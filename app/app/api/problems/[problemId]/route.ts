
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { linearEquationsProblems } from '../../../../lib/interactive-problems';
import { authOptions } from '../../../../lib/auth';

interface RouteParams {
  params: {
    problemId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId } = params;
    const problem = linearEquationsProblems.find(p => p.id === problemId);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Return problem without solution details for security
    const sanitizedProblem = {
      id: problem.id,
      title: problem.title,
      description: problem.description,
      businessContext: problem.businessContext,
      problemStatement: problem.problemStatement,
      type: problem.type,
      difficulty: problem.difficulty,
      points: problem.points,
      choices: problem.choices,
      steps: problem.steps?.map(step => ({
        instruction: step.instruction,
        hint: step.hint,
        explanation: step.explanation
      }))
    };

    return NextResponse.json({ problem: sanitizedProblem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
