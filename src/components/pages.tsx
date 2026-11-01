import { categories, categoryLabel } from "@/lib/categories";
import { copy, type Locale } from "@/lib/i18n";
import { getLegalDocument, type LegalDocument } from "@/lib/legal";
import { priorityJurisdictions, internationalReferences } from "@/lib/jurisdictions";
import { operatorInfo } from "@/lib/operator";
import type { PostsPageResult, PublicPost } from "@/lib/content";

type PostsData = PostsPageResult | null;

function LetterArt() {
  return <svg className="pencil-art" viewBox="0 0 520 390" role="img" aria-label="A hand-drawn letter and pencil illustration">
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M105 86c46-22 116-24 174-16 62 8 105 31 132 61 21 24 31 55 23 88-7 29-32 50-64 62-62 23-160 22-231 2-58-16-95-48-92-93 2-43 23-78 58-104Z" opacity=".22"/>
      <path d="M139 117c55-20 139-18 194 0 31 10 55 29 61 54 5 24-7 43-29 55-44 25-133 30-198 14-44-11-77-34-77-64 0-26 17-47 49-59Z" opacity=".45"/>
      <path d="M159 146c42-13 105-15 149-3 19 5 34 14 42 25M147 169c26 37 111 52 176 32 11-3 21-8 29-13"/>
      <path d="M164 155c-4 24-2 62 2 92l-4 40 22-11 19 12 20-9 20 9 20-11 21 8 18-12 20 3 7-33"/>
      <path d="M204 186c40 12 86 12 124 1M203 207c46 10 89 8 120-1M204 229c32 8 75 7 102 0" opacity=".7"/>
      <path d="m332 245 94 79 19-22-94-79-19 22Zm-12 37 31-15m75 35 9-11 10 11-10 22Z"/>
      <path d="M94 284c-19 5-37 14-51 29M113 311c-13 13-22 26-27 41M394 84c13-12 28-21 45-25M420 103c17-7 34-10 51-8" opacity=".5"/>
    </g>
  </svg>;
}

function PageHeading({ title, intro, locale }: { title: string; intro?: string; locale: Locale }) {
  return <header className="page-heading"><p className="eyebrow">UNKNOWN · {locale === "ar" ? "غير معروف" : "Anonymous expression"}</p><h1 className="section-title">{title}</h1>{intro && <p className="section-description">{intro}</p>}</header>;
}

function CategoryCards({ locale }: { locale: Locale }) {
  return <div className="category-grid">{categories.map(item => <a className="category-card" key={item.id} href={"/" + locale + "/categories/" + item.id}>
    <span className="category-symbol" aria-hidden="true">{item.symbol}</span><span className="category-label">{item[locale]}</span><span className="category-arrow" aria-hidden="true">↗</span>
  </a>)}</div>;
}

function PostCard({ post, locale }: { post: PublicPost; locale: Locale }) {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(post.published_at));
  return <article className="post-card">
    <div className="post-meta"><span className="post-category">{categoryLabel(post.category, locale)}</span><time dateTime={post.published_at}>{date}</time></div>
    <a href={"/" + locale + "/p/" + post.id}><h3 className="post-title">{post.title || (locale === "ar" ? "مشاركة دون عنوان" : "Untitled story")}</h3></a>
    <p className="post-body">{post.body.length > 270 ? post.body.slice(0, 270) + "…" : post.body}</p>
    <div className="post-actions"><a className="text-link" href={"/" + locale + "/p/" + post.id}>{locale === "ar" ? "اقرأ الحكاية ←" : "Read story →"}</a></div>
  </article>;
}

function PostList({ posts, locale, emptyText }: { posts: PublicPost[]; locale: Locale; emptyText?: string }) {
  if (!posts.length) return <div className="empty-state"><strong>{locale === "ar" ? "لا توجد مشاركات عامة بعد." : "No public stories yet."}</strong><p>{emptyText || (locale === "ar" ? "لن نعرض حكايات تجريبية أو محتوى مختلقاً." : "No fabricated or demo stories are shown.")}</p></div>;
  return <div className="post-list">{posts.map(post => <PostCard key={post.id} post={post} locale={locale} />)}</div>;
}

