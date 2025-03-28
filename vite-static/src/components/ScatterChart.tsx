import { EChartsOption, ScatterSeriesOption } from "echarts";
import EChartsReact from "echarts-for-react";

interface ScatterChartProps {
  data: [number, number][];
  className?: string;
}

export default function ScatterChart({
                                       data,
                                       className = ''
                                     }: ScatterChartProps) {
  const option: EChartsOption = {
    xAxis: {
      type: 'time',
      name: 'Time',
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: 'Value',
      nameLocation: 'middle',
      nameGap: 30,
    },
    dataZoom: [
      {
        type: 'inside'
      },
      {
        type: 'slider'
      }
    ],
    series: [
      {
        type: 'scatter',
        symbolSize: 5,
        data: data,
        large: true,
        largeThreshold: 2000,
        progressive: 300,
        progressiveThreshold: 3000,
        sampling: 'lttb'
      } as ScatterSeriesOption,
    ],
  };

  return (
    <EChartsReact
      option={option}
      className={`w-full h-full ${className}`}
      opts={{ renderer: 'canvas' }}
    />
  );
};
