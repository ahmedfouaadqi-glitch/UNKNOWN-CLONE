import { createServerFn } from "@tanstack/react-start";
import { getLatestPosts, getPostById as readPostById, getPostsPage } from "@/lib/content";
import { isPublishingEnabled } from "@/lib/publishing-rules.mjs";

export const getHomeStories = createServerFn({ method: "GET" })
  .handler(async () => getLatestPosts(6));

export const getPosts = createServerFn({ method: "GET" })
  .validator((input: { page?: number; pageSize?: number; category?: string; query?: string }) => input)
  .handler(async ({ data }) => getPostsPage(data));

export const getPostById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => readPostById(data));

export const getFeatureStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const storageReady = Boolean(
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.RATE_LIMIT_SECRET
    );
    return {
      storageReady,
      publishingReady: storageReady && isPublishingEnabled(process.env.PUBLISHING_ENABLED)
    };
  });
