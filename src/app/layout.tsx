import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Project Management Tools",
  description: "Application to manage projects",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}