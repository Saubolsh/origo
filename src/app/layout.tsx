import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/shared/styles";

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
  console.log("RootLayout");
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
