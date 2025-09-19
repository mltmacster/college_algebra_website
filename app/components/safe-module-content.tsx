
'use client';

import { useEffect, useState } from 'react';
import { ErrorBoundary } from './error-boundary';
import { LoadingState, ClientOnlyWrapper } from './loading-state';
import { ModuleContent } from './module-content';

interface SafeModuleContentProps {
  slug: string;
}

export function SafeModuleContent({ slug }: SafeModuleContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial loading and validation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return <LoadingState message="Loading module content" showProgress type="module" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Module Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Module Error" showHomeButton={false}>
      <ClientOnlyWrapper
        fallback={<LoadingState message="Preparing interactive content" type="module" />}
      >
        <ModuleContent slug={slug} />
      </ClientOnlyWrapper>
    </ErrorBoundary>
  );
}
