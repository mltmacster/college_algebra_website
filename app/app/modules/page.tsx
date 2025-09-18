
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { ModulesGrid } from '../../components/modules-grid';
import { authOptions } from '../../lib/auth';

export default async function ModulesPage() {
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
              College Algebra Learning Modules
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete comprehensive modules designed specifically for undergraduate business students. 
              Each module includes interactive content, practice problems, assessments, and real-world applications.
            </p>
          </div>
          <ModulesGrid />
        </div>
      </main>
    </div>
  );
}
