/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },

    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '**',
        },
    ],

};

export default nextConfig;