function WriterPanel({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const text = copy[locale];
  return <div className="writer-panel">
    <div className="writer-topline"><strong className="writer-label">{text.writeTitle}</strong><span className="writer-note">{text.submitHint}</span></div>
    <input className="text-input" disabled placeholder={text.titlePlaceholder} aria-label={text.titlePlaceholder}/>
    <div style={{marginTop:12}}><textarea className="text-area" disabled placeholder={text.writePlaceholder} aria-label={text.writePlaceholder}/></div>
    <div className="field-row"><div><label className="field-label">{text.categoryLabel}</label><select className="select-input" disabled><option>{text.categoryPlaceholder}</option></select></div><div className="notice-box">{ar ? "سيتم فتح استقبال المشاركات بعد تفعيل الحفظ والمراجعة." : "Submissions will open after persistence and moderation are enabled."}</div></div>
    <div className="form-footer"><span className="writer-note">{ar ? "التصفح متاح. استقبال المشاركات غير مفعّل حالياً." : "Browsing is available. User submissions are currently disabled."}</span><button className="primary-button" type="button" disabled>{ar ? "النشر غير مفعّل" : "Publishing is disabled"}</button></div>
  </div>;
}

export function HomePage({ locale, posts }: { locale: Locale; posts: PublicPost[] }) {
  const text = copy[locale];
  const ar = locale === "ar";
  return <div className="site-shell">
    <section className="hero"><div className="reveal"><span className="eyebrow">{text.heroEyebrow}</span><h1 className="hero-title">{text.heroTitleA} <em>{text.heroTitleB}</em></h1><p className="hero-copy">{text.heroCopy}</p><div className="country-note"><span aria-hidden="true">◎</span>{ar ? "مساحة متاحة للزيارة من مختلف أنحاء العالم" : "A space open to visitors around the world"}</div></div><div className="hero-art"><LetterArt/></div></section>
    <section id="write" className="section" style={{borderTop:0,paddingTop:10}}><div className="section-heading"><div><h2 className="section-title">{text.writeTitle}</h2><p className="section-description">{ar ? "لا تحتاج إلى اسم كي تكتب حكايتك." : "You do not need a name to tell your story."}</p></div><span className="writer-note">{ar ? "مساحة مفتوحة للكلمات" : "A quiet space for words"}</span></div><WriterPanel locale={locale}/></section>
    <section className="section"><div className="section-heading"><div><h2 className="section-title">{text.categoriesTitle}</h2><p className="section-description">{text.categoriesDescription}</p></div><a className="text-link" href={"/" + locale + "/categories"}>{text.viewAll} ↗</a></div><CategoryCards locale={locale}/></section>
    <section className="section"><div className="section-heading"><div><h2 className="section-title">{text.latestTitle}</h2><p className="section-description">{text.latestDescription}</p></div><a className="text-link" href={"/" + locale + "/latest"}>{text.viewAll} ↗</a></div><PostList posts={posts} locale={locale} emptyText={ar ? "لا توجد مشاركات محفوظة في قاعدة البيانات بعد." : "No stories are stored in the database yet."}/></section>
    <section className="section"><div className="section-heading"><div><h2 className="section-title">{ar ? "مساحة إنسانية، لا ملف شخصي" : "A human space, not a profile"}</h2><p className="section-description">{ar ? "لا متابعين ولا سباق شعبية. فقط كلمات وتجارب ومشاعر." : "No followers or popularity contest. Just words, experiences and feelings."}</p></div></div><div className="country-grid">
      {[{symbol:"✎",ar:"اكتب بحرية",en:"Write freely",descAr:"شارك ما بداخلك دون إنشاء حساب.",descEn:"Express yourself without creating an account."},{symbol:"♡",ar:"استمع بتعاطف",en:"Respond with care",descAr:"تعليقات مجهولة تحترم الآخرين.",descEn:"Anonymous responses that respect others."},{symbol:"⌑",ar:"احمِ الخصوصية",en:"Respect privacy",descAr:"لا تكشف بياناتك أو أسرار غيرك.",descEn:"Protect your details and other people's privacy."}].map(item=><div className="country-card" key={item.symbol}><div className="category-symbol">{item.symbol}</div><h3 className="post-title" style={{marginTop:16}}>{ar?item.ar:item.en}</h3><p className="section-description">{ar?item.descAr:item.descEn}</p></div>)}
    </div></section>
  </div>;
}

function DocumentPage({ doc, locale }: { doc: LegalDocument; locale: Locale }) {
  return <div className="site-shell inner-page"><PageHeading title={doc.title} intro={doc.intro} locale={locale}/><div className="document-status">{doc.status}</div><article className="document-content">
    {doc.sections.map((section,index)=><section className="document-section" key={section.heading+index}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul>}</section>)}
  </article></div>;
}

