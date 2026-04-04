import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const outputMode = process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined;

const nextConfig: NextConfig = {
  output: outputMode,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
