import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./accessibility.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "UNKNOWN — غير معروف", template: "%s | UNKNOWN" },
  description: "A global space for anonymous expression. Say what you feel. Stay unnamed.",
  applicationName: "UNKNOWN",
  alternates: { languages: { ar: "/ar", en: "/en" } },
  icons: {
    icon: [{ url: "/brand/unknown-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/unknown-favicon.svg"
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
