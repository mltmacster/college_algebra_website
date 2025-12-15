import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

/**
 * POST /api/analytics/problem-attempt
 * Track when a student attempts a problem
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { problemId, moduleSlug, isCorrect, hintsUsedCount, timeSpent, answer } = body;

    if (!problemId || !moduleSlug || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Count previous attempts for this user+problem
    const previousAttempts = await prisma.problemAttempt.count({
      where: {
        userId: user.id,
        problemId,
      },
    });

    // Create attempt record
    const attempt = await prisma.problemAttempt.create({
      data: {
        userId: user.id,
        problemId,
        moduleSlug,
        isCorrect,
        attemptNumber: previousAttempts + 1,
        hintsUsedCount: hintsUsedCount || 0,
        timeSpent: timeSpent || null,
        answer: answer || null,
      },
    });

    // If this was a successful attempt, update hint usages
    if (isCorrect && hintsUsedCount > 0) {
      // Mark recent hint usages as leading to solution
      await markHintsAsSolved(user.id, problemId, timeSpent);
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      attemptNumber: attempt.attemptNumber,
    });
  } catch (error) {
    console.error('Error tracking problem attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/problem-attempt
 * Get attempt statistics for a user or problem
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get('problemId');
    const moduleSlug = searchParams.get('moduleSlug');

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = { userId: user.id };
    if (problemId) where.problemId = problemId;
    if (moduleSlug) where.moduleSlug = moduleSlug;

    // Get attempts
    const attempts = await prisma.problemAttempt.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 50, // Limit to recent 50 attempts
    });

    // Calculate statistics
    const stats = {
      totalAttempts: attempts.length,
      correctAttempts: attempts.filter(a => a.isCorrect).length,
      successRate: attempts.length > 0 
        ? (attempts.filter(a => a.isCorrect).length / attempts.length) * 100 
        : 0,
      avgHintsUsed: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.hintsUsedCount, 0) / attempts.length
        : 0,
      avgTimeSpent: calculateAvgTime(attempts),
    };

    return NextResponse.json({
      success: true,
      attempts,
      stats,
    });
  } catch (error) {
    console.error('Error fetching problem attempts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to mark hints as leading to solution
async function markHintsAsSolved(userId: string, problemId: string, timeSpent: number | null) {
  try {
    // Find recent hint usages (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const recentHints = await prisma.hintUsage.findMany({
      where: {
        userId,
        problemId,
        timestamp: { gte: thirtyMinutesAgo },
        solvedAfter: false,
      },
      orderBy: { timestamp: 'asc' },
    });

    if (recentHints.length === 0) return;

    // Mark all as solved, calculate time from first hint to solution
    const firstHintTime = recentHints[0].timestamp;
    const timeToSolve = timeSpent || Math.floor((Date.now() - firstHintTime.getTime()) / 1000);

    await prisma.hintUsage.updateMany({
      where: {
        id: { in: recentHints.map(h => h.id) },
      },
      data: {
        solvedAfter: true,
        timeToSolve,
      },
    });
  } catch (error) {
    console.error('Error marking hints as solved:', error);
  }
}

// Helper to calculate average time
function calculateAvgTime(attempts: any[]): number {
  const withTime = attempts.filter(a => a.timeSpent !== null && a.timeSpent !== undefined);
  if (withTime.length === 0) return 0;
  
  const total = withTime.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
  return Math.round(total / withTime.length);
}
