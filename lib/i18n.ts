export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function defaultLocaleForCountry(country: string | null, acceptLanguage = ""): Locale {
  if (country) {
    const arabicCountries = new Set([
      "IQ","SA","AE","EG","JO","LB","SY","YE","OM","KW","BH","QA","PS","MA","TN","DZ","LY","SD","SO","DJ","KM","MR"
    ]);
    return arabicCountries.has(country.toUpperCase()) ? "ar" : "en";
  }
  return /^ar(?:-|,|;|$)/i.test(acceptLanguage.trim()) ? "ar" : "en";
}

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export const copy = {
  en: {
    nav: { latest: "Latest stories", categories: "Categories", search: "Search", about: "About", legal: "Legal & rights" },
    heroEyebrow: "A space for every untold story",
    heroTitleA: "Say what you",
    heroTitleB: "cannot say.",
    heroCopy: "A quiet place to write what is on your mind, share a story, or leave a letter unsent — without creating a profile or introducing yourself.",
    writeTitle: "What is on your mind?",
    writeHint: "Your words can be public. Do not include identifying or private details about yourself or anyone else.",
    countryFallback: "the world",
    countryPrefix: "Welcome, visitor browsing from",
    categoriesTitle: "Choose a feeling",
    categoriesDescription: "Start with a feeling, or simply write what you need to say.",
    latestTitle: "Recently shared",
    latestDescription: "Stories shared without public profiles or follower counts.",
    emptyTitle: "A quiet page, waiting for its first words.",
    emptyText: "There are no public stories here yet. You can be the first to share one.",
    readStory: "Read story",
    about: "About UNKNOWN",
    footerLine: "Say what you feel. Stay unnamed.",
    footerDisclaimer: "An expression space, not a medical, mental-health or emergency service.",
    publish: "Share anonymously",
    writePlaceholder: "Write your story, feeling or unsent letter...",
    titlePlaceholder: "A title, if you need one (optional)",
    categoryLabel: "Feeling",
    categoryPlaceholder: "Choose a category",
    consent: "I have read and agree to the publishing terms, privacy notice and anonymous publishing disclaimer.",
    age: "I confirm that I meet the minimum age requirements applicable to my location and that I am at least 18.",
    submitHint: "No account or public profile is created.",
    chars: "characters",
    required: "Please complete the required fields and accept both statements.",
    publishing: "Checking your words…",
    configError: "Publishing is not connected yet. Your text has not been sent or stored.",
    genericError: "We could not publish this right now. Please try again later.",
    success: "Your story has been published.",
    pending: "Your submission was received but is not public while it is checked.",
    deleteToken: "Private deletion code — save it now. It will not be shown again.",
    copy: "Copy",
    copied: "Copied",
    moderationBlocked: "This text may expose private details or harm someone. Please revise it before publishing.",
    noStories: "No stories found.",
    viewAll: "View all",
    backHome: "Back to home",
    commentTitle: "Leave a kind response",
    commentPlaceholder: "Share a thoughtful response…",
    commentSubmit: "Post comment",
    commentsTitle: "Responses",
    noComments: "No responses yet.",
    report: "Report",
    reportTitle: "Report this content",
    reportReason: "Reason",
    reportDetails: "Additional details (optional)",
    reportSubmit: "Send report",
    reportSent: "Your report was received.",
    reportError: "We could not send the report. Please try again.",
    loading: "Loading…",
    notFound: "This story could not be found.",
    legalDraft: "This document is an operational draft and must be reviewed for the operator's jurisdiction and every market where publishing is enabled.",
    contactHint: "Use the contact channel below for privacy, safety, legal and general enquiries.",
    emailNotConfigured: "The official contact mailbox has not been configured yet.",
    countryNotice: "Country detection is approximate and is not proof of residence or nationality."
  },
  ar: {
    nav: { latest: "أحدث الحكايات", categories: "التصنيفات", search: "بحث", about: "عن المبادرة", legal: "القوانين والحقوق" },
    heroEyebrow: "مساحة لكل حكاية لم تُروَ",
    heroTitleA: "قل ما لا تستطيع",
    heroTitleB: "قوله.",
    heroCopy: "مساحة هادئة لتكتب ما بداخلك، أو تشارك حكاية، أو تترك رسالة لم تُرسل، دون إنشاء حساب أو تعريف نفسك.",
    writeTitle: "ما الذي يشغل بالك؟",
    writeHint: "قد تكون كلماتك عامة ومتاحة للجميع. لا تكتب بيانات تكشف هويتك أو خصوصية أي شخص.",
    countryFallback: "العالم",
    countryPrefix: "أهلاً بك، زائرنا من",
    categoriesTitle: "اختر شعورك",
    categoriesDescription: "ابدأ بشعور، أو اكتب ببساطة ما تحتاج إلى قوله.",
    latestTitle: "أحدث المشاركات",
    latestDescription: "حكايات يشاركها أصحابها دون ملفات شخصية أو أعداد متابعين.",
    emptyTitle: "صفحة هادئة تنتظر كلماتها الأولى.",
    emptyText: "لا توجد مشاركات عامة هنا بعد. يمكنك أن تكون أول من يشارك.",
    readStory: "اقرأ الحكاية",
    about: "عن غير معروف",
    footerLine: "قل ما بداخلك، دون أن تكشف من أنت.",
    footerDisclaimer: "مساحة للتعبير، وليست خدمة طبية أو نفسية أو للطوارئ.",
    publish: "انشر دون اسم",
    writePlaceholder: "اكتب حكايتك أو شعورك أو رسالتك التي لم تُرسل...",
    titlePlaceholder: "عنوان، إذا احتجت إليه (اختياري)",
    categoryLabel: "الشعور",
    categoryPlaceholder: "اختر التصنيف",
    consent: "قرأت شروط النشر وسياسة الخصوصية وإخلاء مسؤولية النشر المجهول وأوافق عليها.",
    age: "أؤكد أنني أستوفي الحد الأدنى للعمر المطبق في موقعي، وأن عمري 18 عاماً على الأقل.",
    submitHint: "لن يُنشأ حساب أو ملف شخصي عام.",
    chars: "حرفاً",
    required: "يرجى إكمال الحقول المطلوبة والموافقة على الإقرارين.",
    publishing: "جارٍ فحص كلماتك…",
    configError: "لم يتم ربط خدمة النشر بعد. لم يتم إرسال النص أو تخزينه.",
    genericError: "تعذّر النشر حالياً. حاول مرة أخرى لاحقاً.",
    success: "تم نشر حكايتك.",
    pending: "تم استلام مشاركتك، لكنها لن تظهر للعامة أثناء فحصها.",
    deleteToken: "رمز حذف خاص — احتفظ به الآن، فلن يظهر مرة أخرى.",
    copy: "نسخ",
    copied: "تم النسخ",
    moderationBlocked: "قد يكشف النص معلومات خاصة أو يسبب أذى لشخص. يرجى تعديله قبل النشر.",
    noStories: "لا توجد مشاركات.",
    viewAll: "عرض الكل",
    backHome: "العودة للرئيسية",
    commentTitle: "اترك رداً لطيفاً",
    commentPlaceholder: "شارك رداً محترماً ومراعياً...",
    commentSubmit: "نشر التعليق",
    commentsTitle: "الردود",
    noComments: "لا توجد ردود بعد.",
    report: "إبلاغ",
    reportTitle: "الإبلاغ عن هذا المحتوى",
    reportReason: "سبب الإبلاغ",
    reportDetails: "تفاصيل إضافية (اختياري)",
    reportSubmit: "إرسال البلاغ",
    reportSent: "تم استلام البلاغ.",
    reportError: "تعذّر إرسال البلاغ. حاول مرة أخرى.",
    loading: "جارٍ التحميل…",
    notFound: "تعذّر العثور على هذه الحكاية.",
    legalDraft: "هذه الوثيقة مسودة تشغيلية وتحتاج إلى مراجعة قانونية في دولة المشغّل وكل سوق يُسمح فيه بالنشر.",
    contactHint: "استخدم قنوات التواصل أدناه للاستفسارات المتعلقة بالخصوصية والسلامة والقانون والتواصل العام.",
    emailNotConfigured: "لم يتم إعداد بريد التواصل الرسمي بعد.",
    countryNotice: "تحديد الدولة تقريبي ولا يثبت الإقامة أو الجنسية."
  }
} as const;

export type Copy = (typeof copy)[Locale];
