
'use client';

import { Bot, MessageCircle, Brain, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AITutorSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet AI Unk - Your Personal Math Tutor
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get instant help, explanations, and guidance from our advanced AI tutor. 
            Available 24/7 to support your learning journey through College Algebra.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* AI Tutor Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Answers</h3>
                <p className="text-gray-600">
                  Ask any question about College Algebra concepts and get detailed, step-by-step explanations instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Learning</h3>
                <p className="text-gray-600">
                  AI Unk adapts to your learning style and provides customized practice problems and explanations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Tips & Strategies</h3>
                <p className="text-gray-600">
                  Get helpful study tips, problem-solving strategies, and exam preparation advice tailored for business students.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-gray-600">
                  Study anytime, anywhere. AI Unk is always ready to help, whether it's midnight or early morning.
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Chatbot Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="h-[500px] relative">
              <iframe
                src="https://apps.abacus.ai/chatllm/?appId=170f87fb06&hideTopBar=2"
                className="w-full h-full border-0"
                title="AI Unk Chatbot - College Algebra Tutor"
                allow="microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI Unk</h4>
                  <p className="text-sm text-gray-600">Your College Algebra AI Tutor</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Learning with AI Assistance?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students who are already succeeding with AI Unk's personalized tutoring.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Bot className="h-4 w-4" />
              <span>AI Unk is available in all learning modules and practice sessions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
