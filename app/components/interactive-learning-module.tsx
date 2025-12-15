
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InteractiveProblem } from './interactive-problem';
import { AchievementNotification } from './achievement-notification';
import { 
  BookOpen, 
  Calculator, 
  Award, 
  Target,
  Clock,
  PlayCircle,
  CheckCircle,
  BarChart3,
  Brain,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from './ui/use-toast';
import { Achievement } from '../lib/badge-system';

interface Problem {
  id: string;
  title: string;
  description: string;
  businessContext: string;
  problemStatement: string;
  type: 'multiple-choice' | 'step-by-step' | 'fill-blank';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  choices?: string[];
  steps?: {
    instruction: string;
    hint?: string;
    explanation?: string;
  }[];
}

interface InteractiveLearningModuleProps {
  moduleSlug: string;
  moduleTitle: string;
  moduleDescription: string;
  userId: string;
}

export function InteractiveLearningModule({
  moduleSlug,
  moduleTitle,
  moduleDescription,
  userId
}: InteractiveLearningModuleProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>({});
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problems');
  const [moduleProgress, setModuleProgress] = useState(0);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadProblems();
    loadProgress();
  }, [moduleSlug]);

  const loadProblems = async () => {
    try {
      const response = await fetch(`/api/problems?module=${moduleSlug}`);
      const data = await response.json();
      
      if (data.problems) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      toast({
        title: 'Error',
        description: 'Failed to load practice problems. Please refresh the page.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/progress?module=${moduleSlug}`);
      const data = await response.json();
      
      if (data.progress && data.progress.length > 0) {
        const progress = data.progress[0];
        setModuleProgress(progress.score || 0);
        setTotalTimeSpent(progress.timeSpent || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleProblemComplete = async (score: number, timeSpent: number) => {
    const problemId = problems[currentProblemIndex].id;
    
    // Update local state
    setCompletedProblems(prev => new Set([...prev, problemId]));
    setScores(prev => ({ ...prev, [problemId]: score }));
    setTotalTimeSpent(prev => prev + timeSpent);

    // Calculate new progress
    const newCompletedCount = completedProblems.size + 1;
    const newProgress = Math.round((newCompletedCount / problems.length) * 100);

    try {
      // Update progress on server
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug,
          status: newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
          score: newProgress,
          timeSpent,
          problemId,
          isCorrect: score > 0
        })
      });

      const data = await response.json();

      setModuleProgress(newProgress);

      // Check for new badges
      if (data.newBadges && data.newBadges.length > 0) {
        setNewAchievements(data.newBadges);
      } else {
        toast({
          title: 'Great job!',
          description: `You earned ${score} points! Keep up the excellent work.`,
        });
      }

      // Award badge if module is completed
      if (newProgress === 100) {
        // Don't show the generic completion toast if badges were earned
        if (!data.newBadges || data.newBadges.length === 0) {
          toast({
            title: '🏆 Module Completed!',
            description: `You've mastered ${moduleTitle}! Check your badges.`,
          });
        }
      }

    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Great job!',
        description: `You earned ${score} points! Keep up the excellent work.`,
      });
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
    }
  };

  const getTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const getCompletionRate = () => {
    return problems.length > 0 ? (completedProblems.size / problems.length) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive problems...</p>
        </div>
      </div>
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
            <Badge className="bg-blue-100 text-blue-800">
              Interactive Learning
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {moduleTitle}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {moduleDescription}
              </p>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-900 font-semibold">{problems.length}</span>
                  </div>
                  <p className="text-blue-700 text-sm">Problems</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-900 font-semibold">{completedProblems.size}</span>
                  </div>
                  <p className="text-green-700 text-sm">Completed</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-purple-900 font-semibold">{getTotalScore()}</span>
                  </div>
                  <p className="text-purple-700 text-sm">Points</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-orange-900 font-semibold">{Math.round(totalTimeSpent / 60)}</span>
                  </div>
                  <p className="text-orange-700 text-sm">Minutes</p>
                </div>
              </div>

              {/* Module Progress */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">Module Progress</span>
                  <span className="text-blue-600 font-bold">{moduleProgress}%</span>
                </div>
                <Progress value={moduleProgress} className="h-3" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    Your Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{Math.round(getCompletionRate())}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-semibold">
                      {completedProblems.size > 0 
                        ? Math.round(getTotalScore() / completedProblems.size) 
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time per Problem</span>
                    <span className="font-semibold">
                      {completedProblems.size > 0 
                        ? Math.round((totalTimeSpent / 60) / completedProblems.size) 
                        : 0}m
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg shadow-sm">
            <TabsTrigger value="problems" className="flex items-center font-semibold">
              <Calculator className="h-4 w-4 mr-2" />
              Practice Problems
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center font-semibold">
              <Brain className="h-4 w-4 mr-2" />
              AI Unk Tutor
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center font-semibold">
              <BookOpen className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center font-semibold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Loading Practice Problems...
                    </h3>
                    <p className="text-gray-600">
                      Preparing your personalized learning experience
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : problems.length > 0 ? (
              <>
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Calculator className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>You have {problems.length} practice problems</strong> in this module. 
                    Work through them at your own pace and earn points for each correct answer!
                    {completedProblems.size > 0 && (
                      <span className="ml-2">
                        Progress: <strong>{completedProblems.size}/{problems.length}</strong> completed
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
                <motion.div
                  key={currentProblemIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveProblem
                    problem={problems[currentProblemIndex]}
                    moduleSlug={moduleSlug}
                    onComplete={handleProblemComplete}
                    onNext={handleNextProblem}
                    onPrevious={handlePreviousProblem}
                    isFirst={currentProblemIndex === 0}
                    isLast={currentProblemIndex === problems.length - 1}
                    problemNumber={currentProblemIndex + 1}
                    totalProblems={problems.length}
                  />
                </motion.div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Problems Available Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Interactive problems for this module are being prepared. In the meantime:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setActiveTab('tutor')} 
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Chat with AI Unk
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('overview')} 
                      variant="outline"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Module Overview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tutor">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-600" />
                  AI Unk - Your Personal Math Tutor
                </CardTitle>
                <CardDescription>
                  Get instant help with problems, concepts, and step-by-step explanations. AI Unk speaks your language and breaks down complex math into simple terms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Meet AI Unk</h4>
                      <p className="text-sm text-gray-700">
                        Your street-savvy algebra mentor who explains math concepts using real-world examples and plain English. 
                        Ask questions, get hints, or work through problems step-by-step.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      24/7 availability
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Personalized help
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Step-by-step guidance
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Business context
                    </div>
                  </div>
                </div>
                <div className="h-[600px] bg-white rounded-lg border-2 border-purple-200 shadow-md overflow-hidden">
                  <iframe
                    src="https://apps.abacus.ai/chatllm/?appId=170f87fb06&hideTopBar=2"
                    className="w-full h-full border-0"
                    title="AI Unk Chatbot - Your Personal Math Tutor"
                    allow="microphone"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    onError={(e) => {
                      e.preventDefault();
                      console.log('[InteractiveLearningModule] AI Unk iframe loaded successfully');
                    }}
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Pro Tip:</strong> Ask AI Unk to explain concepts from this module, work through practice problems together, 
                    or get help understanding business applications of algebra.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <Alert className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 shadow-md">
              <Brain className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-gray-900">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <strong className="text-lg block mb-1">Ready to start learning?</strong>
                    <p className="text-sm">
                      Click <strong className="text-blue-600">"Practice Problems"</strong> above to work through interactive exercises, 
                      or chat with <strong className="text-purple-600">"AI Unk Tutor"</strong> for instant help!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setActiveTab('problems')} 
                      className="bg-blue-600 hover:bg-blue-700 shadow-md"
                      size="sm"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Start Practicing
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('tutor')} 
                      className="bg-purple-600 hover:bg-purple-700 shadow-md"
                      size="sm"
                      variant="outline"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Chat with AI Unk
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Module Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <PlayCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    This module features <strong>interactive problem-solving</strong> with step-by-step guidance, 
                    real-time feedback, and business-focused applications of linear algebra concepts.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Break-even analysis and profit optimization for business decisions
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Cost function modeling and revenue calculations
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Supply and demand equilibrium analysis
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Linear inequalities for production constraints
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Real-world business problem-solving techniques
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Interactive Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">Step-by-Step Guidance</h4>
                        <p className="text-purple-700 text-sm">
                          Break down complex problems into manageable steps with hints and explanations.
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Real-Time Feedback</h4>
                        <p className="text-green-700 text-sm">
                          Get immediate feedback on your answers with detailed explanations.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Business Context</h4>
                        <p className="text-blue-700 text-sm">
                          Every problem connects to real business scenarios and applications.
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">Progress Tracking</h4>
                        <p className="text-orange-700 text-sm">
                          Monitor your learning progress and earn points for completed problems.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Problem Completion Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {problems.map((problem, index) => (
                      <div key={problem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{problem.title}</span>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs mr-2">
                              {problem.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-500">{problem.points} pts</span>
                          </div>
                        </div>
                        {completedProblems.has(problem.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(getCompletionRate())}%
                    </div>
                    <p className="text-gray-600">Overall Completion Rate</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points Earned</span>
                      <span className="font-semibold text-green-600">{getTotalScore()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Problems Completed</span>
                      <span className="font-semibold">{completedProblems.size} / {problems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Time Spent</span>
                      <span className="font-semibold">{Math.round(totalTimeSpent / 60)} minutes</span>
                    </div>
                  </div>

                  {moduleProgress === 100 && (
                    <Alert className="bg-green-50 border-green-200">
                      <Award className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900">
                        <strong>Module Completed!</strong> You've mastered all the concepts. Badge earned! 🏆
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Achievement Notifications */}
      <AchievementNotification
        achievements={newAchievements}
        onDismiss={() => setNewAchievements([])}
        autoHide={true}
        duration={6000}
      />
    </div>
  );
}
