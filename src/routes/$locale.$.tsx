import { createFileRoute } from "@tanstack/react-router";
import { getFeatureStatus, getPostById, getPosts } from "@/src/lib/server-data";
import { ContentPageWithInteractions } from "@/src/components/content-page-with-interactions";

export const Route = createFileRoute("/$locale/$")({
  loader: async ({ params, location }) => {
    const path = params._splat || "";
    const parts = path.split("/").filter(Boolean);
    const queryParams = new URLSearchParams(location.searchStr);
    const requestedPage = Number(queryParams.get("page") || "1");
    const page = Number.isFinite(requestedPage) ? Math.min(Math.max(Math.floor(requestedPage), 1), 1000) : 1;
    const features = await getFeatureStatus();
    const targetType: "comment" | "post" = queryParams.get("targetType") === "comment" ? "comment" : "post";
    const targetId = queryParams.get("targetId") || "";

    if (parts[0] === "p" && parts[1]) {
      return { path, post: await getPostById({ data: parts[1] }), posts: null, query: "", features, targetType, targetId };
    }
    if (parts[0] === "latest") {
      return { path, post: null, posts: await getPosts({ data: { page, pageSize: 12 } }), query: "", features, targetType, targetId };
    }
    if (parts[0] === "categories" && parts[1]) {
      return { path, post: null, posts: await getPosts({ data: { page, pageSize: 12, category: parts[1] } }), query: "", features, targetType, targetId };
    }
    if (parts[0] === "search") {
      const query = queryParams.get("q") || "";
      return { path, post: null, posts: query.trim() ? await getPosts({ data: { page, pageSize: 12, query } }) : null, query, features, targetType, targetId };
    }
    return { path, post: null, posts: null, query: "", features, targetType, targetId };
  },
  component: ContentRoute
});

function ContentRoute() {
  const { locale } = Route.useParams();
  const data = Route.useLoaderData();
  return <ContentPageWithInteractions locale={locale === "ar" ? "ar" : "en"} {...data} />;
}
