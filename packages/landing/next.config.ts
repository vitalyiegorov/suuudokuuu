import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    reactStrictMode: true,
    agentRules: false,
    images: {
        unoptimized: true
    },
    experimental: {
        globalNotFound: true,
        memoryBasedWorkersCount: true,
        preloadEntriesOnStart: false,
        swcPlugins: [['@lingui/swc-plugin', {}]]
    }
};

export default nextConfig;
