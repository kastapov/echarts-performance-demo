// app/server-actions/ServerChartContainer.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ChartConfig, ChartData } from '../lib/types';

// Dynamically import ChartWrapper with no SSR
const ChartWrapper = dynamic(
    () => import('../components/ChartWrapper'),
    { ssr: false }
);

interface ServerChartContainerProps {
    chartConfig: ChartConfig;
    dataPoints: number;
    renderer: string;
    onChartReady?: () => void;
    forceReload?: number; // To trigger data reload
}

export default function ServerChartContainer({
                                                 chartConfig,
                                                 dataPoints,
                                                 renderer,
                                                 onChartReady,
                                                 forceReload = 0
                                             }: ServerChartContainerProps) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    // Track if data has been loaded for this instance to prevent multiple loads
    const hasLoadedRef = useRef<boolean>(false);
    const loadingInProgressRef = useRef<boolean>(false);
    const initialRenderRef = useRef<boolean>(true);
    const lastParamsRef = useRef<string>('');

    // Track if the component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    // Keep track of the current request to avoid race conditions
    const requestIdRef = useRef(0);

    // Create a params string to detect when important props change
    const paramsString = `${chartConfig.id}-${chartConfig.type}-${dataPoints}-${forceReload}`;

    // Load data effect
    useEffect(() => {
        // Set mounted flag
        isMountedRef.current = true;

        // If the params haven't changed or we're already loading, don't restart loading
        if (paramsString === lastParamsRef.current && !initialRenderRef.current) {
            return;
        }

        // If we're already loading, don't start another load
        if (loadingInProgressRef.current) {
            return;
        }

        // Update the last params
        lastParamsRef.current = paramsString;
        initialRenderRef.current = false;

        // If this is a force reload, reset the loaded state
        if (forceReload > 0) {
            hasLoadedRef.current = false;
        }

        // If we've already loaded data and this isn't a forced reload, skip loading
        // This prevents unnecessary loads during re-renders
        if (hasLoadedRef.current && chartData !== null) {
            console.log(`[ServerChartContainer ${chartConfig.id}] Using existing data`);

            // Just trigger ready callback if needed
            if (onChartReady) {
                onChartReady();
            }

            return;
        }

        console.log(`[ServerChartContainer ${chartConfig.id}] Fetching data (${dataPoints} points, reload: ${forceReload})`);

        // Reset state
        setLoading(true);
        setError(null);
        setProgress(0);

        // Mark that we're loading
        loadingInProgressRef.current = true;

        // Increment request ID to track the current request
        const currentRequestId = ++requestIdRef.current;

        async function loadData() {
            try {
                // Simulate progressive loading
                setProgress(20);

                // Safely access chartType with fallback
                const chartType = chartConfig?.type || 'line';

                // Fetch data from API route with data points parameter
                // Add timestamp for cache busting only when force reloading
                const cacheBuster = forceReload > 0 ? `&t=${Date.now()}` : '';
                const response = await fetch(
                    `/api/chart-data?type=${encodeURIComponent(chartType)}&count=${dataPoints}${cacheBuster}`
                );

                // Check if this is still the current request and component is mounted
                if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
                    console.log(`[ServerChartContainer ${chartConfig.id}] Ignoring outdated request ${currentRequestId}`);
                    loadingInProgressRef.current = false;
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                setProgress(60);

                const data = await response.json();

                // Check again if component is still mounted
                if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
                    loadingInProgressRef.current = false;
                    return;
                }

                setProgress(80);

                // Create a properly formatted chart data object with defaults
                const formattedData: ChartData = {
                    xAxis: data.xAxis || { type: 'time' },
                    yAxis: data.yAxis || { type: 'value' },
                    series: data.series && data.series.length > 0
                        ? data.series.map((series: { name: any; type: any; data: any; }) => ({
                            ...series,
                            // Ensure name property exists
                            name: series.name || chartType,
                            // Ensure type property exists
                            type: series.type || chartType,
                            // Ensure data property exists
                            data: series.data || []
                        }))
                        : [{
                            type: chartType,
                            name: chartType,
                            data: []
                        }]
                };

                // Short delay to show progress UI
                setTimeout(() => {
                    // Check again if component is still mounted
                    if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
                        loadingInProgressRef.current = false;
                        return;
                    }

                    setChartData(formattedData);
                    setLoading(false);
                    setProgress(100);

                    // Mark that we've loaded data
                    hasLoadedRef.current = true;
                    loadingInProgressRef.current = false;

                    if (onChartReady) {
                        onChartReady();
                    }
                }, 300);
            } catch (err) {
                if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
                    loadingInProgressRef.current = false;
                    return;
                }

                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                console.error(`[ServerChartContainer ${chartConfig.id}] Error loading chart:`, errorMessage);

                setError(errorMessage);
                setLoading(false);
                loadingInProgressRef.current = false;
            }
        }

        // Start loading
        loadData();

        // IMPORTANT: We only depend on the paramsString to prevent multiple re-renders
    }, [paramsString]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            console.log(`[ServerChartContainer ${chartConfig.id}] Component unmounting`);
            isMountedRef.current = false;
        };
    }, [chartConfig.id]);

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
