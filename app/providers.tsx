'use client';

import { Analytics } from '@vercel/analytics/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from './lib/analytics';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track page views with timing
    useEffect(() => {
        if (pathname) {
            const startTime = performance.now();

            // Use requestIdleCallback to measure after page has rendered
            // and browser is idle
            const trackTiming = () => {
                const loadTime = performance.now() - startTime;
                trackPageView(pathname, loadTime);
            };

            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(trackTiming);
            } else {
                // Fallback for browsers that don't support requestIdleCallback
                setTimeout(trackTiming, 500);
            }
        }
    }, [pathname, searchParams]);

    return (
        <>
            {children}
            <Analytics />
        </>
    );
}
