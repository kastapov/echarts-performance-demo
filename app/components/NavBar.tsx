"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Create a wrapper component that uses the hooks
function NavBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current configuration parameters
  const charts = searchParams.get('charts') || '';
  const dataPoints = searchParams.get('dataPoints') || '';

  // Build query string to preserve configuration
  const configQuery = [];
  if (charts) configQuery.push(`charts=${charts}`);
  if (dataPoints) configQuery.push(`dataPoints=${dataPoints}`);
  const queryString = configQuery.length > 0 ? `?${configQuery.join('&')}` : '';

  // URL for the static version (Vite app)
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL || 'http://localhost:3001';

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
              <Link href={`/${queryString}`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
                Home
              </Link>
              <Link href={`/server${queryString}`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/server')}`}>
                Server
              </Link>
              <Link href={`/server-actions${queryString}`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/server-actions')}`}>
                Server Actions
              </Link>
              <Link href={`/client${queryString}`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/client')}`}>
                Client
              </Link>
              <Link href={`/internal-api${queryString}`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/internal-api')}`}>
                Internal API
              </Link>
              <a
                href={`${staticUrl}${queryString}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                Static Bundle
              </a>
              <Link href={`/analysis`} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/analysis')}`}>
                Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Fallback component for when the content is loading
function NavBarFallback() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">ECharts Performance Demo</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Simplified links without dynamic parameters */}
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link href="/server" className="px-3 py-2 rounded-md text-sm font-medium">Server</Link>
              <Link href="/server-actions" className="px-3 py-2 rounded-md text-sm font-medium">Server Actions</Link>
              <Link href="/client" className="px-3 py-2 rounded-md text-sm font-medium">Client</Link>
              <Link href="/internal-api" className="px-3 py-2 rounded-md text-sm font-medium">Internal API</Link>
              <span className="px-3 py-2 rounded-md text-sm font-medium">Static Bundle</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main NavBar component that wraps the content with Suspense
export default function NavBar() {
  return (
    <Suspense fallback={<NavBarFallback />}>
      <NavBarContent />
    </Suspense>
  );
}
