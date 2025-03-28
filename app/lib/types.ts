// app/lib/types.ts

export interface ApiDataPoints {
  type: string;
  count: number;
  data: [number, number][];
}
