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
    siteName: "أوميكاترون",
    brandSub: "أوميكاترون",
    tagline: "ENGINEER · INNOVATE · WIN",
    otherLocaleLabel: "Switch to English",
    title: "أوميكاترون | فريق ميكاترونكس",
    description:
      "أوميكاترون فريق ميكاترونكس في العراق. نبني أنظمة تستشعر وتقرّر وتتحرّك — تصميمًا وتصنيعًا وبرمجة داخل الفريق.",
    keywords: [
      "ميكاترونكس",
      "روبوتات",
      "أنظمة مدمجة",
      "ذكاء اصطناعي",
      "حسّاسات",
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
    theme: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
  },

  hero: {
    wordmark: "OmegaTron",
    statement: "نبني أنظمة تستشعر وتقرّر وتتحرّك.",
    lead: "فريق ميكاترونكس في العراق. نصمّم ونصنّع ونبرمج داخل الفريق.",
    primaryCta: "شاهد المشاريع",
    secondaryCta: "ابدأ مشروعًا",
    imageAlt: "وحدة الاستشعار التي طوّرها فريق أوميكاترون.",
  },

  about: {
    label: "عن الفريق",
    heading: "نبني الأنظمة كاملةً، لا نجمّعها.",
    body: "أوميكاترون فريق ميكاترونكس يعمل بين الميكانيكا والإلكترونيات والبرمجيات والذكاء الاصطناعي. نصمّم ونصنّع ونختبر داخل الفريق، ولا نعرض شيئًا قبل أن يعمل.",
    imageAlt: "الفريق أثناء العمل على وحدة الاستشعار.",
  },

  projects: {
    label: "المشاريع",
    heading: "ما بنيناه",
    oneOf: "هذا واحد من مشاريعنا. البقية قيد التطوير أو تحت اتفاقيات سرية.",
    privacy: "التفاصيل الداخلية والخوارزميات محفوظة.",
    items: [
      {
        id: "sensing-unit",
        name: "وحدة استشعار وقرار مُدمجة",
        status: "نموذج عامل",
        award: "NURAI 2026 — المركز الثالث في العراق",
        summary:
          "وحدة تقرأ الهواء عبر عدة حسّاسات وتُصدر قرارها على المتحكّم نفسه، دون شبكة. صُمّم الغلاف وطُبع ثلاثيّ الأبعاد داخل الفريق.",
        points: [
          "قرار محلي خلال ثوانٍ",
          "تعمل دون اتصال بالإنترنت",
          "غلاف مُصمَّم لمسار الهواء",
        ],
        domains: ["أنظمة مدمجة", "حسّاسات", "ذكاء اصطناعي", "تصميم ميكانيكي"],
      },
    ],
    images: {
      unitAlt: "الوحدة كاملةً: مصفوفة الحسّاسات فوق الغلاف المطبوع.",
      enclosureAlt: "الغلاف المطبوع ثلاثيّ الأبعاد وفتحة دخول الهواء.",
      chamberAlt: "منظر داخل غرفة الاستشعار.",
    },
  },

  capabilities: {
    label: "القدرات",
    heading: "ما نعمل عليه",
    items: [
      { title: "الأنظمة المدمجة", body: "برمجة المتحكّمات وقراءة الحسّاسات" },
      { title: "الروبوتات", body: "منصّات متحرّكة وأذرع" },
      { title: "إنترنت الأشياء", body: "أجهزة متصلة ومراقبة عن بُعد" },
      { title: "الذكاء الاصطناعي", body: "تصنيف ورؤية على أجهزة صغيرة" },
      { title: "تعلّم الآلة", body: "تدريب النماذج وضغطها" },
      { title: "الحسّاسات والقياس", body: "الاختيار والمعايرة وتكييف الإشارة" },
      { title: "أنظمة التحكّم", body: "حلقات مغلقة واستجابة مستقرّة" },
      { title: "التصميم الميكانيكي", body: "نمذجة ثلاثية الأبعاد وأغلفة" },
      { title: "النمذجة السريعة", body: "طباعة وتجميع واختبار سريع" },
    ],
  },

  founder: {
    label: "المؤسس",
    name: "طه جاسم محمد",
    role: "المؤسس ومهندس ميكاترونكس",
    body: "أسّس أوميكاترون ويقود العمل الهندسي فيه. يتابع المشاريع من المتطلّب الأول إلى النموذج المُختبَر.",
    imageAlt: "طه جاسم محمد، مؤسس أوميكاترون.",
  },

  contact: {
    label: "تواصل",
    heading: "لديك مشروع؟",
    lead: "أرسل وصفًا قصيرًا، ونردّ برأي هندسي أوّلي.",
    fullFormPrompt: "تحتاج إلى إضافة ميزانية أو جدول زمني أو ملفات؟",
    fullFormLink: "النموذج الكامل",
  },

  start: {
    label: "ابدأ مشروعًا",
    heading: "أخبرنا بما تريد بناءه",
    lead: "وصف دقيق يعني ردًّا هندسيًا أوضح. لا حاجة إلى ملف متطلّبات كامل.",
    aside: {
      title: "قبل أن ترسل",
      items: [
        "أين سيعمل النظام؟ داخل مبنى أم في الخارج.",
        "ما القيود المعروفة؟ الحجم والطاقة والتكلفة والوقت.",
        "أرفق ما لديك: رسمًا، أو مواصفات، أو صورًا.",
      ],
    },
    form: {
      legendContact: "بيانات التواصل",
      legendProject: "تفاصيل المشروع",
      name: "الاسم",
      namePlaceholder: "اسمك أو اسم الجهة",
      email: "البريد الإلكتروني",
      emailPlaceholder: "name@example.com",
      phone: "الهاتف أو واتساب",
      phonePlaceholder: "‎+964 7XX XXX XXXX",
      organization: "الجهة",
      organizationPlaceholder: "شركة، جامعة، أو مشروع شخصي",
      projectType: "نوع المشروع",
      projectTypeOptions: [
        "نظام مدمج وحسّاسات",
        "روبوت أو نظام متحرّك",
        "أتمتة وتحكّم",
        "ذكاء اصطناعي ورؤية حاسوبية",
        "إنترنت الأشياء",
        "تصميم ميكانيكي ونمذجة",
        "استشارة هندسية",
        "أخرى",
      ],
      description: "وصف المشروع",
      descriptionPlaceholder: "ما المشكلة؟ وأين سيعمل النظام؟ وما القيود؟",
      outcome: "النتيجة المتوقّعة",
      outcomePlaceholder: "ما الذي يجب أن يفعله النظام حتى يكون ناجحًا؟",
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
      attachmentsHint: "حتى ٣ ملفات، ٤ ميغابايت إجمالًا.",
      attachmentsButton: "اختر ملفات",
      attachmentsEmpty: "لم تُختَر ملفات",
      attachmentsRemove: "إزالة",
      select: "اختر…",
      optional: "اختياري",
      required: "مطلوب",
      requiredNote: "الحقول المعلَّمة بـ * مطلوبة.",
      submit: "إرسال",
      submitting: "جارٍ الإرسال…",
      privacy: "تصل بياناتك إلى فريق أوميكاترون فقط.",
    },
    validation: {
      name: "يرجى كتابة الاسم.",
      email: "يرجى كتابة بريد إلكتروني صحيح.",
      phone: "يرجى كتابة رقم هاتف أو واتساب.",
      projectType: "يرجى اختيار نوع المشروع.",
      description: "يرجى وصف المشروع بما لا يقل عن ٢٠ حرفًا.",
      outcome: "يرجى وصف النتيجة المتوقّعة.",
      budget: "يرجى اختيار الميزانية.",
      timeline: "يرجى اختيار الإطار الزمني.",
      environment: "يرجى اختيار بيئة التشغيل.",
      stage: "يرجى اختيار المرحلة الحالية.",
      filesCount: "الحد الأقصى ٣ ملفات.",
      filesSize: "حجم المرفقات يتجاوز ٤ ميغابايت.",
      filesType: "صيغة ملف غير مقبولة.",
      tooMany: "أرسلت طلبات كثيرة. حاول بعد قليل.",
      generic: "تعذّر الإرسال. حاول مرة أخرى.",
      network: "تعذّر الاتصال بالخادم.",
    },
    success: {
      title: "وصلنا طلبك.",
      body: "سنراجعه ونردّ عبر البريد أو واتساب.",
      again: "إرسال طلب آخر",
    },
    errorTitle: "لم يُرسَل الطلب",
  },

  footer: {
    sections: "الأقسام",
    contact: "التواصل",
    startLabel: "طلب مشروع",
    language: "اللغة",
    rights: "جميع الحقوق محفوظة.",
    location: "العراق",
  },

  notFound: {
    title: "الصفحة غير موجودة",
    body: "هذا الرابط لا يقود إلى صفحة قائمة.",
    home: "العودة إلى الرئيسية",
  },
};

