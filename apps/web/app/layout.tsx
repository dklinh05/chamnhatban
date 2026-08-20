import './globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from './auth-context';

export const metadata = {
  title: 'Cham Nhat Ban',
  description: 'Japanese N5 learning platform scaffold.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
