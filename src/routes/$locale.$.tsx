import { createFileRoute } from "@tanstack/react-router";
import { getPostById, getPosts } from "@/src/lib/server-data";
import { ContentPage } from "@/src/components/pages";

export const Route = createFileRoute("/$locale/$")({
  loader: async ({ params, location }) => {
    const path = params._splat || "";
    const parts = path.split("/").filter(Boolean);
    const queryParams = new URLSearchParams(location.searchStr);
    const requestedPage = Number(queryParams.get("page") || "1");
    const page = Number.isFinite(requestedPage) ? Math.min(Math.max(Math.floor(requestedPage), 1), 1000) : 1;

    if (parts[0] === "p" && parts[1]) {
      return { path, post: await getPostById({ data: parts[1] }), posts: null, query: "" };
    }
    if (parts[0] === "latest") {
      return { path, post: null, posts: await getPosts({ data: { page, pageSize: 20 } }), query: "" };
    }
    if (parts[0] === "categories" && parts[1]) {
      return { path, post: null, posts: await getPosts({ data: { page, pageSize: 20, category: parts[1] } }), query: "" };
    }
    if (parts[0] === "search") {
      const query = queryParams.get("q") || "";
      return { path, post: null, posts: query.trim() ? await getPosts({ data: { page, pageSize: 20, query } }) : null, query };
    }
    return { path, post: null, posts: null, query: "" };
  },
  component: ContentRoute
});

function ContentRoute() {
  const { locale } = Route.useParams();
  const data = Route.useLoaderData();
  return <ContentPage locale={locale === "ar" ? "ar" : "en"} {...data} />;
}
