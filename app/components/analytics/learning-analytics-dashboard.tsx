
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, BookOpen, Clock, 
  Target, AlertTriangle, CheckCircle, Brain, Award,
  Calendar, Filter, Download, RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    averageScore: number;
    totalTimeSpent: number;
    riskStudents: number;
  };
  performanceMetrics: {
    modulePerformance: Array<{
      module: string;
      avgScore: number;
      completionRate: number;
      timeSpent: number;
      difficulty: number;
    }>;
    learningVelocity: Array<{
      week: string;
      completedLessons: number;
      timeSpent: number;
      avgScore: number;
    }>;
    comprehensionPatterns: Array<{
      concept: string;
      understanding: number;
      retryRate: number;
      timeToMaster: number;
    }>;
  };
  studentSegments: Array<{
    segment: string;
    count: number;
    avgProgress: number;
    riskLevel: 'low' | 'medium' | 'high';
    color: string;
  }>;
}

export function LearningAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedModule, setSelectedModule] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedModule]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/learning-data?timeRange=${timeRange}&module=${selectedModule}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Mock data for development
        setAnalyticsData(generateMockAnalyticsData());
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setAnalyticsData(generateMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = (): AnalyticsData => ({
    overview: {
      totalStudents: 1247,
      activeStudents: 892,
      completionRate: 73.5,
      averageScore: 81.2,
      totalTimeSpent: 15420, // hours
      riskStudents: 156
    },
    performanceMetrics: {
      modulePerformance: [
        { module: 'Linear Equations', avgScore: 85.3, completionRate: 92.1, timeSpent: 12.5, difficulty: 2.1 },
        { module: 'Systems of Equations', avgScore: 78.9, completionRate: 87.3, timeSpent: 15.2, difficulty: 3.2 },
        { module: 'Functions & Graphing', avgScore: 82.1, completionRate: 79.8, timeSpent: 18.7, difficulty: 3.5 },
        { module: 'Quadratic Functions', avgScore: 76.4, completionRate: 74.2, timeSpent: 21.3, difficulty: 4.1 },
        { module: 'Exponential Functions', avgScore: 79.8, completionRate: 68.9, timeSpent: 19.8, difficulty: 3.8 },
        { module: 'Matrix Operations', avgScore: 74.2, completionRate: 62.1, timeSpent: 25.1, difficulty: 4.5 }
      ],
      learningVelocity: [
        { week: 'Week 1', completedLessons: 145, timeSpent: 1250, avgScore: 78.2 },
        { week: 'Week 2', completedLessons: 189, timeSpent: 1680, avgScore: 81.5 },
        { week: 'Week 3', completedLessons: 167, timeSpent: 1420, avgScore: 79.8 },
        { week: 'Week 4', completedLessons: 198, timeSpent: 1850, avgScore: 83.1 },
        { week: 'Week 5', completedLessons: 156, timeSpent: 1390, avgScore: 77.9 },
        { week: 'Week 6', completedLessons: 203, timeSpent: 1920, avgScore: 84.6 }
      ],
      comprehensionPatterns: [
        { concept: 'Break-even Analysis', understanding: 92.3, retryRate: 12.1, timeToMaster: 3.2 },
        { concept: 'Quadratic Optimization', understanding: 76.8, retryRate: 28.4, timeToMaster: 5.8 },
        { concept: 'Matrix Multiplication', understanding: 68.9, retryRate: 35.7, timeToMaster: 7.1 },
        { concept: 'Exponential Growth', understanding: 84.2, retryRate: 18.9, timeToMaster: 4.3 },
        { concept: 'Function Composition', understanding: 79.5, retryRate: 22.6, timeToMaster: 4.9 }
      ]
    },
    studentSegments: [
      { segment: 'High Performers', count: 287, avgProgress: 94.2, riskLevel: 'low', color: '#22c55e' },
      { segment: 'Steady Learners', count: 605, avgProgress: 76.8, riskLevel: 'low', color: '#3b82f6' },
      { segment: 'Struggling Students', count: 199, avgProgress: 52.1, riskLevel: 'medium', color: '#f59e0b' },
      { segment: 'At-Risk Students', count: 156, avgProgress: 28.4, riskLevel: 'high', color: '#ef4444' }
    ]
  });

  const getMetricIcon = (value: number, benchmark: number) => {
    if (value > benchmark) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < benchmark * 0.9) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading analytics data...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-500 py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Unable to load analytics data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into student learning patterns and performance</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              {getMetricIcon(analyticsData.overview.activeStudents, analyticsData.overview.totalStudents * 0.7)}
              <span className="text-sm text-gray-600 ml-1">
                {analyticsData.overview.activeStudents} active ({((analyticsData.overview.activeStudents / analyticsData.overview.totalStudents) * 100).toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.completionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={analyticsData.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageScore}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              {getMetricIcon(analyticsData.overview.averageScore, 75)}
              <span className="text-sm text-gray-600 ml-1">Target: 75%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.overview.riskStudents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">
                {((analyticsData.overview.riskStudents / analyticsData.overview.totalStudents) * 100).toFixed(1)}% of total
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="comprehension">Comprehension</TabsTrigger>
          <TabsTrigger value="segments">Student Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Module Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Module Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.performanceMetrics.modulePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3b82f6" name="Average Score" />
                  <Bar dataKey="completionRate" fill="#22c55e" name="Completion Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Learning Velocity Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Velocity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.performanceMetrics.learningVelocity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completedLessons" stroke="#3b82f6" name="Completed Lessons" />
                  <Line type="monotone" dataKey="avgScore" stroke="#22c55e" name="Average Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Module</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.performanceMetrics.modulePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="timeSpent" fill="#f59e0b" name="Hours Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.performanceMetrics.learningVelocity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="timeSpent" stroke="#8b5cf6" name="Time Spent (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comprehension" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Concept Comprehension Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performanceMetrics.comprehensionPatterns.map((concept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{concept.concept}</h4>
                      <Badge variant={concept.understanding >= 80 ? "default" : concept.understanding >= 60 ? "secondary" : "destructive"}>
                        {concept.understanding}% Understanding
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Retry Rate:</span>
                        <span className="font-medium ml-1">{concept.retryRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time to Master:</span>
                        <span className="font-medium ml-1">{concept.timeToMaster} hours</span>
                      </div>
                      <div>
                        <Progress value={concept.understanding} className={`${getProgressColor(concept.understanding)}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.studentSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, count }) => `${segment}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.studentSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.studentSegments.map((segment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{segment.segment}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={segment.riskLevel === 'low' ? "default" : segment.riskLevel === 'medium' ? "secondary" : "destructive"}
                          >
                            {segment.riskLevel} risk
                          </Badge>
                          <span className="text-sm font-medium">{segment.count} students</span>
                        </div>
                      </div>
                      <Progress value={segment.avgProgress} className="mb-1" />
                      <span className="text-sm text-gray-600">{segment.avgProgress}% average progress</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
