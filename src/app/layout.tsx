import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/icons/circle_black.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
