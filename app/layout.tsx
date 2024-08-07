import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import React from "react";
import {auth} from "@/auth";
import { Toaster } from "@/components/ui/sonner"
import AuthSessionProvider from "@/components/AuthSessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Full Auth Next.js",
  description: "Fullstack Next js app with full authentication with AuthJS v5",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth()
  return (
      <AuthSessionProvider session={session}>
            <html lang="en" suppressHydrationWarning>
              <body className={cn(
                  "min-h-screen font-sans antialiased bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                  inter.className
              )}>
              <main className="max-w-5xl h-screen mx-auto p-2">{children}</main>
              </body>
              <Toaster />
            </html>
      </AuthSessionProvider>
  );
}
