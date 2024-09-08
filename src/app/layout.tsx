import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { WebSocketProvider } from "./providers/web-socket";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
});

const APP_NAME = "reKurd.";
const APP_DEFAULT_TITLE = "reKurd.";
const APP_TITLE_TEMPLATE = "%s | reKurd.";
const APP_DESCRIPTION = "The social media app for musicians";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    template: "%s | reKurd.",
    default: "reKurd.",
  },
  description: "The social media app for musicians",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ReactQueryProvider>
          
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
