import { createFileRoute } from "@tanstack/react-router";
import * as posts from "@/app/api/posts/route";
import * as comments from "@/app/api/posts/[id]/comments/route";
import * as reactions from "@/app/api/posts/[id]/reactions/route";
import * as reports from "@/app/api/reports/route";
import * as deletion from "@/app/api/delete/route";

async function dispatch(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  if (pathname === "/api/posts") {
    if (method === "GET") return posts.GET(request);
    if (method === "POST") return posts.POST(request);
  }

  const interaction = pathname.match(/^\/api\/posts\/([0-9a-f-]{36})\/(comments|reactions)$/i);
  if (interaction) {
    const [, id, kind] = interaction;
    const context = { params: Promise.resolve({ id }) };
    if (kind === "comments") {
      if (method === "GET") return comments.GET(request, context);
      if (method === "POST") return comments.POST(request, context);
    }
    if (kind === "reactions") {
      if (method === "GET") return reactions.GET(request, context);
      if (method === "POST") return reactions.POST(request, context);
    }
  }

  if (pathname === "/api/reports" && method === "POST") return reports.POST(request);
  if (pathname === "/api/delete" && method === "POST") return deletion.POST(request);
  return Response.json({ error: "API route not found." }, { status: 404 });
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: ({ request }) => dispatch(request),
      POST: ({ request }) => dispatch(request)
    }
  }
});
