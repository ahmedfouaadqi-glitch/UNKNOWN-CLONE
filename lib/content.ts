import type { Locale } from "@/lib/i18n";
import { parseSearchTerm } from "@/lib/search.mjs";
export { categories, categoryLabel } from "@/lib/categories";
export type { CategoryId } from "@/lib/categories";
export type PublicPost={id:string;title:string|null;body:string;category:string;language:string;published_at:string;reaction_count?:number;comment_count?:number};

export async function getLatestPosts(limit=6,category?:string):Promise<PublicPost[]>{
 const {getSupabaseAdmin}=await import("@/lib/supabase-admin");
 const supabase=getSupabaseAdmin();if(!supabase)return [];
 let query=supabase.from("posts").select("id,title,body,category,language,published_at").eq("status","published").order("published_at",{ascending:false}).limit(limit);
 if(category)query=query.eq("category",category);
 const {data,error}=await query;if(error||!data)return [];
 return data as PublicPost[];
}
export async function getPostById(id:string):Promise<PublicPost|null>{
 if(!/^[0-9a-f-]{36}$/i.test(id))return null;
 const {getSupabaseAdmin}=await import("@/lib/supabase-admin");
 const supabase=getSupabaseAdmin();if(!supabase)return null;
 const {data,error}=await supabase.from("posts").select("id,title,body,category,language,published_at").eq("id",id).eq("status","published").maybeSingle();
 if(error||!data)return null;return data as PublicPost;
}


export type PostsPageResult = {
  posts: PublicPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  invalidQuery?: boolean;
};

/**
 * Paginated public feed/search query. Search input is restricted to Unicode
 * letters, numbers and spaces before it is used in a PostgREST filter.
 */
export async function getPostsPage(options: {
  page?: number;
  pageSize?: number;
  category?: string;
  query?: string;
} = {}): Promise<PostsPageResult> {
  const page = Number.isFinite(options.page) ? Math.min(Math.max(Math.floor(options.page || 1), 1), 1000) : 1;
  const pageSize = Number.isFinite(options.pageSize) ? Math.min(Math.max(Math.floor(options.pageSize || 12), 1), 40) : 12;
  const parsedSearch = parseSearchTerm(options.query);
  const searchTerm = parsedSearch.term;
  const empty = { posts: [] as PublicPost[], total: 0, page, pageSize, totalPages: 0 };
  if (!parsedSearch.valid) return { ...empty, invalidQuery: true };

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty;

  let queryBuilder = supabase.from("posts")
    .select("id,title,body,category,language,published_at", { count: "exact" })
    .eq("status", "published");
  if (options.category) queryBuilder = queryBuilder.eq("category", options.category);
  if (searchTerm) {
    const pattern = `%${searchTerm}%`;
    queryBuilder = queryBuilder.or(`title.ilike.${pattern},body.ilike.${pattern}`);
  }
  const from = (page - 1) * pageSize;
  const { data, error, count } = await queryBuilder
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error || !data) return empty;
  const total = count || 0;
  return { posts: data as PublicPost[], total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
