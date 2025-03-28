import { useSearchParams } from '../lib/hooks/useSearchParams';

export default function StaticNavBar() {
  const [searchParams] = useSearchParams();

  // Get URL params for sharing with Next.js app
  const charts = searchParams.get('charts') || '';
  const dataPoints = searchParams.get('dataPoints') || '';

  // Build query string to preserve configuration
  const configQuery = [];
  if (charts) configQuery.push(`charts=${charts}`);
  if (dataPoints) configQuery.push(`dataPoints=${dataPoints}`);
  const queryString = configQuery.length > 0 ? `?${configQuery.join('&')}` : '';

  // We'll assume the host for Next.js app is at localhost:3000 in dev mode
  const nextjsBaseUrl = process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000' // Change this to your production URL
    : 'http://localhost:3000';

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">ECharts Performance Demo</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <a href={`${nextjsBaseUrl}/${queryString}`} className="px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href={`${nextjsBaseUrl}/server${queryString}`} className="px-3 py-2 rounded-md text-sm font-medium">
                Server
              </a>
              <a href={`${nextjsBaseUrl}/server-actions${queryString}`} className="px-3 py-2 rounded-md text-sm font-medium">
                Server Actions
              </a>
              <a href={`${nextjsBaseUrl}/client${queryString}`} className="px-3 py-2 rounded-md text-sm font-medium">
                Client
              </a>
              <a href={`${nextjsBaseUrl}/internal-api${queryString}`} className="px-3 py-2 rounded-md text-sm font-medium">
                Internal API
              </a>
              <span className="px-3 py-2 rounded-md text-sm font-medium bg-blue-700">
                Static Bundle
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
