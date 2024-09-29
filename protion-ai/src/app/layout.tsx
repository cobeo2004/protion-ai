import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Protion AI",
  description: "Protion AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
              <Analytics />
            </div>
          </div>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
