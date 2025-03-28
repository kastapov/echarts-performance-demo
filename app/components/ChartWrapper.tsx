// app/components/ChartWrapper.tsx
"use client";

import ScatterChart from "@/app/components/ScatterChart";
import { ApiDataPoints } from "@/app/lib/types";

interface ChartWrapperProps {
    title: string;
    chartData: ApiDataPoints;
    loading?: boolean;
    onChartReady?: () => void;
}

export default function ChartWrapper({ chartData, title, loading }: ChartWrapperProps) {

    return (
        <div className={`relative rounded-lg border border-gray-200 shadow-md mb-8 h-full`}>
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="text-xs text-gray-500 mt-1">
                    {chartData.data.length.toLocaleString()} data points
                </div>
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            <ScatterChart data={chartData.data}></ScatterChart>
        </div>
    );
}
