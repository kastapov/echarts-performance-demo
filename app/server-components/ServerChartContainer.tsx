// app/server-components/ServerChartContainer.tsx
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartConfig, ChartData } from '../lib/types';
import { trackError } from '../lib/analytics';

// Dynamically import ChartWrapper with no SSR
const ChartWrapper = dynamic(
    () => import('../components/ChartWrapper'),
    { ssr: false }
);

interface ServerChartContainerProps {
  chartConfig: ChartConfig;
  renderer: string;
  onChartReady?: () => void;
}

export default function ServerChartContainer({
                                               chartConfig,
                                               renderer,
                                               onChartReady
                                             }: ServerChartContainerProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Safely access chartType with fallback
        const chartType = chartConfig?.type || 'line';

        // Fetch data from API route
        const response = await fetch(
            `/api/chart-data?type=${encodeURIComponent(chartType)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        // Create a properly formatted chart data object with defaults
        const formattedData: ChartData = {
          xAxis: data.xAxis || { type: 'time' },
          yAxis: data.yAxis || { type: 'value' },
          series: data.series || [{
            type: chartType,
            name: chartType,
            data: []
          }]
        };

        setChartData(formattedData);
        setLoading(false);

        if (onChartReady) {
          onChartReady();
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error loading chart data:', errorMessage);

        setError(errorMessage);
        setLoading(false);

        // Track error for analytics
        trackError('data_loading', {
          chartId: chartConfig?.id,
          approach: 'server-components',
          errorMessage: errorMessage
        });
      }
    }

    fetchData();
  }, [chartConfig, onChartReady]);

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

  // Use a safe empty chart data structure if data is not loaded yet
  const safeChartData: ChartData = chartData || {
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      name: 'Loading...',
      data: []
    }]
  };

  return (
      <ChartWrapper
          id={chartConfig.id}
          title={chartConfig.title}
          chartData={safeChartData}
          loading={loading}
          additionalOptions={{ renderer }}
          className="h-full"
      />
  );
}
