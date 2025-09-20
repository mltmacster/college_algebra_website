
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma, withRetry } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';
import { asyncHandler } from '../../../../lib/error-handler';

interface StudentRiskProfile {
  userId: string;
  userName: string;
  userEmail: string;
  riskScore: number;
  riskFactors: string[];
  moduleProgress: Array<{
    moduleSlug: string;
    moduleTitle: string;
    progress: number;
    score: number;
    timeSpent: number;
    lastAccessed: Date;
    status: string;
  }>;
  engagementMetrics: {
    totalTimeSpent: number;
    averageScore: number;
    completionRate: number;
    lastActivityDays: number;
    loginFrequency: number;
  };
}

export const GET = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch comprehensive student data for risk analysis
  const [users, moduleProgress, userBadges] = await Promise.all([
    withRetry(() => prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
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
            slug: true
          }
        }
      }
    })),
    
    withRetry(() => prisma.userBadge.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        badge: true
      }
    }))
  ]);

  // Calculate risk profiles for each student
  const studentRiskProfiles: StudentRiskProfile[] = [];
  
  for (const user of users) {
    const userProgress = moduleProgress.filter(p => p.userId === user.id);
    const userBadgeCount = userBadges.filter(b => b.userId === user.id).length;
    
    if (userProgress.length === 0) continue; // Skip users with no progress
    
    // Calculate engagement metrics
    const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0) / userProgress.length;
    const completedModules = userProgress.filter(p => p.status === 'COMPLETED').length;
    const completionRate = (completedModules / userProgress.length) * 100;
    
    const lastActivity = Math.max(...userProgress.map(p => p.lastAccessed.getTime()));
    const lastActivityDays = Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60 * 24));
    
    // Calculate risk factors and score
    const riskFactors = [];
    let riskScore = 0;
    
    // Factor 1: Low average score (weight: 0.3)
    if (averageScore < 60) {
      riskFactors.push('Low academic performance');
      riskScore += 0.3;
    } else if (averageScore < 70) {
      riskFactors.push('Below average performance');
      riskScore += 0.15;
    }
    
    // Factor 2: Low engagement (weight: 0.25)
    const avgTimePerModule = totalTimeSpent / userProgress.length;
    if (avgTimePerModule < 5) {
      riskFactors.push('Low engagement');
      riskScore += 0.25;
    } else if (avgTimePerModule < 10) {
      riskFactors.push('Moderate engagement concerns');
      riskScore += 0.1;
    }
    
    // Factor 3: Poor completion rate (weight: 0.2)
    if (completionRate < 30) {
      riskFactors.push('Low completion rate');
      riskScore += 0.2;
    } else if (completionRate < 60) {
      riskFactors.push('Moderate completion concerns');
      riskScore += 0.1;
    }
    
    // Factor 4: Inactive for long periods (weight: 0.15)
    if (lastActivityDays > 14) {
      riskFactors.push('Inactive for 2+ weeks');
      riskScore += 0.15;
    } else if (lastActivityDays > 7) {
      riskFactors.push('Inactive for 1+ week');
      riskScore += 0.08;
    }
    
    // Factor 5: No badges earned (weight: 0.1)
    if (userBadgeCount === 0) {
      riskFactors.push('No achievements earned');
      riskScore += 0.1;
    }
    
    studentRiskProfiles.push({
      userId: user.id,
      userName: user.name || 'Unknown',
      userEmail: user.email,
      riskScore,
      riskFactors,
      moduleProgress: userProgress.map(p => ({
        moduleSlug: p.module.slug,
        moduleTitle: p.module.title,
        progress: calculateModuleProgress(p.status, p.score || 0), // Mock calculation
        score: p.score || 0,
        timeSpent: p.timeSpent || 0,
        lastAccessed: p.lastAccessed,
        status: p.status
      })),
      engagementMetrics: {
        totalTimeSpent,
        averageScore,
        completionRate,
        lastActivityDays,
        loginFrequency: Math.max(1, 30 - lastActivityDays) // Mock login frequency
      }
    });
  }
  
  // Sort by risk score (highest first) and filter for at-risk students
  const atRiskStudents = studentRiskProfiles
    .filter(profile => profile.riskScore > 0.3) // Only include students with significant risk
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 50) // Limit to top 50 at-risk students
    .map(profile => ({
      id: profile.userId,
      name: profile.userName,
      email: profile.userEmail,
      riskScore: profile.riskScore,
      riskLevel: getRiskLevel(profile.riskScore),
      riskFactors: profile.riskFactors,
      currentModule: profile.moduleProgress[profile.moduleProgress.length - 1]?.moduleTitle || 'Not started',
      moduleProgress: profile.moduleProgress[profile.moduleProgress.length - 1]?.progress || 0,
      avgScore: Math.round(profile.engagementMetrics.averageScore),
      timeSpent: Math.round(profile.engagementMetrics.totalTimeSpent / 60 * 10) / 10, // Convert to hours
      lastActivity: new Date(Date.now() - profile.engagementMetrics.lastActivityDays * 24 * 60 * 60 * 1000),
      predictedOutcome: generatePredictedOutcome(profile.riskScore),
      interventionRecommendations: generateInterventionRecommendations(profile)
    }));

  // Mock model performance data
  const models = [
    {
      name: 'Dropout Risk Predictor',
      accuracy: 87.3,
      precision: 84.1,
      recall: 89.7,
      lastTrained: new Date('2025-09-10'),
      features: ['engagement_score', 'assignment_completion', 'time_spent', 'grade_trend', 'login_frequency']
    },
    {
      name: 'Performance Predictor',
      accuracy: 82.6,
      precision: 80.4,
      recall: 85.2,
      lastTrained: new Date('2025-09-08'),
      features: ['quiz_scores', 'time_per_problem', 'help_seeking_behavior', 'previous_math_experience']
    }
  ];

  // Generate trend data
  const trends = [];
  for (let i = 5; i >= 0; i--) {
    trends.push({
      week: `Week ${6 - i}`,
      identifiedRisk: Math.floor(Math.random() * 15) + 10,
      actualDropouts: Math.floor(Math.random() * 3) + 1,
      successfulInterventions: Math.floor(Math.random() * 10) + 8,
      accuracy: 80 + Math.random() * 10
    });
  }

  return NextResponse.json({
    riskStudents: atRiskStudents,
    models,
    trends
  });
});

