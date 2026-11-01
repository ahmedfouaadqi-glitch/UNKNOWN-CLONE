import { createServerFn } from "@tanstack/react-start";
import { getLatestPosts, getPostById as readPostById, getPostsPage } from "@/lib/content";

export const getHomeStories = createServerFn({ method: "GET" })
  .handler(async () => getLatestPosts(6));

export const getPosts = createServerFn({ method: "GET" })
  .validator((input: { page?: number; pageSize?: number; category?: string; query?: string }) => input)
  .handler(async ({ data }) => getPostsPage(data));

export const getPostById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => readPostById(data));
