// app/api/chart-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchLargeDataset } from '../../lib/api';
import { ChartData } from '../../lib/types';

export async function GET(request: NextRequest) {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const chartType = searchParams.get('type') || 'line';
    const dataPointsParam = searchParams.get('count');
    const dataPoints = dataPointsParam ? parseInt(dataPointsParam) : 1000000;

    console.log(`API route called for chart type: ${chartType}, dataPoints: ${dataPoints}`);

    try {
        // Fetch data from the data API
        const chartData = await fetchLargeDataset(chartType, dataPoints);

        // Log data for debugging
        console.log('API route returning data:', {
            xAxisType: chartData.xAxis.type,
            seriesLength: chartData.series.length,
            dataPointsCount: chartData.series[0]?.data?.length || 0,
            samplePoints: chartData.series[0]?.data?.slice(0, 3) || []
        });

        // Return the chart data
        return NextResponse.json(chartData, {
            status: 200
        });
    } catch (error) {
        console.error('Error processing chart data request:', error);

        // Return a safe error response with a fallback empty chart data structure
        const errorResponse: ChartData = {
            xAxis: { type: 'time' },
            yAxis: { type: 'value' },
            series: [{
                type: chartType as 'line' | 'bar' | 'scatter',
                name: 'Error',
                data: []
            }]
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
