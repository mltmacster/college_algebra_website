
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma, withRetry } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';
import { asyncHandler } from '../../../../lib/error-handler';

interface InstructorStudent {
  id: string;
  name: string;
  email: string;
  enrollmentDate: Date;
  overallProgress: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  status: 'active' | 'at-risk' | 'inactive' | 'completed';
  currentModule: string;
  moduleProgress: number;
  badgesEarned: number;
  riskFactors?: string[];
}

export const GET = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch comprehensive data for instructor dashboard
  const [
    users,
    moduleProgress,
    userBadges,
    modules
  ] = await Promise.all([
    withRetry(() => prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })),
    
    withRetry(() => prisma.moduleProgress.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        module: {
          select: {
            id: true,
            title: true,
            slug: true,
            order: true
          }
        }
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    })),
    
    withRetry(() => prisma.userBadge.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        badge: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })),
    
    withRetry(() => prisma.learningModule.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        order: true
      },
      orderBy: {
        order: 'asc'
      }
    }))
  ]);

  // Process student data
  const students: InstructorStudent[] = [];
  
  for (const user of users) {
    const userProgress = moduleProgress.filter((p: any) => p.userId === user.id);
    const userBadgeCount = userBadges.filter(b => b.userId === user.id).length;
    
    if (userProgress.length === 0) {
      // User with no progress - newly enrolled
      students.push({
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        enrollmentDate: user.createdAt,
        overallProgress: 0,
        averageScore: 0,
        timeSpent: 0,
        lastActivity: user.createdAt,
        status: 'inactive',
        currentModule: 'Not Started',
        moduleProgress: 0,
        badgesEarned: 0,
        riskFactors: ['No activity', 'Not started']
      });
      continue;
    }
    
    // Calculate student metrics
    const totalTimeSpent = userProgress.reduce((sum: number, p: any) => sum + (p.timeSpent || 0), 0);
    const averageScore = userProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / userProgress.length;
    const completedModules = userProgress.filter((p: any) => p.status === 'COMPLETED').length;
    const totalModules = modules.length;
    const overallProgress = (completedModules / totalModules) * 100;
    
    const lastActivity = new Date(Math.max(...userProgress.map(p => p.lastAccessed.getTime())));
    const daysSinceLastActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determine current module (highest order module that's started)
    const currentModuleProgress = userProgress
      .filter(p => p.status !== 'COMPLETED')
      .sort((a, b) => (a.module.order || 0) - (b.module.order || 0))[0];
    
    const currentModule = currentModuleProgress 
      ? currentModuleProgress.module.title 
      : completedModules === totalModules 
        ? 'Course Completed' 
        : 'Not Started';
    
    const moduleProgress = currentModuleProgress 
      ? calculateModuleProgressPercentage(currentModuleProgress.status, currentModuleProgress.score || 0)
      : completedModules === totalModules ? 100 : 0;
    
    // Determine student status and risk factors
    let status: InstructorStudent['status'] = 'active';
    const riskFactors: string[] = [];
    
    if (completedModules === totalModules) {
      status = 'completed';
    } else if (daysSinceLastActivity > 7) {
      status = 'inactive';
      riskFactors.push('No recent activity');
    } else if (averageScore < 60) {
      status = 'at-risk';
      riskFactors.push('Low academic performance');
    } else if (daysSinceLastActivity > 3) {
      riskFactors.push('Infrequent activity');
    }
    
    if (averageScore < 70 && averageScore >= 60) {
      riskFactors.push('Below average performance');
    }
    
    if (totalTimeSpent / userProgress.length < 10) {
      riskFactors.push('Low engagement');
    }
    
    if (riskFactors.length >= 2 && status === 'active') {
      status = 'at-risk';
    }
    
    students.push({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      enrollmentDate: user.createdAt,
      overallProgress: Math.round(overallProgress),
      averageScore: Math.round(averageScore),
      timeSpent: Math.round(totalTimeSpent / 60 * 10) / 10, // Convert to hours
      lastActivity,
      status,
      currentModule,
      moduleProgress: Math.round(moduleProgress),
      badgesEarned: userBadgeCount,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined
    });
  }

  // Calculate class overview
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const atRiskStudents = students.filter(s => s.status === 'at-risk' || s.status === 'inactive').length;
  const averageProgress = totalStudents > 0 
    ? students.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents 
    : 0;
  const averageScore = totalStudents > 0 
    ? students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents 
    : 0;
  const classCompletionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

  // Calculate module progress overview
  const moduleProgressOverview = modules.map(module => {
    const moduleProgressData = moduleProgress.filter(p => p.module.id === module.id);
    const studentsStarted = new Set(moduleProgressData.map(p => p.userId)).size;
    const studentsCompleted = moduleProgressData.filter(p => p.status === 'COMPLETED').length;
    const avgScore = moduleProgressData.length > 0 
      ? moduleProgressData.reduce((sum, p) => sum + (p.score || 0), 0) / moduleProgressData.length 
      : 0;
    const avgTimeSpent = moduleProgressData.length > 0 
      ? moduleProgressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / moduleProgressData.length / 60
      : 0;
    
    // Calculate difficulty based on average score and completion rate
    const completionRate = studentsStarted > 0 ? studentsCompleted / studentsStarted : 0;
    const difficulty = Math.max(1, 5 - (avgScore / 20) - completionRate);
    
    return {
      module: module.title,
      studentsStarted,
      studentsCompleted,
      averageScore: Math.round(avgScore * 10) / 10,
      averageTimeSpent: Math.round(avgTimeSpent * 10) / 10,
      difficulty: Math.round(difficulty * 10) / 10
    };
  });

  // Generate recent activity (last 20 activities)
  const recentActivity = moduleProgress
    .slice(0, 20)
    .map(p => ({
      studentName: p.user.name || 'Unknown',
      action: getActionDescription(p.status),
      module: p.module.title,
      timestamp: p.lastAccessed,
      score: p.status === 'COMPLETED' ? p.score : undefined
    }));

  // Generate performance trends (mock data for past 6 weeks)
  const performanceTrends = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - (i * 7));
    
    const weekProgress = moduleProgress.filter(p => 
      p.lastAccessed >= weekStart && p.lastAccessed < weekEnd
    );
    
    const avgScore = weekProgress.length > 0 
      ? weekProgress.reduce((sum, p) => sum + (p.score || 0), 0) / weekProgress.length 
      : 75 + Math.random() * 15; // Mock baseline
    
    const completionRate = weekProgress.length > 0 
      ? (weekProgress.filter(p => p.status === 'COMPLETED').length / weekProgress.length) * 100
      : 80 + Math.random() * 15; // Mock baseline
    
    const engagementRate = 75 + Math.random() * 20; // Mock engagement
    
    performanceTrends.push({
      week: `Week ${6 - i}`,
      averageScore: Math.round(avgScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      engagementRate: Math.round(engagementRate * 10) / 10
    });
  }

  // Mock announcements (would be stored in database in production)
  const announcements = [
    {
      id: '1',
      title: 'Midterm Exam Preparation',
      content: 'The midterm exam is scheduled for next week. Please review modules 1-3 and complete all practice problems.',
      createdAt: new Date('2025-09-18'),
      priority: 'high' as const,
      targetGroup: 'all' as const
    },
    {
      id: '2',
      title: 'Additional Support Available',
      content: 'If you\'re struggling with quadratic functions, additional tutoring sessions are available every Tuesday and Thursday.',
      createdAt: new Date('2025-09-16'),
      priority: 'medium' as const,
      targetGroup: 'at-risk' as const
    }
  ];

  const instructorData = {
    classData: {
      overview: {
        totalStudents,
        activeStudents,
        completedStudents,
        atRiskStudents,
        averageProgress: Math.round(averageProgress * 10) / 10,
        averageScore: Math.round(averageScore * 10) / 10,
        classCompletionRate: Math.round(classCompletionRate * 10) / 10
      },
      moduleProgress: moduleProgressOverview,
      recentActivity,
      performanceTrends
    },
    students,
    announcements
  };

  return NextResponse.json(instructorData);
});

function calculateModuleProgressPercentage(status: string, score: number): number {
  switch (status) {
    case 'COMPLETED':
      return 100;
    case 'IN_PROGRESS':
      return Math.min(90, Math.max(20, score * 0.9));
    case 'NOT_STARTED':
      return 0;
    default:
      return Math.min(50, score * 0.5);
  }
}

function getActionDescription(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'Completed Module';
    case 'IN_PROGRESS':
      return 'Continued Module';
    case 'NOT_STARTED':
      return 'Started Module';
    default:
      return 'Accessed Module';
  }
}
