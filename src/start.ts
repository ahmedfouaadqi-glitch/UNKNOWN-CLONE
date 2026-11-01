import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { isCountryRestricted } from "@/lib/publishing-rules.mjs";

const csrfMiddleware = createCsrfMiddleware({
  filter: context => context.handlerType === "serverFn"
});

const siteAccessMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  // Only trust these headers behind the corresponding CDN/hosting layer,
  // which must overwrite visitor-supplied values.
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  if (isCountryRestricted(country, process.env.SITE_BLOCKED_COUNTRIES)) {
    return new Response(
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

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, siteAccessMiddleware]
}));
