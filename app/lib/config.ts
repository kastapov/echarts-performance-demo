// app/lib/config.ts

export const APP_CONFIG = {
  // Number of charts to render on each page (1-10)
  CHARTS_PER_PAGE: 3,

  // Chart dimensions
  CHART_HEIGHT: 400,
  CHART_WIDTH: '100%',

  // Data API endpoint
  DATA_API_URL: process.env.NEXT_PUBLIC_DATA_API_URL || 'http://localhost:3001',

  // ECharts global options
  ECHARTS_OPTIONS: {
    animation: false, // Disable animations for better performance
    progressive: 500, // Enable progressive rendering
    progressiveThreshold: 3000, // Data threshold to enable progressive rendering
    renderer: 'canvas', // 'canvas' or 'svg'
    useUTC: true,
  },

  // Cache settings
  CACHE_TTL: 60 * 60, // 1 hour in seconds
};

// Types of charts to create
export const CHART_TYPES = [
  'line',
  'bar',
  'scatter',
] as const;

// Default chart options
export const getDefaultChartOptions = (title: string) => ({
  title: {
    text: title,
    left: 'center',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
    formatter: function (params: any) {
      const date = new Date(params[0].value[0]);
      const value = params[0].value[1];
      return `${date.toLocaleString()}<br/>${params[0].seriesName}: ${value.toFixed(2)}`;
    }
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  xAxis: {
    type: 'time',
    boundaryGap: false,
    axisLabel: {
      formatter: '{yyyy-MM-dd HH:mm}'
    }
  },
  yAxis: {
    type: 'value',
    scale: true,
  },
});
