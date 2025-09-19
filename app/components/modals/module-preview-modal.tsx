
'use client';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  PlayCircle, 
  Lock,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react';

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  topics: string[];
  duration: string;
  slug: string;
  difficulty: string;
  estimatedHours: number;
  order: number;
  objectives?: string[];
  prerequisites?: string[];
  completionRate?: number;
  enrolledStudents?: number;
}

interface ModulePreviewModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
  userProgress?: number;
  isUnlocked?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getModuleStatus = (progress: number = 0, isUnlocked: boolean = true) => {
  if (!isUnlocked) return 'locked';
  if (progress >= 100) return 'completed';
  if (progress > 0) return 'in-progress';
  return 'available';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'in-progress':
      return <PlayCircle className="h-5 w-5 text-blue-500" />;
    case 'available':
      return <BookOpen className="h-5 w-5 text-gray-500" />;
    case 'locked':
      return <Lock className="h-5 w-5 text-gray-400" />;
    default:
      return <BookOpen className="h-5 w-5 text-gray-500" />;
  }
};

export function ModulePreviewModal({ 
  module, 
  isOpen, 
  onClose, 
  userProgress = 0,
  isUnlocked = true 
}: ModulePreviewModalProps) {
  if (!module) return null;

  const status = getModuleStatus(userProgress, isUnlocked);
  const completionRate = module.completionRate || 92;
  const enrolledStudents = module.enrolledStudents || 1247;

  const objectives = module.objectives || [
    `Master ${module.topics[0]?.toLowerCase()} concepts and applications`,
    `Apply algebraic principles to real-world business scenarios`,
    `Develop problem-solving skills through interactive practice`,
    `Prepare for advanced mathematical concepts in business`
  ];

  const prerequisites = module.prerequisites || 
    (module.order > 1 ? [`Complete Module ${module.order - 1}`] : ['Basic arithmetic skills']);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="relative">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-6 h-full flex items-end">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  Module {module.order}
                </Badge>
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(status)}
                  <span className="text-sm font-medium">
                    {status === 'completed' ? 'Completed' :
                     status === 'in-progress' ? 'In Progress' :
                     status === 'available' ? 'Available' : 'Locked'}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{module.title}</h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                {module.description}
              </p>
            </div>
          </div>
          
          {/* Module Image */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32">
            <div className="relative w-full h-full">
              <Image
                src={module.image}
                alt={`${module.title} Badge`}
                fill
                className="object-contain filter drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <ModalBody className="space-y-6 py-6">
          {/* Progress Bar (if started) */}
          {userProgress > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-900">Your Progress</span>
                <span className="text-blue-700 font-bold">{userProgress}%</span>
              </div>
              <Progress value={userProgress} className="h-3" />
              <p className="text-sm text-blue-700 mt-2">
                Keep up the great work! You're making excellent progress.
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold text-gray-900">{module.estimatedHours} Hours</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="font-semibold text-gray-900">{enrolledStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="font-semibold text-gray-900">{completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Topics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Key Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {module.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Prerequisites
            </h3>
            <ul className="space-y-1">
              {prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Unk Assistance */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">AI Unk Tutoring Available</h4>
            </div>
            <p className="text-sm text-gray-600">
              Get instant help with concepts, step-by-step problem solving, and personalized explanations 
              throughout this module with your AI tutor.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              Duration: {module.duration} • {module.difficulty} Level
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close Preview
              </Button>
              {status === 'locked' ? (
                <Button disabled className="opacity-50">
                  <Lock className="h-4 w-4 mr-2" />
                  Module Locked
                </Button>
              ) : (
                <Link href={`/modules/${module.slug}`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {status === 'completed' ? 'Review Module' :
                     status === 'in-progress' ? 'Continue Learning' : 'Start Module'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}
