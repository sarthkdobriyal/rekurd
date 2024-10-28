import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { League_Spartan, Poppins } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";


const superchargedLazer = localFont({
  src: "./fonts/SuperchargeLaser.woff2",
  variable: "--font-supercharge-lazer",
});
const helicopta = localFont({
  src: "./fonts/Helicopta-YwXj.ttf",
  variable: "--font-helicopta",
});
const kochire = localFont({
  src: "./fonts/KochireRegular-eZJwl.otf",
  variable: "--font-kochire",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
});
const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});


const APP_NAME = "outsound.";
const APP_DEFAULT_TITLE = "outsound.";
const APP_TITLE_TEMPLATE = "%s | outsound.";
const APP_DESCRIPTION = "The social media app for musicians";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    template: "%s | outsound.",
    default: "outsound.",
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
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${superchargedLazer.variable} ${kochire.variable} ${helicopta.variable} ${poppins.variable}`}>
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
