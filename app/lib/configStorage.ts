// app/lib/configStorage.ts

// Configuration storage keys
const STORAGE_KEYS = {
    CHARTS_COUNT: 'echarts_demo_charts_count',
    DATA_POINTS: 'echarts_demo_data_points',
    RENDERER: 'echarts_demo_renderer'
};

export interface ChartConfiguration {
    chartsCount: number;
    dataPoints: number;
    renderer: string;
}

/**
 * Save configuration to localStorage
 */
export function saveConfiguration(config: ChartConfiguration): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEYS.CHARTS_COUNT, config.chartsCount.toString());
        localStorage.setItem(STORAGE_KEYS.DATA_POINTS, config.dataPoints.toString());
        localStorage.setItem(STORAGE_KEYS.RENDERER, config.renderer);

        console.log('Configuration saved:', config);
    } catch (error) {
        console.error('Error saving configuration to localStorage:', error);
    }
}

/**
 * Load configuration from localStorage
 */
export function loadConfiguration(defaults: ChartConfiguration): ChartConfiguration {
    if (typeof window === 'undefined') return defaults;

    try {
        const chartsCountStr = localStorage.getItem(STORAGE_KEYS.CHARTS_COUNT);
        const dataPointsStr = localStorage.getItem(STORAGE_KEYS.DATA_POINTS);
        const renderer = localStorage.getItem(STORAGE_KEYS.RENDERER);

        const config: ChartConfiguration = {
            chartsCount: chartsCountStr ? parseInt(chartsCountStr) : defaults.chartsCount,
            dataPoints: dataPointsStr ? parseInt(dataPointsStr) : defaults.dataPoints,
            renderer: renderer || defaults.renderer
        };

        console.log('Configuration loaded:', config);
        return config;
    } catch (error) {
        console.error('Error loading configuration from localStorage:', error);
        return defaults;
    }
}

/**
 * Clear configuration from localStorage
 */
export function clearConfiguration(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEYS.CHARTS_COUNT);
        localStorage.removeItem(STORAGE_KEYS.DATA_POINTS);
        localStorage.removeItem(STORAGE_KEYS.RENDERER);

        console.log('Configuration cleared');
    } catch (error) {
        console.error('Error clearing configuration from localStorage:', error);
    }
}
