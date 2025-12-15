'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Target,
  Users,
  Clock,
  Award,
  RefreshCw
} from 'lucide-react';

interface HintStats {
  problemId: string;
  totalUsages: number;
  solvedAfterHint: number;
  avgTimeToSolve: number;
  hints: Array<{
    hintIndex: number;
    usageCount: number;
    solvedAfter: number;
    effectiveness: number;
    helpfulPercent: number | null;
  }>;
}

interface DifficultyMetric {
  problemId: string;
  moduleSlug: string;
  totalAttempts: number;
  totalCompletions: number;
  avgAttempts: number;
  avgTimeToSolve: number;
  avgHintsUsed: number;
  successRate: number;
  calculatedDiff: string;
  sampleSize: number;
}

interface ModuleStats {
  totalProblems: number;
  avgSuccessRate: number;
  avgHintsUsed: number;
  avgTimeToSolve: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  totalAttempts: number;
  totalCompletions: number;
}

interface Props {
  moduleSlug?: string;
}

export function HintAnalyticsDashboard({ moduleSlug }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hintStats, setHintStats] = useState<Record<string, HintStats>>({});
  const [difficultyMetrics, setDifficultyMetrics] = useState<DifficultyMetric[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [moduleSlug]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load hint usage stats
      const hintResponse = await fetch(
        `/api/analytics/hint-usage${moduleSlug ? `?moduleSlug=${moduleSlug}` : ''}`
      );
      
      if (hintResponse.ok) {
        const hintData = await hintResponse.json();
        setHintStats(hintData.stats || {});
      }

      // Load difficulty metrics
      const diffResponse = await fetch(
        `/api/analytics/difficulty-metrics${moduleSlug ? `?moduleSlug=${moduleSlug}` : ''}`
      );
      
      if (diffResponse.ok) {
        const diffData = await diffResponse.json();
        setDifficultyMetrics(diffData.metrics || []);
        setModuleStats(diffData.moduleStats || null);
      }
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 70) return 'text-green-600';
    if (effectiveness >= 50) return 'text-yellow-600';
    if (effectiveness >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Overview Stats */}
      {moduleStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(moduleStats.avgSuccessRate * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {moduleStats.totalCompletions} / {moduleStats.totalAttempts} attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hints Used</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {moduleStats.avgHintsUsed.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per problem attempt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(moduleStats.avgTimeToSolve / 60)}m {moduleStats.avgTimeToSolve % 60}s
              </div>
              <p className="text-xs text-muted-foreground">
                To solve problems
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {moduleStats.totalProblems}
              </div>
              <p className="text-xs text-muted-foreground">
                In this module
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Difficulty Distribution */}
      {moduleStats && (
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
            <CardDescription>How problems are categorized by actual student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Easy</span>
                  <Badge className="bg-green-100 text-green-800">
                    {moduleStats.difficultyDistribution.easy}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(moduleStats.difficultyDistribution.easy / moduleStats.totalProblems) * 100}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Medium</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {moduleStats.difficultyDistribution.medium}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(moduleStats.difficultyDistribution.medium / moduleStats.totalProblems) * 100}%` 
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Hard</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {moduleStats.difficultyDistribution.hard}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(moduleStats.difficultyDistribution.hard / moduleStats.totalProblems) * 100}%` 
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Expert</span>
                  <Badge className="bg-red-100 text-red-800">
                    {moduleStats.difficultyDistribution.expert}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(moduleStats.difficultyDistribution.expert / moduleStats.totalProblems) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Problem Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Problem Overview</TabsTrigger>
          <TabsTrigger value="hints">Hint Effectiveness</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problem Performance Summary</CardTitle>
              <CardDescription>
                Overview of all problems with key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {difficultyMetrics.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No data available yet. Students need to attempt problems first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  difficultyMetrics.map((metric) => (
                    <div 
                      key={metric.problemId} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{metric.problemId}</h4>
                          <Badge className={getDifficultyColor(metric.calculatedDiff)}>
                            {metric.calculatedDiff}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {metric.sampleSize} students • {metric.totalAttempts} attempts
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {(metric.successRate * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Success</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metric.avgHintsUsed.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-600">Avg Hints</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {Math.floor(metric.avgTimeToSolve / 60)}:{(metric.avgTimeToSolve % 60).toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-gray-600">Avg Time</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hint Effectiveness Analysis</CardTitle>
              <CardDescription>
                Which hints help students solve problems successfully?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.keys(hintStats).length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No hint usage data available yet.
                    </AlertDescription>
                  </Alert>
                ) : (
                  Object.values(hintStats).map((stat) => (
                    <div key={stat.problemId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">{stat.problemId}</h4>
                        <Badge variant="outline">
                          {stat.totalUsages} total hint requests
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {stat.hints.map((hint) => (
                          <div 
                            key={hint.hintIndex} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              <Badge variant="secondary">Hint {hint.hintIndex + 1}</Badge>
                              <span className="text-sm">Used {hint.usageCount} times</span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className={`text-lg font-bold ${getEffectivenessColor(hint.effectiveness)}`}>
                                  {hint.effectiveness.toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-600">Solved after</div>
                              </div>
                              
                              {hint.helpfulPercent !== null && (
                                <div className="text-right">
                                  <div className="flex items-center">
                                    {hint.helpfulPercent >= 70 ? (
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                    ) : hint.helpfulPercent >= 40 ? (
                                      <HelpCircle className="h-4 w-4 text-yellow-500 mr-1" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className="text-sm font-medium">
                                      {hint.helpfulPercent.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600">Rated helpful</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Difficulty Calibration</CardTitle>
              <CardDescription>
                Problems that may need content adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Too Hard Problems */}
                {difficultyMetrics.filter(m => m.successRate < 0.3).length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Potentially Too Hard ({difficultyMetrics.filter(m => m.successRate < 0.3).length})
                    </h4>
                    <div className="space-y-2">
                      {difficultyMetrics
                        .filter(m => m.successRate < 0.3)
                        .map(metric => (
                          <div key={metric.problemId} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                            <div>
                              <span className="font-medium">{metric.problemId}</span>
                              <p className="text-sm text-gray-600">
                                {(metric.successRate * 100).toFixed(0)}% success rate • 
                                {metric.avgHintsUsed.toFixed(1)} avg hints • 
                                {metric.sampleSize} students
                              </p>
                            </div>
                            <Badge className="bg-red-100 text-red-800">
                              Needs review
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Too Easy Problems */}
                {difficultyMetrics.filter(m => m.successRate > 0.9 && m.avgHintsUsed < 0.5).length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Potentially Too Easy ({difficultyMetrics.filter(m => m.successRate > 0.9 && m.avgHintsUsed < 0.5).length})
                    </h4>
                    <div className="space-y-2">
                      {difficultyMetrics
                        .filter(m => m.successRate > 0.9 && m.avgHintsUsed < 0.5)
                        .map(metric => (
                          <div key={metric.problemId} className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                            <div>
                              <span className="font-medium">{metric.problemId}</span>
                              <p className="text-sm text-gray-600">
                                {(metric.successRate * 100).toFixed(0)}% success rate • 
                                {metric.avgHintsUsed.toFixed(1)} avg hints • 
                                {metric.sampleSize} students
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Consider adding complexity
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Well-Calibrated Problems */}
                {difficultyMetrics.filter(m => m.successRate >= 0.3 && m.successRate <= 0.9).length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Well-Calibrated ({difficultyMetrics.filter(m => m.successRate >= 0.3 && m.successRate <= 0.9).length})
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      These problems have appropriate difficulty levels
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={loadAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
