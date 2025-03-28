// app/server/page.tsx
import { fetchLargeDataset } from "@/app/lib/api";
import ChartWrapper from "@/app/components/ChartWrapper";
import { ApiDataPoints } from "@/app/lib/types";
import ConfigPanel from "@/app/components/ConfigPanel";
import { parseChartParams } from "@/app/lib/configUtils";

export const dynamic = 'force-dynamic'; // Force dynamic rendering to ensure fresh data on each request

export default async function ServerPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Parse URL parameters
  const { numCharts, dataPoints } = parseChartParams(searchParams);

  // Fetch data for each chart
  const chartDataPromises = Array(numCharts).fill(null).map(() =>
    fetchLargeDataset('scatter', dataPoints)
  );
  const chartsData = await Promise.all(chartDataPromises);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Server-Side Rendered Charts</h1>
      <p className="mb-4 text-gray-700">
        Chart data is fetched during server-side rendering.
        The page only loads after all data has been fetched.
      </p>

      <ConfigPanel defaultCharts={numCharts} defaultDataPoints={dataPoints} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartsData.map((chartData, index) => (
          <div key={index} className="h-[400px]">
            <ChartWrapper
              title={`Scatter Chart ${index + 1} (${dataPoints.toLocaleString()} points)`}
              chartData={chartData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
