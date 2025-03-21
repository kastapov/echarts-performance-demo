// app/components/AnalyticsDashboard.tsx
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import ECharts component
const ChartWrapper = dynamic(() => import('./ChartWrapper'), { ssr: false });

interface PerformanceMetrics {
    approach: string;
    averageRenderTime: number;
    medianRenderTime: number;
    maxRenderTime: number;
    memoryUsage: number;
    dataPoints: number;
    sampleSize: number;
}

export default function AnalyticsDashboard() {
    const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);

                // In a real-world scenario, you would fetch this data from Vercel Analytics API
                // For demo purposes, we're generating synthetic data

                // Simulated API call with timeout
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Synthetic performance data based on typical characteristics of each approach
                const syntheticMetrics: PerformanceMetrics[] = [
                    {
                        approach: 'Server-Side Rendering',
                        averageRenderTime: 850,
                        medianRenderTime: 800,
                        maxRenderTime: 1200,
                        memoryUsage: 28,
                        dataPoints: 1000000,
                        sampleSize: 50
                    },
                    {
                        approach: 'Server Components',
                        averageRenderTime: 650,
                        medianRenderTime: 600,
                        maxRenderTime: 950,
                        memoryUsage: 22,
                        dataPoints: 1000000,
                        sampleSize: 50
                    },
                    {
                        approach: 'Client-Side Rendering',
                        averageRenderTime: 450,
                        medianRenderTime: 420,
                        maxRenderTime: 750,
                        memoryUsage: 35,
                        dataPoints: 1000000,
                        sampleSize: 50
                    }
                ];

                setMetrics(syntheticMetrics);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                setLoading(false);
            }
        }

        fetchMetrics();
    }, []);

    // Prepare chart data
    const renderTimeChartData = {
        xAxis: {
            type: 'category',
            data: metrics.map(m => m.approach),
        },
        yAxis: {
            type: 'value',
            name: 'Time (ms)',
        },
        series: [
            {
                name: 'Average Render Time',
                type: 'bar',
                data: metrics.map(m => m.averageRenderTime),
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    color: '#3b82f6'
                }
            },
            {
                name: 'Median Render Time',
                type: 'bar',
                data: metrics.map(m => m.medianRenderTime),
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    color: '#10b981'
                }
            },
            {
                name: 'Max Render Time',
                type: 'bar',
                data: metrics.map(m => m.maxRenderTime),
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    color: '#ef4444'
                }
            }
        ]
    };

    const memoryUsageChartData = {
        xAxis: {
            type: 'category',
            data: metrics.map(m => m.approach),
        },
        yAxis: {
            type: 'value',
            name: 'Memory (MB)',
        },
        series: [
            {
                name: 'Memory Usage',
                type: 'bar',
                data: metrics.map(m => m.memoryUsage),
                itemStyle: {
                    color: '#8b5cf6'
                }
            }
        ]
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Performance Comparison
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Comparing render times across different approaches (lower is better).
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-80">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <ChartWrapper
                            id="render-time-chart"
                            title="Chart Render Times"
                            chartData={renderTimeChartData}
                            height={400}
                        />

                        <ChartWrapper
                            id="memory-usage-chart"
                            title="Memory Usage"
                            chartData={memoryUsageChartData}
                            height={400}
                        />
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Detailed Metrics
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Performance stats for each rendering approach with 1M datapoints.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Approach
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg. Render Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Median Render Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Max Render Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Memory Usage
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sample Size
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {metrics.map((metric) => (
                                <tr key={metric.approach}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {metric.approach}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {metric.averageRenderTime} ms
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {metric.medianRenderTime} ms
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {metric.maxRenderTime} ms
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {metric.memoryUsage} MB
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {metric.sampleSize} renders
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => router.push(`/${metric.approach.toLowerCase().replace(/-/g, '').replace(' ', '-')}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View Demo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <p>
                    <strong>Note:</strong> In a production environment, this dashboard would display real analytics data from the Vercel Analytics API.
                    For demonstration purposes, we're showing synthetic data that represents typical performance characteristics for each approach.
                </p>
            </div>
        </div>
    );
}
