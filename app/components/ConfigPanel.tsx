// app/components/ConfigPanel.tsx
"use client";

import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../lib/config';
import DataPointsSelector from './DataPointsSelector';
import { ChartConfiguration, loadConfiguration, saveConfiguration } from '../lib/configStorage';

interface ConfigPanelProps {
  onChange: (config: ChartConfiguration) => void;
  onReloadCharts?: () => void;
}

export default function ConfigPanel({
                                      onChange,
                                      onReloadCharts
                                    }: ConfigPanelProps) {
  // Initialize with default values (will be overridden by localStorage if available)
  const [isLoaded, setIsLoaded] = useState(false);
  const [chartsCount, setChartsCount] = useState<number>(APP_CONFIG.CHARTS_PER_PAGE);
  const [renderer, setRenderer] = useState<string>(APP_CONFIG.ECHARTS_OPTIONS.renderer as string);
  const [dataPoints, setDataPoints] = useState<number>(1000000);

  // Load configuration from localStorage on initial mount
  useEffect(() => {
    const defaultConfig: ChartConfiguration = {
      chartsCount: APP_CONFIG.CHARTS_PER_PAGE,
      dataPoints: 1000000,
      renderer: APP_CONFIG.ECHARTS_OPTIONS.renderer as string
    };

    const savedConfig = loadConfiguration(defaultConfig);

    setChartsCount(savedConfig.chartsCount);
    setRenderer(savedConfig.renderer);
    setDataPoints(savedConfig.dataPoints);

    // Mark as loaded after configuration is retrieved
    setIsLoaded(true);
  }, []);

  // Update parent component when config changes and save to localStorage
  useEffect(() => {
    // Only trigger onChange when config is fully loaded
    if (!isLoaded) return;

    const config: ChartConfiguration = { chartsCount, renderer, dataPoints };
    onChange(config);
    saveConfiguration(config);
  }, [chartsCount, renderer, dataPoints, onChange, isLoaded]);

  // Handle page reload
  const handlePageReload = () => {
    if (window) {
      window.location.reload();
    }
  };

  // Handle charts reload
  const handleChartsReload = () => {
    if (onReloadCharts) {
      onReloadCharts();
    }
  };

  if (!isLoaded) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading configuration...</span>
        </div>
    );
  }

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

        <div className="mt-4 flex flex-col md:flex-row justify-between">
          <div className="bg-blue-50 rounded p-2 text-sm text-blue-700 mb-4 md:mb-0 md:w-2/3">
            <p>
              <span className="font-medium">Total data points: </span>
              {(chartsCount * dataPoints).toLocaleString()}
            </p>
            <p className="text-xs mt-1">
              More data points will increase rendering time and memory usage
            </p>
          </div>

          <div className="flex space-x-3">
            <button
                onClick={handleChartsReload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Charts
            </button>

            <button
                onClick={handlePageReload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Page
            </button>
          </div>
        </div>
      </div>
  );
}
