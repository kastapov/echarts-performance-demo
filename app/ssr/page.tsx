// app/ssr/page.tsx
import { Suspense } from 'react';
import { APP_CONFIG, CHART_TYPES } from '../lib/config';
import { fetchLargeDataset } from '../lib/api';
import { ChartData, PageConfig } from '../lib/types';
import SSRCharts from './SSRCharts';

// This function runs on the server for each request
export async function generateMetadata() {
  return {
    title: 'SSR Approach - ECharts Performance Demo',
  };
}

// Server-side data fetching
async function fetchAllChartData(
    count: number = APP_CONFIG.CHARTS_PER_PAGE,
    dataPoints: number = 1000000
): Promise<ChartData[]> {
  console.time('ssr-data-fetch');

  const promises: Promise<ChartData>[] = [];

  // Create one chart for each chart type
  for (let i = 0; i < count; i++) {
    const chartTypeIndex = i % CHART_TYPES.length;
    const chartType = CHART_TYPES[chartTypeIndex];

    promises.push(fetchLargeDataset(chartType, dataPoints));
  }

  const results = await Promise.all(promises);
  console.timeEnd('ssr-data-fetch');

  return results;
}

export default async function SSRPage({
                                        searchParams,
                                      }: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get data points parameter from URL if present
  const dataPointsParam = searchParams['dataPoints'];
  const dataPoints = dataPointsParam
      ? parseInt(Array.isArray(dataPointsParam) ? dataPointsParam[0] : dataPointsParam)
      : 1000000;

  // Server-side pre-fetching of chart data
  const defaultChartCount = APP_CONFIG.CHARTS_PER_PAGE;
  const initialChartData = await fetchAllChartData(defaultChartCount, dataPoints);

  // Generate page configuration
  const pageConfig: PageConfig = {
    title: "Server-Side Rendering (SSR) Approach",
    description: "Charts rendered using getServerSideProps with full data processing on the server",
    charts: Array.from({ length: defaultChartCount }, (_, i) => {
      const chartTypeIndex = i % CHART_TYPES.length;

      return {
        id: `ssr-chart-${i}`,
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
          <SSRCharts
              initialChartData={initialChartData}
              pageConfig={pageConfig}
              initialDataPoints={dataPoints}
          />
        </Suspense>
      </div>
  );
}
