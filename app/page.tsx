// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">ECharts Performance Demo</span>
            <span className="block text-blue-600">1 Million+ Datapoints</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Compare three different approaches for loading and rendering large datasets in Next.js with ECharts
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Server-Side Rendering (SSR)
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Data is fetched and processed on the server before sending HTML to the client.</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Complete pre-rendering</li>
                    <li>SEO-friendly</li>
                    <li>Potentially slower TTFB</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Link
                      href="/ssr"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View SSR Demo
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Server Components
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>React Server Components process data on the server but with more granular control.</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Component-level server processing</li>
                    <li>Streaming and progressive rendering</li>
                    <li>Better client/server separation</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Link
                      href="/server-components"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Server Components Demo
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Client-Side Rendering
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Data is fetched and processed entirely on the client using Web Workers.</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Fast initial page load</li>
                    <li>Non-blocking UI with Web Workers</li>
                    <li>Progressive data loading</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Link
                      href="/client"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Client-side Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Technical Details
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              How this demo works and what it tests
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Data Size</dt>
                <dd className="mt-1 text-sm text-gray-900">1,000,000+ points per chart</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Chart Library</dt>
                <dd className="mt-1 text-sm text-gray-900">ECharts</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Framework</dt>
                <dd className="mt-1 text-sm text-gray-900">Next.js (App Router)</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Deployment</dt>
                <dd className="mt-1 text-sm text-gray-900">Vercel</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Key Metrics</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    <li>Initial page load time</li>
                    <li>Time to interactive charts</li>
                    <li>Memory usage</li>
                    <li>UI responsiveness</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
  );
}
