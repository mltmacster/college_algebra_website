
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  Play,
  Calculator,
  FileText,
  Award,
  BarChart3,
  PlayCircle,
  X,
  Zap
} from 'lucide-react';
import { InteractiveLearningModule } from './interactive-learning-module';
import { useSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const moduleData = {
  'linear-equations': {
    id: 1,
    title: "Linear Equations and Inequalities",
    description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    difficulty: "Beginner",
    estimatedHours: 15,
    progress: 85,
    objectives: [
      "Solve linear equations and inequalities in one variable",
      "Understand the concept of break-even analysis in business",
      "Apply linear functions to model cost, revenue, and profit",
      "Graph linear equations and interpret their business meanings",
      "Use linear models to make business decisions"
    ],
    topics: [
      {
        title: "Introduction to Linear Equations",
        description: "Basic concepts and solving techniques",
        duration: "45 min",
        completed: true
      },
      {
        title: "Business Applications - Cost Functions",
        description: "Using linear equations to model business costs",
        duration: "60 min",
        completed: true
      },
      {
        title: "Break-even Analysis",
        description: "Finding the point where revenue equals cost",
        duration: "75 min",
        completed: true
      },
      {
        title: "Supply and Demand Models",
        description: "Linear modeling of market dynamics",
        duration: "60 min",
        completed: false
      },
      {
        title: "Linear Inequalities in Business",
        description: "Constraints and optimization basics",
        duration: "45 min",
        completed: false
      }
    ],
    practiceProblems: [
      {
        title: "Break-even Analysis Problem Set",
        description: "Calculate break-even points for various business scenarios",
        difficulty: "Easy",
        questions: 12
      },
      {
        title: "Cost Function Modeling",
        description: "Create linear cost models from business data",
        difficulty: "Medium",
        questions: 8
      },
      {
        title: "Market Equilibrium Problems",
        description: "Find equilibrium points in supply/demand models",
        difficulty: "Medium",
        questions: 10
      }
    ],
    realWorldExample: {
      title: "Coffee Shop Break-Even Analysis",
      description: "A local coffee shop wants to determine how many cups of coffee they need to sell daily to break even. With fixed costs of $200/day and variable costs of $1.50 per cup, selling each cup at $4.00, they need to find their break-even point.",
      solution: "Let x = number of cups sold. Revenue = 4x, Total Cost = 200 + 1.5x. Break-even: 4x = 200 + 1.5x, so 2.5x = 200, x = 80 cups per day."
    }
  },
  'functions-graphs': {
    id: 2,
    title: "Functions and Graphs",
    description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    difficulty: "Beginner",
    estimatedHours: 18,
    progress: 60,
    objectives: [
      "Understand function notation and terminology",
      "Graph various types of functions accurately",
      "Analyze domain and range of business functions",
      "Model tiered pricing with piecewise functions",
      "Interpret function transformations in business contexts"
    ],
    topics: [
      {
        title: "Function Basics and Notation",
        description: "Understanding f(x) notation and function concepts",
        duration: "50 min",
        completed: true
      },
      {
        title: "Graphing Techniques",
        description: "Methods for graphing functions accurately",
        duration: "70 min",
        completed: true
      },
      {
        title: "Domain and Range in Business",
        description: "Practical constraints in business functions",
        duration: "55 min",
        completed: false
      },
      {
        title: "Piecewise Functions - Tiered Pricing",
        description: "Modeling complex pricing structures",
        duration: "80 min",
        completed: false
      },
      {
        title: "Function Transformations",
        description: "Shifting and scaling business models",
        duration: "65 min",
        completed: false
      }
    ],
    practiceProblems: [
      {
        title: "Function Evaluation Practice",
        description: "Evaluate functions at various points",
        difficulty: "Easy",
        questions: 15
      },
      {
        title: "Graphing Function Families",
        description: "Graph and analyze different function types",
        difficulty: "Medium",
        questions: 10
      },
      {
        title: "Piecewise Pricing Models",
        description: "Create and analyze tiered pricing functions",
        difficulty: "Hard",
        questions: 6
      }
    ],
    realWorldExample: {
      title: "Subscription Service Pricing",
      description: "A streaming service uses tiered pricing: $10/month for basic (up to 2 devices), $15/month for standard (up to 4 devices), and $20/month for premium (unlimited devices). Model this as a piecewise function.",
      solution: "f(x) = {10 if 1≤x≤2; 15 if 3≤x≤4; 20 if x≥5} where x is the number of devices."
    }
  }
};

const sampleChartData = [
  { x: 0, y: 200 },
  { x: 20, y: 230 },
  { x: 40, y: 260 },
  { x: 60, y: 290 },
  { x: 80, y: 320 },
  { x: 100, y: 350 },
];

interface ModuleContentProps {
  slug: string;
}

export function ModuleContent({ slug }: ModuleContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [useInteractive, setUseInteractive] = useState(false);
  const { data: session } = useSession() || {};
  const module = moduleData[slug as keyof typeof moduleData];

  // Check if this module supports interactive learning
  const interactiveModules = ['linear-equations']; // Add more as we build them
  const supportsInteractive = interactiveModules.includes(slug);

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setLessonModalOpen(true);
  };

  const handlePracticeClick = (practice: any) => {
    setSelectedPractice(practice);
    setPracticeModalOpen(true);
  };

  const handleInteractiveToggle = () => {
    setUseInteractive(!useInteractive);
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Link href="/modules">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render Interactive Learning Module if enabled and supported
  if (useInteractive && supportsInteractive && session?.user?.id) {
    return (
      <InteractiveLearningModule
        moduleSlug={slug}
        moduleTitle={module.title}
        moduleDescription={module.description}
        userId={session.user.id}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/modules">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Modules
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              {supportsInteractive && (
                <Button
                  onClick={handleInteractiveToggle}
                  className={`${
                    useInteractive 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white shadow-lg`}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {useInteractive ? 'Switch to Overview' : 'Interactive Mode'}
                </Button>
              )}
              <Badge className="bg-blue-100 text-blue-800">
                Module {module.id}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {module.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {module.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-green-100 text-green-800">
                  {module.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {module.estimatedHours} hours
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="h-4 w-4 mr-2" />
                  {module.objectives.length} learning objectives
                </div>
              </div>

              {/* Progress */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">Your Progress</span>
                  <span className="text-blue-600 font-bold">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-3" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card>
                  <CardHeader className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={module.image}
                        alt={`${module.title} Badge`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <CardTitle className="text-lg">Module Badge</CardTitle>
                    <CardDescription>
                      Complete this module to earn your badge
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {module.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Real-World Business Application</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-lg mb-3">{module.realWorldExample.title}</h4>
                <p className="text-gray-600 mb-4">{module.realWorldExample.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Solution Approach:</h5>
                  <p className="text-blue-800">{module.realWorldExample.solution}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            {module.topics.map((topic, index) => (
              <Card key={index} className={`${topic.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        topic.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {topic.completed ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                        <p className="text-gray-600">{topic.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {topic.duration}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={topic.completed ? "outline" : "default"}
                      onClick={() => handleLessonClick(topic)}
                    >
                      {topic.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            {module.practiceProblems.map((problem, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Calculator className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                        <p className="text-gray-600">{problem.description}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm">
                          <Badge variant={
                            problem.difficulty === 'Easy' ? 'default' :
                            problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {problem.difficulty}
                          </Badge>
                          <span className="text-gray-500">{problem.questions} questions</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handlePracticeClick(problem)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Interactive Cost Function Graph
                </CardTitle>
                <CardDescription>
                  Visualize how linear cost functions work in business scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        label={{ value: 'Quantity (units)', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <YAxis 
                        label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This graph shows a linear cost function where fixed costs are $200 and variable costs are $1.50 per unit.
                  The equation is: Cost = 200 + 1.5x, where x is the number of units produced.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Tutor Integration</CardTitle>
                <CardDescription>
                  Get instant help with module concepts and problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <iframe
                    src="https://apps.abacus.ai/chatllm/?appId=170f87fb06&hideTopBar=2"
                    className="w-full h-full border-0 rounded-lg"
                    title="AI Unk Chatbot - Module Assistant"
                    allow="microphone"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lesson Modal */}
      <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedLesson?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedLesson && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">Duration: {selectedLesson.duration}</span>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                      Lesson Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <h3>Key Concepts:</h3>
                      <ul>
                        <li>Understanding linear relationships in business contexts</li>
                        <li>Solving equations step-by-step</li>
                        <li>Real-world application examples</li>
                        <li>Common mistakes to avoid</li>
                      </ul>
                      
                      <h3>Interactive Example:</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p><strong>Problem:</strong> A company has fixed costs of $5,000 and variable costs of $15 per unit. If they sell each unit for $25, how many units do they need to sell to break even?</p>
                        <p className="mt-2"><strong>Solution:</strong></p>
                        <p>Let x = number of units to sell</p>
                        <p>Revenue = 25x</p>
                        <p>Total Cost = 5000 + 15x</p>
                        <p>Break-even: 25x = 5000 + 15x</p>
                        <p>10x = 5000</p>
                        <p>x = 500 units</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">✓ You've completed this lesson!</h3>
                  <p className="text-green-800">Great work! You can review this content anytime.</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setLessonModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              // Mark lesson as completed logic would go here
              setLessonModalOpen(false);
            }}>
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Practice Modal */}
      <Dialog open={practiceModalOpen} onOpenChange={setPracticeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedPractice?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedPractice?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedPractice && (
              <>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Badge variant={
                    selectedPractice.difficulty === 'Easy' ? 'default' :
                    selectedPractice.difficulty === 'Medium' ? 'secondary' : 'destructive'
                  }>
                    {selectedPractice.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-semibold">{selectedPractice.questions} Questions</span>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Practice Questions</CardTitle>
                    <CardDescription>
                      Work through these problems to reinforce your understanding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Question 1 of {selectedPractice.questions}</h4>
                          <Badge variant="outline">Multiple Choice</Badge>
                        </div>
                        <p className="mb-4">A startup company has monthly fixed costs of $8,000. Their product costs $12 to make and sells for $20. How many units must they sell monthly to break even?</p>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="a" className="text-blue-600" />
                            <span>A) 800 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="b" className="text-blue-600" />
                            <span>B) 1,000 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="c" className="text-blue-600" />
                            <span>C) 1,200 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="d" className="text-blue-600" />
                            <span>D) 1,500 units</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Tip</h3>
                  <p className="text-yellow-800">Remember: Break-even occurs when Revenue = Total Cost</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setPracticeModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              // Submit practice logic would go here
              setPracticeModalOpen(false);
            }}>
              Submit Answers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
