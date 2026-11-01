"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
type Reaction = "care" | "not-alone" | "wish-well";
export function Reactions({ postId, locale }: { postId: string; locale: Locale }) {
  const ar = locale === "ar";
  const [counts,setCounts] = useState<Record<string,number>>({});
  const [busy,setBusy] = useState(false);
  async function refresh(){const r=await fetch(`/api/posts/${postId}/reactions`,{cache:"no-store"});if(r.ok){const d=await r.json();setCounts(d.counts||{});}}
  useEffect(()=>{void refresh().catch(()=>undefined);},[postId]);
  async function react(type:Reaction){
    setBusy(true);
    try{
      let token=sessionStorage.getItem("unknown_reaction_session");
      if(!token){token=Array.from(crypto.getRandomValues(new Uint8Array(24))).map(v=>v.toString(16).padStart(2,"0")).join("");sessionStorage.setItem("unknown_reaction_session",token);}
      const r=await fetch(`/api/posts/${postId}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reaction:type,visitorToken:token})});
      if(r.ok) await refresh();
    } finally {setBusy(false);}
  }
  const labels:Record<Reaction,string>={care:ar?"أحس بيك":"I hear you","not-alone":ar?"لست وحدك":"You are not alone","wish-well":ar?"أتمنى لك الخير":"Wishing you well"};
  return <div className="post-actions" aria-label={ar?"التفاعلات":"Reactions"}>{(["care","not-alone","wish-well"] as Reaction[]).map(type=><button className="reaction-button" key={type} type="button" disabled={busy} onClick={()=>void react(type)}>{labels[type]} <span>{counts[type]||0}</span></button>)}</div>;
}
