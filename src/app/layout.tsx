import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import Modal from './components/global/Modal';
import AuthProvider from './components/providers/AuthProvider';
import NotificationWrapper from './components/global/NotificationWrapper';
import { NotificationProvider } from '@/contexts/NotificationContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const s3Base = process.env.NEXT_PUBLIC_S3_BASE_URL;
const favicon = s3Base ? `${s3Base}/assets/icons/logo.ico` : '/favicon.ico';

export const metadata: Metadata = {
  title: 'Socomarca | Compra rápida',
  manifest: '/manifest.json',
  icons: {
    icon: favicon,
    shortcut: favicon,
    apple: '/icons/logo_plant-192.png',
  },
};

export const viewport = {
  themeColor: 'white',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-poppins">
        <AuthProvider>
          <NotificationProvider>
            <NotificationWrapper>
              {children}
              <Modal />
            </NotificationWrapper>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
