import type { Locale } from "@/lib/i18n";
import { operatorInfo } from "@/lib/operator";

export const legalVersions = {
  terms: "2026-11-01-1.0",
  privacy: "2026-11-01-1.0",
  disclaimer: "2026-11-01-1.0",
  community: "2026-11-01-1.0"
} as const;

export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalDocument = { title: string; status: string; intro: string; sections: LegalSection[] };

const docs: Record<Locale, Record<string, LegalDocument>> = {
  en: {
    about: {
      title: "About UNKNOWN",
      status: "About the initiative",
      intro: "UNKNOWN is a space for anonymous written expression and human stories.",
      sections: [
        { heading: "Purpose", paragraphs: ["The service gives people a place to put feelings, experiences and personal stories into words without creating a public profile.", "Writing is a form of expression. UNKNOWN does not present writing as medical treatment or promise a particular psychological outcome."] },
        { heading: "Service boundaries", paragraphs: ["UNKNOWN is not a medical provider, mental-health service, therapy platform, crisis hotline or emergency response service. It does not diagnose, treat or provide individualized clinical advice."] },
        { heading: "Who speaks", paragraphs: ["Posts and comments are created by their contributors. Their statements do not necessarily represent the views of UNKNOWN or its operator."] }
      ]
    },
    terms: {
      title: "Terms of service",
      status: "Published service terms · Effective 1 November 2026",
      intro: "These terms describe the rules for accessing and using UNKNOWN. Mandatory consumer, privacy and other rights under applicable law are not limited by these terms.",
      sections: [
        { heading: "Service operator", paragraphs: [`The operator identified for UNKNOWN is ${operatorInfo.nameEn}, based in ${operatorInfo.locationEn}. The published contact mailbox is ${operatorInfo.email}; the telephone and WhatsApp number is ${operatorInfo.phone}.`] },
        { heading: "Eligibility and access", paragraphs: ["The service is intended for people aged 18 or older. Age is self-declared in the current interface and is not verified through an identity document or biometric check. Access may be restricted where local law requires a different age or additional assurance.", "Global availability is the default. Access or publishing may be restricted for a defined territory where applicable law or a valid, enforceable order requires that specific measure."] },
        { heading: "Public content and anonymity", paragraphs: ["Posts and comments are public when published. Anyone who can access a public page may read, copy, capture, index or redistribute its contents. Do not publish information that you expect to remain private.", "The absence of a username or public profile is not a promise of absolute anonymity. Your writing, device, network provider, information included in a post or a lawful request may identify you."] },
        { heading: "Your content and limited permission", paragraphs: ["You remain responsible for the content you submit and must have the rights and permissions needed to submit it.", "When you submit content, you allow UNKNOWN to host, store, reproduce, format, display and deliver that content only as reasonably necessary to operate, secure, moderate and provide the service. This permission is non-exclusive and does not transfer ownership of your content to UNKNOWN."] },
        { heading: "Prohibited content", bullets: ["Threats, incitement, targeted harassment, bullying or hateful abuse.", "Doxxing, private addresses, telephone numbers, account credentials, private correspondence or sensitive personal data belonging to another person.", "Sexual exploitation of children, non-consensual intimate material or instructions that facilitate violence or self-harm.", "Fraud, impersonation, malicious links, unlawful material or copyright infringement."] },
        { heading: "Reporting and moderation", paragraphs: ["Use the report function on a post or comment to identify content and explain the concern. Automated checks are limited and can miss harmful content or flag legitimate expression.", "Content may be delayed, restricted or removed under these terms and applicable law. The existence of a report form does not mean that a staffed 24-hour review service is available. UNKNOWN does not promise an immediate response time."] },
        { heading: "Deletion and retention", paragraphs: ["Where the deletion-code feature is enabled, retain the one-time code shown after submission and use it to request deletion. Deletion from the public page may not remove copies already made by others, search-engine caches, backups or records that must be retained by law.", "Do not send passwords, identity documents or unrelated personal information when reporting or requesting deletion."] },
        { heading: "Service changes and suspension", paragraphs: ["UNKNOWN may restrict access to content or features to protect users, comply with law, address security issues or maintain the service. Where appropriate and legally required, the affected person will be given information about the action and any available review route.", "The service may be changed, paused or discontinued. No guarantee is made that content or features will remain available indefinitely."] },
        { heading: "Mandatory legal rights", paragraphs: ["Nothing in these terms excludes or limits a liability, remedy or user right that cannot legally be excluded or limited. The operator remains responsible for duties imposed on it by applicable law."] }
      ]
    },
    privacy: {
      title: "Privacy notice",
      status: "Published privacy notice · Effective 1 November 2026",
      intro: "UNKNOWN is designed not to require user accounts or public profiles. It still processes information needed to operate the service, protect it from abuse and handle user requests.",
      sections: [
        { heading: "Controller and operator contact", paragraphs: [`The operator identified for UNKNOWN is ${operatorInfo.nameEn}, based in ${operatorInfo.locationEn}. For privacy requests and questions about processing, use ${operatorInfo.email}. Telephone/WhatsApp: ${operatorInfo.phone}.`] },
        { heading: "Information you submit", paragraphs: ["Where publishing is enabled, the service processes the text of a post or comment, an optional title, selected category, language, submission time and the version of the terms and notices accepted with the submission.", "Reports and deletion requests may include the content identifier, the selected reason and additional details you choose to provide. Do not include unnecessary personal information about yourself or anyone else."] },
        { heading: "Technical and security information", paragraphs: ["The application uses one-way hashes for deletion codes and scoped technical digests to reduce duplicate reactions. These are pseudonymous technical signals; they should not be described as proof that the service processes no identifiers.", "The application code does not write raw IP addresses to its application database. Hosting, CDN and network providers may process IP addresses, request metadata and security logs under their own service terms and retention schedules."] },
        { heading: "Approximate location and language", paragraphs: ["A trusted hosting or edge header may be used to infer an approximate country for a welcome message and default language. UNKNOWN does not request GPS permission and does not attach the detected country to a public post. Country detection is not proof of residence, nationality or legal jurisdiction."] },
        { heading: "Public visibility", paragraphs: ["Published stories and comments are public and may be copied, indexed, captured or redistributed by visitors and third parties. Removing content from UNKNOWN cannot recall copies held elsewhere.", "The product does not provide user accounts, public profiles, follower graphs, direct messages, behavioural advertising or individual sentiment profiling."] },
        { heading: "Purposes and legal grounds", paragraphs: ["Information is used to provide requested features, display and organize public content, prevent abuse, protect service security, respond to reports and deletion requests, maintain operational records and meet legal duties. Depending on the jurisdiction and activity, the applicable legal ground may include performance of a requested service, legitimate interests, consent where requested, or compliance with a legal obligation."] },
        { heading: "Service providers and international processing", paragraphs: ["Infrastructure providers may process technical information in the locations where their hosting, network, storage, security or email systems operate. The operator must keep the production provider list, processing locations and applicable transfer safeguards accurate for each enabled market."] },
        { heading: "Retention and deletion", paragraphs: ["Content, reports, deletion records, security signals and backups are retained only for the period needed for the relevant service, safety, security or legal purpose. Different records may have different retention periods. Backups and third-party caches may persist for their normal rotation or independent retention period after public content is removed.", "Exact production retention periods depend on the providers and infrastructure settings actually deployed. This notice does not invent a fixed period where those settings have not been supplied."] },
        { heading: "Your rights and requests", paragraphs: ["Depending on the law that applies to you, you may have rights to access, correct, delete, restrict or object to certain processing, receive a copy of data or complain to a regulator. Requests should use the privacy contact channel shown on the Contact page when that channel is configured and published."] },
        { heading: "Children", paragraphs: ["The service is intended for adults aged 18 or older. A self-declared age checkbox is not identity or age verification. The service must remain unavailable in markets where stronger age assurance or additional child-safety measures are required until those controls are implemented."] },
        { heading: "Changes to this notice", paragraphs: ["Material changes to this notice will be reflected by an updated edition date on this page. Where law requires notice or consent for a change, the relevant process will be followed."] }
      ]
    },
    disclaimer: {
      title: "Anonymous publishing and service disclaimer",
      status: "Published service limitations",
      intro: "This page explains what UNKNOWN does and does not provide. It must be read together with the Terms of Service, Privacy Notice and Community Rules.",
      sections: [
        { heading: "Contributor-created content", paragraphs: ["Contributors create their own posts and comments. Publication does not mean that UNKNOWN verifies, endorses, adopts or confirms a contributor's statements. Content may be incomplete, inaccurate, disputed or harmful."] },
        { heading: "Anonymity limits", paragraphs: ["The service does not require a public name or profile, but it cannot guarantee that writing, device or network information, legal process or details voluntarily included in a post will never identify its contributor."] },
        { heading: "No medical, legal or professional service", paragraphs: ["UNKNOWN is not psychotherapy, diagnosis, counselling, medical treatment, legal advice or a verified news service. Users should seek a qualified professional for decisions requiring specialist advice."] },
        { heading: "No emergency response", paragraphs: ["UNKNOWN is not an emergency service or crisis hotline and does not promise real-time monitoring. If you or another person is in immediate danger, contact local emergency services or a trusted local protection provider. Do not wait for a website response."] },
        { heading: "Availability and third-party copies", paragraphs: ["The service may be interrupted or changed. Public content may be captured, copied, cached or redistributed outside the control of UNKNOWN. Removing a post from the service does not guarantee removal from third-party systems."] },
        { heading: "Mandatory legal rights", paragraphs: ["Nothing on this page removes a duty or liability that applicable law does not allow the operator to exclude."] }
      ]
    },
    community: {
      title: "Community rules",
      status: "Published community and safety rules",
      intro: "These rules protect expression while prohibiting content that targets people, exposes private information or creates a serious safety risk.",
      sections: [
        { heading: "Welcome", bullets: ["Personal feelings, reflections, experiences and stories.", "Respectful disagreement, constructive criticism and supportive comments.", "Anger, grief and disagreement expressed without threats or targeted abuse."] },
        { heading: "Not allowed", bullets: ["Bullying, humiliation, targeted harassment, threats or encouragement of violence or self-harm.", "Doxxing, private addresses, phone numbers, account credentials, leaked correspondence or sensitive personal data.", "Hate speech, unlawful discrimination, exploitation or sexual material involving children.", "Non-consensual intimate material, fraud, impersonation, malicious links or instructions that facilitate harm.", "Defamatory allegations presented as fact about an identifiable private person, or content that unlawfully violates another person's rights."] },
        { heading: "Protect privacy", paragraphs: ["Do not publish information that identifies you or another person without a lawful basis and appropriate permission. Public posts can be copied or redistributed even after removal from UNKNOWN."] },
        { heading: "Report content", paragraphs: ["Use the report control on the relevant post or comment and select the closest reason. Provide only details needed to explain the concern. Do not attach passwords, unrelated identity documents or unnecessary personal data."] },
        { heading: "Moderation limits", paragraphs: ["Automated filtering is a first-pass safeguard, not a complete classifier. It may miss context, dialect, coded language or evasion, and it may flag legitimate expression. A report submission is not a guarantee of immediate review or a specific response time."] }
      ]
    },
    legal: {
      title: "Legal and rights center",
      status: "Official-source directory and jurisdiction register",
      intro: "This center links to official legislation, regulatory texts and government guidance relevant to an anonymous user-generated-content service. Each country's page describes the main source set and its current publication gate.",
      sections: [
        { heading: "How to use these sources", paragraphs: ["The links are primary or official government/regulator sources wherever available. Check the latest consolidated text, commencement provisions, territorial scope and service definitions before relying on a provision.", "A law appearing in this directory is not a statement that every provision applies to UNKNOWN. Applicability depends on the operator, service design, users, processing and territorial facts."] },
        { heading: "International references", bullets: ["International Covenant on Civil and Political Rights — freedom of expression and related rights.", "Universal Declaration of Human Rights — international human-rights declaration.", "Convention on the Rights of the Child — child-rights treaty reference."] },
        { heading: "Consultation documents", paragraphs: ["A government consultation notice or proposed regulation is listed as a consultation source, not as an enacted or final rule. The Iraq digital-content consultation notice is identified separately on the Iraq page."] },
        { heading: "Market activation", paragraphs: ["UNKNOWN adopts global availability by default and does not geographically block a country merely because it appears in this register. This policy does not suspend mandatory duties that apply directly by law. A territorial or service restriction is applied only to the extent required by an applicable legal duty or a verified, enforceable order from a competent authority."] }
      ]
    },
    contact: {
      title: "Contact UNKNOWN",
      status: "Contact and reporting channels",
      intro: "The Contact page publishes only verified channels configured by the operator. It does not display sample addresses or guessed social accounts.",
      sections: [
        { heading: "Available contact routes", paragraphs: ["Use the general, privacy, safety or legal mailbox shown on the Contact page. Public social and telephone channels are displayed only after the operator configures a verified value."] },
        { heading: "Urgent danger", paragraphs: ["Contact channels are not emergency services or a 24-hour crisis hotline. In immediate danger, contact local emergency services."] }
      ]
    }
  },
  ar: {
    about: {
      title: "عن غير معروف",
      status: "عن المبادرة",
      intro: "غير معروف مساحة للتعبير الكتابي المجهول ومشاركة الحكايات الإنسانية.",
      sections: [
        { heading: "الهدف", paragraphs: ["توفر الخدمة مساحة لكتابة المشاعر والتجارب والحكايات الشخصية دون الحاجة إلى إنشاء ملف شخصي عام.", "الكتابة وسيلة للتعبير، ولا تقدمها غير معروف على أنها علاج طبي أو نفسي أو نتيجة مضمونة."] },
        { heading: "حدود الخدمة", paragraphs: ["غير معروف ليست جهة طبية أو خدمة صحة نفسية أو منصة علاج نفسي أو خطاً ساخناً للأزمات أو خدمة استجابة للطوارئ. ولا تقدم تشخيصاً أو علاجاً أو استشارة سريرية فردية."] },
        { heading: "أصحاب الكلمات", paragraphs: ["ينشئ أصحاب المشاركات والتعليقات محتواهم بأنفسهم. ولا تمثل أقوالهم بالضرورة آراء غير معروف أو مشغّلها."] }
      ]
    },
    terms: {
      title: "الشروط والأحكام",
      status: "شروط الخدمة المنشورة · نافذة من 1 نوفمبر 2026",
      intro: "توضح هذه الشروط قواعد الوصول إلى غير معروف واستخدامها. ولا تنتقص من حقوق المستهلك أو الخصوصية أو أي حقوق إلزامية يقررها القانون المنطبق.",
      sections: [
        { heading: "مشغّل الخدمة وبيانات التواصل", paragraphs: [`مشغّل منصة غير معروف هو ${operatorInfo.nameAr}، وموقعه المعلن ${operatorInfo.locationAr}. البريد الرسمي للتواصل هو ${operatorInfo.email}، ورقم الهاتف وواتساب هو ${operatorInfo.phone}.`] },
        { heading: "الأهلية والوصول", paragraphs: ["الخدمة مخصصة لمن بلغوا 18 عاماً على الأقل. الإقرار العمري في الواجهة ذاتي ولا يمثل تحققاً من الهوية أو العمر عبر وثيقة أو فحص بيومتري. وقد يُقيّد الوصول عندما يفرض القانون المحلي عمراً مختلفاً أو وسيلة تحقق إضافية.", "الإتاحة العالمية هي الوضع الافتراضي. قد يُقيّد الوصول أو النشر في نطاق جغرافي محدد عندما يفرض القانون المنطبق أو أمر رسمي صحيح وقابل للنفاذ هذا الإجراء المحدد."] },
        { heading: "النشر العام والمجهولية", paragraphs: ["تكون المشاركات والتعليقات عامة عند نشرها. يستطيع كل من يصل إلى الصفحة العامة قراءتها أو نسخها أو تصويرها أو فهرستها أو إعادة توزيعها. لا تنشر معلومات تتوقع بقاءها سرية.", "عدم ظهور اسم مستخدم أو ملف شخصي لا يعني ضمان المجهولية المطلقة. قد تكشف الكتابة أو الجهاز أو مزود الشبكة أو التفاصيل التي تضعها في النص أو إجراء قانوني هويتك."] },
        { heading: "محتواك والإذن المحدود", paragraphs: ["تبقى مسؤولاً عن المحتوى الذي تقدمه، ويجب أن تمتلك الحقوق والأذونات اللازمة لإرساله.", "عند إرسال المحتوى، تمنح غير معروف إذناً غير حصري لاستضافته وتخزينه ونسخه وتنسيقه وعرضه وتسليمه بالقدر الضروري بصورة معقولة لتشغيل الخدمة وتأمينها ومراجعتها وتقديمها. ولا تنتقل ملكية المحتوى إلى غير معروف."] },
        { heading: "المحتوى المحظور", bullets: ["التهديد والتحريض والتحرش الموجه والتنمر والإساءة القائمة على الكراهية.", "كشف الهوية أو العنوان أو رقم الهاتف أو بيانات الدخول أو المراسلات الخاصة أو البيانات الشخصية الحساسة للآخرين.", "استغلال الأطفال جنسياً أو نشر مواد حميمة دون موافقة أو تعليمات تسهّل العنف أو إيذاء النفس.", "الاحتيال وانتحال الهوية والروابط الخبيثة والمحتوى غير القانوني وانتهاك حقوق النشر."] },
        { heading: "الإبلاغ والإشراف", paragraphs: ["استخدم وظيفة الإبلاغ في المشاركة أو التعليق لتحديد المحتوى وشرح سبب البلاغ. الفحص الآلي محدود وقد يفوّت محتوى ضاراً أو يضع علامة على تعبير مشروع.", "قد يتأخر المحتوى أو يُقيّد أو يُزال وفق هذه الشروط والقانون المنطبق. وجود نموذج للبلاغات لا يعني وجود فريق مراجعة يعمل على مدار 24 ساعة، ولا تَعِد غير معروف بوقت استجابة فوري."] },
        { heading: "الحذف والاحتفاظ", paragraphs: ["عندما تكون خاصية رمز الحذف مفعّلة، احتفظ بالرمز الخاص الذي يظهر مرة واحدة بعد الإرسال واستخدمه لطلب الحذف. إزالة المحتوى من الصفحة العامة لا تضمن حذف النسخ التي أخذها الآخرون أو نسخ محركات البحث أو النسخ الاحتياطية أو السجلات الواجب الاحتفاظ بها قانوناً.", "لا ترسل كلمات مرور أو وثائق هوية أو معلومات شخصية لا ترتبط بالبلاغ أو طلب الحذف."] },
        { heading: "تغيير الخدمة أو تقييدها", paragraphs: ["يجوز لغير معروف تقييد الوصول إلى محتوى أو خصائص لحماية المستخدمين أو الامتثال للقانون أو معالجة مشكلة أمنية أو صيانة الخدمة. وعندما يكون ذلك مناسباً أو مطلوباً قانوناً، تُقدّم للشخص المتأثر معلومات عن الإجراء ومسار المراجعة المتاح.", "قد تتغير الخدمة أو تتوقف مؤقتاً أو نهائياً، ولا يوجد ضمان باستمرار توفر محتوى أو خاصية إلى أجل غير محدد."] },
        { heading: "عدم التنازل عن الحقوق الإلزامية", paragraphs: ["لا يستبعد أي بند في هذه الشروط مسؤولية أو وسيلة انتصاف أو حقاً للمستخدم لا يسمح القانون باستبعاده أو تقييده. وتبقى واجبات المشغّل التي يفرضها القانون قائمة."] }
      ]
    },
    privacy: {
      title: "سياسة الخصوصية",
      status: "إشعار الخصوصية المنشور · نافذ من 1 نوفمبر 2026",
      intro: "صُممت غير معروف كي لا تتطلب حسابات مستخدمين أو ملفات شخصية عامة. ومع ذلك تعالج معلومات لازمة لتقديم الخدمة وحمايتها من الإساءة والاستجابة لطلبات المستخدمين.",
      sections: [
        { heading: "المشغّل وبيانات التواصل بشأن الخصوصية", paragraphs: [`مشغّل غير معروف هو ${operatorInfo.nameAr}، وموقعه المعلن ${operatorInfo.locationAr}. لطلبات الخصوصية والاستفسارات المتعلقة بمعالجة البيانات، استخدم البريد ${operatorInfo.email}. الهاتف وواتساب: ${operatorInfo.phone}.`] },
        { heading: "المعلومات التي تقدمها", paragraphs: ["عندما يكون النشر متاحاً، تعالج الخدمة نص المشاركة أو التعليق والعنوان الاختياري والتصنيف واللغة ووقت الإرسال ونسخة الشروط والإشعارات التي وافقت عليها مع الإرسال.", "قد تتضمن البلاغات وطلبات الحذف معرّف المحتوى والسبب المختار وتفاصيل إضافية تقرر تقديمها. لا تضع معلومات شخصية غير ضرورية عنك أو عن الآخرين."] },
        { heading: "المعلومات التقنية والأمنية", paragraphs: ["تستخدم الشفرة تجزئة أحادية الاتجاه لرموز الحذف ومؤشرات تقنية محددة النطاق لتقليل التفاعلات المكررة. هذه مؤشرات تقنية مستعارة الهوية، ولا يصح وصف الخدمة بأنها لا تعالج أي معرّفات.", "لا تحفظ شفرة التطبيق عناوين IP الخام في قاعدة بيانات التطبيق. لكن قد يعالج مزودو الاستضافة وشبكات التوزيع والحماية عناوين IP وبيانات الطلب وسجلات الأمان وفق شروط خدماتهم ومدد الاحتفاظ لديهم."] },
        { heading: "الدولة واللغة بصورة تقريبية", paragraphs: ["قد يُستخدم ترويس موثوق من الاستضافة أو شبكة الحافة لاستنتاج الدولة بصورة تقريبية وتحديد رسالة الترحيب واللغة الافتراضية. لا تطلب غير معروف إذن GPS ولا تربط الدولة المكتشفة بمشاركة عامة. ولا يثبت تحديد الدولة الإقامة أو الجنسية أو الاختصاص القانوني."] },
        { heading: "ظهور المحتوى للعامة", paragraphs: ["تكون الحكايات والتعليقات المنشورة عامة، وقد ينسخها الزوار أو يفهرسها طرف ثالث أو يصورها أو يعيد توزيعها. إزالة المحتوى من غير معروف لا تسترجع النسخ الموجودة في أماكن أخرى.", "لا يوفر تصميم المنتج حسابات مستخدمين أو ملفات شخصية عامة أو شبكة متابعين أو رسائل مباشرة أو إعلانات سلوكية أو تصنيفاً فردياً للمشاعر."] },
        { heading: "أغراض المعالجة وأسسها", paragraphs: ["تُستخدم المعلومات لتقديم الخصائص المطلوبة وعرض المحتوى العام وتنظيمه ومنع الإساءة وحماية أمن الخدمة والاستجابة للبلاغات وطلبات الحذف والاحتفاظ بسجلات التشغيل والامتثال للواجبات القانونية. وقد يكون الأساس القانوني، بحسب الدولة والنشاط، تنفيذ الخدمة المطلوبة أو المصلحة المشروعة أو الموافقة عند طلبها أو الامتثال لالتزام قانوني."] },
        { heading: "مزودو الخدمة والمعالجة الدولية", paragraphs: ["قد يعالج مزودو البنية التحتية المعلومات التقنية في المواقع التي تعمل فيها أنظمة الاستضافة والشبكات والتخزين والحماية أو البريد. ويلتزم المشغّل بمطابقة قائمة مزودي الإنتاج ومواقع المعالجة وضمانات النقل الدولي مع الإعداد الفعلي لكل سوق مفعّل."] },
        { heading: "الاحتفاظ والحذف", paragraphs: ["يُحتفظ بالمحتوى والبلاغات وسجلات الحذف وإشارات الأمان والنسخ الاحتياطية فقط للمدة اللازمة لغرض الخدمة أو السلامة أو الأمن أو الالتزام القانوني. وقد تختلف مدد الاحتفاظ بين أنواع السجلات. كما قد تستمر النسخ الاحتياطية ونسخ الأطراف الثالثة حتى انتهاء دورة النسخ أو مدة الاحتفاظ المستقلة بعد إزالة المحتوى من العرض العام.", "تعتمد مدد الاحتفاظ الفعلية في الإنتاج على مزودي الخدمة وإعدادات البنية التحتية التي يجري نشرها. ولا تحدد هذه السياسة مدة ثابتة لم تُقدّم إعداداتها بعد."] },
        { heading: "حقوقك والطلبات", paragraphs: ["قد تتمتع، بحسب القانون المنطبق، بحق الوصول إلى بياناتك أو تصحيحها أو حذفها أو تقييد معالجتها أو الاعتراض عليها أو الحصول على نسخة منها أو تقديم شكوى إلى جهة رقابية. يمكن إرسال الطلبات عبر قناة الخصوصية الظاهرة في صفحة التواصل بعد إعدادها ونشرها من قبل المشغّل."] },
        { heading: "الأطفال", paragraphs: ["الخدمة مخصصة لمن بلغوا 18 عاماً على الأقل. مربع الإقرار العمري الذاتي ليس تحققاً من الهوية أو العمر. ويجب أن تبقى الخدمة غير متاحة في الأسواق التي تتطلب تحققاً أقوى من العمر أو تدابير إضافية لحماية الأطفال إلى حين تنفيذ تلك الضوابط."] },
        { heading: "تحديث السياسة", paragraphs: ["تُثبت التغييرات الجوهرية في هذه السياسة بتحديث رقم الإصدار وتاريخ التحديث في هذه الصفحة. وعندما يفرض القانون إشعاراً أو موافقة على التغيير، يُتبع الإجراء المطلوب."] }
      ]
    },
    disclaimer: {
      title: "إخلاء مسؤولية النشر والخدمة",
      status: "حدود الخدمة المنشورة",
      intro: "توضح هذه الصفحة ما تقدمه غير معروف وما لا تقدمه، وتُقرأ مع الشروط وسياسة الخصوصية وقواعد المجتمع.",
      sections: [
        { heading: "المحتوى الذي ينشئه المستخدم", paragraphs: ["ينشئ أصحاب المشاركات والتعليقات محتواهم بأنفسهم. ولا يعني نشره أن غير معروف تحققت من أقوالهم أو أيدتها أو تبنتها أو أكدت صحتها. قد يكون المحتوى ناقصاً أو غير دقيق أو محل خلاف أو ضاراً."] },
        { heading: "حدود المجهولية", paragraphs: ["لا تتطلب الخدمة اسماً أو ملفاً شخصياً عاماً، لكنها لا تستطيع ضمان أن الكتابة أو معلومات الجهاز أو الشبكة أو الإجراء القانوني أو التفاصيل التي يضعها صاحب المشاركة لن تكشف هويته مطلقاً."] },
        { heading: "ليست خدمة طبية أو قانونية أو مهنية", paragraphs: ["غير معروف ليست علاجاً نفسياً أو تشخيصاً أو استشارة طبية أو علاجاً أو استشارة قانونية أو جهة تحقق إخبارية. استعن بمختص مؤهل في القرارات التي تتطلب خبرة مهنية."] },
        { heading: "ليست خدمة طوارئ", paragraphs: ["غير معروف ليست خدمة طوارئ أو خطاً ساخناً للأزمات، ولا تعد بمراقبة فورية. إذا كنت أنت أو شخص آخر في خطر مباشر، تواصل مع خدمات الطوارئ المحلية أو جهة حماية موثوقة. لا تنتظر رداً من موقع إلكتروني."] },
        { heading: "التوفر والنسخ لدى الآخرين", paragraphs: ["قد تتوقف الخدمة أو تتغير. ويمكن تصوير المحتوى العام أو نسخه أو تخزينه مؤقتاً أو إعادة توزيعه خارج سيطرة غير معروف. حذف مشاركة من الخدمة لا يضمن حذفها من أنظمة الأطراف الأخرى."] },
        { heading: "الحقوق القانونية الإلزامية", paragraphs: ["لا تلغي هذه الصفحة أي واجب أو مسؤولية لا يسمح القانون المنطبق للمشغّل باستبعادها."] }
      ]
    },
    community: {
      title: "قواعد المجتمع",
      status: "قواعد المجتمع والسلامة المنشورة",
      intro: "تحمي هذه القواعد حق التعبير، وتحظر المحتوى الذي يستهدف الناس أو يكشف خصوصيتهم أو يخلق خطراً جدياً على السلامة.",
      sections: [
        { heading: "ما نرحب به", bullets: ["المشاعر والتأملات والتجارب والحكايات الشخصية.", "الاختلاف المحترم والنقد البناء والتعليقات الداعمة.", "التعبير عن الغضب والحزن والاختلاف دون تهديد أو إساءة موجهة."] },
        { heading: "ما لا يُسمح به", bullets: ["التنمر والإذلال والتحرش الموجه والتهديد أو التشجيع على العنف أو إيذاء النفس.", "كشف الهوية أو العنوان أو رقم الهاتف أو بيانات الدخول أو المراسلات المسربة أو البيانات الشخصية الحساسة.", "خطاب الكراهية والاستغلال أو المواد الجنسية التي تتضمن أطفالاً.", "المواد الحميمة المنشورة دون موافقة والاحتيال وانتحال الهوية والروابط الخبيثة والتعليمات التي تسهّل الأذى.", "اتهامات تشهيرية مقدمة كحقائق عن شخص خاص يمكن تحديد هويته أو محتوى ينتهك حقوق الآخرين بصورة غير قانونية."] },
        { heading: "احمِ الخصوصية", paragraphs: ["لا تنشر معلومات تكشف هويتك أو هوية شخص آخر دون أساس قانوني وإذن مناسب. يمكن نسخ المشاركات العامة وإعادة توزيعها حتى بعد حذفها من غير معروف."] },
        { heading: "الإبلاغ عن المحتوى", paragraphs: ["استخدم أداة الإبلاغ في المشاركة أو التعليق المعني واختر السبب الأقرب. قدّم التفاصيل الضرورية فقط. لا ترفق كلمات مرور أو وثائق هوية لا حاجة إليها أو بيانات شخصية زائدة."] },
        { heading: "حدود الإشراف", paragraphs: ["الفحص الآلي طبقة أولية وليس مصنفاً شاملاً؛ قد يفوّت السياق واللهجات واللغة المموهة، وقد يضع علامة على تعبير مشروع. إرسال البلاغ لا يضمن مراجعته فوراً أو خلال مدة زمنية محددة."] }
      ]
    },
    legal: {
      title: "مركز القوانين والحقوق",
      status: "دليل المصادر الرسمية وسجل الاختصاصات",
      intro: "يربط هذا المركز بالقوانين واللوائح والإرشادات الحكومية الرسمية ذات الصلة بخدمة تعبير مجهول ومحتوى ينشئه المستخدمون. وتجمع صفحة كل دولة أهم المصادر وبوابة النشر الحالية.",
      sections: [
        { heading: "طريقة استخدام المصادر", paragraphs: ["تُفضّل النصوص التشريعية والجهات الحكومية والتنظيمية الرسمية في الروابط. راجع أحدث نص موحّد وأحكام بدء النفاذ والنطاق الإقليمي وتعريفات الخدمة قبل الاعتماد على أي مادة.", "ظهور قانون في هذا الدليل لا يعني أن كل أحكامه تنطبق تلقائياً على غير معروف؛ إذ يتوقف التطبيق على المشغّل وتصميم الخدمة والمستخدمين والمعالجة والوقائع الإقليمية."] },
        { heading: "المراجع الدولية", bullets: ["العهد الدولي الخاص بالحقوق المدنية والسياسية — حرية التعبير والحقوق المرتبطة بها.", "الإعلان العالمي لحقوق الإنسان — إعلان دولي لحقوق الإنسان.", "اتفاقية حقوق الطفل — مرجع معاهدي لحقوق الطفل."] },
        { heading: "وثائق الاستشارة العامة", paragraphs: ["يُدرج إعلان الاستشارة أو مشروع اللائحة باعتباره مصدراً تشاورياً، لا باعتباره قانوناً صادراً أو لائحة نهائية نافذة. وتظهر وثيقة الاستشارة العراقية الخاصة بالمحتوى الرقمي بصورة منفصلة في صفحة العراق."] },
        { heading: "تفعيل الأسواق", paragraphs: ["تعتمد غير معروف الإتاحة العالمية بوصفها الوضع الافتراضي، ولا تحجب دولة جغرافياً لمجرد إدراجها في هذا السجل. ولا توقف هذه السياسة الالتزامات الإلزامية التي تنطبق مباشرة بموجب القانون. ولا يُفرض قيد جغرافي أو وظيفي إلا بالقدر الذي يفرضه واجب قانوني منطبق أو أمر موثّق وقابل للنفاذ صادر عن جهة مختصة."] }
      ]
    },
    contact: {
      title: "التواصل مع غير معروف",
      status: "قنوات التواصل والإبلاغ",
      intro: "تعرض صفحة التواصل القنوات التي تم التحقق منها وإعدادها من قبل المشغّل، ولا تعرض عناوين تجريبية أو حسابات مفترضة.",
      sections: [
        { heading: "قنوات التواصل المتاحة", paragraphs: ["استخدم البريد العام أو بريد الخصوصية أو السلامة أو المراسلات القانونية الظاهر في صفحة التواصل. ولا تُعرض الحسابات الاجتماعية أو أرقام الهواتف إلا بعد إعداد قيمة رسمية موثقة لها."] },
        { heading: "الخطر العاجل", paragraphs: ["قنوات التواصل ليست خدمات طوارئ أو خطاً ساخناً يعمل على مدار الساعة. عند وجود خطر مباشر، تواصل مع خدمات الطوارئ المحلية."] }
      ]
    }
  }
};

export function getLegalDocument(key: string, locale: Locale): LegalDocument | null {
  return docs[locale][key] ?? null;
}
