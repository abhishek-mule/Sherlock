/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow CSV files to be served as static assets
  webpack(config) {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
      },
    });
    return config;
  },
  // Ensure data directory is included in the build
  output: 'standalone',
  outputFileTracing: true,
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-arm64-gnu',
        'node_modules/@swc/core-linux-arm64-musl',
        'node_modules/@esbuild/android-*',
        'node_modules/@esbuild/darwin-*',
        'node_modules/@esbuild/freebsd-*',
        'node_modules/@esbuild/openbsd-*',
        'node_modules/@esbuild/sunos-*',
        'node_modules/@esbuild/linux-*',
        'node_modules/@esbuild/win32-*',
      ],
    },
    outputFileTracingIncludes: {
      '/': ['data/**/*'],
    },
  },
  images: {
    domains: ['ideogram.ai']
  }
};

module.exports = nextConfig;