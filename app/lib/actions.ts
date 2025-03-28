'use server';

// app/lib/actions.ts
import { fetchLargeDataset } from "@/app/lib/api";
import { ApiDataPoints } from "@/app/lib/types";

export async function getChartData(chartType: string, dataPoints: number = 1000000): Promise<ApiDataPoints> {
  try {
    const data = await fetchLargeDataset(chartType, dataPoints);
    return data;
  } catch (error) {
    console.error('Error in server action:', error);
    // Return empty data structure on error
    return {
      type: chartType,
      count: 0,
      data: []
    };
  }
}
