
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "../app/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskJourney | Your Tasks, Gamified",
  description: "TaskJourney: Your ultimate personal productivity assistant. Manage tasks, track goals, and achieve more with our intuitive and powerful platform.",
  manifest: '/manifest.json',
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
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
