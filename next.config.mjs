/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb'
    }
  },
  // Configuración para aumentar límites de archivos
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    
    // Aumentar límite de tamaño para archivos
    config.performance = {
      ...config.performance,
      maxAssetSize: 150 * 1024 * 1024, // 150MB
      maxEntrypointSize: 150 * 1024 * 1024, // 150MB
    };
    
    return config;
  },
  // Configuración adicional para archivos grandes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  // Configuración para el servidor de desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
  })
};

export default withPWA({
  dest: 'public',
  disable: true,
  register: false,
  skipWaiting: true,
})(nextConfig);
