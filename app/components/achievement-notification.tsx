
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trophy, X, Award } from 'lucide-react';
import { Achievement } from '../lib/badge-system';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function AchievementNotification({
  achievements,
  onDismiss,
  autoHide = true,
  duration = 5000
}: AchievementNotificationProps) {
  const [visible, setVisible] = useState(achievements.length > 0);

  useEffect(() => {
    if (autoHide && achievements.length > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievements.length, autoHide, duration, onDismiss]);

  useEffect(() => {
    setVisible(achievements.length > 0);
  }, [achievements.length]);

  if (achievements.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0 relative">
              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVisible(false);
                  setTimeout(onDismiss, 300);
                }}
                className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Achievement Content */}
              <div className="p-6 text-white">
                <div className="flex items-center mb-4">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Trophy className="h-8 w-8 mr-3" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {achievements.length === 1 ? 'Badge Earned!' : 'Badges Earned!'}
                    </h3>
                    <p className="text-yellow-100 text-sm">
                      Congratulations on your achievement{achievements.length > 1 ? 's' : ''}!
                    </p>
                  </div>
                </div>

                {/* Achievement List */}
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.badgeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className="flex items-center bg-white/20 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="relative h-12 w-12 mr-4 flex-shrink-0">
                        <Image
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          fill
                          className="object-contain"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + (index * 0.1), type: "spring" }}
                          className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
                        >
                          <Award className="h-3 w-3 text-white" />
                        </motion.div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {achievement.title}
                        </h4>
                        <p className="text-yellow-100 text-xs mb-1 line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-1 text-yellow-200" />
                          <span className="text-xs text-yellow-200 font-medium">
                            +{achievement.points} points
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total Points */}
                {achievements.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 pt-4 border-t border-white/20 text-center"
                  >
                    <span className="text-lg font-bold text-white">
                      Total: +{achievements.reduce((sum, a) => sum + a.points, 0)} points
                    </span>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 flex gap-2"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => {
                      // Navigate to badges page
                      window.location.href = '/badges';
                    }}
                  >
                    View Collection
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => {
                      setVisible(false);
                      setTimeout(onDismiss, 300);
                    }}
                  >
                    Continue Learning
                  </Button>
                </motion.div>
              </div>

              {/* Animated Background Elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0], 
                      rotate: [0, 180, 360],
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50]
                    }}
                    transition={{
                      duration: 2,
                      delay: 1 + (i * 0.2),
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <Award className="h-6 w-6 text-yellow-300/30" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
