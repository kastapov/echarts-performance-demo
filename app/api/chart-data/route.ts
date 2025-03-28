// app/api/chart-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchLargeDataset } from '../../lib/api';
import { ApiDataPoints } from '../../lib/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const chartType = searchParams.get('type') || 'scatter';
    const dataPointsParam = searchParams.get('count');
    const dataPoints = dataPointsParam ? parseInt(dataPointsParam) : 1000000;

    console.log(`API route called for chart type: ${chartType}, dataPoints: ${dataPoints}`);

    try {
        const chartData = await fetchLargeDataset(chartType, dataPoints);
        return NextResponse.json(chartData, {
            status: 200
        });
    } catch (error) {
        console.error('Error processing chart data request:', error);
        const errorResponse: ApiDataPoints = {
            type: chartType,
            data: [],
            count: 0
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
