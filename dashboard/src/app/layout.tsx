import type { Metadata } from 'next';
import '@fontsource/quicksand/400.css';
import '@fontsource/lexend/400.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'OceanBoards',
  description: 'AMRIT dashboards application',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
