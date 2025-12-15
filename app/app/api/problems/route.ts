
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import {
  linearEquationsProblems,
  functionsAndGraphingProblems,
  quadraticFunctionsProblems,
  exponentialLogarithmicProblems,
  matrixOperationsProblems,
  sequencesProbabilityProblems
} from '../../../lib/interactive-problems';

// Map module slugs to their respective problem sets
const moduleProblemMap: Record<string, any[]> = {
  'linear-equations': linearEquationsProblems,
  'systems-linear-equations': linearEquationsProblems, // Alias for compatibility
  'functions-and-graphing': functionsAndGraphingProblems,
  'quadratic-functions': quadraticFunctionsProblems,
  'exponential-logarithmic': exponentialLogarithmicProblems,
  'exponential-and-logarithmic-functions': exponentialLogarithmicProblems, // Correct slug
  'matrix-operations': matrixOperationsProblems,
  'matrix-operations-and-applications': matrixOperationsProblems, // Correct slug
  'sequences-probability': sequencesProbabilityProblems
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get module parameter from query string
    const searchParams = request.nextUrl.searchParams;
    const moduleSlug = searchParams.get('module');

    if (!moduleSlug) {
      return NextResponse.json(
        { error: 'Module parameter is required' },
        { status: 400 }
      );
    }

    // Get problems for the specified module
    const problems = moduleProblemMap[moduleSlug] || [];

    return NextResponse.json({
      success: true,
      module: moduleSlug,
      problems: problems,
      count: problems.length
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, action, answer, stepIndex, hintIndex } = body;

    // Find the problem across all module problem sets
    let problem = null;
    for (const problems of Object.values(moduleProblemMap)) {
      problem = problems.find((p: any) => p.id === problemId);
      if (problem) break;
    }

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Handle getting hints
    if (action === 'get_hint') {
      const hints = problem.hints || [];
      const currentHintIndex = hintIndex ?? 0;
      
      if (currentHintIndex >= hints.length) {
        return NextResponse.json({ 
          hint: null,
          message: 'No more hints available',
          remainingHints: 0
        });
      }

      return NextResponse.json({
        hint: hints[currentHintIndex],
        remainingHints: hints.length - currentHintIndex - 1
      });
    }

    // Handle answer evaluation
    if (action === 'evaluate') {
      if (problem.type === 'step-by-step' && stepIndex !== undefined) {
        const step = problem.steps?.[stepIndex];
        if (!step) {
          return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
        }

        // Normalize both answers for comparison (remove spaces, convert to lowercase)
        const normalizedAnswer = answer.trim().toLowerCase().replace(/\s+/g, '');
        const normalizedExpected = step.expectedAnswer.toLowerCase().replace(/\s+/g, '');

        const isCorrect = normalizedAnswer === normalizedExpected || 
                         normalizedAnswer.includes(normalizedExpected) ||
                         normalizedExpected.includes(normalizedAnswer);

        return NextResponse.json({
          isCorrect,
          feedback: isCorrect 
            ? step.explanation || 'Correct! Great job!' 
            : 'Not quite right. Try again or use a hint!',
          score: isCorrect ? problem.points : 0
        });
      }

      // Handle multiple-choice or single-step problems
      if (problem.correctAnswer) {
        const isCorrect = answer.trim().toUpperCase() === problem.correctAnswer.trim().toUpperCase();
        return NextResponse.json({
          isCorrect,
          feedback: isCorrect 
            ? problem.solution?.explanation || 'Correct!' 
            : 'Incorrect. Try again!',
          score: isCorrect ? problem.points : 0
        });
      }

      return NextResponse.json({ 
        error: 'Unable to evaluate answer' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
