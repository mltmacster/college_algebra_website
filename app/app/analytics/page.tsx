
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { authOptions } from '../../lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LearningAnalyticsDashboard } from '../../components/analytics/learning-analytics-dashboard';
import { PredictiveAnalytics } from '../../components/analytics/predictive-analytics';
import { EngagementMetrics } from '../../components/analytics/engagement-metrics';
import { InstructorPortal } from '../../components/analytics/instructor-portal';

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

        <Tabs defaultValue="learning-analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning-analytics">Learning Analytics</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
            <TabsTrigger value="instructor">Instructor Portal</TabsTrigger>
          </TabsList>

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
