import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientProvider } from "@/shared/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "캐디북 관리자",
    template: "%s | 캐디북 관리자",
  },
  description:
    "골프장 운영을 위한 종합 관리 시스템 - 캐디, 필드, 카트, 근무 스케줄을 효율적으로 관리하세요",
  keywords: [
    "골프장 관리",
    "캐디 관리",
    "필드 관리",
    "카트 관리",
    "근무 스케줄",
    "골프장 운영",
  ],
  authors: [{ name: "J-Caddie" }],
  creator: "J-Caddie",
  publisher: "J-Caddie",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "캐디북 관리자",
    description: "골프장 운영을 위한 종합 관리 시스템",
    siteName: "캐디북 관리자",
  },
  twitter: {
    card: "summary",
    title: "캐디북 관리자",
    description: "골프장 운영을 위한 종합 관리 시스템",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
