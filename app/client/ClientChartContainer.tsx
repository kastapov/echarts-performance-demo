// app/client/ClientChartContainer.tsx
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartConfig, ChartData } from '../lib/types';
import { fetchLargeDataset } from '../lib/api';

// Dynamically import ChartWrapper with no SSR
const ChartWrapper = dynamic(
    () => import('../components/ChartWrapper'),
    { ssr: false }
);

interface ClientChartContainerProps {
  chartConfig: ChartConfig;
  dataPoints: number;
  renderer: string;
  onChartReady?: () => void;
}

export default function ClientChartContainer({
                                               chartConfig,
                                               dataPoints,
                                               renderer,
                                               onChartReady
                                             }: ClientChartContainerProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Reset when chart config or data points change
  useEffect(() => {
    // Reset state
    setLoading(true);
    setError(null);
    setProgress(0);
    setChartData(null);

    let isMounted = true;

    async function loadData() {
      try {
        // Simulate progressive loading
        setProgress(20);

        // Fetch the data from API with data points parameter
        const data = await fetchLargeDataset(chartConfig.type, dataPoints);

        if (!isMounted) return;

        setProgress(80);

        // Short delay to show progress UI
        setTimeout(() => {
          if (!isMounted) return;

          setChartData(data);
          setLoading(false);
          setProgress(100);

          if (onChartReady) {
            onChartReady();
          }
        }, 500);
      } catch (err) {
        if (!isMounted) return;

        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    // Start loading
    loadData();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [chartConfig, dataPoints, onChartReady]);

  if (error) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading chart</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="relative">
        {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10 p-4">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.max(5, progress)}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm">
                Loading {dataPoints.toLocaleString()} data points: {progress.toFixed(0)}%
              </p>
            </div>
        )}

        <ChartWrapper
            id={chartConfig.id}
            title={chartConfig.title}
            chartData={chartData || {
              xAxis: { type: 'category' },
              yAxis: { type: 'value' },
              series: [{ type: 'line', name: 'Loading...', data: [] }],
            }}
            loading={false} // We're handling loading UI ourselves
            additionalOptions={{ renderer }}
            className="h-full"
        />
      </div>
  );
}
