import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const outputMode = process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined;

function imageApiHostname(): string {
  const raw = process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim();
  if (!raw) return "api.origo.kz";
  try {
    const base = raw.replace(/\/$/, "");
    return new URL(base.startsWith("http") ? base : `https://${base}`).hostname;
  } catch {
    return "api.origo.kz";
  }
}

const nextConfig: NextConfig = {
  output: outputMode,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imageApiHostname(),
        pathname: "/**",
      },
      // Laravel storage / Filament uploads (product images)
      {
        protocol: "https",
        hostname: "admin.origo.kz",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
