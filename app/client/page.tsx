// app/client/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG, CHART_TYPES } from '../lib/config';
import { PageConfig } from '../lib/types';
import ConfigPanel from '../components/ConfigPanel';
import ClientChartContainer from './ClientChartContainer';
import { ChartConfiguration, loadConfiguration } from '../lib/configStorage';

// Create a client-only page
export default function ClientPage() {
  // Configuration state
  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(1000000);

  // UI state
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);
  const [forceReload, setForceReload] = useState<number>(0); // Increment to force chart reload

  // Performance tracking
  const renderStartRef = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Track rendered charts
  const renderedChartsRef = useRef(new Set<string>());
  const totalExpectedRef = useRef(0);

  // Load configuration on mount
  useEffect(() => {
    const defaultConfig: ChartConfiguration = {
      chartsCount: APP_CONFIG.CHARTS_PER_PAGE,
      dataPoints: 1000000,
      renderer: APP_CONFIG.ECHARTS_OPTIONS.renderer as string
    };

    const savedConfig = loadConfiguration(defaultConfig);

    setChartsCount(savedConfig.chartsCount);
    setRenderer(savedConfig.renderer);
    setDataPoints(savedConfig.dataPoints);
    setConfigLoaded(true);
  }, []);

  // Reset rendered charts tracking when charts count changes
  useEffect(() => {
    renderedChartsRef.current.clear();
    totalExpectedRef.current = chartsCount;
    setRenderTime(null);
    renderStartRef.current = performance.now();
  }, [chartsCount, dataPoints, forceReload]);

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

  // Track when a chart is rendered
  const handleChartReady = useCallback((chartId: string) => {
    console.log(`[ClientPage] Chart ready: ${chartId}`);
    renderedChartsRef.current.add(chartId);

    // If all charts are rendered, update the render time
    if (renderedChartsRef.current.size === totalExpectedRef.current && renderTime === null) {
      console.log(`[ClientPage] All ${totalExpectedRef.current} charts rendered`);
      setRenderTime(performance.now() - renderStartRef.current);
    }
  }, [renderTime]);

  // Handle configuration changes
  const handleConfigChange = useCallback((config: ChartConfiguration) => {
    console.log(`[ClientPage] Config changed:`, config);

    setChartsCount(config.chartsCount);
    setRenderer(config.renderer);
    setDataPoints(config.dataPoints);

    // Reset render metrics when config changes
    renderedChartsRef.current.clear();
    totalExpectedRef.current = config.chartsCount;
    setRenderTime(null);
    renderStartRef.current = performance.now();
  }, []);

  // Handle charts reload
  const handleReloadCharts = useCallback(() => {
    console.log('[ClientPage] Reloading charts');
    // Reset render time immediately
    setRenderTime(null);
    // Clear rendered charts tracking
    renderedChartsRef.current.clear();
    // Reset render start time
    renderStartRef.current = performance.now();
    // Increment the force reload counter to cause chart components to remount
    setForceReload(prev => prev + 1);
  }, []);

  // Show loading state while configuration is loading
  if (!configLoaded) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">{pageConfig.title}</h1>
          <p className="text-gray-500 mb-6">{pageConfig.description}</p>

          <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading configuration...</span>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">{pageConfig.title}</h1>
        <p className="text-gray-500 mb-6">{pageConfig.description}</p>

        <ConfigPanel
            onChange={handleConfigChange}
            onReloadCharts={handleReloadCharts}
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

        {renderTime === null && forceReload > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Rendering Charts</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Loading and rendering charts...</p>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, index) => {
            const chartTypeIndex = index % CHART_TYPES.length;
            const chartConfig = {
              id: `client-chart-${index}`,
              title: `${CHART_TYPES[chartTypeIndex]} Chart - ${(dataPoints / 1000).toFixed(0)}K Datapoints`,
              type: CHART_TYPES[chartTypeIndex],
            };

            // Use a stable key that changes when needed for reloading
            const chartKey = `${chartConfig.id}-${dataPoints}-${renderer}-${forceReload}`;

            return (
                <ClientChartContainer
                    key={chartKey}
                    chartConfig={chartConfig}
                    dataPoints={dataPoints}
                    renderer={renderer}
                    onChartReady={() => handleChartReady(chartConfig.id)}
                />
            );
          })}
        </div>
      </div>
  );
}
