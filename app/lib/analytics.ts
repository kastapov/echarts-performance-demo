// app/lib/analytics.ts
import { track } from '@vercel/analytics';

/**
 * Track page view with performance data
 */
export function trackPageView(page: string, loadTime: number) {
    track('page_view', {
        page,
        loadTime,
        timestamp: Date.now()
    });
}

/**
 * Track chart render performance
 */
export function trackChartPerformance(
    chartId: string,
    chartType: string,
    approach: 'ssr' | 'server-components' | 'client',
    metrics: {
        renderTime: number;
        dataPoints: number;
        memoryUsage?: number;
    }
) {
    track('chart_render', {
        chartId,
        chartType,
        approach,
        renderTime: metrics.renderTime,
        dataPoints: metrics.dataPoints,
        memoryUsage: metrics.memoryUsage || 0,
        timestamp: Date.now()
    });
}

/**
 * Track chart interaction (zoom, pan, etc.)
 */
export function trackChartInteraction(
    chartId: string,
    interaction: 'zoom' | 'pan' | 'tooltip' | 'dataZoom',
    metrics: {
        responseTime: number;
        fps?: number;
    }
) {
    track('chart_interaction', {
        chartId,
        interaction,
        responseTime: metrics.responseTime,
        fps: metrics.fps || 0,
        timestamp: Date.now()
    });
}

/**
 * Track errors that occur during chart rendering or data loading
 */
export function trackError(
    errorType: 'data_loading' | 'rendering' | 'interaction',
    details: {
        chartId?: string;
        approach?: 'ssr' | 'server-components' | 'client';
        errorMessage: string;
    }
) {
    track('error', {
        errorType,
        ...details,
        timestamp: Date.now()
    });
}

/**
 * Get memory usage estimation
 * Note: This is an approximation and not entirely accurate
 */
export function getMemoryUsage(): number {
    if (typeof performance === 'undefined' || !performance.memory) {
        return 0;
    }

    // @ts-ignore - performance.memory is not in the TypeScript types
    return performance.memory?.usedJSHeapSize / (1024 * 1024); // Convert to MB
}

/**
 * Calculate frames per second
 */
export function calculateFPS(duration: number = 1000): Promise<number> {
    return new Promise((resolve) => {
        let frameCount = 0;
        let startTime = performance.now();

        function countFrame() {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - startTime < duration) {
                requestAnimationFrame(countFrame);
            } else {
                const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
                resolve(fps);
            }
        }

        requestAnimationFrame(countFrame);
    });
}
