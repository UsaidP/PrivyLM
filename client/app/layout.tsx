import type { Metadata } from "next";
import { ClerkProvider, } from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/ui/themes'
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PDF Research Assistant",
  description: "AI-powered PDF research tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "font-sans")} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider appearance={{
          theme: dark,
          signIn: { theme: neobrutalism },
        }}>
          {children}
        </ClerkProvider>
      </body>
    </html >
  );
}