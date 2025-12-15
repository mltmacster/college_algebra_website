import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

/**
 * POST /api/analytics/hint-usage
 * Track when a student uses a hint
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
    const { problemId, moduleSlug, hintIndex, solvedAfter, timeToSolve } = body;

    if (!problemId || !moduleSlug || hintIndex === undefined) {
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

    // Create hint usage record
    const hintUsage = await prisma.hintUsage.create({
      data: {
        userId: user.id,
        problemId,
        moduleSlug,
        hintIndex,
        solvedAfter: solvedAfter || false,
        timeToSolve: timeToSolve || null,
      },
    });

    // Update problem difficulty metrics asynchronously
    updateDifficultyMetrics(problemId, moduleSlug).catch(console.error);

    return NextResponse.json({
      success: true,
      hintUsageId: hintUsage.id,
    });
  } catch (error) {
    console.error('Error tracking hint usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/hint-usage
 * Get hint usage statistics for a problem or module
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

    if (!problemId && !moduleSlug) {
      return NextResponse.json(
        { error: 'Either problemId or moduleSlug is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {};
    if (problemId) where.problemId = problemId;
    if (moduleSlug) where.moduleSlug = moduleSlug;

    // Get hint usage statistics
    const hintUsages = await prisma.hintUsage.findMany({
      where,
      select: {
        problemId: true,
        hintIndex: true,
        solvedAfter: true,
        timeToSolve: true,
        wasHelpful: true,
      },
    });

    // Aggregate statistics
    const stats = aggregateHintStats(hintUsages);

    return NextResponse.json({
      success: true,
      stats,
      totalUsages: hintUsages.length,
    });
  } catch (error) {
    console.error('Error fetching hint usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to aggregate hint statistics
function aggregateHintStats(hintUsages: any[]) {
  const statsByProblem: Record<string, any> = {};

  hintUsages.forEach((usage) => {
    const { problemId, hintIndex, solvedAfter, timeToSolve, wasHelpful } = usage;

    if (!statsByProblem[problemId]) {
      statsByProblem[problemId] = {
        problemId,
        totalUsages: 0,
        hintStats: {} as Record<number, any>,
        solvedAfterHint: 0,
        avgTimeToSolve: 0,
        totalTimeToSolve: 0,
        timeSamples: 0,
      };
    }

    const problemStats = statsByProblem[problemId];
    problemStats.totalUsages++;

    // Initialize hint stats if needed
    if (!problemStats.hintStats[hintIndex]) {
      problemStats.hintStats[hintIndex] = {
        hintIndex,
        usageCount: 0,
        solvedAfter: 0,
        helpfulCount: 0,
        helpfulVotes: 0,
      };
    }

    const hintStat = problemStats.hintStats[hintIndex];
    hintStat.usageCount++;

    if (solvedAfter) {
      hintStat.solvedAfter++;
      problemStats.solvedAfterHint++;
    }

    if (wasHelpful !== null && wasHelpful !== undefined) {
      hintStat.helpfulVotes++;
      if (wasHelpful) {
        hintStat.helpfulCount++;
      }
    }

    if (timeToSolve !== null && timeToSolve !== undefined) {
      problemStats.totalTimeToSolve += timeToSolve;
      problemStats.timeSamples++;
    }
  });

  // Calculate averages
  Object.values(statsByProblem).forEach((problemStats: any) => {
    if (problemStats.timeSamples > 0) {
      problemStats.avgTimeToSolve = Math.round(
        problemStats.totalTimeToSolve / problemStats.timeSamples
      );
    }

    // Calculate hint effectiveness
    Object.values(problemStats.hintStats).forEach((hintStat: any) => {
      hintStat.effectiveness = hintStat.usageCount > 0
        ? (hintStat.solvedAfter / hintStat.usageCount) * 100
        : 0;
      hintStat.helpfulPercent = hintStat.helpfulVotes > 0
        ? (hintStat.helpfulCount / hintStat.helpfulVotes) * 100
        : null;
    });

    // Convert hint stats to array
    problemStats.hints = Object.values(problemStats.hintStats);
    delete problemStats.hintStats;
    delete problemStats.totalTimeToSolve;
    delete problemStats.timeSamples;
  });

  return statsByProblem;
}

// Helper function to update difficulty metrics
async function updateDifficultyMetrics(problemId: string, moduleSlug: string) {
  try {
    // Get all attempts for this problem
    const attempts = await prisma.problemAttempt.findMany({
      where: { problemId },
      select: {
        isCorrect: true,
        hintsUsedCount: true,
        timeSpent: true,
        userId: true,
      },
    });

    if (attempts.length === 0) return;

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
  } catch (error) {
    console.error('Error updating difficulty metrics:', error);
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
