/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt tự động generate AGENTS.md để tránh trigger Turbopack file-watcher loop
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
