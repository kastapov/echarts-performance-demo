/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable React strict mode to prevent double rendering in development
    reactStrictMode: false,

    // Configure webpack for ECharts
    webpack: (config) => {
        // Fix for "Can't import the named export" error with echarts
        config.resolve.alias = {
            ...config.resolve.alias,
            'echarts/lib/echarts': 'echarts/dist/echarts.min.js',
        };

        return config;
    },

    // Set appropriate headers for API calls
    async headers() {
        return [
            {
                // Allow CORS for API routes
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
