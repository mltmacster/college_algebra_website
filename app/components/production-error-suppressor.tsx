
'use client';

import { useEffect } from 'react';
import { initializeProductionErrorHandling } from '../lib/production-error-handler';

// Initialize error handling immediately on module load
if (typeof window !== 'undefined') {
  initializeProductionErrorHandling();
}

export function ProductionErrorSuppressor() {
  useEffect(() => {
    // Re-initialize to ensure it's active
    initializeProductionErrorHandling();
  }, []);

  return null; // This component doesn't render anything
}
