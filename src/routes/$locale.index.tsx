import { createFileRoute } from "@tanstack/react-router";
import { getFeatureStatus, getHomeStories } from "@/src/lib/server-data";
import { HomePage } from "@/src/components/pages";

export const Route = createFileRoute("/$locale/")({
  loader: async () => ({ posts: await getHomeStories(), features: await getFeatureStatus() }),
  component: HomeRoute
});

function HomeRoute() {
  const { locale } = Route.useParams();
  const { posts, features } = Route.useLoaderData();
  return <HomePage locale={locale === "ar" ? "ar" : "en"} posts={posts} publishingReady={features.publishingReady} />;
}
