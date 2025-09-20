
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ScatterChart, Scatter, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  AlertTriangle, TrendingDown, Brain, Target, Users,
  Clock, BookOpen, CheckCircle, XCircle, Info,
  Send, Eye, Filter, Download
} from 'lucide-react';

interface RiskStudent {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  currentModule: string;
  moduleProgress: number;
  avgScore: number;
  timeSpent: number;
  lastActivity: Date;
  predictedOutcome: string;
  interventionRecommendations: string[];
}

interface PredictiveModel {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  lastTrained: Date;
  features: string[];
}

interface RiskTrends {
  week: string;
  identifiedRisk: number;
  actualDropouts: number;
  successfulInterventions: number;
  accuracy: number;
}

export function PredictiveAnalytics() {
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [trends, setTrends] = useState<RiskTrends[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  useEffect(() => {
    fetchPredictiveData();
  }, []);

  const fetchPredictiveData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/predictive-data');
      if (response.ok) {
        const data = await response.json();
        setRiskStudents(data.riskStudents);
        setModels(data.models);
        setTrends(data.trends);
      } else {
        // Mock data for development
        generateMockPredictiveData();
      }
    } catch (error) {
      console.error('Failed to fetch predictive analytics:', error);
      generateMockPredictiveData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictiveData = () => {
    const mockRiskStudents: RiskStudent[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        riskScore: 0.85,
        riskLevel: 'critical',
        riskFactors: ['Low engagement', 'Declining scores', 'Missed deadlines', 'No recent activity'],
        currentModule: 'Quadratic Functions',
        moduleProgress: 23,
        avgScore: 42,
        timeSpent: 3.2,
        lastActivity: new Date('2025-09-15'),
        predictedOutcome: '89% chance of not completing course',
        interventionRecommendations: [
          'Schedule immediate one-on-one tutoring session',
          'Recommend prerequisite review materials',
          'Set up daily check-ins for 2 weeks',
          'Consider academic counseling referral'
        ]
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        riskScore: 0.72,
        riskLevel: 'high',
        riskFactors: ['Inconsistent performance', 'High retry rate', 'Time management issues'],
        currentModule: 'Functions and Graphing',
        moduleProgress: 67,
        avgScore: 58,
        timeSpent: 12.5,
        lastActivity: new Date('2025-09-18'),
        predictedOutcome: '67% chance of struggling with advanced modules',
        interventionRecommendations: [
          'Provide time management resources',
          'Offer alternative learning materials',
          'Set up study group participation',
          'Monitor progress more closely'
        ]
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        riskScore: 0.58,
        riskLevel: 'medium',
        riskFactors: ['Slow learning pace', 'High time-to-completion'],
        currentModule: 'Linear Equations',
        moduleProgress: 89,
        avgScore: 72,
        timeSpent: 28.3,
        lastActivity: new Date('2025-09-19'),
        predictedOutcome: '52% chance of taking longer than average to complete',
        interventionRecommendations: [
          'Provide additional practice problems',
          'Suggest self-paced learning approach',
          'Connect with peer mentor',
          'Offer extended deadlines if needed'
        ]
      }
    ];

    const mockModels: PredictiveModel[] = [
      {
        name: 'Dropout Risk Predictor',
        accuracy: 87.3,
        precision: 84.1,
        recall: 89.7,
        lastTrained: new Date('2025-09-10'),
        features: ['engagement_score', 'assignment_completion', 'time_spent', 'grade_trend', 'login_frequency']
      },
      {
        name: 'Performance Predictor',
        accuracy: 82.6,
        precision: 80.4,
        recall: 85.2,
        lastTrained: new Date('2025-09-08'),
        features: ['quiz_scores', 'time_per_problem', 'help_seeking_behavior', 'previous_math_experience']
      }
    ];

    const mockTrends: RiskTrends[] = [
      { week: 'Week 1', identifiedRisk: 12, actualDropouts: 2, successfulInterventions: 8, accuracy: 83.3 },
      { week: 'Week 2', identifiedRisk: 18, actualDropouts: 3, successfulInterventions: 12, accuracy: 83.3 },
      { week: 'Week 3', identifiedRisk: 15, actualDropouts: 1, successfulInterventions: 11, accuracy: 86.7 },
      { week: 'Week 4', identifiedRisk: 22, actualDropouts: 4, successfulInterventions: 15, accuracy: 86.4 },
      { week: 'Week 5', identifiedRisk: 19, actualDropouts: 2, successfulInterventions: 14, accuracy: 89.5 },
      { week: 'Week 6', identifiedRisk: 16, actualDropouts: 1, successfulInterventions: 13, accuracy: 87.5 }
    ];

    setRiskStudents(mockRiskStudents);
    setModels(mockModels);
    setTrends(mockTrends);
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredStudents = selectedRiskLevel === 'all' 
    ? riskStudents 
    : riskStudents.filter(student => student.riskLevel === selectedRiskLevel);

  const handleSendIntervention = (studentId: string, interventionType: string) => {
    // Implement intervention sending logic
    console.log(`Sending ${interventionType} intervention to student ${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-lg">Analyzing student data and calculating risk scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-gray-600 mt-1">AI-powered early intervention system to identify at-risk students</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedRiskLevel} 
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Model Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {models.map((model, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                {model.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy:</span>
                  <span className="font-semibold">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Precision:</span>
                  <span className="font-semibold">{model.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recall:</span>
                  <span className="font-semibold">{model.recall}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Last trained: {model.lastTrained.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Risk Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Critical Risk</span>
                <Badge variant="destructive">
                  {riskStudents.filter(s => s.riskLevel === 'critical').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">High Risk</span>
                <Badge variant="destructive">
                  {riskStudents.filter(s => s.riskLevel === 'high').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium Risk</span>
                <Badge variant="secondary">
                  {riskStudents.filter(s => s.riskLevel === 'medium').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Monitored</span>
                <Badge variant="outline">{riskStudents.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Success Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="identifiedRisk" stroke="#ef4444" name="Identified At-Risk" />
              <Line type="monotone" dataKey="successfulInterventions" stroke="#22c55e" name="Successful Interventions" />
              <Line type="monotone" dataKey="actualDropouts" stroke="#6b7280" name="Actual Dropouts" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* At-Risk Students List */}
      <Card>
        <CardHeader>
          <CardTitle>At-Risk Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 space-y-3">
                {/* Student Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{student.name}</h4>
                    <p className="text-gray-600 text-sm">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskBadgeColor(student.riskLevel)} className="flex items-center gap-1">
                      {getRiskIcon(student.riskLevel)}
                      {student.riskLevel} risk
                    </Badge>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      Risk Score: {(student.riskScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Student Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded">
                  <div>
                    <p className="text-xs text-gray-600">Current Module</p>
                    <p className="font-semibold text-sm">{student.currentModule}</p>
                    <Progress value={student.moduleProgress} className="mt-1 h-2" />
                    <p className="text-xs text-gray-500">{student.moduleProgress}% complete</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Average Score</p>
                    <p className="font-semibold text-lg">{student.avgScore}%</p>
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

                {/* Risk Factors */}
                <div>
                  <p className="font-semibold text-sm mb-2">Risk Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Predicted Outcome */}
                <Alert>
                  <TrendingDown className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Prediction:</strong> {student.predictedOutcome}
                  </AlertDescription>
                </Alert>

                {/* Intervention Recommendations */}
                <div>
                  <p className="font-semibold text-sm mb-2">Recommended Interventions:</p>
                  <div className="space-y-2">
                    {student.interventionRecommendations.map((recommendation, index) => (
                      <div key={index} className="flex justify-between items-center bg-blue-50 p-2 rounded text-sm">
                        <span>{recommendation}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendIntervention(student.id, 'email')}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendIntervention(student.id, 'view')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
