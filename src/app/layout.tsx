import type { Metadata } from 'next';
import './globals.css';
import NavbarTest from './components/global/NavbarTest';

export const metadata: Metadata = {
  title: 'Socomarca',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <NavbarTest />
      </body>
    </html>
  );
}
