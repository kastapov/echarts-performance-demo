// app/lib/api.ts
import axios from 'axios';
import { ApiDataPoints } from "@/app/lib/types";

/**
 * Fetches dataset from the data API
 */
export async function fetchLargeDataset(chartType: string, dataPoints: number = 1000000): Promise<ApiDataPoints> {
  try {
    const uniqueParam = `&timestamp=${new Date().getTime()}`;
    const url = `${process.env.NEXT_PUBLIC_DATA_API_URL}/api/data/1m?type=${chartType}&count=${dataPoints}${uniqueParam}`;
    console.log(`Fetching data from ${url}`);
    const response = await axios.get(url);
    console.log(`Received ${response.data.length} points`);
    console.log(response.data.length);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${chartType} chart:`, error);
    // Return empty chart data on error
    return {
      type: chartType,
      data: [],
      count: 0
    }
  }
}
