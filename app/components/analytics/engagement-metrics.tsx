
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Clock, Mouse, Eye, Play, Pause, Target, TrendingUp,
  Users, BookOpen, MessageCircle, HelpCircle, Calculator,
  Calendar, Filter, Download, RefreshCw, Activity
} from 'lucide-react';

interface EngagementData {
  overview: {
    totalSessions: number;
    avgSessionDuration: number;
    totalTimeSpent: number;
    uniqueUsers: number;
    interactionRate: number;
    completionRate: number;
  };
  timeMetrics: {
    dailyActivity: Array<{
      date: string;
      sessions: number;
      avgDuration: number;
      uniqueUsers: number;
    }>;
    hourlyDistribution: Array<{
      hour: string;
      sessions: number;
      avgEngagement: number;
    }>;
    sessionLengthDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  interactionPatterns: {
    clickHeatmap: Array<{
      component: string;
      clicks: number;
      avgTimeToClick: number;
      conversionRate: number;
    }>;
    navigationFlow: Array<{
      from: string;
      to: string;
      count: number;
      bounceRate: number;
    }>;
    helpSeeking: Array<{
      module: string;
      helpRequests: number;
      avgHelpTime: number;
      resolutionRate: number;
    }>;
  };
  successMetrics: {
    moduleEngagement: Array<{
      module: string;
      avgTimeSpent: number;
      completionRate: number;
      retryRate: number;
      satisfactionScore: number;
    }>;
    learningVelocity: Array<{
      week: string;
      conceptsMastered: number;
      practiceProblems: number;
      averageAccuracy: number;
    }>;
    engagementCorrelation: Array<{
      engagementLevel: string;
      avgScore: number;
      completionRate: number;
      retentionRate: number;
    }>;
  };
}

export function EngagementMetrics() {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState('all');

  useEffect(() => {
    fetchEngagementData();
  }, [timeRange, selectedModule]);

  const fetchEngagementData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/engagement-data?timeRange=${timeRange}&module=${selectedModule}`);
      if (response.ok) {
        const data = await response.json();
        setEngagementData(data);
      } else {
        generateMockEngagementData();
      }
    } catch (error) {
      console.error('Failed to fetch engagement data:', error);
      generateMockEngagementData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockEngagementData = (): void => {
    const mockData: EngagementData = {
      overview: {
        totalSessions: 15847,
        avgSessionDuration: 24.5,
        totalTimeSpent: 31290,
        uniqueUsers: 1247,
        interactionRate: 78.3,
        completionRate: 73.5
      },
      timeMetrics: {
        dailyActivity: [
          { date: '2025-09-14', sessions: 456, avgDuration: 25.3, uniqueUsers: 234 },
          { date: '2025-09-15', sessions: 523, avgDuration: 22.7, uniqueUsers: 267 },
          { date: '2025-09-16', sessions: 489, avgDuration: 26.1, uniqueUsers: 245 },
          { date: '2025-09-17', sessions: 567, avgDuration: 24.8, uniqueUsers: 289 },
          { date: '2025-09-18', sessions: 634, avgDuration: 23.9, uniqueUsers: 312 },
          { date: '2025-09-19', sessions: 598, avgDuration: 25.6, uniqueUsers: 298 },
          { date: '2025-09-20', sessions: 445, avgDuration: 27.2, uniqueUsers: 221 }
        ],
        hourlyDistribution: [
          { hour: '8 AM', sessions: 145, avgEngagement: 85.2 },
          { hour: '9 AM', sessions: 289, avgEngagement: 92.1 },
          { hour: '10 AM', sessions: 356, avgEngagement: 89.7 },
          { hour: '11 AM', sessions: 298, avgEngagement: 87.3 },
          { hour: '12 PM', sessions: 178, avgEngagement: 76.8 },
          { hour: '1 PM', sessions: 234, avgEngagement: 81.4 },
          { hour: '2 PM', sessions: 312, avgEngagement: 88.9 },
          { hour: '3 PM', sessions: 267, avgEngagement: 85.7 },
          { hour: '4 PM', sessions: 189, avgEngagement: 79.2 },
          { hour: '5 PM', sessions: 156, avgEngagement: 73.6 },
          { hour: '6 PM', sessions: 245, avgEngagement: 82.1 },
          { hour: '7 PM', sessions: 298, avgEngagement: 86.4 }
        ],
        sessionLengthDistribution: [
          { range: '0-5 min', count: 2341, percentage: 14.8 },
          { range: '5-15 min', count: 4256, percentage: 26.9 },
          { range: '15-30 min', count: 5123, percentage: 32.3 },
          { range: '30-60 min', count: 3267, percentage: 20.6 },
          { range: '60+ min', count: 860, percentage: 5.4 }
        ]
      },
      interactionPatterns: {
        clickHeatmap: [
          { component: 'Start Lesson Button', clicks: 8945, avgTimeToClick: 3.2, conversionRate: 89.7 },
          { component: 'Practice Problems', clicks: 7234, avgTimeToClick: 12.5, conversionRate: 76.3 },
          { component: 'AI Tutor Chat', clicks: 3456, avgTimeToClick: 45.6, conversionRate: 64.2 },
          { component: 'Module Navigation', clicks: 9123, avgTimeToClick: 5.8, conversionRate: 92.1 },
          { component: 'Progress Tracker', clicks: 4567, avgTimeToClick: 8.7, conversionRate: 68.9 },
          { component: 'Badge Collection', clicks: 2345, avgTimeToClick: 25.3, conversionRate: 45.7 }
        ],
        navigationFlow: [
          { from: 'Home', to: 'Modules', count: 2456, bounceRate: 12.3 },
          { from: 'Modules', to: 'Linear Equations', count: 1789, bounceRate: 8.7 },
          { from: 'Linear Equations', to: 'Practice', count: 1456, bounceRate: 15.2 },
          { from: 'Practice', to: 'AI Tutor', count: 567, bounceRate: 22.1 },
          { from: 'AI Tutor', to: 'Next Module', count: 389, bounceRate: 18.9 }
        ],
        helpSeeking: [
          { module: 'Linear Equations', helpRequests: 234, avgHelpTime: 4.5, resolutionRate: 87.3 },
          { module: 'Quadratic Functions', helpRequests: 456, avgHelpTime: 6.2, resolutionRate: 82.1 },
          { module: 'Systems of Equations', helpRequests: 189, avgHelpTime: 3.8, resolutionRate: 91.2 },
          { module: 'Functions & Graphing', helpRequests: 312, avgHelpTime: 5.9, resolutionRate: 79.8 },
          { module: 'Exponential Functions', helpRequests: 278, avgHelpTime: 7.1, resolutionRate: 76.4 },
          { module: 'Matrix Operations', helpRequests: 398, avgHelpTime: 8.3, resolutionRate: 73.2 }
        ]
      },
      successMetrics: {
        moduleEngagement: [
          { module: 'Linear Equations', avgTimeSpent: 18.5, completionRate: 92.1, retryRate: 23.4, satisfactionScore: 4.6 },
          { module: 'Systems of Equations', avgTimeSpent: 22.3, completionRate: 87.8, retryRate: 31.2, satisfactionScore: 4.4 },
          { module: 'Functions & Graphing', avgTimeSpent: 25.7, completionRate: 81.2, retryRate: 28.9, satisfactionScore: 4.3 },
          { module: 'Quadratic Functions', avgTimeSpent: 28.9, completionRate: 76.5, retryRate: 35.7, satisfactionScore: 4.1 },
          { module: 'Exponential Functions', avgTimeSpent: 31.2, completionRate: 72.3, retryRate: 42.1, satisfactionScore: 3.9 },
          { module: 'Matrix Operations', avgTimeSpent: 34.6, completionRate: 68.7, retryRate: 48.3, satisfactionScore: 3.8 }
        ],
        learningVelocity: [
          { week: 'Week 1', conceptsMastered: 45, practiceProblems: 234, averageAccuracy: 78.2 },
          { week: 'Week 2', conceptsMastered: 52, practiceProblems: 289, averageAccuracy: 81.5 },
          { week: 'Week 3', conceptsMastered: 48, practiceProblems: 267, averageAccuracy: 79.8 },
          { week: 'Week 4', conceptsMastered: 58, practiceProblems: 312, averageAccuracy: 83.1 },
          { week: 'Week 5', conceptsMastered: 44, practiceProblems: 245, averageAccuracy: 77.9 },
          { week: 'Week 6', conceptsMastered: 61, practiceProblems: 334, averageAccuracy: 84.6 }
        ],
        engagementCorrelation: [
          { engagementLevel: 'High (80-100%)', avgScore: 87.3, completionRate: 94.2, retentionRate: 96.1 },
          { engagementLevel: 'Medium (60-80%)', avgScore: 76.8, completionRate: 82.5, retentionRate: 88.7 },
          { engagementLevel: 'Low (40-60%)', avgScore: 64.2, completionRate: 67.3, retentionRate: 73.4 },
          { engagementLevel: 'Very Low (0-40%)', avgScore: 45.6, completionRate: 32.1, retentionRate: 51.2 }
        ]
      }
    };
    
    setEngagementData(mockData);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-blue-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-lg">Analyzing user engagement patterns...</p>
        </div>
      </div>
    );
  }

  if (!engagementData) {
    return <div className="text-center text-gray-500 py-8">No engagement data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Metrics</h1>
          <p className="text-gray-600 mt-1">Detailed analysis of user interaction patterns and engagement levels</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchEngagementData}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{engagementData.overview.totalSessions.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {engagementData.overview.uniqueUsers.toLocaleString()} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(engagementData.overview.avgSessionDuration)}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Total: {formatTime(engagementData.overview.totalTimeSpent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interaction Rate</p>
                <p className={`text-2xl font-bold ${getEngagementColor(engagementData.overview.interactionRate)}`}>
                  {engagementData.overview.interactionRate}%
                </p>
              </div>
              <Mouse className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={engagementData.overview.interactionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="time-patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="time-patterns">Time Patterns</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="success-correlation">Success Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="time-patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData.timeMetrics.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sessions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="uniqueUsers" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData.timeMetrics.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Session Length Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Session Duration Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={engagementData.timeMetrics.sessionLengthDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {engagementData.timeMetrics.sessionLengthDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {engagementData.timeMetrics.sessionLengthDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.count.toLocaleString()}</span>
                        <Badge variant="outline">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          {/* Click Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Component Interaction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {engagementData.interactionPatterns.clickHeatmap.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{item.component}</h4>
                      <Badge variant="outline">{item.clicks.toLocaleString()} clicks</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Time to Click:</span>
                        <span className="font-medium ml-1">{item.avgTimeToClick}s</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion Rate:</span>
                        <span className="font-medium ml-1">{item.conversionRate}%</span>
                      </div>
                      <div>
                        <Progress value={item.conversionRate} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Seeking Behavior */}
          <Card>
            <CardHeader>
              <CardTitle>Help Seeking Patterns by Module</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData.interactionPatterns.helpSeeking}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="helpRequests" fill="#f59e0b" name="Help Requests" />
                  <Bar dataKey="resolutionRate" fill="#22c55e" name="Resolution Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          {/* Navigation Flow */}
          <Card>
            <CardHeader>
              <CardTitle>User Navigation Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {engagementData.interactionPatterns.navigationFlow.map((flow, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{flow.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{flow.to}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{flow.count.toLocaleString()} users</span>
                      <Badge variant={flow.bounceRate > 20 ? "destructive" : "default"}>
                        {flow.bounceRate}% bounce
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success-correlation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Module Engagement vs Success */}
            <Card>
              <CardHeader>
                <CardTitle>Module Engagement Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData.successMetrics.moduleEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completionRate" fill="#22c55e" name="Completion Rate" />
                    <Bar dataKey="satisfactionScore" fill="#3b82f6" name="Satisfaction (x20)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement vs Performance Correlation */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Impact on Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData.successMetrics.engagementCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="engagementLevel" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="Average Score" />
                    <Line type="monotone" dataKey="retentionRate" stroke="#22c55e" name="Retention Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Learning Velocity */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Velocity Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementData.successMetrics.learningVelocity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="conceptsMastered" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="averageAccuracy" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
