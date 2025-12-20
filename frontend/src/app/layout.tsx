import Footer from "@/components/Footer";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/NavBar";
import Snowfall from "@/components/SnowFall";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Ahum Maitra | Website - Haunted Forest | Home page",
  description: "Ahum Maitra's official website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <meta name="google-site-verification" content="EWlKxxDPAR_i9xq6LDfUAOl78DTclgQgl8Y_CJaX494" />
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="pointer-events-none fixed inset-0 -z-10">
              <LightRays
                raysOrigin="top-center"
                raysColor="#00ffff"
                raysSpeed={3.5}
                lightSpread={0.8}
                rayLength={10}
                followMouse={false}
                mouseInfluence={0.1}
                noiseAmount={0.1}
                distortion={0.05}
              />
            </div>
            <Snowfall />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
