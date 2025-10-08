
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../../components/navigation';
import { SafeModuleContent } from '../../../components/safe-module-content';
import { ErrorBoundary } from '../../../components/error-boundary';
import { authOptions } from '../../../lib/auth';
import { moduleParamsSchema } from '../../../lib/input-validation';

interface ModulePageProps {
  params: {
    slug: string;
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  try {
    // Validate the slug parameter
    const validatedParams = moduleParamsSchema.parse(params);
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      redirect('/auth/login');
    }

    return (
      <ErrorBoundary fallbackTitle="Module Loading Error">
        <div className="min-h-screen bg-white">
          <Navigation />
          <SafeModuleContent slug={validatedParams.slug} />
        </div>
      </ErrorBoundary>
    );
  } catch (error: any) {
    // NEXT_REDIRECT is expected behavior for authentication - don't log it as an error
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw to allow Next.js to handle the redirect
    }
    console.error('Module page error:', error);
    redirect('/modules');
  }
}
