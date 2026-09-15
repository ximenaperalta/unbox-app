import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNBOX",
  description:
    "UNBOX designs the moment your customer opens the box — an AI unboxing-experience tool for e-commerce brands and subscription box creators.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this is the root layout, so it applies site-wide, not per-page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Jost:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
