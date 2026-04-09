import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClipperQA } from "@/components/clipper-qa/ClipperQA";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
] as const;

export const metadata: Metadata = {
  title: {
    default: "ClipperQA",
    template: "%s · ClipperQA",
  },
  description: "Modern web experience built with Next.js",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Navbar brand="ClipperQA" links={[...navLinks]} />
        <div className="flex flex-1 flex-col">{children}</div>
        <ClipperQA />
      </body>
    </html>
  );
};

export default RootLayout;
