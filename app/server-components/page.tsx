// app/server-components/page.tsx
import { Suspense } from 'react';
import { APP_CONFIG, CHART_TYPES } from '../lib/config';
import { PageConfig } from '../lib/types';
import ServerChartsWrapper from './ServerChartsWrapper';

export async function generateMetadata() {
    return {
        title: 'Server Components Approach - ECharts Performance Demo',
    };
}

export default async function ServerComponentsPage({
                                                       searchParams,
                                                   }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get data points parameter from URL if present
    const dataPointsParam = searchParams['dataPoints'];
    const dataPoints = dataPointsParam
        ? parseInt(Array.isArray(dataPointsParam) ? dataPointsParam[0] : dataPointsParam)
        : 1000000;

    // Get charts count parameter from URL if present
    const chartsCountParam = searchParams['chartsCount'];
    const chartsCount = chartsCountParam
        ? parseInt(Array.isArray(chartsCountParam) ? chartsCountParam[0] : chartsCountParam)
        : APP_CONFIG.CHARTS_PER_PAGE;

    // Generate page configuration
    const pageConfig: PageConfig = {
        title: "Server Components Approach",
        description: "Charts rendered using React Server Components with streaming data",
        charts: Array.from({ length: chartsCount }, (_, i) => {
            const chartTypeIndex = i % CHART_TYPES.length;

            return {
                id: `server-chart-${i}`,
                title: `${CHART_TYPES[chartTypeIndex]} Chart - ${(dataPoints / 1000).toFixed(0)}K Datapoints`,
                type: CHART_TYPES[chartTypeIndex],
            };
        }),
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">{pageConfig.title}</h1>
            <p className="text-gray-500 mb-6">{pageConfig.description}</p>

            <Suspense fallback={<div className="animate-pulse h-20 bg-gray-100 rounded mb-8"></div>}>
                <ServerChartsWrapper
                    pageConfig={pageConfig}
                    initialDataPoints={dataPoints}
                    initialChartsCount={chartsCount}
                />
            </Suspense>
        </div>
    );
}
