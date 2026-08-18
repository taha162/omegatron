export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** The other language, used by the toggle. */
export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

const ar = {
  meta: {
    localeName: "العربية",
    otherLocaleName: "English",
    otherLocaleLabel: "Switch to English",
    siteName: "أوميكاترون",
    brandSub: "أوميكاترون",
    tagline: "ENGINEER · INNOVATE · WIN",
    title: "أوميكاترون | هندسة أنظمة متكاملة وبحث وتطوير",
    description:
      "أوميكاترون فريق هندسي للبحث والتطوير يُصمّم ويبني ويُكامل أنظمة ذكية تجمع الميكانيكا والإلكترونيات والبرمجيات والذكاء الاصطناعي وأنظمة التحكّم.",
    keywords: [
      "هندسة الميكاترونكس",
      "الروبوتات",
      "الأنظمة المدمجة",
      "أنظمة الذكاء الاصطناعي",
      "حلول هندسية",
      "بحث وتطوير",
      "إنترنت الأشياء",
      "أنظمة التحكّم",
      "الحسّاسات والقياس",
      "أوميكاترون",
      "العراق",
      "NURAI",
    ],
  },

  nav: {
    home: "الرئيسية",
    about: "عن الفريق",
    projects: "المشاريع",
    capabilities: "القدرات",
    founder: "المؤسس",
    contact: "تواصل",
    start: "ابدأ مشروعًا",
    menu: "القائمة",
    close: "إغلاق",
    skipToContent: "تخطَّ إلى المحتوى",
    primary: "التنقّل الرئيسي",
  },

  hero: {
    eyebrow: "هندسة أنظمة متكاملة · بحث وتطوير",
    wordmark: "OmegaTron",
    statement: "نُصمّم ونبني ونُكامل أنظمة هندسية ذكية.",
    lead: "أوميكاترون فريق هندسي للبحث والتطوير يجمع الميكانيكا والإلكترونيات والبرمجيات والذكاء الاصطناعي وأنظمة التحكّم في نظام واحد يعمل — من تعريف المشكلة إلى نموذج مُختبَر.",
    differentiator: "التصميم والتصنيع والبرمجة والاختبار كلّها تجري داخل الفريق.",
    primaryCta: "استعرض المشاريع",
    secondaryCta: "ابدأ مشروعًا",
    facts: [
      { value: "المركز الثالث", label: "على مستوى العراق — NURAI 2026" },
      { value: "خمس طبقات هندسية", label: "ميكانيكا · إلكترونيات · تحكّم · برمجيات · ذكاء اصطناعي" },
      { value: "تنفيذ داخلي", label: "من التصميم إلى النموذج المُختبَر" },
    ],
    imageAlt: "وحدة الاستشعار والقرار المُدمجة التي طوّرها فريق أوميكاترون.",
  },

  achievement: {
    label: "إنجاز",
    place: "المركز الثالث على مستوى العراق",
    event: "NURAI 2026",
    scope: "منافسة وطنية",
    body: "نتيجةٌ حقّقها الفريق بنظام صُمِّم ونُفِّذ واختُبر بالكامل داخله — من الغرفة الميكانيكية إلى البرمجيات المدمجة ونموذج التصنيف.",
    imageAlt: "فريق أوميكاترون في منافسة NURAI 2026.",
  },

  about: {
    index: "٠١",
    label: "عن الفريق",
    heading: "نبني أنظمة، لا عروضًا تقديمية.",
    body: [
      "أوميكاترون فريق هندسي للبحث والتطوير يعمل عند تقاطع خمسة مجالات: الميكانيكا، والإلكترونيات، وأنظمة التحكّم، والبرمجيات، والذكاء الاصطناعي. النظام الحقيقي لا يولد داخل أيٍّ منها منفردًا، بل عند حدودها المشتركة.",
      "نبدأ من متطلّب قابل للقياس، ثم ننتقل إلى معمارية النظام والتنفيذ والتكامل والتحقّق. كل قرار هندسي — اختيار حسّاس، أو خوارزمية، أو تفصيل ميكانيكي — يُتَّخذ لأنه يخدم أداء النظام، لا لأنه يبدو جيّدًا على الورق.",
      "نُصنّع النماذج داخليًا، ونكتب البرمجيات المدمجة بأنفسنا، ونختبر تحت ظروف قريبة من الواقع. ما نعرضه هو ما يعمل فعلًا.",
    ],
    principles: [
      {
        title: "متطلّب قبل حل",
        body: "لا نبدأ من التقنية، بل من المشكلة وحدودها القابلة للقياس.",
      },
      {
        title: "تكامل لا تجميع",
        body: "الميكانيكا والإلكترونيات والبرمجيات تُصمَّم معًا منذ اليوم الأول.",
      },
      {
        title: "نموذج يعمل",
        body: "المعيار المقبول هو نظام يصمد خارج المختبر، لا محاكاة على الشاشة.",
      },
    ],
  },

  projects: {
    index: "٠٢",
    label: "المشاريع",
    heading: "دراسات حالة هندسية",
    lead: "نوثّق مشاريعنا كما نوثّق العمل الهندسي نفسه: المشكلة، والمنهج، والتنفيذ، والنتيجة.",
    oneOf: "ما يلي واحدٌ من مشاريع الفريق، معروضٌ بتفصيله الكامل. بقية المشاريع إمّا قيد التطوير أو محكومة باتفاقيات سرية مع جهات العمل.",
    counterLabel: "مشروع",
    blockLabels: {
      problem: "المشكلة",
      approach: "المنهج",
      engineering: "التنفيذ الهندسي",
      outcome: "النتيجة",
    },
    items: [
      {
        id: "sensing-unit",
        name: "وحدة استشعار وقرار مُدمجة",
        summary:
          "وحدة مستقلة تقرأ الوسط المحيط عبر عدة قنوات، وتُصدر قرارها على المتحكّم نفسه دون الاعتماد على اتصال خارجي.",
        status: "نموذج عامل",
        badge: "NURAI 2026 — المركز الثالث على مستوى العراق",
        domains: ["أنظمة مدمجة", "حسّاسات وقياس", "ذكاء اصطناعي", "تصميم ميكانيكي"],
        problem:
          "كشف الحالة الخطرة في الهواء قرارٌ يجب أن يقع خلال ثوانٍ. الأنظمة التي تُرسل قراءاتها إلى خادم بعيد تُنفق هذه الثواني على الشبكة، وتتوقّف تمامًا حين ينقطع الاتصال — وهو الوضع المعتاد في كثير من المواقع الصناعية والسكنية.",
        approach:
          "بناء وحدة مستقلة تقرأ الوسط المحيط عبر عدة قنوات، وتُنفّذ المعالجة والقرار على المتحكّم نفسه. يصبح الاتصال بالشبكة إضافةً للتسجيل والتنبيه البعيد، لا شرطًا لعمل النظام.",
        engineering:
          "مصفوفة حسّاسات موزّعة داخل غرفة استشعار صُمّمت وطُبعت ثلاثيّ الأبعاد داخل الفريق، مع مسار دخول موجَّه يضبط وصول العيّنة إلى الحسّاسات. فوقها طبقة برمجية مُدمجة تُنقّي الإشارة وتستخلص خصائصها ضمن قيود الزمن الحقيقي، ونموذج تصنيف مُهيّأ ليعمل داخل ذاكرة المتحكّم ويُرفق مستوى ثقة مع كل قرار. صُمّمت الطبقات الثلاث معًا، وأُعيد تعديل الغلاف أكثر من مرة استنادًا إلى نتائج الاختبار لا إلى الشكل.",
        outcome:
          "نموذج عامل يُصدر قراره محليًا ضمن زمن استجابة محدود ومعروف، ودون أي اعتماد على اتصال خارجي. عُرض النظام في NURAI 2026 وحصل على المركز الثالث على مستوى العراق.",
      },
    ],
    confidentialTitle: "ما لا يُنشَر",
    confidentialBody:
      "الهندسة التفصيلية — تركيبة المصفوفة، ومنهج استخلاص الخصائص، وبيانات التدريب والمعايرة، وأبعاد الغرفة الداخلية — محفوظة ولا تُنشَر. ما يظهر هنا وصفٌ للنظام على مستواه المعماري، وهو ما نشارك مثله في أي تعاون قبل توقيع اتفاقية.",
    images: {
      unitAlt: "الوحدة كاملةً: غلاف مطبوع ثلاثيّ الأبعاد تعلوه مصفوفة الحسّاسات.",
      enclosureAlt: "الغلاف الأسود المطبوع ثلاثيّ الأبعاد وفتحة الدخول الجانبية.",
      chamberAlt: "منظر داخل غرفة الاستشعار من فتحة الدخول.",
    },
  },

  capabilities: {
    index: "٠٣",
    label: "القدرات",
    heading: "ما نبنيه",
    lead: "تسعة مجالات نعمل فيها فعليًا، بمنهجية واحدة وأدوات مشتركة.",
    items: [
      {
        title: "الأنظمة المدمجة",
        body: "برمجيات المتحكّمات، وقراءة الحسّاسات، والتشغيل ضمن قيود الزمن الحقيقي والطاقة المحدودة.",
      },
      {
        title: "الروبوتات",
        body: "منصّات متحرّكة وأذرع مناولة: التصميم الحركي، ومنظومة الدفع، والتحكّم بالمسار.",
      },
      {
        title: "أنظمة إنترنت الأشياء",
        body: "أجهزة طرفية متصلة، وبروتوكولات اتصال موفّرة للطاقة، وتسجيل ومراقبة عن بُعد.",
      },
      {
        title: "الذكاء الاصطناعي",
        body: "تصنيف وتنبّؤ ورؤية حاسوبية، مُهيّأة للعمل على أجهزة محدودة الموارد لا على خوادم بعيدة.",
      },
      {
        title: "تعلّم الآلة",
        body: "بناء مجموعات البيانات، وتدريب النماذج وتقييمها، وضغطها حتى تعمل داخل المتحكّم.",
      },
      {
        title: "الحسّاسات والقياس",
        body: "اختيار الحسّاسات، ودوائر تكييف الإشارة، والمعايرة، وتقدير عدم اليقين في القراءة.",
      },
      {
        title: "أنظمة التحكّم",
        body: "حلقات تحكّم مغلقة، وضبط المعاملات، واستجابة مستقرّة تحت الاضطراب والتغيّر.",
      },
      {
        title: "التصميم الميكانيكي",
        body: "نمذجة ثلاثية الأبعاد، وتصميم الأغلفة والتثبيتات، ومراعاة قابلية التصنيع منذ البداية.",
      },
      {
        title: "النمذجة السريعة",
        body: "طباعة ثلاثية الأبعاد، وتجميع وتكرار سريع يقصّر المسافة بين التصميم والاختبار.",
      },
    ],
  },

  process: {
    index: "٠٤",
    label: "المنهجية",
    heading: "عمليتنا الهندسية",
    lead: "خمس مراحل نمرّ بها في كل مشروع، بالترتيب نفسه، ومع مخرج واضح لكل مرحلة.",
    steps: [
      {
        index: "01",
        title: "الاستكشاف",
        body: "نفهم المشكلة وحدودها: بيئة التشغيل، والقيود المعروفة، ومعايير النجاح القابلة للقياس.",
      },
      {
        index: "02",
        title: "التصميم",
        body: "نضع معمارية النظام ونوزّع الوظائف بين الميكانيكا والإلكترونيات والبرمجيات.",
      },
      {
        index: "03",
        title: "التنفيذ",
        body: "نُصنّع الأجزاء ونُجهّز الإلكترونيات ونكتب البرمجيات المدمجة كوحدات قابلة للاختبار.",
      },
      {
        index: "04",
        title: "التكامل",
        body: "نربط الطبقات معًا ونعالج ما يظهر عند حدودها: التوقيت، والضجيج، والطاقة، والتفاوتات.",
      },
      {
        index: "05",
        title: "التحقّق",
        body: "نختبر تحت ظروف قريبة من الواقع، ونقيس، ونُعيد التصميم حتى يستقرّ الأداء.",
      },
    ],
  },

  founder: {
    index: "٠٥",
    label: "المؤسس",
    name: "طه جاسم محمد",
    role: "المؤسس وكبير مهندسي الميكاترونكس",
    quote: "الفريق الجيّد لا يُقاس بما يعرضه، بل بما يستطيع تشغيله.",
    intro:
      "طه جاسم محمد هو مؤسس أوميكاترون وكبير مهندسي الميكاترونكس فيه. يقود معمارية الأنظمة التي يبنيها الفريق، ويشرف على مسار كل مشروع من تعريف المتطلّب إلى نموذج مُختبَر.",
    blocks: [
      {
        title: "الرؤية",
        body: "أن يكون أوميكاترون جهة هندسية عراقية تُبنى فيها الأنظمة كاملةً بدل أن تُجمَّع من مكوّنات جاهزة، وقادرة على العمل مع الصناعة والجامعات ومراكز البحث بمعايير مهنية واضحة.",
      },
      {
        title: "الفلسفة الهندسية",
        body: "الهندسة الجيّدة تُقاس بما يصمد تحت الاختبار. لذلك يبدأ العمل من متطلّب قابل للقياس، وتُصمَّم الطبقات الثلاث معًا منذ اليوم الأول، ولا يُعرض شيء قبل أن يعمل.",
      },
      {
        title: "منهج القيادة",
        body: "منهجية عمل واضحة داخل الفريق: توثيق القرارات الهندسية وأسبابها، ومراجعة التصاميم قبل التنفيذ، واختبار منظّم قبل أي عرض.",
      },
    ],
    expertiseTitle: "مجالات الخبرة",
    expertise: [
      "هندسة الأنظمة",
      "الأنظمة المدمجة",
      "الروبوتات",
      "الذكاء الاصطناعي",
      "الحسّاسات الذكية",
    ],
    imageAlt: "طه جاسم محمد، مؤسس أوميكاترون وكبير مهندسي الميكاترونكس.",
  },

  contact: {
    index: "٠٦",
    label: "تواصل",
    heading: "لديك تحدٍّ هندسي؟ لنبنِ الحل.",
    lead: "أرسل وصفًا موجزًا للتحدّي. نقرأ كل طلب بأنفسنا، ونردّ برأي هندسي أوّلي وخطوة تالية واضحة.",
    fullFormPrompt: "تحتاج إلى إرسال ميزانية أو جدول زمني أو ملفات مرفقة؟",
    fullFormLink: "استخدم نموذج الطلب الكامل",
  },

  start: {
    index: "٠٧",
    label: "ابدأ مشروعًا",
    heading: "أخبرنا بما تريد بناءه",
    lead: "كلما كان الوصف أدقّ، كان الرد الهندسي أوضح. لا حاجة إلى ملف متطلّبات كامل — تحدٍّ محدّد يكفي للبداية.",
    aside: {
      title: "قبل أن ترسل",
      items: [
        "صِف البيئة التي سيعمل فيها النظام: داخل مبنى أم في الخارج، ودرجة الحرارة والرطوبة إن كانت مؤثّرة.",
        "اذكر القيود المعروفة لديك: الحجم، ومصدر الطاقة، والتكلفة، والموعد النهائي.",
        "أرفق ما لديك: رسمًا يدويًا، أو ورقة مواصفات، أو صورًا لنظام مشابه.",
      ],
      noteTitle: "الرد",
      noteBody:
        "نردّ عادةً خلال أيام قليلة. الطلبات الناقصة تستغرق وقتًا أطول، لأننا نعود إليك بأسئلة قبل أن نستطيع تقييمها.",
    },
    steps: [
      { index: "01", title: "ترسل الطلب", body: "تملأ النموذج بتفاصيل التحدّي والنتيجة المتوقّعة." },
      { index: "02", title: "مراجعة هندسية", body: "نقرأ الطلب ونحدّد الجدوى والقيود الأساسية." },
      { index: "03", title: "رد مباشر", body: "نردّ عبر البريد أو واتساب برأي أوّلي وأسئلة توضيحية." },
      { index: "04", title: "نطاق وخطة", body: "نتفق على النطاق والمراحل والجدول الزمني قبل البدء." },
    ],
    form: {
      legendContact: "بيانات التواصل",
      legendProject: "تفاصيل المشروع",
      name: "الاسم الكامل",
      namePlaceholder: "الاسم الثلاثي أو اسم الجهة",
      email: "البريد الإلكتروني",
      emailPlaceholder: "name@example.com",
      phone: "الهاتف أو واتساب",
      phonePlaceholder: "‎+964 7XX XXX XXXX",
      organization: "الجهة",
      organizationPlaceholder: "شركة، جامعة، أو مشروع شخصي",
      environment: "بيئة التشغيل",
      environmentOptions: [
        "داخل مبنى — بيئة مضبوطة",
        "داخل مبنى — بيئة صناعية",
        "في الخارج",
        "على مركبة أو منصّة متحرّكة",
        "غير محدّدة بعد",
      ],
      stage: "المرحلة الحالية",
      stageOptions: [
        "فكرة أولية",
        "متطلّبات مكتوبة",
        "نموذج أولي قائم",
        "نظام يعمل ويحتاج تطويرًا",
      ],
      projectType: "نوع المشروع",
      projectTypeOptions: [
        "نظام مدمج وحسّاسات",
        "روبوت أو نظام متحرّك",
        "أتمتة وأنظمة تحكّم",
        "ذكاء اصطناعي ورؤية حاسوبية",
        "إنترنت الأشياء والمراقبة عن بُعد",
        "تصميم ميكانيكي ونمذجة",
        "استشارة هندسية",
        "أخرى",
      ],
      description: "وصف التحدّي",
      descriptionPlaceholder:
        "ما المشكلة التي تريد حلّها؟ وما البيئة التي سيعمل فيها النظام؟ وما القيود المعروفة لديك؟",
      outcome: "النتيجة المتوقّعة",
      outcomePlaceholder: "ما الذي يجب أن يفعله النظام حتى تعتبر المشروع ناجحًا؟",
      budget: "الميزانية التقديرية",
      budgetOptions: [
        "أقل من ٥٠٠ دولار",
        "٥٠٠ – ٢٬٠٠٠ دولار",
        "٢٬٠٠٠ – ٥٬٠٠٠ دولار",
        "٥٬٠٠٠ – ١٥٬٠٠٠ دولار",
        "أكثر من ١٥٬٠٠٠ دولار",
        "غير محدّدة بعد",
      ],
      timeline: "الإطار الزمني",
      timelineOptions: [
        "عاجل — أقل من شهر",
        "من شهر إلى ٣ أشهر",
        "من ٣ إلى ٦ أشهر",
        "أكثر من ٦ أشهر",
        "مرن",
      ],
      attachments: "مرفقات",
      attachmentsHint:
        "حتى ٣ ملفات، بحجم إجمالي لا يتجاوز ٤ ميغابايت. الصيغ المقبولة: PDF، صور، مستندات، مضغوطات.",
      attachmentsButton: "اختر ملفات",
      attachmentsEmpty: "لم تُختَر أي ملفات",
      attachmentsRemove: "إزالة",
      select: "اختر…",
      optional: "اختياري",
      required: "مطلوب",
      requiredNote: "الحقول المعلَّمة بـ * إجبارية. نطلبها لأن الرد الهندسي لا يكون دقيقًا بدونها.",
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال…",
      privacy: "تُرسَل بياناتك إلى فريق أوميكاترون فقط، ولا تُشارك مع أي جهة أخرى.",
    },
    validation: {
      name: "يرجى كتابة الاسم.",
      email: "يرجى كتابة بريد إلكتروني صحيح.",
      phone: "يرجى كتابة رقم هاتف أو واتساب.",
      projectType: "يرجى اختيار نوع المشروع.",
      description: "يرجى وصف التحدّي بما لا يقل عن ٢٠ حرفًا.",
      outcome: "يرجى وصف النتيجة المتوقّعة.",
      budget: "يرجى اختيار الميزانية التقديرية.",
      timeline: "يرجى اختيار الإطار الزمني.",
      environment: "يرجى اختيار بيئة التشغيل.",
      stage: "يرجى اختيار المرحلة الحالية.",
      filesCount: "الحد الأقصى ٣ ملفات.",
      filesSize: "الحجم الإجمالي للمرفقات يتجاوز ٤ ميغابايت.",
      filesType: "صيغة ملف غير مقبولة.",
      tooMany: "أرسلت طلبات كثيرة خلال وقت قصير. يرجى المحاولة بعد قليل.",
      generic: "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.",
      network: "تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مجددًا.",
    },
    success: {
      title: "وصلنا طلبك.",
      body: "سنراجعه ونردّ عليك عبر البريد الإلكتروني أو واتساب. إن كان الطلب عاجلًا، أعد الإرسال مع كلمة «عاجل» في وصف التحدّي.",
      again: "إرسال طلب آخر",
    },
    errorTitle: "لم يُرسَل الطلب",
  },

  footer: {
    tagline: "نُصمّم ونبني ونُكامل أنظمة هندسية ذكية.",
    sections: "الأقسام",
    contact: "التواصل",
    startLabel: "طلب مشروع",
    language: "اللغة",
    rights: "جميع الحقوق محفوظة.",
    location: "العراق",
  },

  notFound: {
    title: "الصفحة غير موجودة",
    body: "الرابط الذي فتحته لا يقود إلى صفحة قائمة.",
    home: "العودة إلى الرئيسية",
  },
};