function calculateModuleProgress(status: string, score: number): number {
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

function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 0.8) return 'critical';
  if (riskScore >= 0.6) return 'high';
  if (riskScore >= 0.4) return 'medium';
  return 'low';
}

function generatePredictedOutcome(riskScore: number): string {
  if (riskScore >= 0.8) {
    return `${Math.round(riskScore * 100)}% chance of not completing course`;
  } else if (riskScore >= 0.6) {
    return `${Math.round(riskScore * 90)}% chance of struggling with advanced modules`;
  } else if (riskScore >= 0.4) {
    return `${Math.round(riskScore * 80)}% chance of taking longer than average to complete`;
  }
  return 'Low risk of academic difficulties';
}

function generateInterventionRecommendations(profile: StudentRiskProfile): string[] {
  const recommendations = [];
  
  if (profile.riskFactors.includes('Low academic performance') || profile.riskFactors.includes('Below average performance')) {
    recommendations.push('Schedule one-on-one tutoring session');
    recommendations.push('Recommend prerequisite review materials');
  }
  
  if (profile.riskFactors.includes('Low engagement') || profile.riskFactors.includes('Moderate engagement concerns')) {
    recommendations.push('Increase interactive content engagement');
    recommendations.push('Set up study group participation');
  }
  
  if (profile.riskFactors.includes('Low completion rate')) {
    recommendations.push('Provide time management resources');
    recommendations.push('Offer extended deadlines if needed');
  }
  
  if (profile.riskFactors.includes('Inactive for 2+ weeks') || profile.riskFactors.includes('Inactive for 1+ week')) {
    recommendations.push('Send re-engagement email campaign');
    recommendations.push('Set up daily check-ins for 2 weeks');
  }
  
  if (profile.riskFactors.includes('No achievements earned')) {
    recommendations.push('Connect with peer mentor');
    recommendations.push('Focus on achievable short-term goals');
  }
  
  // Default recommendations for high-risk students
  if (profile.riskScore >= 0.6) {
    recommendations.push('Consider academic counseling referral');
    recommendations.push('Monitor progress more closely');
  }
  
  return recommendations;
}
