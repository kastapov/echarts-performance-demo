// app/lib/types.ts

export interface DataSource {
  name?: string;
  url?: string;
  transformation?: string;
}

export interface ApiResponse {
  data: any;
  fromCache: boolean;
}

export interface ChartData {
  xAxis: {
    type: string;
    min?: number;
    max?: number;
    [key: string]: any;
  };
  yAxis: {
    type: string;
    scale?: boolean;
    [key: string]: any;
  };
  series: Array<{
    type: string;
    name: string;
    data: any[];
    showSymbol?: boolean;
    sampling?: string;
    symbolSize?: number;
    itemStyle?: any;
    areaStyle?: any;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: string;
  dataSource?: DataSource;
  options?: Record<string, any>;
}

export interface PageConfig {
  title: string;
  description: string;
  charts: ChartConfig[];
}
