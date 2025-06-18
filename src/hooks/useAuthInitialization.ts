'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';

export const useAuthInitialization = () => {
  const { initializeFromAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeFromAuth();
    }
  }, [initializeFromAuth, isInitialized]);

  return isInitialized;
};
