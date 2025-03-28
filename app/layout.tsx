import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/app/components/NavBar';

export const metadata: Metadata = {
    title: 'ECharts Performance Demo',
    description: 'Demonstration of rendering large datasets with different Next.js data fetching strategies',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
      <html lang="en">
      <body>
      <NavBar />

      <main>
          {children}
      </main>
      </body>
      </html>
    );
}
