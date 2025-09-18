
'use client';

import Image from 'next/image';
import { 
  Calculator, 
  Award, 
  BarChart3, 
  Users, 
  Clock, 
  Trophy,
  Target,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Calculator,
    title: "Interactive Learning",
    description: "Engage with dynamic mathematical visualizations and practice problems tailored for business applications.",
    image: "https://cdn.abacus.ai/images/32c88839-176e-4f10-b666-42a6ca0057d8.png"
  },
  {
    icon: Award,
    title: "Digital Badge System",
    description: "Earn recognition for your achievements with beautiful digital badges that showcase your mastery.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png"
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and personalized progress reports.",
    image: "https://cdn.abacus.ai/images/8195ff2a-dfeb-4615-8511-56b1766ba0e8.png"
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Connect with fellow business students and learn together in our supportive community.",
    image: "https://cdn.abacus.ai/images/c1aac196-5e4c-4dd9-80f9-ddc5998fd74a.png"
  },
  {
    icon: Clock,
    title: "Self-Paced Learning",
    description: "Learn at your own speed with flexible scheduling that fits your busy student lifestyle.",
    image: "https://cdn.abacus.ai/images/a9502816-14fb-4bbf-9fd2-29dbbede7841.png"
  },
  {
    icon: Trophy,
    title: "Business Applications",
    description: "Apply mathematical concepts to real-world business scenarios and case studies.",
    image: "https://cdn.abacus.ai/images/641e37df-5ede-4df9-b906-99f6b8afb404.png"
  }
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Designed specifically for undergraduate business students, our platform combines modern technology 
            with proven educational methods to make College Algebra engaging and practical.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => {
            const IconComponent = feature?.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={feature?.image || ''}
                        alt={feature?.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {IconComponent && (
                      <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {feature?.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature?.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Join Thousands of Successful Students
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <motion.div 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                5,000+
              </motion.div>
              <p className="text-blue-100">Students Enrolled</p>
            </div>
            
            <div className="flex flex-col items-center">
              <motion.div 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                95%
              </motion.div>
              <p className="text-blue-100">Success Rate</p>
            </div>
            
            <div className="flex flex-col items-center">
              <motion.div 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                50,000+
              </motion.div>
              <p className="text-blue-100">Badges Earned</p>
            </div>
            
            <div className="flex flex-col items-center">
              <motion.div 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                4.9/5
              </motion.div>
              <p className="text-blue-100">Student Rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
