import './globals.css';
import type { ReactNode } from 'react';

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
      <body>{children}</body>
    </html>
  );
}
