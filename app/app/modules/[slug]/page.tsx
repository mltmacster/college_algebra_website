
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../../components/navigation';
import { ModuleContent } from '../../../components/module-content';
import { authOptions } from '../../../lib/auth';

interface ModulePageProps {
  params: {
    slug: string;
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ModuleContent slug={params.slug} />
    </div>
  );
}
