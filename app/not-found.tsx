import Link from "next/link";
export default function NotFound(){
 return <main className="site-shell"><div className="page-intro"><span className="eyebrow">UNKNOWN</span><h1 className="page-title">404</h1><p className="section-description">This page could not be found.</p><Link className="primary-button" href="/">{ "Back to home" }</Link></div></main>;
}
