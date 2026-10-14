import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    reactStrictMode: true,
    agentRules: false,
    images: {
        unoptimized: true
    },
    experimental: {
        memoryBasedWorkersCount: true,
        preloadEntriesOnStart: false
    }
};

export default nextConfig;
