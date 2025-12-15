
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { authOptions } from '../../lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LearningAnalyticsDashboard } from '../../components/analytics/learning-analytics-dashboard';
import { PredictiveAnalytics } from '../../components/analytics/predictive-analytics';
import { EngagementMetrics } from '../../components/analytics/engagement-metrics';
import { InstructorPortal } from '../../components/analytics/instructor-portal';
import { HintAnalyticsDashboard } from '../../components/analytics/hint-analytics-dashboard';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and insights for student learning patterns, engagement, and performance.
          </p>
        </div>

        <Tabs defaultValue="hint-analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hint-analytics">Hint Analytics</TabsTrigger>
            <TabsTrigger value="learning-analytics">Learning Analytics</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
            <TabsTrigger value="instructor">Instructor Portal</TabsTrigger>
          </TabsList>

          <TabsContent value="hint-analytics">
            <HintAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="learning-analytics">
            <LearningAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="engagement">
            <EngagementMetrics />
          </TabsContent>

          <TabsContent value="instructor">
            <InstructorPortal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
