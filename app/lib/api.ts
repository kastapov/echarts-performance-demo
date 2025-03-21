// app/lib/api.ts
import axios from 'axios';
import { APP_CONFIG } from './config';
import { ChartData } from './types';

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Fetches large dataset from the data API
 */
export async function fetchLargeDataset(chartType: string, dataPoints: number = 1000000): Promise<ChartData> {
  try {
    const url = `${APP_CONFIG.DATA_API_URL}/api/data/1m?type=${chartType}&count=${dataPoints}`;
    const cacheKey = url;
    const now = Date.now();

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData && now - cachedData.timestamp < APP_CONFIG.CACHE_TTL * 1000) {
      return formatChartData(cachedData.data, chartType);
    }

    console.log(`Fetching data from ${url}`);
    const response = await axios.get(url);
    const data = response.data;

    console.log('API response received:', {
      type: data.type,
      count: data.count,
      sampleData: data.data?.slice(0, 3) || []
    });

    // Store in cache
    apiCache.set(cacheKey, { data, timestamp: now });

    const formattedData = formatChartData(data, chartType);
    console.log('Formatted chart data:', {
      xAxisType: formattedData.xAxis.type,
      seriesLength: formattedData.series.length,
      dataPointsSample: formattedData.series[0]?.data?.slice(0, 3) || []
    });

    return formattedData;
  } catch (error) {
    console.error(`Error fetching data for ${chartType} chart:`, error);
    // Return empty chart data on error
    return createEmptyChartData(chartType);
  }
}

/**
 * Formats the API response into ECharts format
 */
function formatChartData(apiResponse: any, chartType: string): ChartData {
  // Ensure we have a valid API response
  if (!apiResponse || !apiResponse.data) {
    console.warn('Invalid API response format, using empty chart data');
    return createEmptyChartData(chartType);
  }

  // Make sure the data array is properly formatted
  const chartData = apiResponse.data || [];

  // Verify data format
  if (chartData.length > 0) {
    console.log('First data point:', chartData[0]);
    console.log('Data array length:', chartData.length);
  } else {
    console.warn('Empty data array in API response');
  }

  switch (chartType) {
    case 'line':
      return {
        xAxis: {
          type: 'time',
          min: chartData.length > 0 ? chartData[0][0] : undefined,
          max: chartData.length > 0 ? chartData[chartData.length - 1][0] : undefined
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [{
          type: 'line',
          name: 'Value',
          showSymbol: false,
          data: chartData,
          sampling: 'lttb',
        }],
      };

    case 'bar':
      return {
        xAxis: {
          type: 'time',
          min: chartData.length > 0 ? chartData[0][0] : undefined,
          max: chartData.length > 0 ? chartData[chartData.length - 1][0] : undefined
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [{
          type: 'bar',
          name: 'Value',
          data: chartData,
        }],
      };

    case 'scatter':
      return {
        xAxis: {
          type: 'time',
          min: chartData.length > 0 ? chartData[0][0] : undefined,
          max: chartData.length > 0 ? chartData[chartData.length - 1][0] : undefined
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [{
          type: 'scatter',
          name: 'Value',
          symbolSize: 5,
          data: chartData,
        }],
      };

    default:
      return {
        xAxis: {
          type: 'time',
          min: chartData.length > 0 ? chartData[0][0] : undefined,
          max: chartData.length > 0 ? chartData[chartData.length - 1][0] : undefined
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [{
          type: 'line',
          name: 'Value',
          showSymbol: false,
          data: chartData,
          sampling: 'lttb',
        }],
      };
  }
}

/**
 * Creates empty chart data for error states
 */
function createEmptyChartData(chartType: string): ChartData {
  return {
    xAxis: { type: 'time' },
    yAxis: { type: 'value' },
    series: [{
      type: chartType as 'line' | 'bar' | 'scatter',
      name: 'Value',
      data: [],
    }],
  };
}
