import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
