import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { clipperQaIsEnabled } from "@/../plugins/clipper-qa/clipperQaEnv";
import { ClipperQA } from "@/../plugins/clipper-qa/ClipperQA";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const clipperQaEnabled = clipperQaIsEnabled();

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
    default: "Test site for ClipperQA",
    template: "%s · site for ClipperQA",
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
        <Navbar brand="SiteName" links={[...navLinks]} />
        <div className="flex flex-1 flex-col">{children}</div>
        {clipperQaEnabled ? <ClipperQA /> : null}
      </body>
    </html>
  );
};

export default RootLayout;
