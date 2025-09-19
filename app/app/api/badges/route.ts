
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { getUserBadgesWithProgress, getUserBadgeStats, checkUserBadges } from '../../../lib/badge-system';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const { prisma } = await import('../../../lib/db');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'stats':
        const stats = await getUserBadgeStats(user.id);
        return NextResponse.json({ stats });
      
      case 'progress':
        const badgesWithProgress = await getUserBadgesWithProgress(user.id);
        return NextResponse.json({ badges: badgesWithProgress });
      
      case 'check':
        // Check and award any new badges
        const newBadges = await checkUserBadges(user.id);
        return NextResponse.json({ 
          newBadges,
          message: newBadges.length > 0 
            ? `Congratulations! You earned ${newBadges.length} new badge(s)!` 
            : 'No new badges earned at this time.'
        });
      
      default:
        // Default: return both stats and progress
        const [userStats, userBadges] = await Promise.all([
          getUserBadgeStats(user.id),
          getUserBadgesWithProgress(user.id)
        ]);
        
        return NextResponse.json({
          stats: userStats,
          badges: userBadges
        });
    }
  } catch (error) {
    console.error('Error processing badges request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const { prisma } = await import('../../../lib/db');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action, badgeId } = body;

    if (action === 'check_and_award') {
      // Check for any badges the user has earned
      const newBadges = await checkUserBadges(user.id);
      
      return NextResponse.json({
        success: true,
        newBadges,
        count: newBadges.length,
        message: newBadges.length > 0 
          ? `🎉 Amazing! You earned ${newBadges.length} new badge(s)!`
          : '✨ Keep up the great work! More badges await.'
      });
    }

    if (action === 'award_specific' && badgeId) {
      const { awardSpecificBadge } = await import('../../../lib/badge-system');
      const result = await awardSpecificBadge(user.id, badgeId);
      
      if (result) {
        return NextResponse.json({
          success: true,
          badge: result,
          message: result.message
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Badge already earned or not found'
        });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing badge award:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
