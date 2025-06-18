'use client';

import { useAuthInitialization } from '@/hooks/useAuthInitialization';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInitialization();
  
  return <>{children}</>;
}
