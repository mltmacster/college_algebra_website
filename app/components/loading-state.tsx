
'use client';

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Calculator } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface LoadingStateProps {
  message?: string;
  showProgress?: boolean;
  type?: 'default' | 'module' | 'calculation';
}

export function LoadingState({ 
  message = 'Loading...', 
  showProgress = false, 
  type = 'default' 
}: LoadingStateProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 15));
      }, 200);

      return () => clearInterval(progressInterval);
    }
  }, [showProgress]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'module':
        return <BookOpen className="h-6 w-6 text-blue-600" />;
      case 'calculation':
        return <Calculator className="h-6 w-6 text-purple-600" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-4">
            {getIcon()}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message}{dots}
          </h3>
          
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <p className="text-sm text-gray-500 text-center">
            {type === 'module' && 'Loading interactive content...'}
            {type === 'calculation' && 'Processing calculations...'}
            {type === 'default' && 'Please wait while we prepare your content.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton loader for consistent loading states
export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}

// Loading wrapper to prevent hydration errors
export function ClientOnlyWrapper({ 
  children, 
  fallback = <LoadingState /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
