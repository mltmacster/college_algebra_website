
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Users, BookOpen, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Target, Send, Eye, Edit, Plus,
  Download, Filter, Search, Bell, MessageCircle, Calendar,
  GraduationCap, Award, Settings, ChevronDown, RefreshCw
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: Date;
  overallProgress: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  status: 'active' | 'at-risk' | 'inactive' | 'completed';
  currentModule: string;
  moduleProgress: number;
  badgesEarned: number;
  riskFactors?: string[];
}

interface ClassData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
    atRiskStudents: number;
    averageProgress: number;
    averageScore: number;
    classCompletionRate: number;
  };
  moduleProgress: Array<{
    module: string;
    studentsStarted: number;
    studentsCompleted: number;
    averageScore: number;
    averageTimeSpent: number;
    difficulty: number;
  }>;
  recentActivity: Array<{
    studentName: string;
    action: string;
    module: string;
    timestamp: Date;
    score?: number;
  }>;
  performanceTrends: Array<{
    week: string;
    averageScore: number;
    completionRate: number;
    engagementRate: number;
  }>;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  targetGroup: 'all' | 'at-risk' | 'high-performers';
}

export function InstructorPortal() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetGroup: 'all' as 'all' | 'at-risk' | 'high-performers'
  });

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/instructor-data');
      if (response.ok) {
        const data = await response.json();
        setClassData(data.classData);
        setStudents(data.students);
        setAnnouncements(data.announcements);
      } else {
        generateMockInstructorData();
      }
    } catch (error) {
      console.error('Failed to fetch instructor data:', error);
      generateMockInstructorData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockInstructorData = () => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@university.edu',
        enrollmentDate: new Date('2025-08-15'),
        overallProgress: 85,
        averageScore: 92,
        timeSpent: 45.5,
        lastActivity: new Date('2025-09-19'),
        status: 'active',
        currentModule: 'Quadratic Functions',
        moduleProgress: 67,
        badgesEarned: 4,
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.c@university.edu',
        enrollmentDate: new Date('2025-08-16'),
        overallProgress: 42,
        averageScore: 58,
        timeSpent: 23.2,
        lastActivity: new Date('2025-09-18'),
        status: 'at-risk',
        currentModule: 'Functions and Graphing',
        moduleProgress: 34,
        badgesEarned: 1,
        riskFactors: ['Low engagement', 'Declining scores', 'Inconsistent attendance']
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@university.edu',
        enrollmentDate: new Date('2025-08-14'),
        overallProgress: 100,
        averageScore: 95,
        timeSpent: 52.8,
        lastActivity: new Date('2025-09-20'),
        status: 'completed',
        currentModule: 'Course Completed',
        moduleProgress: 100,
        badgesEarned: 6,
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.k@university.edu',
        enrollmentDate: new Date('2025-08-17'),
        overallProgress: 15,
        averageScore: 32,
        timeSpent: 8.1,
        lastActivity: new Date('2025-09-05'),
        status: 'inactive',
        currentModule: 'Linear Equations',
        moduleProgress: 23,
        badgesEarned: 0,
        riskFactors: ['No recent activity', 'Very low scores', 'Behind schedule']
      }
    ];

    const mockClassData: ClassData = {
      overview: {
        totalStudents: 42,
        activeStudents: 34,
        completedStudents: 6,
        atRiskStudents: 8,
        averageProgress: 73.5,
        averageScore: 78.2,
        classCompletionRate: 67.4
      },
      moduleProgress: [
        { module: 'Linear Equations', studentsStarted: 42, studentsCompleted: 38, averageScore: 85.3, averageTimeSpent: 12.5, difficulty: 2.1 },
        { module: 'Systems of Equations', studentsStarted: 38, studentsCompleted: 32, averageScore: 78.9, averageTimeSpent: 15.2, difficulty: 3.2 },
        { module: 'Functions & Graphing', studentsStarted: 32, studentsCompleted: 26, averageScore: 82.1, averageTimeSpent: 18.7, difficulty: 3.5 },
        { module: 'Quadratic Functions', studentsStarted: 26, studentsCompleted: 18, averageScore: 76.4, averageTimeSpent: 21.3, difficulty: 4.1 },
        { module: 'Exponential Functions', studentsStarted: 18, studentsCompleted: 12, averageScore: 79.8, averageTimeSpent: 19.8, difficulty: 3.8 },
        { module: 'Matrix Operations', studentsStarted: 12, studentsCompleted: 6, averageScore: 74.2, averageTimeSpent: 25.1, difficulty: 4.5 }
      ],
      recentActivity: [
        { studentName: 'Sarah Johnson', action: 'Completed Module', module: 'Functions & Graphing', timestamp: new Date('2025-09-20T14:30:00'), score: 94 },
        { studentName: 'Michael Chen', action: 'Started Module', module: 'Quadratic Functions', timestamp: new Date('2025-09-20T11:15:00') },
        { studentName: 'Alex Thompson', action: 'Earned Badge', module: 'Linear Equations Master', timestamp: new Date('2025-09-20T09:45:00'), score: 88 },
        { studentName: 'Lisa Wang', action: 'Completed Practice', module: 'Systems of Equations', timestamp: new Date('2025-09-19T16:22:00'), score: 76 },
        { studentName: 'James Wilson', action: 'Requested Help', module: 'Exponential Functions', timestamp: new Date('2025-09-19T13:10:00') }
      ],
      performanceTrends: [
        { week: 'Week 1', averageScore: 82.1, completionRate: 95.2, engagementRate: 88.7 },
        { week: 'Week 2', averageScore: 78.9, completionRate: 91.3, engagementRate: 85.4 },
        { week: 'Week 3', averageScore: 81.5, completionRate: 87.8, engagementRate: 82.9 },
        { week: 'Week 4', averageScore: 76.3, completionRate: 84.1, engagementRate: 79.6 },
        { week: 'Week 5', averageScore: 79.7, completionRate: 88.9, engagementRate: 83.2 },
        { week: 'Week 6', averageScore: 83.2, completionRate: 92.4, engagementRate: 87.1 }
      ]
    };

    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Midterm Exam Preparation',
        content: 'The midterm exam is scheduled for next week. Please review modules 1-3 and complete all practice problems.',
        createdAt: new Date('2025-09-18'),
        priority: 'high',
        targetGroup: 'all'
      },
      {
        id: '2',
        title: 'Additional Support Available',
        content: 'If you\'re struggling with quadratic functions, additional tutoring sessions are available every Tuesday and Thursday.',
        createdAt: new Date('2025-09-16'),
        priority: 'medium',
        targetGroup: 'at-risk'
      }
    ];

    setStudents(mockStudents);
    setClassData(mockClassData);
    setAnnouncements(mockAnnouncements);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'default';
      case 'at-risk': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'active': return <Users className="h-4 w-4" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    const announcement: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      createdAt: new Date()
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium', targetGroup: 'all' });
    setShowNewAnnouncement(false);
  };

  const exportStudentData = () => {
    const csvContent = [
      ['Name', 'Email', 'Progress', 'Average Score', 'Status', 'Current Module'].join(','),
      ...students.map(student => [
        student.name,
        student.email,
        `${student.overallProgress}%`,
        `${student.averageScore}%`,
        student.status,
        student.currentModule
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'student-progress.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-lg">Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return <div className="text-center text-gray-500 py-8">No class data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Portal</h1>
          <p className="text-gray-600 mt-1">Comprehensive class management and student progress monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportStudentData}>
            <Download className="h-4 w-4 mr-1" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={fetchInstructorData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowNewAnnouncement(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{classData.overview.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-600">{classData.overview.activeStudents} active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Class Average</p>
                <p className="text-2xl font-bold text-gray-900">{classData.overview.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={classData.overview.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{classData.overview.classCompletionRate}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={classData.overview.classCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-2xl font-bold text-red-600">{classData.overview.atRiskStudents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">
                {((classData.overview.atRiskStudents / classData.overview.totalStudents) * 100).toFixed(1)}% of class
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={classData.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke="#3b82f6" name="Average Score" />
                    <Line type="monotone" dataKey="completionRate" stroke="#22c55e" name="Completion Rate" />
                    <Line type="monotone" dataKey="engagementRate" stroke="#8b5cf6" name="Engagement Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {classData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.studentName}</p>
                        <p className="text-xs text-gray-600">{activity.action} - {activity.module}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp.toLocaleString()}</p>
                      </div>
                      {activity.score && (
                        <Badge variant="outline">{activity.score}%</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Student Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Overview ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{student.name}</h4>
                        <p className="text-gray-600 text-sm">{student.email}</p>
                        <p className="text-xs text-gray-500">
                          Enrolled: {student.enrollmentDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeColor(student.status)} className="flex items-center gap-1">
                          {getStatusIcon(student.status)}
                          {student.status}
                        </Badge>
                        <Badge variant="outline">{student.badgesEarned} badges</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Overall Progress</p>
                        <Progress value={student.overallProgress} className="mt-1" />
                        <p className="text-xs text-gray-500 mt-1">{student.overallProgress}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Average Score</p>
                        <p className="font-semibold text-lg">{student.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Time Spent</p>
                        <p className="font-semibold text-sm">{student.timeSpent}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Last Activity</p>
                        <p className="font-semibold text-sm">{student.lastActivity.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Current: </span>
                          {student.currentModule} ({student.moduleProgress}%)
                        </p>
                        {student.riskFactors && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.riskFactors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classData.moduleProgress.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg">{module.module}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {module.studentsCompleted}/{module.studentsStarted} completed
                        </Badge>
                        <Badge variant="secondary">
                          Difficulty: {module.difficulty.toFixed(1)}/5
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <Progress value={(module.studentsCompleted / module.studentsStarted) * 100} className="mt-1" />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((module.studentsCompleted / module.studentsStarted) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="font-semibold text-lg">{module.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Time Spent</p>
                        <p className="font-semibold text-sm">{module.averageTimeSpent}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Students Started</p>
                        <p className="font-semibold text-lg">{module.studentsStarted}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          {/* New Announcement Form */}
          {showNewAnnouncement && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
                <Textarea
                  placeholder="Announcement content..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  rows={4}
                />
                <div className="flex gap-4">
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select
                    value={newAnnouncement.targetGroup}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, targetGroup: e.target.value as any})}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Students</option>
                    <option value="at-risk">At-Risk Students</option>
                    <option value="high-performers">High Performers</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSendAnnouncement}>
                    <Send className="h-4 w-4 mr-1" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={announcement.priority === 'high' ? 'destructive' : 
                                      announcement.priority === 'medium' ? 'secondary' : 'outline'}>
                          {announcement.priority}
                        </Badge>
                        <Badge variant="outline">{announcement.targetGroup}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">
                      Created: {announcement.createdAt.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</p>
                <p className="text-gray-600 mb-4">
                  Detailed analytics including predictive insights, engagement patterns, and performance correlations will be available here.
                </p>
                <Button variant="outline">
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
