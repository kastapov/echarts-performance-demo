// app/components/ConfigPanel.tsx
"use client";

import { useState, useEffect } from 'react';
import { APP_CONFIG, CHART_TYPES } from '../lib/config';
import DataPointsSelector from './DataPointsSelector';

interface ConfigPanelProps {
  onChange: (config: {
    chartsCount: number;
    renderer: string;
    dataPoints: number;
  }) => void;
  initialDataPoints?: number;
}

export default function ConfigPanel({
                                      onChange,
                                      initialDataPoints = 1000000
                                    }: ConfigPanelProps) {
  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(initialDataPoints);

  // Update parent component when config changes
  useEffect(() => {
    onChange({ chartsCount, renderer, dataPoints });
  }, [chartsCount, renderer, dataPoints, onChange]);

  return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Chart Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="charts-count" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Charts
            </label>
            <div className="flex items-center">
              <input
                  type="range"
                  id="charts-count"
                  min="1"
                  max="10"
                  value={chartsCount}
                  onChange={(e) => setChartsCount(parseInt(e.target.value))}
                  className="w-full mr-2"
              />
              <span className="text-sm text-gray-500 w-10">{chartsCount}</span>
            </div>
          </div>

          <div>
            <label htmlFor="renderer" className="block text-sm font-medium text-gray-700 mb-1">
              Renderer
            </label>
            <select
                id="renderer"
                value={renderer}
                onChange={(e) => setRenderer(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="canvas">Canvas (faster)</option>
              <option value="svg">SVG (better quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Points
            </label>
            <DataPointsSelector
                onChange={setDataPoints}
                initialValue={dataPoints}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-blue-50 rounded p-2 text-sm text-blue-700">
            <p>
              <span className="font-medium">Total data points: </span>
              {(chartsCount * dataPoints).toLocaleString()}
            </p>
            <p className="text-xs mt-1">
              More data points will increase rendering time and memory usage
            </p>
          </div>
        </div>
      </div>
  );
}
