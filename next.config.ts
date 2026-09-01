import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
    turbopackServerFastRefresh: false,
  },
}
export default nextConfig
