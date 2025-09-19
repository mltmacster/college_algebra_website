
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { ProgressDashboard } from '../../components/progress-dashboard';
import { BadgeProgressWidget } from '../../components/badge-progress-widget';
import { authOptions } from '../../lib/auth';

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Learning Progress
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track your progress through College Algebra modules and monitor your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ProgressDashboard />
            </div>
            <div className="lg:col-span-1">
              <BadgeProgressWidget 
                userId={session.user?.id || ''}
                showNextBadge={true}
                compact={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
