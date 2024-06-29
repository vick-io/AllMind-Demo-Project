// src/app/layout.tsx

import React from "react";
import "./globals.css";

export const metadata = {
  title: "Stock Sentiment Analyzer",
  description: "Analyze sentiment of stock-related news articles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
