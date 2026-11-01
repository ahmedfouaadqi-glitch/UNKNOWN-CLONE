import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {isLocale,copy} from "@/lib/i18n";
import {getPostById} from "@/lib/content";
import {categoryLabel} from "@/lib/categories";
import {Comments} from "@/components/comments";
import {DeleteContent} from "@/components/delete-content";
import {Reactions} from "@/components/reactions";

export const dynamic="force-dynamic";
export const metadata:Metadata={robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{locale:string;id:string}>}){
 const {locale,id}=await params;if(!isLocale(locale))notFound();const post=await getPostById(id);if(!post)notFound();
 const ar=locale==="ar";const t=copy[locale];const date=new Intl.DateTimeFormat(locale,{dateStyle:"long",timeStyle:"short"}).format(new Date(post.published_at));
 return <div className="site-shell"><article className="page-intro" style={{maxWidth:880}}><span className="eyebrow">{categoryLabel(post.category,locale)}</span><h1 className="page-title" style={{fontSize:"clamp(28px,5vw,46px)"}}>{post.title||(ar?"مشاركة دون عنوان":"Untitled story")}</h1><p className="writer-note">{date} · {ar?"مشاركة مجهولة":"Anonymous story"}</p><div className="prose" style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",fontSize:17,paddingBlock:20}}>{post.body}</div><Reactions postId={post.id} locale={locale}/><div className="comment-tools"><Link className="report-link" href={`/${locale}/report?targetType=post&targetId=${post.id}`}>{ar?"الإبلاغ عن المشاركة":"Report story"}</Link><DeleteContent locale={locale} type="post" id={post.id}/></div></article><div style={{maxWidth:850}}><Comments postId={post.id} locale={locale} copy={t}/></div></div>;
}