function CategoryIndex({ locale }: { locale: Locale }) {
  const ar=locale==="ar";
  return <div className="site-shell inner-page"><PageHeading locale={locale} title={ar?"التصنيفات":"Categories"} intro={ar?"اختر الشعور أو نوع الحكاية التي تريد قراءتها.":"Choose a feeling or the kind of story you want to explore."}/><section className="section"><CategoryCards locale={locale}/></section></div>;
}

function SearchPage({ locale, query, posts }: { locale: Locale; query: string; posts: PostsData }) {
  const ar=locale==="ar";
  return <div className="site-shell inner-page"><PageHeading locale={locale} title={ar?"البحث في الحكايات":"Search stories"} intro={ar?"ابحث في المشاركات العامة المحفوظة.":"Search published public stories."}/>
    <form className="search-form" method="get" action={"/"+locale+"/search"}><input className="text-input" name="q" defaultValue={query} minLength={2} maxLength={80} placeholder={ar?"اكتب كلمة أو عبارة...":"Enter a word or phrase..."}/><button className="primary-button" type="submit">{ar?"بحث":"Search"}</button></form>
    {query&&<section className="section"><div className="section-heading"><h2 className="section-title">{ar?"نتائج البحث":"Search results"}</h2><span className="writer-note">{posts?.total||0} {ar?"نتيجة":"results"}</span></div><PostList posts={posts?.posts||[]} locale={locale} emptyText={ar?"لم نعثر على مشاركات مطابقة أو أن قاعدة البيانات غير متصلة.":"No matching stories were found, or the database is not connected."}/></section>}
  </div>;
}

function ListingPage({ locale, title, intro, result }: { locale: Locale; title: string; intro: string; result: PostsData }) {
  const ar=locale==="ar";
  return <div className="site-shell inner-page"><PageHeading locale={locale} title={title} intro={intro}/><section className="section"><div className="section-heading"><span className="writer-note">{result?.total||0} {ar?"مشاركة":"stories"}</span></div><PostList posts={result?.posts||[]} locale={locale}/></section></div>;
}

function StoryPage({ locale, post }: { locale: Locale; post: PublicPost|null }) {
  const ar=locale==="ar";
  if(!post)return <div className="site-shell inner-page"><div className="empty-state"><strong>{ar?"تعذّر العثور على الحكاية.":"Story not found."}</strong><a className="text-link" href={"/"+locale+"/latest"}>{ar?"العودة إلى المشاركات":"Browse latest stories"}</a></div></div>;
  const date=new Intl.DateTimeFormat(locale,{dateStyle:"long"}).format(new Date(post.published_at));
  return <div className="site-shell inner-page"><article className="story-detail"><div className="post-meta"><span className="post-category">{categoryLabel(post.category,locale)}</span><time dateTime={post.published_at}>{date}</time></div><h1 className="hero-title">{post.title||(ar?"مشاركة دون عنوان":"Untitled story")}</h1><div className="story-body">{post.body}</div><div className="story-actions"><a className="secondary-button" href={"/"+locale+"/report"}>{ar?"الإبلاغ عن المحتوى":"Report this content"}</a></div><div className="notice-box">{ar?"التعليقات والتفاعلات ستظهر عند تفعيل خدمات التخزين والمراجعة.":"Comments and reactions will be available when storage and moderation are enabled."}</div></article></div>;
}

