// app/analytics/page.tsx
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export const metadata = {
    title: 'Performance Analytics - ECharts Demo',
    description: 'Performance analytics for different data loading approaches',
};

export default function AnalyticsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
            <p className="text-gray-500 mb-6">
                Real-time performance metrics for different data loading approaches with 1M datapoints
            </p>

            <AnalyticsDashboard />
        </div>
    );
}
