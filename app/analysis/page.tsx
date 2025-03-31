"use client";
// src/app/analysis/page.tsx

import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption, SeriesOption } from 'echarts';
import type { TooltipFormatterCallback } from 'echarts/types/dist/shared';

interface PerformanceDataEntry {
  method: string;
  charts: number;
  points: number;
  pointsLabel: string;
  resourceSize: number;
  finishTime: number;
  domContentLoaded: number;
  loadTime: number;
}

interface ChartDataItem {
  value: number | null;
  method: string;
  pointLabel: string;
  dclTime: number | null;
  dclToLoadDur: number | null;
  loadToFinishDur: number | null;
  totalFinishTime: number | null;
}

const performanceData: PerformanceDataEntry[] = [
  {
    method: "Server",
    charts: 1,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1572864,
    finishTime: 437,
    domContentLoaded: 295,
    loadTime: 418
  },
  {
    method: "Server",
    charts: 1,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 1782579.2,
    finishTime: 549,
    domContentLoaded: 420,
    loadTime: 522
  },
  {
    method: "Server",
    charts: 1,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 3879731.2,
    finishTime: 1300,
    domContentLoaded: 1260,
    loadTime: 1270
  },
  {
    method: "Server",
    charts: 1,
    points: 1000000,
    pointsLabel: "1M",
    resourceSize: 24536678.4,
    finishTime: 7740,
    domContentLoaded: 7710,
    loadTime: 7720
  },
  {
    method: "Server",
    charts: 10,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1782579.2,
    finishTime: 759,
    domContentLoaded: 360,
    loadTime: 650
  },
  {
    method: "Server",
    charts: 10,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 3879731.2,
    finishTime: 1140,
    domContentLoaded: 1080,
    loadTime: 1120
  },
  {
    method: "Server",
    charts: 10,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 24536678.4,
    finishTime: 5500,
    domContentLoaded: 5280,
    loadTime: 5430
  },
  {
    method: "Server Actions",
    charts: 1,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1572864,
    finishTime: 485,
    domContentLoaded: 31,
    loadTime: 116
  },
  {
    method: "Server Actions",
    charts: 1,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 1782579.2,
    finishTime: 659,
    domContentLoaded: 31,
    loadTime: 115
  },
  {
    method: "Server Actions",
    charts: 1,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 3879731.2,
    finishTime: 1230,
    domContentLoaded: 35,
    loadTime: 117
  },
  {
    method: "Server Actions",
    charts: 1,
    points: 1000000,
    pointsLabel: "1M",
    resourceSize: 24536678.4,
    finishTime: 4720,
    domContentLoaded: 30,
    loadTime: 115
  },
  {
    method: "Server Actions",
    charts: 10,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1782579.2,
    finishTime: 2080,
    domContentLoaded: 33,
    loadTime: 137
  },
  {
    method: "Server Actions",
    charts: 10,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 3879731.2,
    finishTime: 3970,
    domContentLoaded: 30,
    loadTime: 133
  },
  {
    method: "Server Actions",
    charts: 10,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 24536678.4,
    finishTime: 8400,
    domContentLoaded: 37,
    loadTime: 143
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 1,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1572864,
    finishTime: 345,
    domContentLoaded: 32,
    loadTime: 115
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 1,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 1782579.2,
    finishTime: 489,
    domContentLoaded: 32,
    loadTime: 112
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 1,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 3879731.2,
    finishTime: 977,
    domContentLoaded: 30,
    loadTime: 112
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 1,
    points: 1000000,
    pointsLabel: "1M",
    resourceSize: 24536678.4,
    finishTime: 2520,
    domContentLoaded: 34,
    loadTime: 119
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 10,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1782579.2,
    finishTime: 546,
    domContentLoaded: 34,
    loadTime: 142
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 10,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 3879731.2,
    finishTime: 1020,
    domContentLoaded: 34,
    loadTime: 145
  },
  {
    method: "Client (NextJS) + Internal API",
    charts: 10,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 24536678.4,
    finishTime: 3500,
    domContentLoaded: 37,
    loadTime: 152
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 1,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1572864,
    finishTime: 277,
    domContentLoaded: 32,
    loadTime: 123
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 1,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 1782579.2,
    finishTime: 479,
    domContentLoaded: 30,
    loadTime: 121
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 1,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 3879731.2,
    finishTime: 901,
    domContentLoaded: 29,
    loadTime: 121
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 1,
    points: 1000000,
    pointsLabel: "1M",
    resourceSize: 24536678.4,
    finishTime: 2650,
    domContentLoaded: 31,
    loadTime: 124
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 10,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1782579.2,
    finishTime: 376,
    domContentLoaded: 32,
    loadTime: 139
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 10,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 3879731.2,
    finishTime: 578,
    domContentLoaded: 31,
    loadTime: 143
  },
  {
    method: "Client (NextJS) + Direct API",
    charts: 10,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 24536678.4,
    finishTime: 1280,
    domContentLoaded: 32,
    loadTime: 142
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 1,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1363148.8,
    finishTime: 246,
    domContentLoaded: 74,
    loadTime: 95
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 1,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 1572864,
    finishTime: 530,
    domContentLoaded: 75,
    loadTime: 94
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 1,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 3565158.4,
    finishTime: 804,
    domContentLoaded: 76,
    loadTime: 98
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 1,
    points: 1000000,
    pointsLabel: "1M",
    resourceSize: 24222105.6,
    finishTime: 2370,
    domContentLoaded: 73,
    loadTime: 93
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 10,
    points: 1000,
    pointsLabel: "1K",
    resourceSize: 1572864,
    finishTime: 335,
    domContentLoaded: 73,
    loadTime: 121
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 10,
    points: 10000,
    pointsLabel: "10K",
    resourceSize: 3565158.4,
    finishTime: 561,
    domContentLoaded: 74,
    loadTime: 118
  },
  {
    method: "Client (Vite) + Direct API",
    charts: 10,
    points: 100000,
    pointsLabel: "100K",
    resourceSize: 24222105.6,
    finishTime: 1120,
    domContentLoaded: 74,
    loadTime: 117
  },
];

