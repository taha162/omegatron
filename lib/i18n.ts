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
    title: "أوميكاترون | فريق هندسة ميكاترونكس",
    description:
      "أوميكاترون فريق ميكاترونكس تنافسي يبني أنظمة مدمجة تستشعر وتُقرِّر وتتحرّك — روبوتات، وذكاء اصطناعي، وأنظمة مدمجة، وأتمتة، ونمذجة سريعة.",
    keywords: [
      "أوميكاترون",
      "ميكاترونكس",
      "روبوتات",
      "ذكاء اصطناعي",
      "أنظمة مدمجة",
      "أتمتة",
      "هندسة",
      "العراق",
      "NURAI",
    ],
  },

  nav: {
    about: "من نحن",
    project: "المشروع",
    capabilities: "القدرات",
    founder: "المؤسس",
    start: "ابدأ مشروعك",
    menu: "القائمة",
    close: "إغلاق",
    skipToContent: "تخطَّ إلى المحتوى",
    home: "الصفحة الرئيسية",
  },

  hero: {
    eyebrow: "فريق ميكاترونكس تنافسي — العراق",
    name: "أوميكاترون",
    wordmark: "OmegaTron",
    statement: "نُهندس أنظمة تستشعر، وتُقرِّر، وتتحرّك.",
    lead: "نجمع الميكانيكا والإلكترونيات والتحكّم والبرمجيات في نظام واحد متماسك — من الفكرة الأولى إلى نموذج يعمل خارج المختبر.",
    primaryCta: "ابدأ مشروعًا",
    secondaryCta: "استعرض المشروع",
    facts: [
      { value: "المركز الثالث", label: "على مستوى العراق — NURAI 2026" },
      { value: "أربعة تخصّصات", label: "ميكانيكا · إلكترونيات · تحكّم · برمجيات" },
      { value: "تنفيذ داخلي", label: "تصميم وتصنيع واختبار داخل الفريق" },
    ],
    imageAlt: "وحدة الاستشعار المدمجة التي طوّرها فريق أوميكاترون.",
  },

  achievement: {
    label: "إنجاز",
    place: "المركز الثالث على مستوى العراق",
    event: "NURAI 2026",
    year: "2026",
    scope: "منافسة وطنية",
    body: "نتيجةٌ حقّقها الفريق ضمن منافسة وطنية، بنظام صُمِّم ونُفِّذ واختُبر بالكامل داخل الفريق — من الغلاف الميكانيكي إلى البرمجيات المدمجة.",
    imageAlt: "فريق أوميكاترون في منافسة NURAI 2026.",
  },

  about: {
    index: "٠١",
    label: "من نحن",
    heading: "نبني أنظمة، لا عروضًا تقديمية.",
    body: [
      "أوميكاترون فريق هندسي تنافسي يعمل عند تقاطع أربعة مجالات: الميكانيكا، والإلكترونيات، وأنظمة التحكّم، والبرمجيات. هذا التقاطع هو تعريف الميكاترونكس، وهو الموضع الذي تُولد فيه الأنظمة الحقيقية.",
      "نبدأ من متطلّب واضح، ثم ننتقل إلى التصميم والتنفيذ والاختبار. كل قرار هندسي — اختيار حسّاس، أو خوارزمية، أو تفصيل ميكانيكي — يُتَّخذ لأنه يخدم أداء النظام، لا لأنه يبدو جيّدًا على الورق.",
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
        body: "المعيار المقبول هو نظام يعمل خارج المختبر، لا محاكاة على الشاشة.",
      },
    ],
  },

  project: {
    index: "٠٢",
    label: "المشروع",
    heading: "نظام استشعار وقرار مُدمج",
    lead: "نظام مُدمج يجمع مصفوفة حسّاسات داخل غلافٍ مُصمَّم هندسيًا مع وحدة معالجة تُحلّل القراءات محليًا وتُصدر قرارًا لحظيًا، دون الاعتماد على اتصال خارجي.",
    stages: [
      {
        index: "01",
        title: "الاستشعار",
        body: "مصفوفة حسّاسات تقرأ الوسط المحيط قراءةً مستمرة عبر أكثر من قناة.",
      },
      {
        index: "02",
        title: "المعالجة",
        body: "تُنقّى الإشارة وتُستخلَص خصائصها محليًا على المتحكّم، لا على خادم بعيد.",
      },
      {
        index: "03",
        title: "القرار",
        body: "نموذج مُدرَّب يُصنِّف الحالة ويُقدِّر مستوى الثقة في التصنيف.",
      },
      {
        index: "04",
        title: "الاستجابة",
        body: "إنذار أو أمر تحكّم يصدر خلال زمنٍ محدود ومعروف مسبقًا.",
      },
    ],
    enclosureTitle: "الغلاف جزء من النظام",
    enclosureBody:
      "الغلاف ليس علبة. مسار دخول الهواء، وحجم الغرفة الداخلية، وتوزيع الحسّاسات داخلها، كلها عناصر تصميمية تؤثر مباشرة في جودة القراءة وزمن الاستجابة. صُمِّم الغلاف وطُبع ثلاثيّ الأبعاد داخل الفريق، وأُعيد تعديله بناءً على نتائج الاختبار.",
    confidentialTitle: "ما لا يُنشَر",
    confidentialBody:
      "الهندسة التفصيلية — تركيبة المصفوفة، ومنهج المعالجة، وبيانات التدريب والمعايرة — محفوظة ولا تُنشَر. ما يظهر هنا هو وصف النظام على مستواه العام.",
    images: {
      unitAlt: "الوحدة كاملةً: غلاف مطبوع ثلاثيّ الأبعاد تعلوه مصفوفة الحسّاسات.",
      enclosureAlt: "الغلاف الأسود المطبوع ثلاثيّ الأبعاد وفتحة الدخول الجانبية.",
      chamberAlt: "منظر داخل غرفة الاستشعار من فتحة الدخول.",
    },
  },

  capabilities: {
    index: "٠٣",
    label: "القدرات",
    heading: "ما نستطيع بناءه",
    lead: "ستة مجالات نعمل فيها فعليًا، بأدوات ومنهجية واحدة.",
    items: [
      {
        title: "الروبوتات",
        body: "أنظمة متحرّكة وأذرع مناولة: التصميم الحركي، والدفع، والتحكّم بالمسار.",
      },
      {
        title: "الميكاترونكس",
        body: "دمج الميكانيكا والإلكترونيات والتحكّم في منظومة واحدة متّسقة.",
      },
      {
        title: "الذكاء الاصطناعي",
        body: "نماذج تصنيف وتنبّؤ مُهيّأة للعمل على أجهزة محدودة الموارد.",
      },
      {
        title: "الأنظمة المدمجة",
        body: "برمجيات المتحكّمات، وقراءة الحسّاسات، والعمل ضمن قيود الزمن الحقيقي.",
      },
      {
        title: "الأتمتة",
        body: "أتمتة العمليات، والتحكّم المنطقي، وحلقات التغذية الراجعة المغلقة.",
      },
      {
        title: "النمذجة السريعة",
        body: "تصميم الأغلفة، والطباعة ثلاثية الأبعاد، والتجميع والاختبار التكراري.",
      },
    ],
  },

  founder: {
    index: "٠٤",
    label: "المؤسس",
    name: "طه جاسم محمد",
    role: "مؤسس أوميكاترون",
    quote: "الفريق الجيّد لا يُقاس بما يعرضه، بل بما يستطيع تشغيله.",
    body: [
      "طه جاسم محمد هو مؤسس أوميكاترون. يقود التوجّه الهندسي للفريق، ويشرف على انتقال المشاريع من المتطلّب الأولي إلى نموذج مُختبَر، مع التركيز على تكامل الميكانيكا والإلكترونيات والبرمجيات ضمن نظام واحد.",
      "إلى جانب العمل الهندسي، يهتم ببناء منهجية عمل واضحة داخل الفريق: توثيق القرارات، ومراجعة التصاميم، والاختبار المنظّم قبل أي عرض.",
    ],
    imageAlt: "طه جاسم محمد، مؤسس أوميكاترون.",
  },

  cta: {
    heading: "لديك نظام تريد بناءه؟",
    body: "أرسل تفاصيل مشروعك. نقرأ كل طلب بأنفسنا، ونردّ برأي هندسي أوّلي وخطوة تالية واضحة.",
    button: "ابدأ مشروعًا",
  },

  start: {
    index: "٠٥",
    label: "ابدأ مشروعًا",
    heading: "أخبرنا بما تريد بناءه",
    lead: "كلما كان الوصف أدقّ، كان الرد الهندسي أوضح. لا حاجة إلى ملف متطلّبات كامل — فكرة محدّدة تكفي للبداية.",
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
      { index: "01", title: "ترسل الطلب", body: "تملأ النموذج بتفاصيل المشروع والنتيجة المتوقّعة." },
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
      projectType: "نوع المشروع",
      projectTypeOptions: [
        "روبوت أو نظام متحرّك",
        "نظام مدمج وحسّاسات",
        "أتمتة وتحكّم",
        "ذكاء اصطناعي ورؤية حاسوبية",
        "نمذجة وتصنيع",
        "استشارة هندسية",
        "أخرى",
      ],
      description: "وصف المشروع",
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
      attachments: "مرفقات (اختياري)",
      attachmentsHint:
        "حتى ٣ ملفات، بحجم إجمالي لا يتجاوز ٤ ميغابايت. الصيغ المقبولة: PDF، صور، مستندات، مضغوطات.",
      attachmentsButton: "اختر ملفات",
      attachmentsEmpty: "لم تُختَر أي ملفات",
      attachmentsRemove: "إزالة",
      select: "اختر…",
      required: "مطلوب",
      optional: "اختياري",
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال…",
      privacy: "تُرسَل بياناتك إلى فريق أوميكاترون فقط، ولا تُشارك مع أي جهة أخرى.",
    },
    validation: {
      name: "يرجى كتابة الاسم.",
      email: "يرجى كتابة بريد إلكتروني صحيح.",
      phone: "يرجى كتابة رقم هاتف أو واتساب.",
      projectType: "يرجى اختيار نوع المشروع.",
      description: "يرجى وصف المشروع بما لا يقل عن ٢٠ حرفًا.",
      outcome: "يرجى وصف النتيجة المتوقّعة.",
      budget: "يرجى اختيار الميزانية التقديرية.",
      timeline: "يرجى اختيار الإطار الزمني.",
      filesCount: "الحد الأقصى ٣ ملفات.",
      filesSize: "الحجم الإجمالي للمرفقات يتجاوز ٤ ميغابايت.",
      filesType: "صيغة ملف غير مقبولة.",
      tooMany: "أرسلت طلبات كثيرة خلال وقت قصير. يرجى المحاولة بعد قليل.",
      generic: "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.",
      network: "تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مجددًا.",
    },
    success: {
      title: "وصلنا طلبك.",
      body: "سنراجعه ونردّ عليك عبر البريد الإلكتروني أو واتساب. إن كان الطلب عاجلًا، أعد الإرسال مع كلمة «عاجل» في وصف المشروع.",
      again: "إرسال طلب آخر",
    },
    errorTitle: "لم يُرسَل الطلب",
  },

  footer: {
    tagline: "نُهندس أنظمة تستشعر، وتُقرِّر، وتتحرّك.",
    sections: "الأقسام",
    contact: "التواصل",
    emailLabel: "البريد الإلكتروني",
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
    title: "OmegaTron | Mechatronics Engineering Team",
    description:
      "OmegaTron is a competitive mechatronics team building embedded systems that sense, decide, and act — robotics, AI, embedded systems, automation, and rapid prototyping.",
    keywords: [
      "OmegaTron",
      "mechatronics",
      "robotics",
      "artificial intelligence",
      "embedded systems",
      "automation",
      "engineering",
      "Iraq",
      "NURAI",
    ],
  },

  nav: {
    about: "About",
    project: "Project",
    capabilities: "Capabilities",
    founder: "Founder",
    start: "Start a Project",
    menu: "Menu",
    close: "Close",
    skipToContent: "Skip to content",
    home: "Home",
  },

  hero: {
    eyebrow: "Competitive Mechatronics Team — Iraq",
    name: "OmegaTron",
    wordmark: "OmegaTron",
    statement: "We engineer systems that sense, decide, and act.",
    lead: "We bring mechanics, electronics, control, and software together into one coherent system — from the first concept to a prototype that works outside the lab.",
    primaryCta: "Start a Project",
    secondaryCta: "See the Project",
    facts: [
      { value: "3rd Place", label: "Nationally in Iraq — NURAI 2026" },
      { value: "Four Disciplines", label: "Mechanics · Electronics · Control · Software" },
      { value: "Built In-House", label: "Designed, fabricated, and tested by the team" },
    ],
    imageAlt: "The embedded sensing unit developed by the OmegaTron team.",
  },

  achievement: {
    label: "Achievement",
    place: "3rd Place in Iraq",
    event: "NURAI 2026",
    year: "2026",
    scope: "National competition",
    body: "A result earned in national competition with a system designed, built, and tested entirely within the team — from the mechanical enclosure to the embedded software.",
    imageAlt: "The OmegaTron team at the NURAI 2026 competition.",
  },

  about: {
    index: "01",
    label: "About",
    heading: "We build systems, not slide decks.",
    body: [
      "OmegaTron is a competitive engineering team working at the intersection of four disciplines: mechanics, electronics, control systems, and software. That intersection is the definition of mechatronics, and it is where real systems are born.",
      "We start from a clearly stated requirement, then move through design, fabrication, and testing. Every engineering decision — a sensor choice, an algorithm, a mechanical detail — is made because it serves the system's performance, not because it reads well on paper.",
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
        body: "The accepted standard is a system that works outside the lab, not a simulation on a screen.",
      },
    ],
  },

  project: {
    index: "02",
    label: "The Project",
    heading: "An Embedded Sensing and Decision System",
    lead: "An embedded system that pairs a sensor array inside a purpose-designed enclosure with a processing unit that analyses readings locally and issues a real-time decision, without depending on an external connection.",
    stages: [
      {
        index: "01",
        title: "Sensing",
        body: "A sensor array reads the surrounding medium continuously across multiple channels.",
      },
      {
        index: "02",
        title: "Processing",
        body: "The signal is conditioned and its features extracted locally on the controller, not on a remote server.",
      },
      {
        index: "03",
        title: "Decision",
        body: "A trained model classifies the state and estimates its confidence in that classification.",
      },
      {
        index: "04",
        title: "Response",
        body: "An alarm or control command is issued within a bounded, known response time.",
      },
    ],
    enclosureTitle: "The Enclosure Is Part of the System",
    enclosureBody:
      "The enclosure is not a box. The intake path, the internal chamber volume, and the sensor layout within it are design elements that directly affect reading quality and response time. It was designed and 3D-printed in-house, then revised against test results.",
    confidentialTitle: "What We Do Not Publish",
    confidentialBody:
      "The detailed engineering — array composition, processing method, and training and calibration data — is proprietary and stays unpublished. What appears here is a high-level description of the system.",
    images: {
      unitAlt: "The complete unit: a 3D-printed enclosure topped by the sensor array.",
      enclosureAlt: "The black 3D-printed enclosure and its side intake port.",
      chamberAlt: "A view inside the sensing chamber through the intake port.",
    },
  },

  capabilities: {
    index: "03",
    label: "Capabilities",
    heading: "What We Can Build",
    lead: "Six fields we actually work in, with one shared toolset and method.",
    items: [
      {
        title: "Robotics",
        body: "Mobile platforms and manipulators: kinematic design, drivetrain, and path control.",
      },
      {
        title: "Mechatronics",
        body: "Merging mechanics, electronics, and control into one consistent system.",
      },
      {
        title: "Artificial Intelligence",
        body: "Classification and prediction models prepared to run on resource-constrained hardware.",
      },
      {
        title: "Embedded Systems",
        body: "Microcontroller firmware, sensor acquisition, and work under real-time constraints.",
      },
      {
        title: "Automation",
        body: "Process automation, logic control, and closed feedback loops.",
      },
      {
        title: "Rapid Prototyping",
        body: "Enclosure design, 3D printing, and iterative assembly and testing.",
      },
    ],
  },

  founder: {
    index: "04",
    label: "Founder",
    name: "Taha Jasim Mohammed",
    role: "Founder of OmegaTron",
    quote: "A good team is measured not by what it presents, but by what it can actually run.",
    body: [
      "Taha Jasim Mohammed is the founder of OmegaTron. He leads the team's engineering direction and oversees the path from an initial requirement to a tested prototype, with an emphasis on integrating mechanics, electronics, and software into a single system.",
      "Alongside the engineering work, he focuses on establishing a clear working method inside the team: documented decisions, design reviews, and structured testing before anything is presented.",
    ],
    imageAlt: "Taha Jasim Mohammed, founder of OmegaTron.",
  },

  cta: {
    heading: "Have a system you want built?",
    body: "Send us the details. We read every request ourselves and reply with an initial engineering opinion and a clear next step.",
    button: "Start a Project",
  },

  start: {
    index: "05",
    label: "Start a Project",
    heading: "Tell us what you want to build",
    lead: "The more precise the description, the clearer the engineering reply. You do not need a full requirements document — a well-defined idea is enough to begin.",
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
      { index: "01", title: "You Send", body: "Fill in the form with your project details and expected outcome." },
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
      projectType: "Project Type",
      projectTypeOptions: [
        "Robot or mobile system",
        "Embedded system and sensors",
        "Automation and control",
        "AI and computer vision",
        "Prototyping and fabrication",
        "Engineering consultation",
        "Other",
      ],
      description: "Project Description",
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
      attachments: "Attachments (optional)",
      attachmentsHint:
        "Up to 3 files, 4 MB total. Accepted formats: PDF, images, documents, and archives.",
      attachmentsButton: "Choose files",
      attachmentsEmpty: "No files selected",
      attachmentsRemove: "Remove",
      select: "Select…",
      required: "Required",
      optional: "Optional",
      submit: "Send Request",
      submitting: "Sending…",
      privacy: "Your details go to the OmegaTron team only and are never shared with anyone else.",
    },
    validation: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a phone or WhatsApp number.",
      projectType: "Please choose a project type.",
      description: "Please describe the project in at least 20 characters.",
      outcome: "Please describe the expected outcome.",
      budget: "Please choose an estimated budget.",
      timeline: "Please choose a timeline.",
      filesCount: "A maximum of 3 files is allowed.",
      filesSize: "Total attachment size exceeds 4 MB.",
      filesType: "That file format is not accepted.",
      tooMany: "Too many requests in a short time. Please try again shortly.",
      generic: "The request could not be sent. Please try again.",
      network: "Could not reach the server. Check your connection and try again.",
    },
    success: {
      title: "Your request has reached us.",
      body: "We will review it and reply by email or WhatsApp. If it is urgent, resend it with the word “urgent” in the project description.",
      again: "Send another request",
    },
    errorTitle: "Request not sent",
  },

  footer: {
    tagline: "We engineer systems that sense, decide, and act.",
    sections: "Sections",
    contact: "Contact",
    emailLabel: "Email",
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
