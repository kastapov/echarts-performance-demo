// app/server-actions/ServerChartsWrapper.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { APP_CONFIG } from '../lib/config';
import { PageConfig } from '../lib/types';
import ConfigPanel from '../components/ConfigPanel';
import ServerChartContainer from './ServerChartContainer';
import { ChartConfiguration, loadConfiguration, saveConfiguration } from '../lib/configStorage';

interface ServerChartsWrapperProps {
  pageConfig: PageConfig;
  initialDataPoints?: number;
  initialChartsCount?: number;
}

export default function ServerChartsWrapper({
                                              pageConfig,
                                              initialDataPoints = 1000000,
                                              initialChartsCount = APP_CONFIG.CHARTS_PER_PAGE
                                            }: ServerChartsWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [chartsCount, setChartsCount] = useState<number>(initialChartsCount);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(initialDataPoints);
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(false);
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);
  const [forceReload, setForceReload] = useState<number>(0);
  const [isDataReloading, setIsDataReloading] = useState<boolean>(false);

  // Performance tracking
  const renderStartRef = useRef<number>(performance.now());
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Track rendered charts
  const renderedChartsRef = useRef(new Set<string>());
  const totalExpectedRef = useRef(0);

  // Load configuration on mount, but respect server-provided initial values
  useEffect(() => {
    const defaultConfig: ChartConfiguration = {
      chartsCount: initialChartsCount,
      dataPoints: initialDataPoints,
      renderer: APP_CONFIG.ECHARTS_OPTIONS.renderer as string
    };

    const savedConfig = loadConfiguration(defaultConfig);

    // Only update from localStorage if URL params aren't set
    if (!searchParams.has('dataPoints')) {
      setDataPoints(savedConfig.dataPoints);
      setNeedsRefresh(savedConfig.dataPoints !== initialDataPoints);
    }

    if (!searchParams.has('chartsCount')) {
      setChartsCount(savedConfig.chartsCount);
      setNeedsRefresh(savedConfig.chartsCount !== initialChartsCount);
    }

    setRenderer(savedConfig.renderer);
    setConfigLoaded(true);

    // Save the current configuration
    saveConfiguration({
      chartsCount: chartsCount,
      dataPoints: dataPoints,
      renderer: savedConfig.renderer
    });
  }, [initialDataPoints, initialChartsCount, searchParams, chartsCount, dataPoints]);

  // Reset rendered charts tracking when charts count changes or on forced reload
  useEffect(() => {
    renderedChartsRef.current.clear();
    totalExpectedRef.current = chartsCount;
    setRenderTime(null);
    renderStartRef.current = performance.now();
  }, [chartsCount, dataPoints, forceReload]);

  // Track when a chart is rendered
  const handleChartReady = useCallback((chartId: string) => {
    console.log(`[ServerChartsWrapper] Chart ready: ${chartId}`);
    renderedChartsRef.current.add(chartId);

    // If all charts are rendered, update the render time
    if (renderedChartsRef.current.size >= totalExpectedRef.current && renderTime === null) {
      console.log(`[ServerChartsWrapper] All ${totalExpectedRef.current} charts rendered`);
      setRenderTime(performance.now() - renderStartRef.current);
    }
  }, [renderTime]);

  // Handle configuration changes
  const handleConfigChange = useCallback((config: ChartConfiguration) => {
    console.log(`[ServerChartsWrapper] Config changed:`, config);

    // Check if we need to update URL params
    const needServerRefresh =
        config.dataPoints !== dataPoints ||
        config.chartsCount !== chartsCount;

    setChartsCount(config.chartsCount);
    setRenderer(config.renderer);
    setDataPoints(config.dataPoints);

    // Reset render metrics
    renderedChartsRef.current.clear();
    totalExpectedRef.current = config.chartsCount;
    setRenderTime(null);
    renderStartRef.current = performance.now();

    // Request page refresh if data points or charts count changed
    if (needServerRefresh) {
      setNeedsRefresh(true);
    }
  }, [chartsCount, dataPoints]);

  // Handle charts reload without changing URL
  const handleReloadCharts = useCallback(() => {
    console.log('[ServerChartsWrapper] Reloading charts with fresh data');
    // Reset render time immediately
    setRenderTime(null);
    // Clear rendered charts tracking
    renderedChartsRef.current.clear();
    // Reset render start time
    renderStartRef.current = performance.now();
    // Set data reloading flag to true (will be false when data is loaded)
    setIsDataReloading(true);
    // Increment the force reload counter to cause chart components to remount
    setForceReload(prev => prev + 1);
  }, []);

  // Update URL when data points or charts count change to trigger a server refresh
  useEffect(() => {
    if (needsRefresh && configLoaded) {
      console.log(`[ServerChartsWrapper] Refreshing with ${dataPoints} data points and ${chartsCount} charts`);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('dataPoints', dataPoints.toString());
      newParams.set('chartsCount', chartsCount.toString());

      // Navigate to the new URL which will trigger a server fetch
      router.push(`${pathname}?${newParams.toString()}`);
      setNeedsRefresh(false);
    }
  }, [needsRefresh, dataPoints, chartsCount, pathname, router, searchParams, configLoaded]);

  // Reset data reloading flag when all charts have rendered
  useEffect(() => {
    if (renderTime !== null && isDataReloading) {
      setIsDataReloading(false);
    }
  }, [renderTime, isDataReloading]);

  // Show loading state while configuration is loading
  if (!configLoaded) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading configuration...</span>
        </div>
    );
  }

  return (
      <>
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

        {(isDataReloading || (renderTime === null && forceReload > 0)) && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Fetching Fresh Data</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Loading and rendering new data...</p>
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
                  <h3 className="text-sm font-medium text-yellow-800">Refreshing Page</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Updating configuration with server-rendered data...</p>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, index) => {
            // Use safe access to chart config with fallbacks
            const chartConfigBase = pageConfig.charts[index % pageConfig.charts.length] || {
              id: `server-chart-fallback-${index}`,
              title: 'Chart',
              type: 'line'
            };

            // Create individual chart config for each position
            const chartConfig = {
              ...chartConfigBase,
              id: `server-chart-${index}`
            };

            // Use a stable key that changes when appropriate
            const chartKey = `${chartConfig.id}-${dataPoints}-${renderer}-${forceReload}`;

            return (
                <ServerChartContainer
                    key={chartKey}
                    chartConfig={chartConfig}
                    dataPoints={dataPoints}
                    renderer={renderer}
                    onChartReady={() => handleChartReady(chartConfig.id)}
                    forceReload={forceReload} // Pass the force reload counter to trigger data refresh
                />
            );
          })}
        </div>
      </>
  );
}
