"use client";
import { useEffect } from "react";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 useEffect(()=>{console.error("UNKNOWN application error",error.digest);},[error]);
 return <main className="site-shell"><div className="page-intro"><span className="eyebrow">UNKNOWN</span><h1 className="page-title">Something went wrong.</h1><p className="section-description">The page could not be loaded. Please try again.</p><button className="primary-button" onClick={()=>reset()}>Try again</button></div></main>;
}
