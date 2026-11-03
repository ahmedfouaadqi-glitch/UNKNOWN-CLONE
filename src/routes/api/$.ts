import { createFileRoute } from "@tanstack/react-router";

async function dispatch(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  // Load legacy handler modules only inside the server request boundary.
  // Static imports here leaked server-only dependencies into the client SSR graph.
  if (pathname === "/api/admin/session" && method === "GET") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminSession(request);
  }
  if (pathname === "/api/admin/auth/start" && method === "POST") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminAuthStart(request);
  }
  if (pathname === "/api/admin/auth/callback" && method === "GET") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminAuthCallback(request);
  }
  if (pathname === "/api/admin/logout" && method === "POST") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminLogout(request);
  }
  if (pathname === "/api/admin/mfa/setup" && method === "POST") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminMfaSetup(request);
  }
  if (pathname === "/api/admin/mfa/verify" && method === "POST") {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminMfaVerify(request);
  }
  if (pathname === "/api/admin/queue" && (method === "GET" || method === "POST")) {
    const admin = await import("@/lib/admin-api.server");
    return admin.adminQueue(request);
  }

  if (pathname === "/api/posts") {
    const posts = await import("@/app/api/posts/route");
    if (method === "GET") return posts.GET(request);
    if (method === "POST") return posts.POST(request);
  }

  const interaction = pathname.match(/^\/api\/posts\/([0-9a-f-]{36})\/(comments|reactions)$/i);
  if (interaction) {
    const [, id, kind] = interaction;
    const context = { params: Promise.resolve({ id }) };
    if (kind === "comments") {
      const comments = await import("@/app/api/posts/[id]/comments/route");
      if (method === "GET") return comments.GET(request, context);
      if (method === "POST") return comments.POST(request, context);
    }
    if (kind === "reactions") {
      const reactions = await import("@/app/api/posts/[id]/reactions/route");
      if (method === "GET") return reactions.GET(request, context);
      if (method === "POST") return reactions.POST(request, context);
    }
  }

  if (pathname === "/api/reports" && method === "POST") {
    const reports = await import("@/app/api/reports/route");
    return reports.POST(request);
  }
  if (pathname === "/api/delete" && method === "POST") {
    const deletion = await import("@/app/api/delete/route");
    return deletion.POST(request);
  }
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
