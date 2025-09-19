
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Award, 
  CheckCircle, 
  Lock, 
  Target,
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeWithProgress } from '../lib/badge-system';

interface BadgeCardProps {
  badge: BadgeWithProgress;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onClick?: () => void;
}

export function BadgeCard({ 
  badge, 
  size = 'medium', 
  showProgress = true, 
  onClick 
}: BadgeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeTypeIcon = (type: string) => {
    switch (type) {
      case 'MODULE_COMPLETION':
        return <Award className="h-4 w-4" />;
      case 'QUIZ_PASS':
        return <Target className="h-4 w-4" />;
      case 'COURSE_COMPLETION':
        return <Star className="h-4 w-4" />;
      case 'STREAK':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getBadgeTypeColor = (type: string) => {
    switch (type) {
      case 'MODULE_COMPLETION':
        return 'bg-blue-100 text-blue-800';
      case 'QUIZ_PASS':
        return 'bg-green-100 text-green-800';
      case 'COURSE_COMPLETION':
        return 'bg-purple-100 text-purple-800';
      case 'STREAK':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return 'w-48 h-64';
      case 'large':
        return 'w-80 h-96';
      default:
        return 'w-64 h-80';
    }
  };

  const getImageSize = () => {
    switch (size) {
      case 'small':
        return 'h-16 w-16';
      case 'large':
        return 'h-24 w-24';
      default:
        return 'h-20 w-20';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${getCardSize()} cursor-pointer`}
      onClick={onClick}
    >
      <Card className={`h-full ${
        badge.isEarned 
          ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:shadow-md'
      } transition-all duration-300 overflow-hidden`}>
        
        {/* Status Overlay */}
        <div className="absolute top-3 right-3 z-10">
          {badge.isEarned ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
            </motion.div>
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Badge Image */}
        <CardHeader className="text-center pb-4">
          <div className={`relative ${getImageSize()} mx-auto mb-3 ${
            badge.isEarned ? '' : 'opacity-60 grayscale'
          } transition-all duration-300`}>
            <div className={`absolute inset-0 ${
              badge.isEarned 
                ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' 
                : 'bg-gray-200/20'
            } rounded-full`} />
            <Image
              src={badge.imageUrl}
              alt={badge.title}
              fill
              className="object-contain p-2"
            />
            
            {/* Shine effect for earned badges */}
            <AnimatePresence>
              {badge.isEarned && isHovered && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 100, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
                />
              )}
            </AnimatePresence>
          </div>

          <CardTitle className={`${
            size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base'
          } font-bold text-gray-900 line-clamp-2 ${
            badge.isEarned ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {badge.title}
          </CardTitle>
          
          <CardDescription className={`${
            size === 'small' ? 'text-xs' : 'text-sm'
          } line-clamp-3 ${
            badge.isEarned ? 'text-gray-700' : 'text-gray-500'
          }`}>
            {badge.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Badge Type and Points */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getBadgeTypeColor(badge.badgeType)} text-xs flex items-center`}
            >
              {getBadgeTypeIcon(badge.badgeType)}
              <span className="ml-1">
                {badge.badgeType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </Badge>
            
            <div className="flex items-center text-sm font-semibold">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
              <span className={badge.isEarned ? 'text-yellow-600' : 'text-gray-500'}>
                {badge.points}
              </span>
            </div>
          </div>

          {/* Module Association */}
          {badge.module && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              📚 {badge.module.title}
            </div>
          )}

          {/* Progress Indicator */}
          {showProgress && !badge.isEarned && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{Math.round(badge.progress.percentage)}%</span>
              </div>
              <Progress value={badge.progress.percentage} className="h-2" />
              <div className="text-xs text-gray-500 text-center">
                {badge.progress.current} / {badge.progress.target}
              </div>
            </div>
          )}

          {/* Earned Date */}
          {badge.isEarned && badge.earnedAt && (
            <div className="flex items-center text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
              <Calendar className="h-3 w-3 mr-1" />
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}

          {/* Call to Action */}
          {!badge.isEarned && badge.progress.percentage > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                // Handle continue learning action
              }}
            >
              {badge.progress.percentage >= 80 ? '🔥 Almost there!' : '📚 Keep Learning'}
            </Button>
          )}
        </CardContent>

        {/* Glow effect for earned badges */}
        <AnimatePresence>
          {badge.isEarned && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
