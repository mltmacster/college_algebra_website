import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/analytics/difficulty-metrics
 * Get difficulty metrics for problems
 * Query params: moduleSlug (optional), problemId (optional)
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
    const moduleSlug = searchParams.get('moduleSlug');
    const problemId = searchParams.get('problemId');

    // Build where clause
    const where: any = {};
    if (problemId) {
      where.problemId = problemId;
    } else if (moduleSlug) {
      where.moduleSlug = moduleSlug;
    }

    // Get metrics
    const metrics = await prisma.problemDifficultyMetrics.findMany({
      where,
      orderBy: { successRate: 'asc' }, // Hardest problems first
    });

    // Calculate module-wide statistics if moduleSlug provided
    let moduleStats = null;
    if (moduleSlug && metrics.length > 0) {
      moduleStats = {
        totalProblems: metrics.length,
        avgSuccessRate: metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length,
        avgHintsUsed: metrics.reduce((sum, m) => sum + m.avgHintsUsed, 0) / metrics.length,
        avgTimeToSolve: Math.round(metrics.reduce((sum, m) => sum + m.avgTimeToSolve, 0) / metrics.length),
        difficultyDistribution: {
          easy: metrics.filter(m => m.calculatedDiff === 'easy').length,
          medium: metrics.filter(m => m.calculatedDiff === 'medium').length,
          hard: metrics.filter(m => m.calculatedDiff === 'hard').length,
          expert: metrics.filter(m => m.calculatedDiff === 'expert').length,
        },
        totalAttempts: metrics.reduce((sum, m) => sum + m.totalAttempts, 0),
        totalCompletions: metrics.reduce((sum, m) => sum + m.totalCompletions, 0),
      };
    }

    return NextResponse.json({
      success: true,
      metrics,
      moduleStats,
    });
  } catch (error) {
    console.error('Error fetching difficulty metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/difficulty-metrics/recalculate
 * Recalculate difficulty metrics for a problem or module
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

    // Check if user is instructor (you may want to add role checking)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { problemId, moduleSlug } = body;

    if (!problemId && !moduleSlug) {
      return NextResponse.json(
        { error: 'Either problemId or moduleSlug is required' },
        { status: 400 }
      );
    }

    // Get problems to recalculate
    let problemIds: string[] = [];
    
    if (problemId) {
      problemIds = [problemId];
    } else if (moduleSlug) {
      // Get all problems for this module from attempts
      const attempts = await prisma.problemAttempt.findMany({
        where: { moduleSlug },
        select: { problemId: true },
        distinct: ['problemId'],
      });
      problemIds = attempts.map(a => a.problemId);
    }

    // Recalculate each problem
    const results = [];
    for (const pid of problemIds) {
      const result = await recalculateProblemDifficulty(pid);
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      recalculated: results.length,
      results,
    });
  } catch (error) {
    console.error('Error recalculating difficulty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to recalculate problem difficulty
async function recalculateProblemDifficulty(problemId: string) {
  try {
    // Get all attempts for this problem
    const attempts = await prisma.problemAttempt.findMany({
      where: { problemId },
      select: {
        isCorrect: true,
        hintsUsedCount: true,
        timeSpent: true,
        userId: true,
        moduleSlug: true,
      },
    });

    if (attempts.length === 0) {
      return { problemId, status: 'no_data' };
    }

    const moduleSlug = attempts[0].moduleSlug;
    const totalAttempts = attempts.length;
    const totalCompletions = attempts.filter(a => a.isCorrect).length;
    const uniqueUsers = new Set(attempts.map(a => a.userId)).size;

    const avgHintsUsed = attempts.reduce((sum, a) => sum + a.hintsUsedCount, 0) / totalAttempts;
    
    const timeSamples = attempts.filter(a => a.timeSpent !== null);
    const avgTimeToSolve = timeSamples.length > 0
      ? timeSamples.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / timeSamples.length
      : 0;

    const successRate = totalAttempts > 0 ? totalCompletions / totalAttempts : 0;

    // Calculate difficulty score
    const calculatedDiff = calculateDifficulty({
      successRate,
      avgHintsUsed,
      avgTimeToSolve,
    });

    // Upsert metrics
    await prisma.problemDifficultyMetrics.upsert({
      where: { problemId },
      create: {
        problemId,
        moduleSlug,
        totalAttempts,
        totalCompletions,
        avgAttempts: totalAttempts / uniqueUsers,
        avgTimeToSolve: Math.round(avgTimeToSolve),
        avgHintsUsed: Math.round(avgHintsUsed * 10) / 10,
        successRate: Math.round(successRate * 100) / 100,
        calculatedDiff,
        sampleSize: uniqueUsers,
        lastCalculated: new Date(),
      },
      update: {
        totalAttempts,
        totalCompletions,
        avgAttempts: totalAttempts / uniqueUsers,
        avgTimeToSolve: Math.round(avgTimeToSolve),
        avgHintsUsed: Math.round(avgHintsUsed * 10) / 10,
        successRate: Math.round(successRate * 100) / 100,
        calculatedDiff,
        sampleSize: uniqueUsers,
        lastCalculated: new Date(),
      },
    });

    return {
      problemId,
      status: 'success',
      metrics: {
        calculatedDiff,
        successRate,
        totalAttempts,
        sampleSize: uniqueUsers,
      },
    };
  } catch (error) {
    console.error(`Error recalculating difficulty for ${problemId}:`, error);
    return { problemId, status: 'error', error: String(error) };
  }
}

// Difficulty calculation algorithm
function calculateDifficulty(metrics: {
  successRate: number;
  avgHintsUsed: number;
  avgTimeToSolve: number;
}): string {
  const score = (
    (1 - metrics.successRate) * 0.4 +           // 40% weight
    (metrics.avgHintsUsed / 5) * 0.3 +          // 30% weight (max 5 hints)
    Math.min(metrics.avgTimeToSolve / 600, 1) * 0.3  // 30% weight (capped at 10 min)
  );

  if (score < 0.25) return 'easy';
  if (score < 0.5) return 'medium';
  if (score < 0.75) return 'hard';
  return 'expert';
}
