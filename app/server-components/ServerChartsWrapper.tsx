// app/server-components/ServerChartsWrapper.tsx
"use client";

import { useState, useCallback } from 'react';
import { PageConfig } from '../lib/types';
import ConfigPanel from '../components/ConfigPanel';
import { APP_CONFIG } from '../lib/config';
import ServerChartContainer from './ServerChartContainer';

interface ServerChartsWrapperProps {
  pageConfig: PageConfig;
}

export default function ServerChartsWrapper({ pageConfig }: ServerChartsWrapperProps) {
  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);

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
  const handleConfigChange = useCallback(({ chartsCount, renderer }: { chartsCount: number; renderer: string }) => {
    setChartsCount(chartsCount);
    setRenderer(renderer);
    // Reset render time when config changes
    setRenderTime(null);
    setTimeout(() => {
      setRenderTime(performance.now() - renderStart);
    }, 500);
  }, [renderStart]);

  // Ensure pageConfig exists and has charts
  if (!pageConfig || !pageConfig.charts || !Array.isArray(pageConfig.charts)) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Invalid page configuration. Please check the server component setup.</p>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <>
        <ConfigPanel onChange={handleConfigChange} />

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
                    <p>Each chart contains approximately 1 million data points</p>
                    <p>Total data points: ~{(chartsCount * 1000000).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, index) => {
            // Safely access chart configuration with fallbacks
            const chartConfig = pageConfig.charts[index % pageConfig.charts.length] || {
              id: `fallback-chart-${index}`,
              title: 'Chart',
              type: 'line'
            };

            return (
                <ServerChartContainer
                    key={`${chartConfig.id}-${index}`}
                    chartConfig={{
                      ...chartConfig,
                      id: `${chartConfig.id}-${index}`,
                    }}
                    renderer={renderer}
                    onChartReady={index === chartsCount - 1 ? handleAllChartsRendered : undefined}
                />
            );
          })}
        </div>
      </>
  );
}
