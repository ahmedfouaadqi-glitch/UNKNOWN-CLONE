"use client";
import Link from "next/link";
import {useState} from "react";
import type {Copy,Locale} from "@/lib/i18n";
import {categories} from "@/lib/categories";
export function PublishForm({locale,copy}:{locale:Locale;copy:Copy}){
 const [title,setTitle]=useState("");const [body,setBody]=useState("");const [category,setCategory]=useState("");
 const [accepted,setAccepted]=useState(false);const [adult,setAdult]=useState(false);const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");const [kind,setKind]=useState<"error"|"success"|"info">("info");const [deletionToken,setDeletionToken]=useState("");
 const isAr=locale==="ar";
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setMessage("");
  if(body.trim().length<8||!category||!accepted||!adult){setKind("error");setMessage(copy.required);return;}
  setBusy(true);setMessage(copy.publishing);
  try{
   const response=await fetch("/api/posts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,body,category,language:locale,acceptedTerms:accepted,acceptedPrivacy:accepted,acceptedDisclaimer:accepted,confirmedAdult:adult})});
   const payload=await response.json();
   if(!response.ok){
    const text=payload.code==="market_disabled"||payload.code==="database_not_configured"?copy.configError:
      payload.code==="moderation_review"||payload.code==="moderation_rejected"?copy.moderationBlocked:(payload.error||copy.genericError);
    throw new Error(text);
   }
   setKind("success");setMessage(payload.status==="pending_review"?copy.pending:copy.success);
   if(payload.deletionToken)setDeletionToken(payload.deletionToken);
   setTitle("");setBody("");setCategory("");setAccepted(false);setAdult(false);
  }catch(error){setKind("error");setMessage(error instanceof Error?error.message:copy.genericError);}
  finally{setBusy(false);}
 }
 async function copyToken(){try{await navigator.clipboard.writeText(deletionToken);setMessage(copy.copied);}catch{setMessage(deletionToken);}}
 return <form className="writer-panel" onSubmit={submit}>
  <div className="writer-topline"><div className="writer-label">{copy.writeTitle}</div><div className="writer-note">{copy.submitHint}</div></div>
  <input className="text-input" maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder={copy.titlePlaceholder} aria-label={copy.titlePlaceholder}/>
  <div style={{marginTop:12}}><textarea className="text-area" maxLength={5000} value={body} onChange={e=>setBody(e.target.value)} placeholder={copy.writePlaceholder} aria-label={copy.writePlaceholder} required minLength={8}/><div className="form-footer" style={{marginTop:7}}><span className="writer-note">{body.length}/5000 {copy.chars}</span><span className="writer-note">{copy.writeHint}</span></div></div>
  <div className="field-row"><div><label className="field-label" htmlFor="unknown-category">{copy.categoryLabel}</label><select id="unknown-category" className="select-input" value={category} onChange={e=>setCategory(e.target.value)} required><option value="">{copy.categoryPlaceholder}</option>{categories.map(item=><option key={item.id} value={item.id}>{item[locale]}</option>)}</select></div><div className="notice-box" style={{display:"flex",alignItems:"center"}}>{isAr?"تُعرض المشاركات للعامة بعد اجتياز الفحص.":"Stories become public only after passing checks."}</div></div>
  <div className="consent-stack" style={{marginTop:20}}>
   <label className="check-row"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>{copy.consent} <Link href={`/${locale}/terms`}>{isAr?"الشروط":"Terms"}</Link> · <Link href={`/${locale}/privacy`}>{isAr?"الخصوصية":"Privacy"}</Link> · <Link href={`/${locale}/disclaimer`}>{isAr?"إخلاء المسؤولية":"Disclaimer"}</Link></span></label>
   <label className="check-row"><input type="checkbox" checked={adult} onChange={e=>setAdult(e.target.checked)}/><span>{copy.age}</span></label>
   <p className="writer-note" style={{margin:0}}>{isAr?"إقرار العمر تصريح ذاتي وليس خدمة تحقق من العمر. لا تشارك بيانات تكشف هويتك.":"Age confirmation is self-declared, not age verification. Do not include identifying details."}</p>
  </div>
  <div className="form-footer"><span className="writer-note">{isAr?"لن يظهر اسمك أو بلدك مع المشاركة.":"Your name or detected country will not appear with the story."}</span><button className="primary-button" type="submit" disabled={busy||!body.trim()||!category||!accepted||!adult}>{busy?copy.publishing:copy.publish} <span aria-hidden="true">↗</span></button></div>
  {message&&<p className={`form-message ${kind}`} role="status">{message}</p>}
  {deletionToken&&<div className="notice-box" style={{marginTop:12}}><strong>{copy.deleteToken}</strong><p style={{overflowWrap:"anywhere",fontFamily:"monospace"}}>{deletionToken}</p><button className="secondary-button" type="button" onClick={copyToken}>{copy.copy}</button></div>}
 </form>;
}
