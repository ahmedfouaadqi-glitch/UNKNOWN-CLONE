"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {Locale,Copy} from "@/lib/i18n";
import {DeleteContent} from "@/components/delete-content";
type CommentItem={id:string;body:string;created_at:string};
export function Comments({postId,locale,copy}:{postId:string;locale:Locale;copy:Copy}){
 const [items,setItems]=useState<CommentItem[]>([]);const [body,setBody]=useState("");const [accepted,setAccepted]=useState(false);
 const [adult,setAdult]=useState(false);const [status,setStatus]=useState("");const [busy,setBusy]=useState(false);const [deletionToken,setDeletionToken]=useState("");
 const ar=locale==="ar";
 async function refresh(){try{const r=await fetch(`/api/posts/${postId}/comments`,{cache:"no-store"});if(r.ok){const d=await r.json();setItems(d.comments||[]);}}catch{/* leave comments unavailable without breaking page */}}
 useEffect(()=>{void refresh();},[postId]);
 async function submit(event:React.FormEvent){
  event.preventDefault();if(!body.trim()||!accepted||!adult)return;setBusy(true);setStatus("");
  try{
   const r=await fetch(`/api/posts/${postId}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body,accepted,adult,language:locale})});
   const d=await r.json();if(!r.ok)throw new Error(d.error||(ar?"تعذر إرسال التعليق.":"The response could not be sent."));
   setBody("");setAccepted(false);setAdult(false);if(d.deletionToken)setDeletionToken(d.deletionToken);
   setStatus(d.status==="pending_review"?(ar?"تم استلام التعليق وهو بانتظار الفحص.":"Your response is awaiting review."):(ar?"تم نشر تعليقك.":"Your response was published."));
   await refresh();
  }catch(error){setStatus(error instanceof Error?error.message:copy.genericError);}finally{setBusy(false);}
 }
 return <section className="section"><h2 className="section-title">{copy.commentsTitle}</h2>
  <div className="comments-list">{items.length===0?<div className="empty-state">{copy.noComments}</div>:items.map(item=><article className="comment-card" key={item.id}><div className="comment-label">{ar?"مشاركة من غير معروف":"Anonymous response"}</div><p className="comment-body">{item.body}</p><div className="comment-tools"><Link className="report-link" href={`/${locale}/report?targetType=comment&targetId=${item.id}`}>{ar?"الإبلاغ عن التعليق":"Report response"}</Link><DeleteContent locale={locale} type="comment" id={item.id} compact/></div></article>)}</div>
  <form className="writer-panel" onSubmit={submit}><h3 className="writer-label">{copy.commentTitle}</h3>
   <textarea className="text-area" value={body} onChange={e=>setBody(e.target.value)} maxLength={1500} placeholder={copy.commentPlaceholder} required minLength={2}/>
   <div className="consent-stack" style={{marginTop:14}}>
    <label className="check-row"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>{ar?"أوافق على قواعد التعليقات وسياسة الخصوصية.":"I agree to the comment rules and privacy notice."} <Link href={`/${locale}/community`}>{ar?"قواعد المجتمع":"Community rules"}</Link></span></label>
    <label className="check-row"><input type="checkbox" checked={adult} onChange={e=>setAdult(e.target.checked)}/><span>{ar?"أؤكد أن عمري 18 عاماً على الأقل.":"I confirm that I am at least 18."}</span></label>
   </div>
   <div className="form-footer"><span className="writer-note">{ar?"التعليقات تمر بالفحص قبل ظهورها.":"Responses are checked before publication."}</span><button className="primary-button" disabled={busy||!body.trim()||!accepted||!adult}>{busy?copy.publishing:copy.commentSubmit}</button></div>
   {status&&<p className="form-message" role="status">{status}</p>}
   {deletionToken&&<div className="notice-box"><strong>{ar?"رمز حذف تعليقك، احتفظ به الآن:":"Save your comment deletion code now:"}</strong><p style={{overflowWrap:"anywhere",fontFamily:"monospace"}}>{deletionToken}</p></div>}
  </form></section>;
}
