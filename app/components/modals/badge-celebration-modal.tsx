
'use client';

import { Modal, ModalBody } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Award, 
  Star, 
  Trophy, 
  CheckCircle,
  ArrowRight,
  Share2,
  Download
} from 'lucide-react';

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    id: number;
    title: string;
    description: string;
    image: string;
    type: 'module' | 'achievement' | 'milestone';
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    earnedDate: string;
    moduleTitle?: string;
  } | null;
  onShareBadge?: () => void;
  onDownloadCertificate?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  legendary: 'from-purple-400 to-purple-600'
};

const rarityBorder = {
  common: 'border-gray-300',
  uncommon: 'border-green-300',
  rare: 'border-blue-300',
  legendary: 'border-purple-300'
};

export function BadgeCelebrationModal({ 
  isOpen, 
  onClose, 
  badge,
  onShareBadge,
  onDownloadCertificate
}: BadgeCelebrationModalProps) {
  if (!badge) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div className="relative overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50" />
        
        {/* Floating Stars Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 1.2],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </motion.div>
          ))}
        </div>

        <ModalBody className="relative z-10 py-8 text-center">
          {/* Congratulations Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Congratulations!</h2>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-lg text-gray-600 mb-8">
              You've earned a new badge for your hard work and dedication!
            </p>
          </motion.div>

          {/* Badge Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className={`relative mx-auto w-48 h-48 rounded-full p-4 ${rarityBorder[badge.rarity]} border-4 bg-white shadow-2xl`}>
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-10`} />
              <Image
                src={badge.image}
                alt={badge.title}
                fill
                className="object-contain p-6"
              />
              
              {/* Pulse Animation */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${rarityBorder[badge.rarity]}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Badge Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={`bg-gradient-to-r ${rarityColors[badge.rarity]} text-white border-0 px-3 py-1 text-sm font-semibold`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </Badge>
              {badge.type === 'milestone' && <Badge variant="outline">Milestone</Badge>}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {badge.title}
            </h3>
            <p className="text-gray-600 mb-4 max-w-sm mx-auto">
              {badge.description}
            </p>
            
            {badge.moduleTitle && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  <CheckCircle className="inline h-4 w-4 mr-1" />
                  Completed: <span className="font-semibold">{badge.moduleTitle}</span>
                </p>
              </div>
            )}

            <div className="text-sm text-gray-500">
              Earned on {new Date(badge.earnedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex gap-3 justify-center">
              {onShareBadge && (
                <Button variant="outline" onClick={onShareBadge} className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Achievement
                </Button>
              )}
              {onDownloadCertificate && (
                <Button variant="outline" onClick={onDownloadCertificate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              )}
            </div>
            
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue Learning
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <Award className="h-5 w-5 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              <strong>Keep it up!</strong> You're making excellent progress on your College Algebra journey. 
              Every badge represents your growing mastery and dedication to learning.
            </p>
          </motion.div>
        </ModalBody>
      </div>
    </Modal>
  );
}
