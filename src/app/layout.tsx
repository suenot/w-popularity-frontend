import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "w_popularity",
  description: "Audience growth across your social channels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
