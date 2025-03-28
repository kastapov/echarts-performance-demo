/**
 * Parse and validate URL parameters for chart configuration
 * Static version - simplified for Vite
 */
export function parseChartParams(searchParams: URLSearchParams) {
  // Number of charts
  let numCharts = 1;
  const chartsParam = searchParams.get('charts');
  if (chartsParam) {
    const parsed = parseInt(chartsParam, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      numCharts = parsed;
    }
  }

  // Data points
  let dataPoints = 1000;
  const dataParam = searchParams.get('dataPoints');
  if (dataParam) {
    const parsed = parseInt(dataParam, 10);
    if (!isNaN(parsed) && [1000, 10000, 100000, 1000000].includes(parsed)) {
      dataPoints = parsed;
    }
  }

  return { numCharts, dataPoints };
}
