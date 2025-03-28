import { useState, useEffect } from 'react';
import { useSearchParams } from '../lib/hooks/useSearchParams';
import ChartWrapper from "../components/ChartWrapper";
import { ApiDataPoints } from "../lib/types";
import { fetchLargeDataset } from "../lib/api";
import ConfigPanel from "../components/ConfigPanel";
import { parseChartParams } from "../lib/configUtils";

export default function StaticChart() {
  const [searchParams] = useSearchParams();
  const { numCharts, dataPoints } = parseChartParams(searchParams);

  const [chartsData, setChartsData] = useState<ApiDataPoints[]>(
    Array(numCharts).fill({ type: 'scatter', count: 0, data: [] })
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartsData = async () => {
      try {
        setLoading(true);

        // Call fetch function directly from client
        const promises = Array(numCharts).fill(null).map(() =>
          fetchLargeDataset('scatter', dataPoints)
        );
        const data = await Promise.all(promises);

        setChartsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChartsData();
  }, [numCharts, dataPoints]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Static Bundle Charts</h1>
      <p className="mb-4 text-gray-700">
        This page is served as a completely static bundle via Vite.
        All chart data is fetched from the client, but the page itself
        is independent of the Next.js application.
      </p>

      <ConfigPanel defaultCharts={numCharts} defaultDataPoints={dataPoints} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartsData.map((chartData, index) => (
          <div key={index} className="h-[400px]">
            <ChartWrapper
              title={`Static Chart ${index + 1} (${dataPoints.toLocaleString()} points)`}
              chartData={chartData}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
