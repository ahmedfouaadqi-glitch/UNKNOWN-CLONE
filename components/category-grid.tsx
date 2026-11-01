import Link from "next/link";
import type {Locale} from "@/lib/i18n";
import {categories} from "@/lib/categories";
export function CategoryGrid({locale}:{locale:Locale}){
 return <div className="category-grid">{categories.map(item=><Link className="category-card" key={item.id} href={`/${locale}/categories/${item.id}`}><span className="category-symbol" aria-hidden="true">{item.symbol}</span><span className="category-label">{item[locale]}</span><span className="category-arrow" aria-hidden="true">↗</span></Link>)}</div>;
}
