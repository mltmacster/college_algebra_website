
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Award, 
  Trophy, 
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserBadgeStats } from '../lib/badge-system';

interface BadgeProgressWidgetProps {
  userId?: string;
  showNextBadge?: boolean;
  compact?: boolean;
  className?: string;
}

export function BadgeProgressWidget({
  userId,
  showNextBadge = true,
  compact = false,
  className = ''
}: BadgeProgressWidgetProps) {
  const [stats, setStats] = useState<UserBadgeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    loadBadgeStats();
  }, [userId]);

  const loadBadgeStats = async () => {
    try {
      const response = await fetch('/api/badges?type=stats');
      const data = await response.json();
      
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading badge stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardContent className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <span className="font-semibold text-gray-900">
                  {stats.earnedBadges}/{stats.totalBadges}
                </span>
                <span className="text-sm text-gray-600 ml-1">badges</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-yellow-600">
                {stats.totalPoints}
              </span>
            </div>
          </div>
          
          {showNextBadge && stats.nextBadge && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Next: {stats.nextBadge.title}</span>
                <span>{Math.round(stats.nextBadge.progress.percentage)}%</span>
              </div>
              <Progress value={stats.nextBadge.progress.percentage} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Badge Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.earnedBadges}
            </div>
            <div className="text-sm text-gray-600">Earned</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.totalBadges - stats.earnedBadges}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-yellow-500"
                style={{
                  strokeDasharray: `${2 * Math.PI * 40}`,
                  strokeDashoffset: `${2 * Math.PI * 40 * (1 - stats.earnedBadges / stats.totalBadges)}`,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '48px 48px'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {Math.round((stats.earnedBadges / stats.totalBadges) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        {stats.recentBadges.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {stats.recentBadges.slice(0, 3).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-2 bg-yellow-50 rounded-lg"
                >
                  <div className="relative h-8 w-8 mr-3">
                    <img
                      src={badge.imageUrl}
                      alt={badge.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {badge.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{badge.points}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Next Badge */}
        {showNextBadge && stats.nextBadge && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-500" />
              Next Goal
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900">
                  {stats.nextBadge.title}
                </span>
                <span className="text-sm text-blue-700">
                  {Math.round(stats.nextBadge.progress.percentage)}%
                </span>
              </div>
              <Progress 
                value={stats.nextBadge.progress.percentage} 
                className="h-2 mb-3"
              />
              <p className="text-sm text-blue-800 mb-3">
                {stats.nextBadge.description}
              </p>
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/modules'}
              >
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* View All Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = '/badges'}
        >
          <Trophy className="h-4 w-4 mr-2" />
          View All Badges
        </Button>
      </CardContent>
    </Card>
  );
}