const ALL_METHODS = [
  "Server",
  "Server Actions",
  "Client (NextJS) + Internal API",
  "Client (NextJS) + Direct API",
  "Client (Vite) + Direct API"
];

const POINTS_ORDER = [1000, 10000, 100000, 1000000];
const POINTS_LABELS = ["1K", "10K", "100K", "1M"];
const TIMING_SEGMENT_NAMES = ['Time to DCL', 'Time from DCL to Load', 'Time from Load to Finish'];

const ECHARTS_COLORS = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
];

const generateStackedTimingChartOption = (
  chartsCount: number,
  isolatedMethod: string | null
): EChartsOption => {
  const seriesData: SeriesOption[] = [];
  const methodsToDisplay = isolatedMethod ? [isolatedMethod] : ALL_METHODS;

  methodsToDisplay.forEach(methodName => {
    const mapDataToSeriesItem = (segmentIndex: number) =>
      POINTS_ORDER.map((pointCount, index) => {
        const entry = performanceData.find(d => d.method === methodName && d.points === pointCount && d.charts === chartsCount);
        let dclTime: number | null = null;
        let dclToLoadDur: number | null = null;
        let loadToFinishDur: number | null = null;
        let totalFinishTime: number | null = null;
        let value: number | null = null;

        if (entry) {
          dclTime = entry.domContentLoaded;
          dclToLoadDur = Math.max(0, entry.loadTime - dclTime);
          loadToFinishDur = Math.max(0, entry.finishTime - entry.loadTime);
          totalFinishTime = entry.finishTime;

          if (segmentIndex === 0) value = dclTime;
          else if (segmentIndex === 1) value = dclToLoadDur;
          else if (segmentIndex === 2) value = loadToFinishDur;
        }

        return {
          value: value,
          method: methodName,
          pointLabel: POINTS_LABELS[index],
          dclTime: dclTime,
          dclToLoadDur: dclToLoadDur,
          loadToFinishDur: loadToFinishDur,
          totalFinishTime: totalFinishTime
        } as ChartDataItem;
      });

    seriesData.push({
      name: TIMING_SEGMENT_NAMES[0],
      type: 'bar',
      stack: methodName,
      emphasis: { focus: 'none' },
      data: mapDataToSeriesItem(0),
    });
    seriesData.push({
      name: TIMING_SEGMENT_NAMES[1],
      type: 'bar',
      stack: methodName,
      emphasis: { focus: 'none' },
      data: mapDataToSeriesItem(1),
    });
    seriesData.push({
      name: TIMING_SEGMENT_NAMES[2],
      type: 'bar',
      stack: methodName,
      emphasis: { focus: 'none' },
      label: {
        show: !isolatedMethod,
        position: 'top',
        formatter: methodName,
        color: '#4A5568',
        fontSize: 10,
        distance: 5,
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
      },
      data: mapDataToSeriesItem(2),
    });
  });

  const tooltipFormatter: TooltipFormatterCallback<any> = (params) => {
    if (!params || typeof params !== 'object' || Array.isArray(params)) {
      return '';
    }
    const embeddedData = params.data as ChartDataItem;
    if (!embeddedData || !embeddedData.method) {
      const pointLabel = params.name || 'N/A';
      return `<div class="text-sm">${pointLabel} Points<br/>No data available</div>`;
    }

    const { method, pointLabel, dclTime, dclToLoadDur, loadToFinishDur, totalFinishTime } = embeddedData;
    const createMarker = (color: string) =>
      `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;

    let tooltipContent = `<div class="text-sm space-y-1">`;
    tooltipContent += `<div>${pointLabel} Points</div>`;
    tooltipContent += `<div class="font-bold text-black">${method}</div>`;
    tooltipContent += `<div>${createMarker(ECHARTS_COLORS[0])} ${TIMING_SEGMENT_NAMES[0]}: ${dclTime?.toFixed(0) ?? 'N/A'} ms</div>`;
    tooltipContent += `<div>${createMarker(ECHARTS_COLORS[1])} ${TIMING_SEGMENT_NAMES[1]}: ${dclToLoadDur?.toFixed(0) ?? 'N/A'} ms</div>`;
    tooltipContent += `<div>${createMarker(ECHARTS_COLORS[2])} ${TIMING_SEGMENT_NAMES[2]}: ${loadToFinishDur?.toFixed(0) ?? 'N/A'} ms</div>`;
    tooltipContent += `<div class="font-semibold pt-1">Total Finish: ${totalFinishTime?.toFixed(0) ?? 'N/A'} ms</div>`;
    tooltipContent += `</div>`;

    return tooltipContent;
  };

  const options: EChartsOption = {
    color: ECHARTS_COLORS,
    title: {
      text: `Timing Metrics (${chartsCount} Chart${chartsCount > 1 ? 's' : ''})${isolatedMethod ? ` - ${isolatedMethod}` : ''}`,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: tooltipFormatter,
      confine: true,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: [5, 10],
      textStyle: { color: '#333', fontSize: 12 }
    },
    legend: {
      data: TIMING_SEGMENT_NAMES,
      top: 40,
      show: !isolatedMethod,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
      top: isolatedMethod ? 70 : 90,
    },
    xAxis: {
      type: 'category',
      data: POINTS_LABELS,
      axisLabel: { interval: 0 },
    },
    yAxis: {
      type: 'value',
      name: 'Time (ms)',
    },
    dataZoom: [
      { type: 'slider', xAxisIndex: 0, start: 0, end: 100, bottom: 10, height: 20 },
      { type: 'inside', xAxisIndex: 0, start: 0, end: 100 }
    ],
    series: seriesData,
  };

  return options;
};

export default function PerformanceAnalysisPage() {
  const [isolatedMethod1, setIsolatedMethod1] = useState<string | null>(null);
  const [isolatedMethod10, setIsolatedMethod10] = useState<string | null>(null);

  const chartOption1 = useMemo(
    () => generateStackedTimingChartOption(1, isolatedMethod1),
    [isolatedMethod1]
  );
  const chartOption10 = useMemo(
    () => generateStackedTimingChartOption(10, isolatedMethod10),
    [isolatedMethod10]
  );

  const handleChartClick = (
    params: any,
    currentIsolatedMethod: string | null,
    setIsolatedMethod: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const clickedMethod = params.componentType === 'series' ? params.stack : null;
    if (currentIsolatedMethod !== null) {
      setIsolatedMethod(null);
    } else if (clickedMethod) {
      setIsolatedMethod(clickedMethod);
    }
  };

  const chartElementStyle = { height: '600px', width: '100%' };

  return (
    <div className="p-4 font-sans bg-gray-50 min-h-screen">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12">
          <section className="mb-10 pb-5 border-b border-gray-200">
            <div className="w-full">
              <ReactECharts
                option={chartOption1}
                style={chartElementStyle}
                onEvents={{
                  click: (params) => handleChartClick(params, isolatedMethod1, setIsolatedMethod1)
                }}
              />
            </div>
          </section>
          <section className="mb-10">
            <div className="w-full">
              <ReactECharts
                option={chartOption10}
                style={chartElementStyle}
                onEvents={{
                  click: (params) => handleChartClick(params, isolatedMethod10, setIsolatedMethod10)
                }}
              />
            </div>
          </section>
        </div>
        <div className="w-full lg:w-4/12 lg:pl-6">
          <div className="bg-white rounded-lg shadow-md p-4 lg:sticky lg:top-8">
            <h1 className="text-lg font-bold text-gray-800 mb-4">Browser Event Timeline</h1>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-indigo-700 mb-2">DomContentLoaded</h2>
              <p className="text-sm text-gray-700 mb-2">
                The <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">DomContentLoaded</code> event is fired
                when the initial HTML document has been completely downloaded and parsed.
              </p>
              <div className="pl-2 border-l-4 border-indigo-200 text-xs">
                <p className="text-gray-700 mb-1">Please consider that:</p>
                <div className="mb-2">
                  <p className="font-medium text-gray-800 mb-1">If you have a <code
                    className="bg-gray-100 px-1 rounded text-xs">&lt;script src="test.js"&gt;&lt;/script&gt;</code>:</p>
                  <ol className="list-decimal pl-4 text-gray-700">
                    <li>Browser downloads and parses index.html and test.js</li>
                    <li>Browser parses and evaluates script</li>
                    <li>Browser will fire a <code className="bg-gray-100 px-1 rounded text-xs">DomContentLoaded</code>
                    </li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">If you have a <code
                    className="bg-gray-100 px-1 rounded text-xs">&lt;script src="test.js"
                    async&gt;&lt;/script&gt;</code>:</p>
                  <ol className="list-decimal pl-4 text-gray-700">
                    <li>Browser downloads and parses index.html</li>
                    <li>Browser will fire a <code
                      className="bg-gray-100 px-1 rounded text-xs">DomContentLoaded</code> and in the meanwhile
                      downloads the js
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-base font-semibold text-indigo-700 mb-2">Load</h2>
              <p className="text-sm text-gray-700 mb-1">
                The <code className="bg-gray-100 px-1 rounded text-xs">Load</code> event is fired when the page is fully
                loaded, so when HTML and the BLOCKING resources are downloaded and parsed.
              </p>
              <div className="pl-2 border-l-4 border-indigo-200 text-xs">
                <p className="text-gray-700">The BLOCKING resources are CSS and Javascript. The NOT BLOCKING is async
                  javascript.</p>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-base font-semibold text-indigo-700 mb-2">Finished</h2>
              <p className="text-sm text-gray-700 mb-1">
                The <code className="bg-gray-100 px-1 rounded text-xs">Finished</code> event is fired when HTML +
                BLOCKING + NON BLOCKING resources are downloaded | parsed and all the <code
                className="bg-gray-100 px-1 rounded text-xs">XMLHttpRequest()</code> and <code
                className="bg-gray-100 px-1 rounded text-xs">Promise</code> are completed.
              </p>
              <div className="pl-2 border-l-4 border-indigo-200 text-xs">
                <p className="text-gray-700">In case you have a loop that is checking for updates you'll keep seeing
                  updates to this value.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
