import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
// import AuthProvider from "../_providers/auth";
import LandingPageNav from "../_components/landingPageNav";
import Footer from "../_components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbi Store",
  description: "Loja de produtos Apple em Salvador",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-512x512.png",
  },
  openGraph: {
    title: "Orbi Store",
    description:
      "Os melhores iPhones e acessórios premium com atendimento de qualidade!",
    siteName: "Orbi Store",
    images: [
      {
        url: "/icon-512x512.png",
        width: 1200,
        height: 630,
        alt: "Orbi Store - Loja de produtos Apple",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />

        <link rel="apple" href="/icon-512x512.png" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-full flex-col">
          {/* <AuthProvider> */}
          <div className="fixed z-10">
            <LandingPageNav />
          </div>

          <div className="flex-1 ">{children}</div>
          <Footer />
          {/* </AuthProvider> */}
        </div>
      </body>
    </html>
  );
}
