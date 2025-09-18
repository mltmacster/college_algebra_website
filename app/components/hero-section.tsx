
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowRight, BookOpen, Award, Calculator } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { data: session } = useSession() || {};

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Image
            src="https://cdn.abacus.ai/images/86a44d97-1714-4703-aba2-0b4f39a43303.png"
            alt="Mathematical Learning Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Master College
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Algebra
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Interactive learning modules designed for business students. Learn through practice, earn digital badges, and get AI-powered tutoring assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {session?.user ? (
              <Link href="/modules">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Continue Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Link href="/modules">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10">
                Explore Modules
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
              <Calculator className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">6 Interactive Modules</h3>
              <p className="text-gray-300 text-sm">From linear equations to probability</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
              <Award className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Digital Badges</h3>
              <p className="text-gray-300 text-sm">Earn rewards for your progress</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
              <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Tutor Assistant</h3>
              <p className="text-gray-300 text-sm">24/7 personalized learning support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Math Elements */}
      <motion.div
        className="absolute top-20 left-10 text-white/20 text-6xl font-thin"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ∫
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-10 text-white/20 text-4xl font-thin"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        Σ
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-20 text-white/20 text-5xl font-thin"
        animate={{
          x: [0, 15, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        π
      </motion.div>
    </section>
  );
}
