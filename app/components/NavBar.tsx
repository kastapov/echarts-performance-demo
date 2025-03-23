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
                  SSR Approach
                </Link>
                <Link href="/server-components" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/server-components')}`}>
                  Server Components
                </Link>
                <Link href="/client" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/client')}`}>
                  Client-side
                </Link>
                <Link href="/analysis" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/analysis')}`}>
                  Analysis
                </Link>
                {/*<Link href="/analytics" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/analytics')}`}>*/}
                {/*<span className="flex items-center">*/}
                {/*  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />*/}
                {/*  </svg>*/}
                {/*  Analytics*/}
                {/*</span>*/}
                {/*</Link>*/}
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}
