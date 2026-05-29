import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(process.env.APP_URL ?? "https://v.bkeel.com"),
    title: {
      default: settings.global.siteTitle,
      template: `%s｜${settings.global.shortName}`,
    },
    description: settings.global.siteDescription,
    icons: {
      icon: settings.global.logo,
      apple: settings.global.logo,
    },
    openGraph: {
      title: settings.global.ogTitle,
      description: settings.global.ogDescription,
      images: [{ url: settings.global.shareImage, width: 1024, height: 1024, alt: settings.global.name }],
    },
  };
}

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
