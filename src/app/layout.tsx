import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_BRAND } from "@/lib/site-content";
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
  metadataBase: new URL(process.env.APP_URL ?? "https://v.bkeel.com"),
  title: {
    default: "跟我练AI编程｜Watson老师带孩子用AI做真实小程序",
    template: "%s｜跟我练AI编程",
  },
  description:
    "前腾讯AI产品专家 Watson 老师设计的青少年 AI 编程项目课，面向9-15岁孩子，8节课从0到1完成微信小程序作品。不只学代码，更学习产品思维、AI协作、隐私责任和项目展示。",
  icons: {
    icon: SITE_BRAND.logo,
    apple: SITE_BRAND.logo,
  },
  openGraph: {
    title: "跟我练AI编程｜Watson老师带孩子用AI做真实小程序",
    description: "用AI和代码，做出真正能用的小程序。",
    images: [{ url: SITE_BRAND.shareImage, width: 1024, height: 1024, alt: "跟我练AI编程课程视觉" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-950">{children}</body>
    </html>
  );
}
