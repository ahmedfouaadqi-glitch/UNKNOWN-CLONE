import { NextRequest, NextResponse } from "next/server";
import { isCountryRestricted } from "./lib/publishing-rules.mjs";

/**
 * SITE_BLOCKED_COUNTRIES is reserved for verified, enforceable measures that
 * require the whole site to be unavailable in a defined territory.
 * A publishing-only restriction belongs in PUBLISHING_BLOCKED_COUNTRIES.
 */
export function proxy(request: NextRequest) {
  const countryCode =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  if (!isCountryRestricted(countryCode, process.env.SITE_BLOCKED_COUNTRIES)) {
    return NextResponse.next();
  }

  return new NextResponse(
    "This service is unavailable in this territory in response to an applicable legal restriction.",
    {
      status: 451,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
