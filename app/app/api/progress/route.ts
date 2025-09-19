
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma, withRetry } from '../../../lib/db';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleSlug = searchParams.get('module');

    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { email: session.user!.email! },
        include: {
          progress: {
            include: {
              module: true
            },
            ...(moduleSlug && {
              where: {
                module: { slug: moduleSlug }
              }
            })
          }
        }
      })
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const progressData = user.progress.map((p: any) => ({
      moduleId: p.moduleId,
      moduleSlug: p.module.slug,
      moduleTitle: p.module.title,
      status: p.status,
      score: p.score,
      timeSpent: p.timeSpent,
      lastAccessed: p.lastAccessed,
      completedAt: p.completedAt
    }));

    return NextResponse.json({ progress: progressData });
  } catch (error) {
    console.error('Error fetching progress:', error);
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
    const { moduleSlug, status, score, timeSpent, problemId, isCorrect } = body;

    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { email: session.user!.email! }
      })
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const module = await withRetry(() =>
      prisma.learningModule.findUnique({
        where: { slug: moduleSlug }
      })
    );

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const updatedProgress = await withRetry(() =>
      prisma.moduleProgress.upsert({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: module.id
          }
        },
        update: {
          status: status || undefined,
          score: score !== undefined ? score : undefined,
          timeSpent: timeSpent ? { increment: timeSpent } : undefined,
          lastAccessed: new Date(),
          ...(status === 'COMPLETED' && !problemId && { completedAt: new Date() })
        },
        create: {
          userId: user.id,
          moduleId: module.id,
          status: status || 'IN_PROGRESS',
          score: score || 0,
          timeSpent: timeSpent || 0,
          lastAccessed: new Date()
        }
      })
    );

    return NextResponse.json({ 
      message: 'Progress updated successfully',
      progress: updatedProgress 
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
