// app/components/NavBar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">ECharts Performance Demo</span>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
                  Home
                </Link>
                <Link href="/ssr" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/ssr')}`}>
                  SSR
                </Link>
                <Link href="/server-actions" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/server-actions')}`}>
                  Server Actions
                </Link>
                <Link href="/client" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/client')}`}>
                  Client-side
                </Link>
                <Link href="/analysis" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/analysis')}`}>
                  Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}
