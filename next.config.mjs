import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    /*disable: process.env.NODE_ENV === 'development',*/
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    workboxOptions: {
        disableDevLogs: true
    }
})

    ({
        experimental: {
            missingSuspenseWithCSRBailout: false,
        },
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'firebasestorage.googleapis.com',
                    pathname: '**',
                },
            ],
        },
    });

export default nextConfig;
