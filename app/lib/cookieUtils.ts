// app/lib/cookieUtils.ts

// Cookie names
const COOKIE_CHART_COUNT = 'echarts_demo_chart_count';
const COOKIE_DATA_POINTS = 'echarts_demo_data_points';
const COOKIE_RENDERER = 'echarts_demo_renderer';

/**
 * Set a cookie with the given name and value
 */
export function setCookie(name: string, value: string, days: number = 30) {
    try {
        if (typeof window === 'undefined') return; // Skip on server-side

        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
        console.log(`Cookie set: ${name}=${value}`);
    } catch (error) {
        console.error(`Error setting cookie ${name}:`, error);
    }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
    try {
        if (typeof window === 'undefined') return null; // Skip on server-side

        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                const encodedValue = c.substring(nameEQ.length, c.length);
                return decodeURIComponent(encodedValue);
            }
        }
        return null;
    } catch (error) {
        console.error(`Error getting cookie ${name}:`, error);
        return null;
    }
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string) {
    try {
        if (typeof window === 'undefined') return; // Skip on server-side

        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log(`Cookie deleted: ${name}`);
    } catch (error) {
        console.error(`Error deleting cookie ${name}:`, error);
    }
}

/**
 * Save chart configuration to cookies
 */
export function saveChartConfig(chartsCount: number, dataPoints: number, renderer: string) {
    try {
        if (typeof window === 'undefined') return; // Skip on server-side

        setCookie(COOKIE_CHART_COUNT, chartsCount.toString());
        setCookie(COOKIE_DATA_POINTS, dataPoints.toString());
        setCookie(COOKIE_RENDERER, renderer);
        console.log('Saved chart config to cookies:', { chartsCount, dataPoints, renderer });
    } catch (error) {
        console.error('Error saving chart config to cookies:', error);
    }
}

/**
 * Load chart configuration from cookies
 */
export function loadChartConfig() {
    try {
        if (typeof window === 'undefined') {
            return {}; // Return empty object on server-side
        }

        const chartCount = getCookie(COOKIE_CHART_COUNT);
        const dataPoints = getCookie(COOKIE_DATA_POINTS);
        const renderer = getCookie(COOKIE_RENDERER);

        const result = {
            chartsCount: chartCount ? parseInt(chartCount) : undefined,
            dataPoints: dataPoints ? parseInt(dataPoints) : undefined,
            renderer: renderer || undefined
        };

        console.log('Loaded chart config from cookies:', result);
        return result;
    } catch (error) {
        console.error('Error loading chart config from cookies:', error);
        return {};
    }
}

/**
 * Check if running in browser
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}
