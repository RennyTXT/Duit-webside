import type { Metadata, Viewport } from "next";
import { Outfit, Anuphan } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from 'sonner';
import MainLayout from "@/components/MainLayout";
import AuraCursor from "@/components/AuraCursor";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const anuphan = Anuphan({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-anuphan',
  display: 'swap',
});

const greycliff = localFont({
  src: [
    {
      path: "../../public/fonts/GreycliffCF-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GreycliffCF-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GreycliffCF-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GreycliffCF-Heavy.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-greycliff",
});

export const metadata: Metadata = {
  title: "DUIT TH | Designed for Better Living",
  description: "Experience the latest evolution of the Duit design language. Precision-crafted pet products and lifestyle furniture from South Korea.",
  keywords: ["pet furniture", "smart pet products", "korean design", "duit th", "luxury pet care"],
  authors: [{ name: "Duit TH" }],
  openGraph: {
    title: "DUIT TH",
    description: "Designed for Better Living",
    url: "https://RennyTXT.github.io/Duit-webside",
    siteName: "Duit TH Thailand",
    locale: "th_TH",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${greycliff.variable} ${outfit.variable} ${anuphan.variable} antialiased`}>
      <body className="bg-white text-black min-h-screen flex flex-col font-sans selection:bg-black selection:text-white overflow-x-hidden">
        <div className="grain-overlay" />
        <Toaster position="top-center" richColors />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
