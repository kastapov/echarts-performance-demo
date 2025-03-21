// app/components/ChartWrapper.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { APP_CONFIG, getDefaultChartOptions } from '../lib/config';
import { ChartData } from '../lib/types';

interface ChartWrapperProps {
  id: string;
  title: string;
  chartData: ChartData;
  loading?: boolean;
  height?: number | string;
  className?: string;
  additionalOptions?: Record<string, any>;
  onChartReady?: () => void;
}

export default function ChartWrapper({
                                       id,
                                       title,
                                       chartData,
                                       loading = false,
                                       height = APP_CONFIG.CHART_HEIGHT,
                                       className = '',
                                       additionalOptions = {},
                                       onChartReady,
                                     }: ChartWrapperProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [dataPoints, setDataPoints] = useState(0);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize ECharts instance
    const chartInstance = echarts.init(
        chartContainerRef.current,
        undefined,
        {
          renderer: additionalOptions.renderer || APP_CONFIG.ECHARTS_OPTIONS.renderer as 'canvas' | 'svg',
          ...APP_CONFIG.ECHARTS_OPTIONS,
        }
    );

    chartInstanceRef.current = chartInstance;

    // Handle resize
    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [additionalOptions.renderer]);

  // Debug the chart data
  useEffect(() => {
    if (chartData && chartData.series) {
      console.log(`Chart ${id} data:`, chartData);

      // Count data points
      let totalPoints = 0;
      chartData.series.forEach(series => {
        if (Array.isArray(series.data)) {
          totalPoints += series.data.length;
        }
      });

      setDataPoints(totalPoints);
      console.log(`Chart ${id} has ${totalPoints} data points`);
    }
  }, [chartData, id]);

  // Update chart when data changes
  useEffect(() => {
    if (!chartInstanceRef.current || loading || !chartData) return;

    const baseOptions = getDefaultChartOptions(title);

    // Merge options
    const options = {
      ...baseOptions,
      ...chartData,
      ...additionalOptions,
    };

    console.log(`Setting chart options for ${id}:`, options);

    // IMPORTANT: Explicitly configure the x-axis for time data
    if (!options.xAxis.type) {
      options.xAxis.type = 'time';
    }

    chartInstanceRef.current.setOption(options, true);

    if (onChartReady) {
      onChartReady();
    }
  }, [chartData, title, loading, additionalOptions, id, onChartReady]);

  return (
      <div className={`relative rounded-lg border border-gray-200 shadow-md mb-8 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="text-xs text-gray-500 mt-1">
            {dataPoints.toLocaleString()} data points | {additionalOptions.renderer || APP_CONFIG.ECHARTS_OPTIONS.renderer} renderer
          </div>
        </div>

        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )}

        <div
            ref={chartContainerRef}
            id={`chart-${id}`}
            style={{
              height: typeof height === 'number' ? `${height}px` : height,
              width: APP_CONFIG.CHART_WIDTH
            }}
            className="p-4"
        ></div>
      </div>
  );
}
