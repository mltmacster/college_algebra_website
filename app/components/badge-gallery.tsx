
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { BadgeCard } from './badge-card';
import { 
  Award, 
  Trophy, 
  Target,
  TrendingUp,
  Star,
  RefreshCw,
  Gift,
  Calendar,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeWithProgress, UserBadgeStats } from '../lib/badge-system';
import { toast } from './ui/use-toast';

interface BadgeGalleryProps {
  userId: string;
}

export function BadgeGallery({ userId }: BadgeGalleryProps) {
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [stats, setStats] = useState<UserBadgeStats | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingBadges, setIsCheckingBadges] = useState(false);
  const [showNewBadges, setShowNewBadges] = useState<any[]>([]);

  useEffect(() => {
    loadBadgeData();
  }, [userId]);

  const loadBadgeData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/badges');
      const data = await response.json();
      
      if (data.badges) {
        setBadges(data.badges);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading badge data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badges. Please refresh the page.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewBadges = async () => {
    try {
      setIsCheckingBadges(true);
      const response = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_and_award' })
      });
      
      const data = await response.json();
      
      if (data.newBadges && data.newBadges.length > 0) {
        setShowNewBadges(data.newBadges);
        toast({
          title: '🎉 New Badges Earned!',
          description: `Congratulations! You earned ${data.newBadges.length} new badge(s)!`,
        });
        // Reload badge data to reflect changes
        await loadBadgeData();
      } else {
        toast({
          title: '✨ Keep Learning!',
          description: 'No new badges earned yet. Keep working on your modules!',
        });
      }
    } catch (error) {
      console.error('Error checking badges:', error);
      toast({
        title: 'Error',
        description: 'Failed to check for new badges.',
        variant: 'destructive'
      });
    } finally {
      setIsCheckingBadges(false);
    }
  };

  const filterBadges = (filter: string) => {
    switch (filter) {
      case 'earned':
        return badges.filter(badge => badge.isEarned);
      case 'available':
        return badges.filter(badge => !badge.isEarned && badge.progress.percentage > 0);
      case 'locked':
        return badges.filter(badge => !badge.isEarned && badge.progress.percentage === 0);
      case 'module':
        return badges.filter(badge => badge.badgeType === 'MODULE_COMPLETION');
      case 'achievement':
        return badges.filter(badge => badge.badgeType !== 'MODULE_COMPLETION');
      default:
        return badges;
    }
  };

  const getBadgeTypeStats = () => {
    const typeStats = badges.reduce((acc, badge) => {
      const type = badge.badgeType;
      if (!acc[type]) {
        acc[type] = { total: 0, earned: 0 };
      }
      acc[type].total++;
      if (badge.isEarned) {
        acc[type].earned++;
      }
      return acc;
    }, {} as Record<string, { total: number; earned: number }>);

    return Object.entries(typeStats).map(([type, data]) => ({
      type,
      ...data,
      percentage: (data.earned / data.total) * 100
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your badges...</p>
        </div>
      </div>
    );
  }

  const filteredBadges = filterBadges(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                Badge Collection
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Track your achievements and unlock new badges by completing modules and challenges.
              </p>
            </div>
            
            <Button
              onClick={checkForNewBadges}
              disabled={isCheckingBadges}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCheckingBadges ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Gift className="h-4 w-4 mr-2" />
              )}
              Check for Badges
            </Button>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-yellow-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Total Points</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.totalPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Trophy className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Badges Earned</p>
                      <p className="text-2xl font-bold text-green-900">
                        {stats.earnedBadges}/{stats.totalBadges}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Completion Rate</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {Math.round((stats.earnedBadges / stats.totalBadges) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Recent Activity</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {stats.recentBadges.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Next Badge Progress */}
          {stats?.nextBadge && (
            <Alert className="mb-8 bg-blue-50 border-blue-200">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-blue-900">Next Badge: </span>
                    <span className="text-blue-800">{stats.nextBadge.title}</span>
                    <span className="text-blue-700 ml-2">
                      ({Math.round(stats.nextBadge.progress.percentage)}% complete)
                    </span>
                  </div>
                  <div className="w-32">
                    <Progress value={stats.nextBadge.progress.percentage} className="h-2" />
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Badge Gallery */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="earned">Earned ({stats?.earnedBadges || 0})</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
            <TabsTrigger value="module">Module</TabsTrigger>
            <TabsTrigger value="achievement">Achievement</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredBadges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <BadgeCard
                          badge={badge}
                          size="medium"
                          showProgress={true}
                          onClick={() => {
                            // Handle badge click - could open detailed view
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No badges in this category
                      </h3>
                      <p className="text-gray-600">
                        {activeTab === 'earned' 
                          ? 'Start learning to earn your first badge!'
                          : activeTab === 'available'
                          ? 'Complete more modules to unlock available badges!'
                          : 'Keep learning to unlock more badges in this category!'
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Badge Achievement Modal/Notification */}
      <AnimatePresence>
        {showNewBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewBadges([])}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🎉 Congratulations!
                </h2>
                <p className="text-gray-600">
                  You've earned {showNewBadges.length} new badge{showNewBadges.length > 1 ? 's' : ''}!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {showNewBadges.map((achievement, index) => (
                  <motion.div
                    key={achievement.badgeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200"
                  >
                    <div className="flex items-center mb-3">
                      <div className="relative h-12 w-12 mr-4">
                        <Image
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.points} points</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                onClick={() => setShowNewBadges([])}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
              >
                Awesome! Continue Learning
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
