import type {Metadata} from "next";
import Link from "next/link";
import {Geist, Geist_Mono} from "next/font/google";
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
  title: "Image Editor",
  description: "Browse and edit your images with professional tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-scroll flex min-h-screen flex-col`}
      >
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
        <footer className="border-t border-border bg-background">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            Developed by&nbsp;
            <Link
              href="https://oleksiipopov.com"
              className="font-medium text-foreground hover:text-primary focus-visible:underline"
              rel="noopener noreferrer"
            >
              Oleksii Popov
            </Link>
            &nbsp;in 2025
          </div>
        </footer>
      </body>
    </html>
  );
}
