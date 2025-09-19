
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { 
  Award, 
  Trophy, 
  Star, 
  Target,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BadgeCelebrationModal } from './modals/badge-celebration-modal';

const sampleBadges = [
  {
    id: 1,
    title: "Linear Equations Master",
    description: "Successfully completed all Linear Equations and Inequalities modules with 85% or higher scores.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    type: 'module' as const,
    rarity: 'common' as const,
    earnedDate: new Date().toISOString(),
    moduleTitle: "Linear Equations and Inequalities"
  },
  {
    id: 2,
    title: "Problem Solver Extraordinaire",
    description: "Solved 100 practice problems across all modules with exceptional accuracy.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    type: 'achievement' as const,
    rarity: 'rare' as const,
    earnedDate: new Date().toISOString()
  },
  {
    id: 3,
    title: "College Algebra Champion",
    description: "Completed all 6 modules with distinction and earned the highest honor in College Algebra mastery.",
    image: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
    type: 'milestone' as const,
    rarity: 'legendary' as const,
    earnedDate: new Date().toISOString()
  }
];

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

export function BadgeShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedBadge, setSelectedBadge] = useState<typeof sampleBadges[0] | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  const handleCelebrateBadge = (badge: typeof sampleBadges[0]) => {
    setSelectedBadge(badge);
    setIsCelebrationOpen(true);
  };

  const closeCelebration = () => {
    setIsCelebrationOpen(false);
    setSelectedBadge(null);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50" ref={ref}>
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Digital Badge System
              </h2>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn recognition for your achievements and track your progress through our comprehensive 
              badge system. Each badge represents a milestone in your College Algebra mastery journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {sampleBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`h-full hover:shadow-2xl transition-all duration-300 border-2 ${rarityBorder[badge.rarity]} group cursor-pointer`}
                      onClick={() => handleCelebrateBadge(badge)}>
                  <CardHeader className="text-center pb-2">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-20`} />
                      <div className="relative w-full h-full">
                        <Image
                          src={badge.image}
                          alt={badge.title}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${rarityColors[badge.rarity]} text-white border-0 mb-2`}>
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </Badge>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {badge.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <p className="text-gray-600 text-sm mb-4">
                      {badge.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      {badge.type === 'module' && <Target className="h-3 w-3" />}
                      {badge.type === 'achievement' && <Star className="h-3 w-3" />}
                      {badge.type === 'milestone' && <Trophy className="h-3 w-3" />}
                      <span className="capitalize">{badge.type} Badge</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
          >
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Badge Celebrations
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Click on any badge above to experience our celebration system! When you complete modules 
              and achieve milestones, you'll be rewarded with these engaging badge ceremonies.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Recognition</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-blue-500" />
                <span>Shareable Achievements</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Badge Celebration Modal */}
      <BadgeCelebrationModal
        badge={selectedBadge}
        isOpen={isCelebrationOpen}
        onClose={closeCelebration}
        onShareBadge={() => {
          // Demo function - in real app would implement sharing
          alert('Share badge functionality would be implemented here!');
        }}
        onDownloadCertificate={() => {
          // Demo function - in real app would generate certificate
          alert('Certificate download would be implemented here!');
        }}
      />
    </>
  );
}