function LegalIndex({ locale, countryCode }: { locale: Locale; countryCode?: string }) {
  const ar=locale==="ar";
  const selected=priorityJurisdictions.find(item=>item.code.toLowerCase()===(countryCode||"").toLowerCase());
  return <div className="site-shell inner-page">
    <PageHeading locale={locale} title={selected?(ar?"المراجع القانونية — "+selected.name:"Legal references — "+selected.name):(ar?"مركز القوانين والحقوق":"Legal & rights center")} intro={selected?(ar?selected.noteAr:selected.noteEn):(ar?"مصادر رسمية للقوانين واللوائح والإرشادات ذات الصلة بالخدمة.":"Official sources for laws, regulations and guidance relevant to the service.")}/>
    {selected&&<div className="document-content"><h2>{ar?"محاور المراجعة":"Review topics"}</h2><ul>{selected.topics.map((topic,i)=><li key={i}>{topic[locale]}</li>)}</ul></div>}
    <section className="section"><h2 className="section-title">{ar?"الاختصاصات":"Jurisdictions"}</h2><div className="country-grid">{priorityJurisdictions.map(item=><a className="country-card" href={"/"+locale+"/legal/"+item.code} key={item.code}><span className="category-symbol">{item.code}</span><h3 className="post-title">{item.name}</h3><span className="text-link">{ar?"عرض المصادر":"View sources"} ↗</span></a>)}</div></section>
    <section className="section"><h2 className="section-title">{ar?"المراجع الدولية":"International references"}</h2><div className="document-content">{(selected?.references||internationalReferences).map(item=><article className="reference-item" key={item.id}><h3>{ar?item.titleAr:item.titleEn}</h3><p>{ar?item.noteAr:item.noteEn}</p><a className="text-link" href={item.url} target="_blank" rel="noreferrer">{ar?"المصدر الرسمي":"Official source"} ↗</a></article>)}</div></section>
  </div>;
}

