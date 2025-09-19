
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Target, 
  CheckCircle, 
  PlayCircle,
  Lock,
  Eye
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ModulePreviewModal } from './modals/module-preview-modal';

const modules = [
  {
    id: 1,
    title: "Linear Equations and Inequalities",
    description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    topics: ["Linear Functions", "Break-even Analysis", "Cost Functions", "Supply & Demand", "Market Equilibrium"],
    duration: "2-3 weeks",
    slug: "linear-equations",
    difficulty: "Beginner",
    estimatedHours: 15,
    order: 1
  },
  {
    id: 2,
    title: "Functions and Graphs",
    description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    topics: ["Function Notation", "Graphing", "Piecewise Functions", "Domain & Range", "Transformations"],
    duration: "2-3 weeks",
    slug: "functions-graphs",
    difficulty: "Beginner",
    estimatedHours: 18,
    order: 2
  },
  {
    id: 3,
    title: "Polynomial and Rational Functions",
    description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
    image: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
    topics: ["Polynomial Models", "Revenue Optimization", "Efficiency Analysis", "Asymptotes", "End Behavior"],
    duration: "3-4 weeks",
    slug: "polynomial-rational",
    difficulty: "Intermediate",
    estimatedHours: 24,
    order: 3
  },
  {
    id: 4,
    title: "Exponential and Logarithmic Functions",
    description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
    image: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
    topics: ["Exponential Growth", "Compound Interest", "Business Scaling", "Logarithmic Models", "Investment Analysis"],
    duration: "3-4 weeks",
    slug: "exponential-logarithmic",
    difficulty: "Intermediate",
    estimatedHours: 26,
    order: 4
  },
  {
    id: 5,
    title: "Systems of Equations and Matrices",
    description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
    image: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
    topics: ["Resource Allocation", "Matrix Operations", "Optimization", "Linear Programming", "Decision Making"],
    duration: "3-4 weeks",
    slug: "systems-matrices",
    difficulty: "Advanced",
    estimatedHours: 28,
    order: 5
  },
  {
    id: 6,
    title: "Sequences, Series, and Probability",
    description: "Apply sequences and probability concepts to financial planning, risk assessment, and forecasting.",
    image: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
    topics: ["Financial Planning", "Risk Assessment", "Forecasting", "Annuities", "Monte Carlo Methods"],
    duration: "2-3 weeks",
    slug: "sequences-probability",
    difficulty: "Advanced",
    estimatedHours: 22,
    order: 6
  }
];

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

export function ModulesGrid() {
  const { data: session } = useSession() || {};
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Simulate progress data - in real app, fetch from API
  useEffect(() => {
    const mockProgress = {
      1: 100,
      2: 100,
      3: 100,
      4: 100,
      5: 100,
      6: 100
    };
    setProgress(mockProgress);
  }, []);

  const handlePreviewModule = (module: typeof modules[0]) => {
    setSelectedModule(module);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedModule(null);
  };

  const getModuleStatus = (moduleOrder: number, moduleProgress: number) => {
    if (moduleProgress >= 100) return 'completed';
    if (moduleProgress > 0) return 'in-progress';
    if (moduleOrder === 1 || (progress[moduleOrder - 1] && progress[moduleOrder - 1] >= 80)) {
      return 'available';
    }
    return 'locked';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'Continue';
      case 'available':
        return 'Start Module';
      case 'locked':
        return 'Locked';
      default:
        return 'Start Module';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {modules?.map((module) => {
        const moduleProgress = progress[module.id] || 0;
        const status = getModuleStatus(module.order, moduleProgress);
        
        return (
          <Card key={module?.id} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={module?.image || ''}
                  alt={`${module?.title} Badge`}
                  fill
                  className="object-contain p-8 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Status overlay */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={`${
                    status === 'completed' ? 'bg-green-100 text-green-800' :
                    status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    status === 'available' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  } bg-white/90 backdrop-blur-sm`}
                >
                  {getStatusIcon(status)}
                  <span className="ml-1">Module {module?.order}</span>
                </Badge>
              </div>

              <div className="absolute top-4 right-4">
                <Badge className={getDifficultyColor(module?.difficulty)}>
                  {module?.difficulty}
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
              {/* Progress bar for started modules */}
              {moduleProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{moduleProgress}%</span>
                  </div>
                  <Progress value={moduleProgress} className="h-2" />
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {module?.duration} • {module?.estimatedHours} hours
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
                  {module?.topics && module.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{module.topics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {status === 'locked' ? (
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePreviewModule(module)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Module
                  </Button>
                  <Button 
                    className="w-full" 
                    disabled
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Previous Module
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handlePreviewModule(module)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Link href={`/modules/${module?.slug}`} className="flex-1">
                    <Button className={`w-full ${
                      status === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                      status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-gray-900 hover:bg-gray-800'
                    } transition-colors group-hover:bg-blue-600`}>
                      {getStatusIcon(status)}
                      <span className="ml-2">{getStatusText(status).split(' ').slice(0,1).join(' ')}</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Module Preview Modal */}
    <ModulePreviewModal
      module={selectedModule}
      isOpen={isPreviewOpen}
      onClose={closePreview}
      userProgress={selectedModule ? progress[selectedModule.id] || 0 : 0}
      isUnlocked={selectedModule ? getModuleStatus(selectedModule.order, progress[selectedModule.id] || 0) !== 'locked' : true}
    />
    </>
  );
}
