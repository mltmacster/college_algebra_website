
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getProblemsForModule, evaluateAnswer, getHint, calculateScore } from '../../../lib/interactive-problems';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleSlug = searchParams.get('module');
    const problemId = searchParams.get('problemId');

    if (!moduleSlug) {
      return NextResponse.json({ error: 'Module slug is required' }, { status: 400 });
    }

    // Get problems for the specified module
    const moduleProblems = getProblemsForModule(moduleSlug);
    
    if (moduleProblems.length === 0) {
      return NextResponse.json({ error: 'Module not found or has no problems' }, { status: 404 });
    }

    if (problemId) {
      const problem = moduleProblems.find(p => p.id === problemId);
      if (!problem) {
        return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
      }
      return NextResponse.json({ problem });
    }

    // Return all problems for the module (without solutions)
    const problems = moduleProblems.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      businessContext: p.businessContext,
      problemStatement: p.problemStatement,
      type: p.type,
      difficulty: p.difficulty,
      points: p.points,
      choices: p.choices,
      steps: p.steps?.map(step => ({
        instruction: step.instruction,
        hint: step.hint
      }))
    }));

    return NextResponse.json({ problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, answer, stepIndex, action, hintIndex } = body;

    // Handle hint requests
    if (action === 'get_hint') {
      const hint = getHint(problemId, hintIndex || 0);
      if (!hint) {
        return NextResponse.json({ error: 'Hint not available' }, { status: 404 });
      }
      return NextResponse.json({ hint });
    }

    // Handle answer evaluation
    if (action === 'evaluate') {
      const evaluation = evaluateAnswer(problemId, answer, stepIndex);
      
      // Calculate score if answer is correct (simplified logic for now)
      let score = 0;
      if (evaluation.isCorrect) {
        // Find the problem across all modules to get its points value
        const moduleSlug = body.moduleSlug; // Client should send this
        if (moduleSlug) {
          const moduleProblems = getProblemsForModule(moduleSlug);
          const problem = moduleProblems.find(p => p.id === problemId);
          if (problem) {
            score = calculateScore(1, 0, problem.points); // Simplified scoring
          }
        }
      }

      return NextResponse.json({ 
        ...evaluation,
        score
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing problem request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
