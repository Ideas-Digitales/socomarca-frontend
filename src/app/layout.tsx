import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import Modal from './components/global/Modal';
import AuthProvider from './components/providers/AuthProvider';
// import NotificationWrapper from './components/global/NotificationWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Socomarca | Compra rápida',
  description: 'Tu tienda online favorita para compras rápidas y seguras',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/logo_plant-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/logo_plant-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/logo_plant-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/logo_plant-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/logo_plant-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/logo_plant-128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/logo_plant-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/logo_plant-256.png', sizes: '256x256', type: 'image/png' },
      { url: '/icons/logo_plant-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/logo_plant-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/logo_plant-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/logo_plant-144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/logo_plant-128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Socomarca',
    startupImage: [
      {
        url: '/icons/logo_plant-512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/logo_plant-512.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/logo_plant-512.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Socomarca',
    'application-name': 'Socomarca',
    'msapplication-TileColor': '#00ff00',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport = {
  themeColor: '#00ff00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
                   {children}
                   <Modal />
                 </AuthProvider>
      </body>
    </html>
  );
}
