import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Aegis",
  description: "Build without the hassle",
  icons: [{ rel: "icon", url: "/loco.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable}`}>
    <body className={`${GeistSans.variable} antialiased`}>
    <TRPCReactProvider>{children}</TRPCReactProvider>
    </body>
      </html>
    </ClerkProvider>
  );
}
