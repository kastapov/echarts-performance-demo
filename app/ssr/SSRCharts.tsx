// app/ssr/SSRCharts.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { APP_CONFIG } from '../lib/config';
import { ChartData, PageConfig } from '../lib/types';
import ConfigPanel from '../components/ConfigPanel';

// Dynamically import ChartWrapper with no SSR
const ChartWrapper = dynamic(
    () => import('../components/ChartWrapper'),
    { ssr: false }
);

interface SSRChartsProps {
  initialChartData: ChartData[];
  pageConfig: PageConfig;
  initialDataPoints?: number;
}

export default function SSRCharts({
                                    initialChartData,
                                    pageConfig,
                                    initialDataPoints = 1000000
                                  }: SSRChartsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(initialDataPoints);
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(false);

  // Time the initial render
  const [renderStart] = useState<number>(performance.now());
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Track when all charts are rendered
  const handleAllChartsRendered = useCallback(() => {
    if (renderTime === null) {
      setRenderTime(performance.now() - renderStart);
    }
  }, [renderStart, renderTime]);

  // Handle configuration changes
  const handleConfigChange = useCallback(({
                                            chartsCount,
                                            renderer,
                                            dataPoints: newDataPoints
                                          }: {
    chartsCount: number;
    renderer: string;
    dataPoints: number;
  }) => {
    setChartsCount(chartsCount);
    setRenderer(renderer);

    // Only update URL and trigger refresh if data points changed
    if (newDataPoints !== dataPoints) {
      setDataPoints(newDataPoints);
      setNeedsRefresh(true);
    }
  }, [dataPoints]);

  // Update URL when data points change to trigger a server refresh
  useEffect(() => {
    if (needsRefresh) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('dataPoints', dataPoints.toString());

      // Navigate to the new URL which will trigger a server fetch
      router.push(`${pathname}?${newParams.toString()}`);
      setNeedsRefresh(false);
    }
  }, [needsRefresh, dataPoints, pathname, router, searchParams]);

  return (
      <>
        <ConfigPanel
            onChange={handleConfigChange}
            initialDataPoints={dataPoints}
        />

        {renderTime !== null && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Performance Metrics</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Charts rendered in {renderTime.toFixed(2)}ms</p>
                    <p>Each chart contains approximately {dataPoints.toLocaleString()} data points</p>
                    <p>Total data points: ~{(chartsCount * dataPoints).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
        )}

        {needsRefresh && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Refreshing Data</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Updating to {dataPoints.toLocaleString()} data points per chart...</p>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, index) => {
            const chartConfig = pageConfig.charts[index % pageConfig.charts.length];
            const chartData = initialChartData[index % initialChartData.length];

            return (
                <ChartWrapper
                    key={`${chartConfig.id}-${index}-${dataPoints}`}
                    id={`${chartConfig.id}-${index}`}
                    title={chartConfig.title}
                    chartData={chartData}
                    additionalOptions={{ renderer }}
                    className="h-full"
                    onChartReady={index === chartsCount - 1 ? handleAllChartsRendered : undefined}
                />
            );
          })}
        </div>
      </>
  );
}