function ContactPage({ locale }: { locale: Locale }) {
  const ar=locale==="ar";
  return <div className="site-shell inner-page"><PageHeading locale={locale} title={ar?"التواصل مع غير معروف":"Contact UNKNOWN"} intro={ar?"قنوات التواصل المنشورة للمشغّل.":"Published contact channels for the service operator."}/><div className="document-content"><p><strong>{ar?operatorInfo.nameAr:operatorInfo.nameEn}</strong></p><p>{ar?operatorInfo.locationAr:operatorInfo.locationEn}</p><p><a className="text-link" href={"mailto:"+operatorInfo.email}>{operatorInfo.email}</a></p><p><a className="text-link" href={"tel:"+operatorInfo.phone}>{operatorInfo.phone}</a></p><p><a className="text-link" href={operatorInfo.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp ↗</a></p><p>{ar?"قنوات التواصل ليست خدمات طوارئ ولا تضمن المراقبة الفورية.":"Contact channels are not emergency services and do not provide real-time monitoring."}</p></div></div>;
}

const helpPages: Record<string,{arTitle:string;enTitle:string;arIntro:string;enIntro:string;arBody:string[];enBody:string[]}> = {
  safety:{arTitle:"السلامة والمساعدة",enTitle:"Safety & support",arIntro:"إرشادات لاستخدام مساحة التعبير مع مراعاة سلامتك وخصوصيتك.",enIntro:"Guidance for using this expression space while protecting your safety and privacy.",arBody:["لا تذكر اسمك الكامل أو عنوانك أو رقم هاتفك أو بيانات الدخول أو تفاصيل يمكن أن تحدد هويتك.","غير معروف ليست خدمة طوارئ أو خطاً ساخناً للأزمات. عند وجود خطر مباشر، تواصل مع خدمات الطوارئ المحلية أو جهة حماية موثوقة."],enBody:["Do not include your full name, address, phone number, login details or information that can identify you.","UNKNOWN is not an emergency service or crisis hotline. If there is immediate danger, contact local emergency services or a trusted protection service."]},
  moderation:{arTitle:"الإشراف على المحتوى",enTitle:"Content moderation",arIntro:"تُستخدم قواعد فحص أولية لتقليل المحتوى الذي قد يسبب أذى أو يكشف معلومات خاصة.",enIntro:"First-pass checks help reduce content that may cause harm or expose private information.",arBody:["الفحص القائم على الأنماط ليس مصنفاً ذكياً شاملاً، وقد يفوّت السياق واللهجات واللغة المموهة.","الحالات التي تتطلب تقييماً تحتاج إلى مراجعة بشرية وإجراء موثق."],enBody:["Pattern-based screening is not a comprehensive AI classifier and may miss context, dialects and obfuscated language.","Cases requiring judgement need human review and a documented process."]},
  appeals:{arTitle:"الاعتراضات",enTitle:"Appeals",arIntro:"استقبال الاعتراضات وحفظها ومراجعتها غير مفعّل في هذه النسخة.",enIntro:"Appeal submission, storage and review are not enabled in this build.",arBody:["ستُفعّل آلية الاعتراض بعد تجهيز سجل القرارات وقناة الاستقبال ومراجعة بشرية موثقة."],enBody:["The appeal workflow will be enabled after decision logs, an intake channel and documented human review are implemented."]},
  report:{arTitle:"الإبلاغ عن محتوى",enTitle:"Report content",arIntro:"استقبال البلاغات وحفظها غير مفعّل حتى ربط قاعدة البيانات.",enIntro:"Report intake and storage are not enabled until the database is connected.",arBody:["لا تُرفق كلمات مرور أو وثائق هوية أو معلومات لا ترتبط بالبلاغ."],enBody:["Do not attach passwords, identity documents or unrelated information."]}
};

function UtilityPage({ locale, slug }: { locale: Locale; slug: string }) {
  const item=helpPages[slug];
  const ar=locale==="ar";
  if(!item)return <div className="site-shell inner-page"><div className="empty-state">{ar?"الصفحة غير موجودة.":"Page not found."}</div></div>;
  return <div className="site-shell inner-page"><PageHeading locale={locale} title={ar?item.arTitle:item.enTitle} intro={ar?item.arIntro:item.enIntro}/><article className="document-content"><section className="document-section"><h2>{ar?"معلومات مهمة":"Important information"}</h2>{(ar?item.arBody:item.enBody).map((p,i)=><p key={i}>{p}</p>)}</section></article></div>;
}

export function ContentPage({ locale, path, posts, post, query }: { locale: Locale; path: string; posts: PostsData; post: PublicPost|null; query: string }) {
  const parts=path.split("/").filter(Boolean);
  const first=parts[0]||"";
  const second=parts[1]||"";
  const ar=locale==="ar";
  if(first==="latest")return <ListingPage locale={locale} title={ar?"أحدث المشاركات":"Latest stories"} intro={ar?"المشاركات العامة المحفوظة في الخدمة.":"Public stories currently stored in the service."} result={posts}/>;
  if(first==="categories"&&!second)return <CategoryIndex locale={locale}/>;
  if(first==="categories"&&second){const category=categories.find(item=>item.id===second);return <ListingPage locale={locale} title={category?category[locale]:(ar?"تصنيف غير معروف":"Unknown category")} intro={ar?"الحكايات المنشورة ضمن هذا التصنيف.":"Published stories in this category."} result={posts}/>;}
  if(first==="search")return <SearchPage locale={locale} query={query} posts={posts}/>;
  if(first==="p"&&second)return <StoryPage locale={locale} post={post}/>;
  if(first==="legal")return <LegalIndex locale={locale} countryCode={second}/>;
  if(first==="contact")return <ContactPage locale={locale}/>;
  if(["safety","moderation","appeals","report"].includes(first))return <UtilityPage locale={locale} slug={first}/>;
  const doc=getLegalDocument(first,locale);
  if(doc)return <DocumentPage doc={doc} locale={locale}/>;
  return <div className="site-shell inner-page"><div className="empty-state"><strong>{ar?"الصفحة غير موجودة.":"Page not found."}</strong><a className="text-link" href={"/"+locale}>{ar?"العودة للرئيسية":"Back home"}</a></div></div>;
}
