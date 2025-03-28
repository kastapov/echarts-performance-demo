// app/lib/configUtils.ts

import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Parse and validate URL parameters for chart configuration
 * Works with both client-side searchParams and server-side request params
 */
export function parseChartParams(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string | string[] | undefined>) {
  let chartsParam: string | null = null;
  let dataParam: string | null = null;

  // Handle different parameter types
  if (searchParams instanceof URLSearchParams || 'get' in searchParams) {
    // Client-side ReadonlyURLSearchParams or URLSearchParams
    chartsParam = (searchParams as any).get('charts');
    dataParam = (searchParams as any).get('dataPoints');
  } else {
    // Server-side request params (Record)
    chartsParam = typeof searchParams.charts === 'string' ? searchParams.charts : null;
    dataParam = typeof searchParams.dataPoints === 'string' ? searchParams.dataPoints : null;
  }

  // Number of charts
  let numCharts = 1;
  if (chartsParam) {
    const parsed = parseInt(chartsParam, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      numCharts = parsed;
    }
  }

  // Data points
  let dataPoints = 1000;
  if (dataParam) {
    const parsed = parseInt(dataParam, 10);
    if (!isNaN(parsed) && [1000, 10000, 100000, 1000000].includes(parsed)) {
      dataPoints = parsed;
    }
  }

  return { numCharts, dataPoints };
}