/** English mirrors the Arabic structure exactly; the compiler enforces it. */
const en: typeof ar = {
  meta: {
    localeName: "English",
    otherLocaleName: "العربية",
    otherLocaleLabel: "التبديل إلى العربية",
    siteName: "OmegaTron",
    brandSub: "Mechatronics R&D",
    tagline: "ENGINEER · INNOVATE · WIN",
    title: "OmegaTron | Integrated Systems Engineering & R&D",
    description:
      "OmegaTron is an engineering R&D team that designs, builds, and integrates intelligent systems across mechanics, electronics, software, artificial intelligence, and control.",
    keywords: [
      "mechatronics engineering",
      "robotics",
      "embedded systems",
      "AI systems",
      "engineering solutions",
      "research and development",
      "IoT systems",
      "control systems",
      "sensors and instrumentation",
      "OmegaTron",
      "Iraq",
      "NURAI",
    ],
  },

  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    capabilities: "Capabilities",
    founder: "Founder",
    contact: "Contact",
    start: "Start a Project",
    menu: "Menu",
    close: "Close",
    skipToContent: "Skip to content",
    primary: "Primary",
  },

  hero: {
    eyebrow: "Integrated Systems Engineering · R&D",
    wordmark: "OmegaTron",
    statement: "We design, build, and integrate intelligent engineering systems.",
    lead: "OmegaTron is an engineering R&D team that brings mechanics, electronics, software, artificial intelligence, and control together into one working system — from problem definition to a tested prototype.",
    differentiator: "Design, fabrication, firmware, and testing all happen inside the team.",
    primaryCta: "Explore Projects",
    secondaryCta: "Start a Project",
    facts: [
      { value: "3rd Place", label: "Nationally in Iraq — NURAI 2026" },
      { value: "Five Engineering Layers", label: "Mechanics · Electronics · Control · Software · AI" },
      { value: "Built In-House", label: "From design through to a tested prototype" },
    ],
    imageAlt: "The embedded sensing and decision unit developed by the OmegaTron team.",
  },

  achievement: {
    label: "Recognition",
    place: "3rd Place in Iraq",
    event: "NURAI 2026",
    scope: "National competition",
    body: "A result earned with a system designed, built, and tested entirely within the team — from the mechanical chamber through to the embedded software and the classification model.",
    imageAlt: "The OmegaTron team at the NURAI 2026 competition.",
  },

  about: {
    index: "01",
    label: "About",
    heading: "We build systems, not slide decks.",
    body: [
      "OmegaTron is an engineering R&D team working at the intersection of five disciplines: mechanics, electronics, control systems, software, and artificial intelligence. A real system is not born inside any one of them — it is born at the boundaries between them.",
      "We start from a measurable requirement, then move through system architecture, build, integration, and validation. Every engineering decision — a sensor choice, an algorithm, a mechanical detail — is made because it serves the system's performance, not because it reads well on paper.",
      "We fabricate prototypes in-house, write our own embedded software, and test under conditions close to the real thing. What we present is what actually runs.",
    ],
    principles: [
      {
        title: "Requirement Before Solution",
        body: "We start from the problem and its measurable limits, not from the technology.",
      },
      {
        title: "Integration, Not Assembly",
        body: "Mechanics, electronics, and software are designed together from day one.",
      },
      {
        title: "A Prototype That Runs",
        body: "The accepted standard is a system that holds up outside the lab, not a simulation on a screen.",
      },
    ],
  },

  projects: {
    index: "02",
    label: "Projects",
    heading: "Engineering Case Studies",
    lead: "We document our projects the way we document the engineering itself: the problem, the approach, the build, and the result.",
    oneOf: "What follows is one of the team's projects, documented in full. The others are either in development or covered by confidentiality agreements with the parties involved.",
    counterLabel: "Project",
    blockLabels: {
      problem: "Problem",
      approach: "Approach",
      engineering: "Engineering",
      outcome: "Outcome",
    },
    items: [
      {
        id: "sensing-unit",
        name: "Embedded Sensing and Decision Unit",
        summary:
          "A self-contained unit that reads its surroundings across several channels and reaches its decision on the controller itself, with no dependency on an external connection.",
        status: "Working prototype",
        badge: "NURAI 2026 — 3rd Place in Iraq",
        domains: ["Embedded Systems", "Sensors & Instrumentation", "Artificial Intelligence", "Mechanical Design"],
        problem:
          "Detecting a hazardous condition in air is a decision that has to land within seconds. Systems that ship their readings to a remote server spend those seconds on the network, and stop working altogether when the link drops — which is the normal state of affairs across many industrial and residential sites.",
        approach:
          "Build a self-contained unit that reads its surroundings across several channels and performs both the processing and the decision on the controller itself. Network connectivity becomes an addition for logging and remote alerting, not a precondition for the system to function.",
        engineering:
          "A sensor array distributed inside a sensing chamber designed and 3D-printed in-house, with a directed intake path governing how the sample reaches the sensors. Above it, an embedded software layer conditions the signal and extracts its features under real-time constraints, and a classification model sized to fit the controller's memory returns a confidence level with every decision. All three layers were designed together, and the enclosure was revised several times against test results rather than appearance.",
        outcome:
          "A working prototype that reaches its decision locally, within a bounded and known response time, with no external connection involved. The system was presented at NURAI 2026 and placed 3rd nationally in Iraq.",
      },
    ],
    confidentialTitle: "What We Do Not Publish",
    confidentialBody:
      "The detailed engineering — array composition, the feature-extraction method, training and calibration data, and internal chamber geometry — is proprietary and stays unpublished. What appears here describes the system at the architectural level, and it is the same level we share in any collaboration before an agreement is signed.",
    images: {
      unitAlt: "The complete unit: a 3D-printed enclosure topped by the sensor array.",
      enclosureAlt: "The black 3D-printed enclosure and its side intake port.",
      chamberAlt: "A view inside the sensing chamber through the intake port.",
    },
  },

  capabilities: {
    index: "03",
    label: "Capabilities",
    heading: "What We Build",
    lead: "Nine fields we actually work in, under one method and a shared toolset.",
    items: [
      {
        title: "Embedded Systems",
        body: "Microcontroller firmware, sensor acquisition, and operation under real-time and limited-power constraints.",
      },
      {
        title: "Robotics",
        body: "Mobile platforms and manipulators: kinematic design, drivetrain, and path control.",
      },
      {
        title: "IoT Systems",
        body: "Connected edge devices, power-efficient communication protocols, and remote logging and monitoring.",
      },
      {
        title: "Artificial Intelligence",
        body: "Classification, prediction, and computer vision, prepared to run on constrained hardware rather than remote servers.",
      },
      {
        title: "Machine Learning",
        body: "Dataset construction, model training and evaluation, and compression until the model fits on the controller.",
      },
      {
        title: "Sensors & Instrumentation",
        body: "Sensor selection, signal-conditioning circuits, calibration, and estimating the uncertainty in a reading.",
      },
      {
        title: "Control Systems",
        body: "Closed control loops, parameter tuning, and stable response under disturbance and drift.",
      },
      {
        title: "Mechanical Design",
        body: "3D modelling, enclosure and mounting design, and manufacturability considered from the outset.",
      },
      {
        title: "Rapid Prototyping",
        body: "3D printing, assembly, and fast iteration that shortens the distance between design and test.",
      },
    ],
  },

  process: {
    index: "04",
    label: "Method",
    heading: "Our Engineering Process",
    lead: "Five stages we run in every project, in the same order, each with a defined deliverable.",
    steps: [
      {
        index: "01",
        title: "Discover",
        body: "We map the problem and its limits: the operating environment, the known constraints, and measurable criteria for success.",
      },
      {
        index: "02",
        title: "Design",
        body: "We set the system architecture and allocate functions across mechanics, electronics, and software.",
      },
      {
        index: "03",
        title: "Build",
        body: "We fabricate the parts, prepare the electronics, and write the embedded software as testable units.",
      },
      {
        index: "04",
        title: "Integrate",
        body: "We bring the layers together and resolve what surfaces at their boundaries: timing, noise, power, and tolerances.",
      },
      {
        index: "05",
        title: "Validate",
        body: "We test under conditions close to the real thing, measure, and redesign until performance holds.",
      },
    ],
  },

  founder: {
    index: "05",
    label: "Leadership",
    name: "Taha Jasim Mohammed",
    role: "Founder & Lead Mechatronics Engineer",
    quote: "A good team is measured not by what it presents, but by what it can actually run.",
    intro:
      "Taha Jasim Mohammed founded OmegaTron and leads its mechatronics engineering. He owns the architecture of the systems the team builds and oversees each project from requirement definition through to a tested prototype.",
    blocks: [
      {
        title: "Vision",
        body: "For OmegaTron to be an Iraqi engineering practice where systems are built end to end rather than assembled from off-the-shelf parts — and one that can work with industry, universities, and research centres to a clear professional standard.",
      },
      {
        title: "Engineering Philosophy",
        body: "Good engineering is measured by what survives testing. So the work starts from a measurable requirement, the three layers are designed together from day one, and nothing is presented before it runs.",
      },
      {
        title: "How the Team Works",
        body: "A clear working method inside the team: engineering decisions and their reasoning are documented, designs are reviewed before they are built, and testing is structured before anything is shown.",
      },
    ],
    expertiseTitle: "Areas of Expertise",
    expertise: [
      "Systems Engineering",
      "Embedded Systems",
      "Robotics",
      "Artificial Intelligence",
      "Intelligent Sensors",
    ],
    imageAlt: "Taha Jasim Mohammed, founder and lead mechatronics engineer at OmegaTron.",
  },

  contact: {
    index: "06",
    label: "Contact",
    heading: "Have an engineering challenge? Let's build the solution.",
    lead: "Send us a short description of the challenge. We read every enquiry ourselves and reply with an initial engineering opinion and a clear next step.",
    fullFormPrompt: "Need to send a budget, a timeline, or attachments?",
    fullFormLink: "Use the full project request form",
  },

  start: {
    index: "07",
    label: "Start a Project",
    heading: "Tell us what you want to build",
    lead: "The more precise the description, the clearer the engineering reply. You do not need a full requirements document — a well-defined challenge is enough to begin.",
    aside: {
      title: "Before you send",
      items: [
        "Describe where the system will operate: indoors or outdoors, and temperature or humidity if they matter.",
        "State the constraints you already know: size, power source, cost, and deadline.",
        "Attach whatever you have: a hand sketch, a specification sheet, or photos of a comparable system.",
      ],
      noteTitle: "Our reply",
      noteBody:
        "We usually reply within a few days. Incomplete requests take longer, because we have to come back with questions before we can assess them.",
    },
    steps: [
      { index: "01", title: "You Send", body: "Fill in the form with the details of the challenge and the outcome you expect." },
      { index: "02", title: "Engineering Review", body: "We read the request and assess feasibility and core constraints." },
      { index: "03", title: "Direct Reply", body: "We respond by email or WhatsApp with a first opinion and clarifying questions." },
      { index: "04", title: "Scope and Plan", body: "We agree on scope, milestones, and schedule before any work starts." },
    ],
    form: {
      legendContact: "Contact Details",
      legendProject: "Project Details",
      name: "Full Name",
      namePlaceholder: "Your name or your organisation",
      email: "Email Address",
      emailPlaceholder: "name@example.com",
      phone: "Phone or WhatsApp",
      phonePlaceholder: "+964 7XX XXX XXXX",
      organization: "Organisation",
      organizationPlaceholder: "Company, university, or personal project",
      environment: "Operating Environment",
      environmentOptions: [
        "Indoors — controlled environment",
        "Indoors — industrial environment",
        "Outdoors",
        "On a vehicle or mobile platform",
        "Not defined yet",
      ],
      stage: "Current Stage",
      stageOptions: [
        "Initial idea",
        "Written requirements",
        "Existing prototype",
        "Working system needing development",
      ],
      projectType: "Project Type",
      projectTypeOptions: [
        "Embedded system and sensors",
        "Robot or mobile system",
        "Automation and control systems",
        "AI and computer vision",
        "IoT and remote monitoring",
        "Mechanical design and prototyping",
        "Engineering consultation",
        "Other",
      ],
      description: "Describe the Challenge",
      descriptionPlaceholder:
        "What problem are you solving? Where will the system operate? What constraints do you already know about?",
      outcome: "Expected Outcome",
      outcomePlaceholder: "What must the system do for you to consider the project a success?",
      budget: "Estimated Budget",
      budgetOptions: [
        "Under $500",
        "$500 – $2,000",
        "$2,000 – $5,000",
        "$5,000 – $15,000",
        "Over $15,000",
        "Not defined yet",
      ],
      timeline: "Timeline",
      timelineOptions: [
        "Urgent — under a month",
        "1 – 3 months",
        "3 – 6 months",
        "More than 6 months",
        "Flexible",
      ],
      attachments: "Attachments",
      attachmentsHint:
        "Up to 3 files, 4 MB total. Accepted formats: PDF, images, documents, and archives.",
      attachmentsButton: "Choose files",
      attachmentsEmpty: "No files selected",
      attachmentsRemove: "Remove",
      select: "Select…",
      optional: "Optional",
      required: "Required",
      requiredNote: "Fields marked * are mandatory. We ask for them because an engineering reply is not accurate without them.",
      submit: "Send Request",
      submitting: "Sending…",
      privacy: "Your details go to the OmegaTron team only and are never shared with anyone else.",
    },
    validation: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a phone or WhatsApp number.",
      projectType: "Please choose a project type.",
      description: "Please describe the challenge in at least 20 characters.",
      outcome: "Please describe the expected outcome.",
      budget: "Please choose an estimated budget.",
      timeline: "Please choose a timeline.",
      environment: "Please choose the operating environment.",
      stage: "Please choose the current stage.",
      filesCount: "A maximum of 3 files is allowed.",
      filesSize: "Total attachment size exceeds 4 MB.",
      filesType: "That file format is not accepted.",
      tooMany: "Too many requests in a short time. Please try again shortly.",
      generic: "The request could not be sent. Please try again.",
      network: "Could not reach the server. Check your connection and try again.",
    },
    success: {
      title: "Your request has reached us.",
      body: "We will review it and reply by email or WhatsApp. If it is urgent, resend it with the word “urgent” in the description.",
      again: "Send another request",
    },
    errorTitle: "Request not sent",
  },

  footer: {
    tagline: "We design, build, and integrate intelligent engineering systems.",
    sections: "Sections",
    contact: "Contact",
    startLabel: "Project request",
    language: "Language",
    rights: "All rights reserved.",
    location: "Iraq",
  },

  notFound: {
    title: "Page not found",
    body: "The link you opened does not lead to an existing page.",
    home: "Back to home",
  },
};

export type Dictionary = typeof ar;

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
