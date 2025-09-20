
'use client';

import { useEffect } from 'react';
import { initializeProductionErrorHandling } from '../lib/production-error-handler';

export function ProductionErrorSuppressor() {
  useEffect(() => {
    initializeProductionErrorHandling();
  }, []);

  return null; // This component doesn't render anything
}
