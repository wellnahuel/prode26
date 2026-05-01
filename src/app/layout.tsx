import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Prode Mundial 2026",
  description: "Pronósticos del FIFA World Cup 2026 - Jugá con tus amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-900 text-slate-50 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}