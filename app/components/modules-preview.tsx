
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Clock, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const modules = [
  {
    id: 1,
    title: "Linear Equations and Inequalities",
    description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    topics: ["Linear Functions", "Break-even Analysis", "Cost Functions"],
    duration: "2-3 weeks",
    slug: "linear-equations",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Functions and Graphs",
    description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    topics: ["Function Notation", "Graphing", "Piecewise Functions"],
    duration: "2-3 weeks",
    slug: "functions-graphs",
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Polynomial and Rational Functions", 
    description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
    image: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
    topics: ["Polynomial Models", "Revenue Optimization", "Efficiency Analysis"],
    duration: "3-4 weeks",
    slug: "polynomial-rational",
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Exponential and Logarithmic Functions",
    description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
    image: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
    topics: ["Exponential Growth", "Compound Interest", "Business Scaling"],
    duration: "3-4 weeks",
    slug: "exponential-logarithmic",
    color: "bg-orange-500"
  },
  {
    id: 5,
    title: "Systems of Equations and Matrices",
    description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
    image: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
    topics: ["Resource Allocation", "Matrix Operations", "Optimization"],
    duration: "3-4 weeks",
    slug: "systems-matrices",
    color: "bg-teal-500"
  },
  {
    id: 6,
    title: "Sequences, Series, and Probability",
    description: "Apply sequences and probability concepts to financial planning, risk assessment, and forecasting.",
    image: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
    topics: ["Financial Planning", "Risk Assessment", "Forecasting"],
    duration: "2-3 weeks",
    slug: "sequences-probability",
    color: "bg-red-500"
  }
];

export function ModulesPreview() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            6-Module Learning Boot-Camp
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive College Algebra curriculum designed specifically for undergraduate business students. 
            Each module includes interactive content, practice problems, and real-world applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules?.map((module, index) => (
            <motion.div
              key={module?.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0">
                    <Image
                      src={module?.image || ''}
                      alt={`${module?.title} Badge`}
                      fill
                      className="object-contain p-8 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      Module {module?.id}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {module?.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3">
                    {module?.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {module?.duration}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Key Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {module?.topics?.slice(0, 3)?.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href={`/modules/${module?.slug}`} className="block">
                    <Button className="w-full mt-4 group-hover:bg-blue-600 transition-colors">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Module
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link href="/modules">
            <Button size="lg" variant="outline" className="px-8 py-3">
              View All Modules
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
