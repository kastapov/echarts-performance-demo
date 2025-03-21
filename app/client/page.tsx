// app/client/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG, CHART_TYPES } from '../lib/config';
import { PageConfig } from '../lib/types';
import ConfigPanel from '../components/ConfigPanel';
import ClientChartContainer from './ClientChartContainer';

// Create a client-only page
export default function ClientPage() {
  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(1000000);

  // Generate page configuration
  const pageConfig: PageConfig = {
    title: "Client-Side Rendering Approach",
    description: "Charts rendered entirely on the client with progressive loading",
    charts: Array.from({ length: APP_CONFIG.CHARTS_PER_PAGE }, (_, i) => {
      const chartTypeIndex = i % CHART_TYPES.length;

      return {
        id: `client-chart-${i}`,
        title: `${CHART_TYPES[chartTypeIndex]} Chart - ${(dataPoints / 1000).toFixed(0)}K Datapoints`,
        type: CHART_TYPES[chartTypeIndex],
      };
    }),
  };

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
                                            dataPoints
                                          }: {
    chartsCount: number;
    renderer: string;
    dataPoints: number;
  }) => {
    setChartsCount(chartsCount);
    setRenderer(renderer);
    setDataPoints(dataPoints);

    // Reset render time when config changes
    setRenderTime(null);
  }, []);

  // Update page title when data points change
  useEffect(() => {
    const updatedPageConfig = {...pageConfig};
    updatedPageConfig.charts = Array.from({ length: APP_CONFIG.CHARTS_PER_PAGE }, (_, i) => {
      const chartTypeIndex = i % CHART_TYPES.length;

      return {
        id: `client-chart-${i}`,
        title: `${CHART_TYPES[chartTypeIndex]} Chart - ${(dataPoints / 1000).toFixed(0)}K Datapoints`,
        type: CHART_TYPES[chartTypeIndex],
      };
    });
  }, [dataPoints, pageConfig]);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">{pageConfig.title}</h1>
        <p className="text-gray-500 mb-6">{pageConfig.description}</p>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, index) => {
            const chartConfig = {
              ...pageConfig.charts[index % pageConfig.charts.length],
              id: `client-chart-${index}`,
            };

            return (
                <ClientChartContainer
                    key={`${chartConfig.id}-${dataPoints}`}
                    chartConfig={chartConfig}
                    dataPoints={dataPoints}
                    renderer={renderer}
                    onChartReady={index === chartsCount - 1 ? handleAllChartsRendered : undefined}
                />
            );
          })}
        </div>
      </div>
  );
}
