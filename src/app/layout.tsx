// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./contexts/AuthContext";
import ReactQueryProvider from "../app/contexts/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TaskJourney | Your Tasks, Gamified",
    template: "%s | TaskJourney",
  },
  description: "TaskJourney: Your ultimate personal productivity assistant. Manage tasks, track goals, and achieve more with our intuitive and powerful platform.",
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TaskJourney | Your Tasks, Gamified",
    description: "TaskJourney: Your ultimate personal productivity assistant. Manage tasks, track goals, and achieve more with our intuitive and powerful platform.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: 'TaskJourney',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/ogimg.png`,
        width: 1279,
        height: 578,
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/apple-touch-icon.png" />
      <meta name="google-site-verification" content="HPRsI9jClQ_G3uLgK3lB-hELlLxJA-UB3DURj2_dTck" />

      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
