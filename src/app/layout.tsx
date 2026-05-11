import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/shared/styles";
import Script from 'next/script'

export const metadata: Metadata = {
  icons: {
    icon: "/icons/circle_black.png",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout");
  return (
    <html lang="en">
      <body>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
        </Script>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
