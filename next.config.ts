import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edu-vod-1251741609.cos.ap-guangzhou.myqcloud.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "watsontest-1251741609.cos.ap-guangzhou.myqcloud.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
