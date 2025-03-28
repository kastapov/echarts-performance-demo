'use client';

// app/internal-api/page.tsx
import { useState, useEffect } from 'react';
import ChartWrapper from "@/app/components/ChartWrapper";
import { ApiDataPoints } from "@/app/lib/types";
import ConfigPanel from "@/app/components/ConfigPanel";
import { parseChartParams } from "@/app/lib/configUtils";

export default function InternalApiPage({
                                          searchParams
                                        }: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  // Parse search params from props instead of using useSearchParams hook
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

        // Use internal API route
        const promises = Array(numCharts).fill(null).map(() =>
          fetch(`/api/chart-data?type=scatter&count=${dataPoints}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              return res.json();
            })
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
      <h1 className="text-3xl font-bold mb-6">Internal API Charts</h1>
      <p className="mb-4 text-gray-700">
        Chart data is fetched from the client using internal Next.js API routes.
        The page loads immediately, but charts only display once data has been fetched.
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
              title={`Internal API Chart ${index + 1} (${dataPoints.toLocaleString()} points)`}
              chartData={chartData}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