/** English mirrors the Arabic structure exactly; the compiler enforces it. */
const en: typeof ar = {
  meta: {
    siteName: "OmegaTron",
    brandSub: "Mechatronics",
    tagline: "ENGINEER · INNOVATE · WIN",
    otherLocaleLabel: "التبديل إلى العربية",
    title: "OmegaTron | Mechatronics Team",
    description:
      "OmegaTron is a mechatronics team in Iraq. We build systems that sense, decide, and move — designed, fabricated, and programmed in-house.",
    keywords: [
      "mechatronics",
      "robotics",
      "embedded systems",
      "artificial intelligence",
      "sensors",
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
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
  },

  hero: {
    wordmark: "OmegaTron",
    statement: "We build systems that sense, decide, and move.",
    lead: "A mechatronics team in Iraq. We design, fabricate, and program in-house.",
    primaryCta: "See our work",
    secondaryCta: "Start a project",
    imageAlt: "The sensing unit developed by the OmegaTron team.",
  },

  about: {
    label: "About",
    heading: "We build systems end to end, not from a parts bin.",
    body: "OmegaTron is a mechatronics team working across mechanics, electronics, software, and AI. We design, fabricate, and test in-house, and we don't show anything before it runs.",
    imageAlt: "The team working on the sensing unit.",
  },

  projects: {
    label: "Projects",
    heading: "What we've built",
    oneOf: "This is one of our projects. The rest are in development or under confidentiality.",
    privacy: "Internal design and algorithms stay private.",
    items: [
      {
        id: "sensing-unit",
        name: "Embedded Sensing and Decision Unit",
        status: "Working prototype",
        award: "NURAI 2026 — 3rd place in Iraq",
        summary:
          "A unit that reads the air through several sensors and reaches its decision on the controller itself, with no network. The enclosure was designed and 3D-printed in-house.",
        points: [
          "Local decision within seconds",
          "Runs with no internet connection",
          "Enclosure shaped around the airflow",
        ],
        domains: ["Embedded", "Sensors", "AI", "Mechanical design"],
      },
    ],
    images: {
      unitAlt: "The complete unit: the sensor array above the printed enclosure.",
      enclosureAlt: "The 3D-printed enclosure and its air intake port.",
      chamberAlt: "A view inside the sensing chamber.",
    },
  },

  capabilities: {
    label: "Capabilities",
    heading: "What we work on",
    items: [
      { title: "Embedded Systems", body: "Firmware and sensor acquisition" },
      { title: "Robotics", body: "Mobile platforms and arms" },
      { title: "IoT", body: "Connected devices and remote monitoring" },
      { title: "Artificial Intelligence", body: "Classification and vision on small hardware" },
      { title: "Machine Learning", body: "Model training and compression" },
      { title: "Sensors", body: "Selection, calibration, signal conditioning" },
      { title: "Control Systems", body: "Closed loops and stable response" },
      { title: "Mechanical Design", body: "3D modelling and enclosures" },
      { title: "Rapid Prototyping", body: "Printing, assembly, fast iteration" },
    ],
  },

  founder: {
    label: "Founder",
    name: "Taha Jasim Mohammed",
    role: "Founder & mechatronics engineer",
    body: "Founded OmegaTron and leads its engineering work. He takes projects from the first requirement through to a tested prototype.",
    imageAlt: "Taha Jasim Mohammed, founder of OmegaTron.",
  },

  contact: {
    label: "Contact",
    heading: "Have a project?",
    lead: "Send a short description and we'll reply with a first engineering opinion.",
    fullFormPrompt: "Need to add a budget, a timeline, or files?",
    fullFormLink: "Full form",
  },

  start: {
    label: "Start a Project",
    heading: "Tell us what you want to build",
    lead: "A precise description means a clearer engineering reply. No full requirements document needed.",
    aside: {
      title: "Before you send",
      items: [
        "Where will the system run? Indoors or outdoors.",
        "What constraints do you know? Size, power, cost, time.",
        "Attach what you have: a sketch, a spec, or photos.",
      ],
    },
    form: {
      legendContact: "Contact",
      legendProject: "Project",
      name: "Name",
      namePlaceholder: "Your name or organisation",
      email: "Email",
      emailPlaceholder: "name@example.com",
      phone: "Phone or WhatsApp",
      phonePlaceholder: "+964 7XX XXX XXXX",
      organization: "Organisation",
      organizationPlaceholder: "Company, university, or personal project",
      projectType: "Project type",
      projectTypeOptions: [
        "Embedded system and sensors",
        "Robot or mobile system",
        "Automation and control",
        "AI and computer vision",
        "IoT",
        "Mechanical design and prototyping",
        "Engineering consultation",
        "Other",
      ],
      description: "Project description",
      descriptionPlaceholder: "What is the problem? Where will it run? What are the constraints?",
      outcome: "Expected outcome",
      outcomePlaceholder: "What must the system do for this to be a success?",
      environment: "Operating environment",
      environmentOptions: [
        "Indoors — controlled",
        "Indoors — industrial",
        "Outdoors",
        "On a vehicle or mobile platform",
        "Not defined yet",
      ],
      stage: "Current stage",
      stageOptions: [
        "Initial idea",
        "Written requirements",
        "Existing prototype",
        "Working system needing development",
      ],
      budget: "Estimated budget",
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
      attachmentsHint: "Up to 3 files, 4 MB total.",
      attachmentsButton: "Choose files",
      attachmentsEmpty: "No files selected",
      attachmentsRemove: "Remove",
      select: "Select…",
      optional: "Optional",
      required: "Required",
      requiredNote: "Fields marked * are required.",
      submit: "Send",
      submitting: "Sending…",
      privacy: "Your details reach the OmegaTron team only.",
    },
    validation: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a phone or WhatsApp number.",
      projectType: "Please choose a project type.",
      description: "Please describe the project in at least 20 characters.",
      outcome: "Please describe the expected outcome.",
      budget: "Please choose a budget.",
      timeline: "Please choose a timeline.",
      environment: "Please choose the operating environment.",
      stage: "Please choose the current stage.",
      filesCount: "A maximum of 3 files is allowed.",
      filesSize: "Attachments exceed 4 MB.",
      filesType: "That file format is not accepted.",
      tooMany: "Too many requests. Try again shortly.",
      generic: "Could not send. Please try again.",
      network: "Could not reach the server.",
    },
    success: {
      title: "Your request has reached us.",
      body: "We'll review it and reply by email or WhatsApp.",
      again: "Send another request",
    },
    errorTitle: "Request not sent",
  },

  footer: {
    sections: "Sections",
    contact: "Contact",
    startLabel: "Project request",
    language: "Language",
    rights: "All rights reserved.",
    location: "Iraq",
  },

  notFound: {
    title: "Page not found",
    body: "This link does not lead to an existing page.",
    home: "Back to home",
  },
};

export type Dictionary = typeof ar;

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
