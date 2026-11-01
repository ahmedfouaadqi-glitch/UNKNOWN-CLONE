import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState
} from "@tanstack/react-router";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "UNKNOWN — غير معروف" },
      { name: "description", content: "A global space for anonymous written expression. Say what you feel. Stay unnamed." },
      { name: "theme-color", content: "#ffffff" }
    ],
    links: [
      { rel: "icon", href: "/brand/unknown-favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.webmanifest" }
    ]
  }),
  component: RootComponent
});

function RootComponent() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  return <RootDocument locale={locale}><Outlet /></RootDocument>;
}

function RootDocument({ children, locale }: Readonly<{ children: ReactNode; locale: "ar" | "en" }>) {
  return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <head><HeadContent /></head>
    <body>{children}<Scripts /></body>
  </html>;
}
