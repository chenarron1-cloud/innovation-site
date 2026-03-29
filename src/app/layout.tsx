import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "創新先生 Mr. Innovation — AI 創新思維實戰平台",
    template: "%s — 創新先生",
  },
  description:
    "這不是教你怎麼問 AI 的網站，而是教你怎麼用創新思維，讓 AI 幫你做出更有差異化成果的網站。",
  keywords: ["AI", "創新思維", "人工智慧", "職場", "創業"],
  authors: [{ name: "陳建銘" }],
  creator: "創新先生",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "創新先生",
    title: "創新先生 — AI 創新思維實戰平台",
    description: "用創新思維結合 AI，幫助使用者做出不普通的成果。",
  },
  twitter: {
    card: "summary_large_image",
    title: "創新先生 — AI 創新思維實戰平台",
    description: "用創新思維結合 AI，幫助使用者做出不普通的成果。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
