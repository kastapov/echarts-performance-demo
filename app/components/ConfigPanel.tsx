'use client';

// app/components/ConfigPanel.tsx
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ConfigPanelProps {
  defaultCharts?: number;
  defaultDataPoints?: number;
}

export default function ConfigPanel({
                                      defaultCharts = 1,
                                      defaultDataPoints = 1000
                                    }: ConfigPanelProps) {
  const router = useRouter();

  // Initialize state from defaults
  const [numCharts, setNumCharts] = useState<number>(defaultCharts);
  const [dataPoints, setDataPoints] = useState<number>(defaultDataPoints);

  // Update state when props change
  useEffect(() => {
    setNumCharts(defaultCharts);
    setDataPoints(defaultDataPoints);
  }, [defaultCharts, defaultDataPoints]);

  // Update URL when settings change
  const updateURL = () => {
    // Get the current path
    const path = window.location.pathname;
    const url = `${path}?charts=${numCharts}&dataPoints=${dataPoints}`;
    router.push(url);
  };

  const handleChartsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumCharts(value);
  };

  const handleDataPointsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setDataPoints(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-3">Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="numCharts" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Charts
          </label>
          <select
            id="numCharts"
            value={numCharts}
            onChange={handleChartsChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dataPoints" className="block text-sm font-medium text-gray-700 mb-1">
            Data Points per Chart
          </label>
          <select
            id="dataPoints"
            value={dataPoints}
            onChange={handleDataPointsChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value={1000}>1,000</option>
            <option value={10000}>10,000</option>
            <option value={100000}>100,000</option>
            <option value={1000000}>1,000,000</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={updateURL}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Configuration
        </button>
      </div>
    </div>
  );
}
