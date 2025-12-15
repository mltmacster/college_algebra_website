
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
