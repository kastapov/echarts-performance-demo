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
    const hasCalledOnReadyRef = useRef(false);
    const renderAttemptRef = useRef(0);

    // Initialize chart only once
    useEffect(() => {
        if (!chartContainerRef.current) return;
        if (chartInstanceRef.current) return; // Prevent reinitializing if already exists

        console.log(`[${id}] Initializing chart instance (attempt: ${renderAttemptRef.current++})`);

        // Initialize ECharts instance
        const chartInstance = echarts.init(
            chartContainerRef.current,
            undefined,
            {
                ...APP_CONFIG.ECHARTS_OPTIONS,
                renderer: additionalOptions.renderer || APP_CONFIG.ECHARTS_OPTIONS.renderer as 'canvas' | 'svg',
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
            console.log(`[${id}] Disposing chart instance`);
            chartInstance.dispose();
            chartInstanceRef.current = null;
            window.removeEventListener('resize', handleResize);
        };
        // Only depend on id to prevent recreating the chart instance
    }, [id]);

    // Update chart when data changes
    useEffect(() => {
        if (!chartInstanceRef.current || loading || !chartData) return;

        // Count data points
        let totalPoints = 0;
        if (chartData.series) {
            chartData.series.forEach(series => {
                if (Array.isArray(series.data)) {
                    totalPoints += series.data.length;
                }
            });
        }

        console.log(`[${id}] Updating chart with ${totalPoints} data points`);
        setDataPoints(totalPoints);

        const baseOptions = getDefaultChartOptions(title);

        // Merge options
        const options = {
            ...baseOptions,
            ...chartData,
            ...additionalOptions,
        };

        // IMPORTANT: Explicitly configure the x-axis for time data
        if (!options.xAxis.type) {
            options.xAxis.type = 'time';
        }

        // Set chart options
        chartInstanceRef.current.setOption(options, true);

        // Call onChartReady only once
        if (onChartReady && !hasCalledOnReadyRef.current) {
            onChartReady();
            hasCalledOnReadyRef.current = true;
        }

    }, [chartData, title, loading, additionalOptions, id, onChartReady]);

    // Reset hasCalledOnReady when the id changes
    useEffect(() => {
        hasCalledOnReadyRef.current = false;
    }, [id]);

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
