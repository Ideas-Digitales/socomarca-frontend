'use client';

import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <LoginForm
      role="admin"
      recoveryLink="/auth/recuperar-admin"
      useWindowLocation={false}
    />
  );
}
