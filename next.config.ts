/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,

    // Configure webpack for Web Workers if needed
    webpack: (config, { isServer }) => {
        // Fix for "Can't import the named export" error with echarts
        config.resolve.alias = {
            ...config.resolve.alias,
            'echarts/lib/echarts': 'echarts/dist/echarts.min.js',
        };

        return config;
    },

    // Enable correct handling of API routes
    experimental: {
        // Only needed for older Next.js versions
        // Remove this if using Next.js 13.4+
        serverComponentsExternalPackages: [],
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
