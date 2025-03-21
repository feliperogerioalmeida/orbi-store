import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthProvider from "../_providers/auth";
import LandingPageNav from "../_components/landingPageNav";
import Footer from "../_components/footer";
import { Toaster } from "../_components/ui/toaster";
import { UserProvider } from "../_providers/user";

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

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orbistore.com.br/" />
        <meta property="og:site_name" content="Orbi Store" />
        <meta property="og:title" content="Orbi Store" />

        <meta property="fb:app_id" content="951395522636668" />
        <meta
          property="og:description"
          content="Os melhores iPhones e acessórios premium com atendimento de qualidade!"
        />
        <meta
          property="og:image"
          content="https://orbistore.com.br/icon-512x512.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-full flex-col">
          <AuthProvider>
            <UserProvider>
              <div className="fixed z-30 w-full">
                <LandingPageNav />
              </div>
              <div className="flex min-h-screen h-auto w-full flex-col">
                <div className="flex-1 w-full mt-auto ">{children}</div>
                <Toaster />
                <Footer />
              </div>
            </UserProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
