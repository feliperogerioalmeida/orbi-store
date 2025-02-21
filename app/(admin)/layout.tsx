import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthProvider from "../_providers/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import AdmSidebar from "../_components/admSidebar";
import { SidebarInset, SidebarProvider } from "../_components/ui/sidebar";
import { Toaster } from "@/app/_components/ui/toaster";
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

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />

        <link rel="apple" href="/icon-512x512.png" />

        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserProvider>
            <SidebarProvider defaultOpen={true}>
              <AdmSidebar />
              <SidebarInset>
                <div className="flex min-h-screen w-full flex-col">
                  <div className="flex-1 w-full ">{children}</div>
                  <Toaster />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
