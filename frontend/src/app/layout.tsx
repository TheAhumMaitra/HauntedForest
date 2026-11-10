import Footer from "@/components/Footer";
import HauntedBackground from "@/components/HauntedBackground";
import MonsterEncounter from "@/components/MonsterEncounter";
import HorrorDisclaimer from "@/components/HorrorDisclaimer";
import Navbar from "@/components/NavBar";
// import Snowfall from "@/components/SnowFall";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const loraHeading = Lora({subsets:['latin'],variable:'--font-heading'});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    <html lang="en" suppressHydrationWarning className={cn("font-mono overflow-x-hidden max-w-full", jetbrainsMono.variable, loraHeading.variable)}>
      <meta
        name="google-site-verification"
        content="EWlKxxDPAR_i9xq6LDfUAOl78DTclgQgl8Y_CJaX494"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased overflow-x-hidden w-full max-w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <HauntedBackground />
          <MonsterEncounter />
          <HorrorDisclaimer />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
