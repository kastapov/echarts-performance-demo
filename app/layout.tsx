// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ECharts Performance Demo - Next.js',
    description: 'Comparing different approaches for loading 1M+ datapoints in Next.js with ECharts',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <NavBar />
            <main className="min-h-screen bg-gray-50">
                {children}
            </main>
        </body>
        </html>
    );
}
