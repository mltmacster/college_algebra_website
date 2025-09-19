
// Digital Badge System for College Algebra Learning Platform
// Handles badge awarding, tracking, and display logic

import { prisma } from './db';
import { BadgeType, ProgressStatus } from '@prisma/client';

export interface BadgeRequirement {
  minScore?: number;
  moduleSlug?: string;
  problemsCompleted?: number;
  streakDays?: number;
  totalTimeSpent?: number; // in minutes
  specificAchievement?: string;
}

export interface BadgeWithProgress {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badgeType: BadgeType;
  requirements: BadgeRequirement;
  points: number;
  isEarned: boolean;
  earnedAt?: Date;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
  module?: {
    title: string;
    slug: string;
  };
}

export interface UserBadgeStats {
  totalBadges: number;
  earnedBadges: number;
  totalPoints: number;
  recentBadges: Array<{
    id: string;
    title: string;
    imageUrl: string;
    earnedAt: Date;
    points: number;
  }>;
  nextBadge?: {
    title: string;
    description: string;
    imageUrl: string;
    progress: {
      current: number;
      target: number;
      percentage: number;
    };
  };
}

export interface Achievement {
  badgeId: string;
  title: string;
  description: string;
  imageUrl: string;
  points: number;
  message: string;
}

class BadgeSystem {
  // Check and award badges for a user based on their progress
  async checkAndAwardBadges(userId: string): Promise<Achievement[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          progress: {
            include: {
              module: true
            }
          },
          badges: {
            include: {
              badge: true
            }
          }
        }
      });

      if (!user) throw new Error('User not found');

      const earnedBadgeIds = new Set(user.badges.map(ub => ub.badgeId));
      const availableBadges = await prisma.badge.findMany({
        include: {
          module: true
        }
      });

      const newAchievements: Achievement[] = [];

      for (const badge of availableBadges) {
        if (earnedBadgeIds.has(badge.id)) continue; // Already earned

        const requirements: BadgeRequirement = badge.requirements 
          ? JSON.parse(badge.requirements) 
          : {};

        const qualifies = await this.checkBadgeRequirements(user, badge, requirements);

        if (qualifies) {
          // Award the badge
          await prisma.userBadge.create({
            data: {
              userId: user.id,
              badgeId: badge.id
            }
          });

          newAchievements.push({
            badgeId: badge.id,
            title: badge.title,
            description: badge.description,
            imageUrl: badge.imageUrl,
            points: badge.points,
            message: this.generateAchievementMessage(badge.title, badge.points)
          });

          console.log(`🏆 Badge awarded to ${user.email}: ${badge.title}`);
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  // Check if user meets requirements for a specific badge
  private async checkBadgeRequirements(user: any, badge: any, requirements: BadgeRequirement): Promise<boolean> {
    try {
      switch (badge.badgeType) {
        case BadgeType.MODULE_COMPLETION:
          return this.checkModuleCompletionRequirements(user, requirements);
        
        case BadgeType.QUIZ_PASS:
          return this.checkQuizPassRequirements(user, requirements);
        
        case BadgeType.COURSE_COMPLETION:
          return this.checkCourseCompletionRequirements(user, requirements);
        
        case BadgeType.STREAK:
          return this.checkStreakRequirements(user, requirements);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking badge requirements:', error);
      return false;
    }
  }

  private checkModuleCompletionRequirements(user: any, requirements: BadgeRequirement): boolean {
    if (!requirements.moduleSlug || typeof requirements.minScore !== 'number') return false;

    const moduleProgress = user.progress.find((p: any) => 
      p.module.slug === requirements.moduleSlug
    );

    if (!moduleProgress) return false;

    return moduleProgress.status === ProgressStatus.COMPLETED && 
           (moduleProgress.score || 0) >= (requirements.minScore ?? 0);
  }

  private checkQuizPassRequirements(user: any, requirements: BadgeRequirement): boolean {
    // Implementation for quiz-specific requirements
    if (typeof requirements.minScore !== 'number') return false;

    const completedModules = user.progress.filter((p: any) => 
      p.status === ProgressStatus.COMPLETED && 
      (p.score || 0) >= (requirements.minScore ?? 0)
    );

    return completedModules.length >= (requirements.problemsCompleted || 1);
  }

  private checkCourseCompletionRequirements(user: any, requirements: BadgeRequirement): boolean {
    const completedModules = user.progress.filter((p: any) => 
      p.status === ProgressStatus.COMPLETED && 
      (p.score || 0) >= (requirements.minScore ?? 80)
    );

    // Check if all 6 modules are completed
    return completedModules.length >= 6;
  }

  private checkStreakRequirements(user: any, requirements: BadgeRequirement): boolean {
    if (typeof requirements.streakDays !== 'number') return false;

    // Calculate learning streak (simplified - based on consecutive days with progress)
    const sortedProgress = user.progress
      .map((p: any) => p.lastAccessed)
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    if (sortedProgress.length === 0) return false;

    // Simplified streak calculation - in production, you'd want more sophisticated logic
    const daysDifference = Math.floor(
      (Date.now() - sortedProgress[0].getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDifference <= requirements.streakDays;
  }

  // Get user's badge progress and statistics
  async getUserBadgeStats(userId: string): Promise<UserBadgeStats> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          progress: {
            include: {
              module: true
            }
          },
          badges: {
            include: {
              badge: true
            },
            orderBy: {
              earnedAt: 'desc'
            }
          }
        }
      });

      if (!user) throw new Error('User not found');

      const allBadges = await prisma.badge.findMany({
        include: {
          module: true
        }
      });

      const earnedBadges = user.badges;
      const totalPoints = earnedBadges.reduce((sum, ub) => sum + ub.badge.points, 0);

      // Get recent badges (last 5)
      const recentBadges = earnedBadges.slice(0, 5).map(ub => ({
        id: ub.badge.id,
        title: ub.badge.title,
        imageUrl: ub.badge.imageUrl,
        earnedAt: ub.earnedAt,
        points: ub.badge.points
      }));

      // Find next achievable badge
      const nextBadge = await this.getNextAchievableBadge(user, allBadges);

      return {
        totalBadges: allBadges.length,
        earnedBadges: earnedBadges.length,
        totalPoints,
        recentBadges,
        nextBadge
      };
    } catch (error) {
      console.error('Error getting user badge stats:', error);
      return {
        totalBadges: 0,
        earnedBadges: 0,
        totalPoints: 0,
        recentBadges: [],
      };
    }
  }

  // Get all badges with user's progress
  async getUserBadgesWithProgress(userId: string): Promise<BadgeWithProgress[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          progress: {
            include: {
              module: true
            }
          },
          badges: {
            include: {
              badge: true
            }
          }
        }
      });

      if (!user) throw new Error('User not found');

      const allBadges = await prisma.badge.findMany({
        include: {
          module: true
        }
      });

      const earnedBadgeIds = new Set(user.badges.map(ub => ub.badgeId));

      return allBadges.map(badge => {
        const isEarned = earnedBadgeIds.has(badge.id);
        const earnedBadge = user.badges.find(ub => ub.badgeId === badge.id);
        const requirements: BadgeRequirement = badge.requirements 
          ? JSON.parse(badge.requirements) 
          : {};

        const progress = this.calculateBadgeProgress(user, badge, requirements);

        return {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          imageUrl: badge.imageUrl,
          badgeType: badge.badgeType,
          requirements,
          points: badge.points,
          isEarned,
          earnedAt: earnedBadge?.earnedAt,
          progress,
          module: badge.module ? {
            title: badge.module.title,
            slug: badge.module.slug
          } : undefined
        };
      });
    } catch (error) {
      console.error('Error getting user badges with progress:', error);
      return [];
    }
  }

  // Calculate progress toward a specific badge
  private calculateBadgeProgress(user: any, badge: any, requirements: BadgeRequirement): {
    current: number;
    target: number;
    percentage: number;
  } {
    switch (badge.badgeType) {
      case BadgeType.MODULE_COMPLETION:
        if (requirements.moduleSlug) {
          const moduleProgress = user.progress.find((p: any) => 
            p.module.slug === requirements.moduleSlug
          );
          const current = moduleProgress?.score || 0;
          const target = requirements.minScore ?? 80;
          return {
            current: Math.min(current, target),
            target,
            percentage: Math.min((current / target) * 100, 100)
          };
        }
        break;
      
      case BadgeType.COURSE_COMPLETION:
        const completedModules = user.progress.filter((p: any) => 
          p.status === ProgressStatus.COMPLETED
        ).length;
        const target = 6; // Total modules
        return {
          current: completedModules,
          target,
          percentage: (completedModules / target) * 100
        };
      
      case BadgeType.QUIZ_PASS:
        const highScoreModules = user.progress.filter((p: any) => 
          p.status === ProgressStatus.COMPLETED && 
          (p.score || 0) >= (requirements.minScore ?? 80)
        ).length;
        const quizTarget = requirements.problemsCompleted || 3;
        return {
          current: highScoreModules,
          target: quizTarget,
          percentage: (highScoreModules / quizTarget) * 100
        };
    }

    return { current: 0, target: 1, percentage: 0 };
  }

  // Find the next most achievable badge for motivation
  private async getNextAchievableBadge(user: any, allBadges: any[]): Promise<UserBadgeStats['nextBadge']> {
    const earnedBadgeIds = new Set(user.badges.map((ub: any) => ub.badgeId));
    const unearned = allBadges.filter(badge => !earnedBadgeIds.has(badge.id));

    if (unearned.length === 0) return undefined;

    // Find badge with highest progress percentage
    let bestBadge = null;
    let bestProgress = -1;

    for (const badge of unearned) {
      const requirements: BadgeRequirement = badge.requirements 
        ? JSON.parse(badge.requirements) 
        : {};
      const progress = this.calculateBadgeProgress(user, badge, requirements);
      
      if (progress.percentage > bestProgress) {
        bestProgress = progress.percentage;
        bestBadge = { badge, progress };
      }
    }

    if (!bestBadge) return undefined;

    return {
      title: bestBadge.badge.title,
      description: bestBadge.badge.description,
      imageUrl: bestBadge.badge.imageUrl,
      progress: bestBadge.progress
    };
  }

  // Generate motivational message for badge achievements
  private generateAchievementMessage(badgeTitle: string, points: number): string {
    const messages = [
      `🎉 Congratulations! You've earned the "${badgeTitle}" badge and ${points} points!`,
      `🏆 Amazing work! You've unlocked "${badgeTitle}" worth ${points} points!`,
      `⭐ Fantastic! "${badgeTitle}" badge is yours, plus ${points} points added to your score!`,
      `🎊 Outstanding! You've achieved the "${badgeTitle}" badge and earned ${points} points!`,
      `🌟 Excellent progress! "${badgeTitle}" badge unlocked with ${points} points earned!`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Award a specific badge to a user (for manual awarding)
  async awardBadge(userId: string, badgeId: string): Promise<Achievement | null> {
    try {
      const badge = await prisma.badge.findUnique({
        where: { id: badgeId }
      });

      if (!badge) throw new Error('Badge not found');

      // Check if already earned
      const existingUserBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId
          }
        }
      });

      if (existingUserBadge) return null; // Already earned

      await prisma.userBadge.create({
        data: {
          userId,
          badgeId
        }
      });

      return {
        badgeId: badge.id,
        title: badge.title,
        description: badge.description,
        imageUrl: badge.imageUrl,
        points: badge.points,
        message: this.generateAchievementMessage(badge.title, badge.points)
      };
    } catch (error) {
      console.error('Error awarding badge:', error);
      return null;
    }
  }
}

export const badgeSystem = new BadgeSystem();

// Helper functions for common operations
export async function checkUserBadges(userId: string): Promise<Achievement[]> {
  return badgeSystem.checkAndAwardBadges(userId);
}

export async function getUserBadgeStats(userId: string): Promise<UserBadgeStats> {
  return badgeSystem.getUserBadgeStats(userId);
}

export async function getUserBadgesWithProgress(userId: string): Promise<BadgeWithProgress[]> {
  return badgeSystem.getUserBadgesWithProgress(userId);
}

export async function awardSpecificBadge(userId: string, badgeId: string): Promise<Achievement | null> {
  return badgeSystem.awardBadge(userId, badgeId);
}
