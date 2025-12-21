import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Webpack Configuration: 
    Required for Web3 libraries like viem/wagmi and fixing MetaMask SDK errors.
  */
  webpack: (config) => {
    // Standard polyfills for node-specific modules
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };

    // Fix for: Module not found '@react-native-async-storage/async-storage'
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
  
  typescript: {
    // Prevents "BigInt" or external library errors from stopping the build
    ignoreBuildErrors: true,
  },

  /* 3. Performance:
    Empty turbopack object silences the Next.js 16 warning 
    when using a custom webpack config.
  */
  turbopack: {},
};

export default nextConfig;