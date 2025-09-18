
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Award, 
  Clock, 
  Target, 
  CheckCircle, 
  Star,
  Calendar,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const badges = [
  {
    id: 1,
    title: "Linear Equations Master",
    description: "Completed Linear Equations and Inequalities module",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    earned: true,
    earnedDate: "2024-02-15",
    category: "Module Completion"
  },
  {
    id: 2,
    title: "Function Explorer",
    description: "Completed Functions and Graphs module",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    earned: true,
    earnedDate: "2024-03-02",
    category: "Module Completion"
  },
  {
    id: 3,
    title: "Polynomial Pro",
    description: "Completed Polynomial and Rational Functions module",
    image: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
    earned: false,
    earnedDate: null,
    category: "Module Completion"
  },
  {
    id: 4,
    title: "Exponential Expert",
    description: "Completed Exponential and Logarithmic Functions module",
    image: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
    earned: false,
    earnedDate: null,
    category: "Module Completion"
  },
  {
    id: 5,
    title: "Systems Solver",
    description: "Completed Systems of Equations and Matrices module",
    image: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
    earned: false,
    earnedDate: null,
    category: "Module Completion"
  },
  {
    id: 6,
    title: "Probability Pioneer",
    description: "Completed Sequences, Series, and Probability module",
    image: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
    earned: false,
    earnedDate: null,
    category: "Module Completion"
  },
  {
    id: 7,
    title: "First Steps",
    description: "Completed your first practice problem",
    image: "https://cdn.abacus.ai/images/32c88839-176e-4f10-b666-42a6ca0057d8.png",
    earned: true,
    earnedDate: "2024-02-10",
    category: "Achievement"
  },
  {
    id: 8,
    title: "Quiz Master",
    description: "Scored 90% or higher on 5 quizzes",
    image: "https://cdn.abacus.ai/images/8195ff2a-dfeb-4615-8511-56b1766ba0e8.png",
    earned: true,
    earnedDate: "2024-02-28",
    category: "Achievement"
  },
  {
    id: 9,
    title: "Course Completion",
    description: "Complete all 6 learning modules",
    image: "https://cdn.abacus.ai/images/a9502816-14fb-4bbf-9fd2-29dbbede7841.png",
    earned: false,
    earnedDate: null,
    category: "Course Completion"
  }
];

const moduleProgress = [
  { name: 'Linear Equations', completed: 100, total: 100 },
  { name: 'Functions & Graphs', completed: 85, total: 100 },
  { name: 'Polynomial Functions', completed: 45, total: 100 },
  { name: 'Exponential Functions', completed: 0, total: 100 },
  { name: 'Systems & Matrices', completed: 0, total: 100 },
  { name: 'Sequences & Probability', completed: 0, total: 100 },
];

const overallProgress = [
  { name: 'Completed', value: 38, color: '#10B981' },
  { name: 'Remaining', value: 62, color: '#E5E7EB' }
];

const studyStats = {
  totalTime: 24,
  currentStreak: 7,
  badgesEarned: 4,
  totalBadges: 9,
  averageScore: 87,
  completedModules: 2
};

export function ProgressDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({
    totalTime: 0,
    currentStreak: 0,
    badgesEarned: 0,
    averageScore: 0
  });

  useEffect(() => {
    // Animate numbers counting up
    const timer = setTimeout(() => {
      setAnimatedStats(studyStats);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedStats.totalTime}h</div>
            <p className="text-xs text-muted-foreground">
              Total time spent learning
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedStats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedStats.badgesEarned}/{studyStats.totalBadges}</div>
            <p className="text-xs text-muted-foreground">
              Digital achievements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Quiz performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Course Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallProgress}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                      >
                        {overallProgress.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">38%</p>
                  <p className="text-gray-600">Course Progress</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnedBadges.slice(-3).reverse().map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={badge.image}
                          alt={badge.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{badge.title}</h4>
                        <p className="text-sm text-gray-500">
                          Earned {new Date(badge.earnedDate || '').toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Module Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleProgress} margin={{ bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                Earned Badges ({earnedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="text-center group">
                    <div className="relative w-24 h-24 mx-auto mb-3 transform group-hover:scale-110 transition-transform">
                      <Image
                        src={badge.image}
                        alt={badge.title}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{badge.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {new Date(badge.earnedDate || '').toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unearned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-gray-400" />
                Available Badges ({unearnedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {unearnedBadges.map((badge) => (
                  <div key={badge.id} className="text-center group opacity-60">
                    <div className="relative w-24 h-24 mx-auto mb-3 filter grayscale group-hover:grayscale-0 transition-all">
                      <Image
                        src={badge.image}
                        alt={badge.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-1">{badge.title}</h4>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Detailed Module Progress */}
          <div className="space-y-4">
            {moduleProgress.map((module, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                      <p className="text-sm text-gray-500">Module {index + 1}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{module.completed}%</div>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>
                  <Progress value={module.completed} className="h-2" />
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{module.completed}/100 lessons</span>
                    <span>
                      {module.completed === 100 ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      ) : module.completed > 0 ? (
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
