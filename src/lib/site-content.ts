export const SITE_BRAND = {
  name: "跟我练-AI编程",
  shortName: "跟我练AI",
  teacherName: "Watson",
  teacherDisplayName: "Watson 老师",
  companyName: "博学优才教育有限公司（香港）",
  supportEmail: "watson@bkeel.com",
  slogan: "用AI和代码，做出真正能用的小程序",
  logo: "/assets/images/brand/genwolian-ai-logo.png",
  avatar: "/assets/images/teacher/watson-avatar.jpg",
  teachingPhoto: "/assets/images/teacher/watson-teaching.jpg",
  lecturerCertificate: "/assets/images/teacher/tencent-lecturer-certificate.jpg",
  courseCover: "/assets/images/courses/ai-miniprogram-cover.png",
  coursePoster: "/assets/images/courses/ai-miniprogram-poster.jpg",
  shareImage: "/assets/images/share/ai-miniprogram-share.png",
} as const;

export const MAIN_COURSE = {
  slug: "ai-miniprogram-course",
  title: "AI+小程序编程课：8节课做出班级情绪日记本",
  listTitle: "AI+小程序编程课",
  subtitle: "8节课做出班级情绪日记本",
  summary:
    "8节课从0到1开发微信小程序，学习产品设计、编程基础和AI协作，完成一个可演示的班级情绪日记本项目，适合9-15岁零基础孩子。",
  description:
    "这不是普通的编程语法课，而是一次完整的产品开发体验。8节课，孩子将从0到1开发一个真实的微信小程序“班级情绪日记本”。这个小程序围绕校园表达与同伴互动场景设计，包含账号登录、班级空间、日记发布、日记流、点赞评论、匿名显示、举报处理、管理员后台和项目展示等环节。课程不只教写代码，更教产品思维：第1课先做产品设计，想清楚为什么做、给谁用、解决什么问题；后续课时再逐步学习 WXML、WXSS、JavaScript、API、数据库、用户权限、隐私保护和测试发布。AI 会作为学习助手参与头脑风暴、代码解释和报错排查，但孩子需要理解每一步，不做复制粘贴工程师。结课时，孩子不仅拥有一个可演示的小程序作品，还能用自己的话讲清楚项目目标、核心功能、技术亮点、隐私边界和下一步优化方向。",
  regularPriceCents: 99900,
  earlyBirdPriceCents: 69900,
  validityDays: 365,
  ageRange: "9-15岁",
  serviceModel: "纯录播点播 + 直播答疑",
  coverUrl: SITE_BRAND.courseCover,
} as const;

export const HOME_CONTENT = {
  eyebrow: "AI时代 · 产品思维 · 真实作品",
  title: "用AI做出真实小程序，让孩子成为创造者而非消费者",
  description:
    "前腾讯AI产品专家 Watson 老师设计，带9-15岁孩子从0到1完成微信小程序作品。课程不只教代码，更训练产品思维、AI协作、隐私责任和项目展示。孩子将围绕“班级情绪日记本”完成一个能演示、能复盘的真实项目，把屏幕时间转化为创造力训练。",
  features: [
    {
      title: "真实作品",
      description: "8节课围绕一个能在微信里运行的小程序展开，孩子会接触页面、数据、账号、权限、匿名、管理后台和测试展示。",
    },
    {
      title: "产品思维",
      description: "第一课先想清楚谁会用、解决什么问题、第一版先做什么。孩子学到的是从想法到作品的完整路径。",
    },
    {
      title: "AI协作",
      description: "课程会教孩子用AI辅助头脑风暴、解释代码和排查报错，但不做复制粘贴工程师。",
    },
  ],
  audienceTitle: "这门课适合谁？不适合谁？",
  audience:
    "适合9-15岁、对编程、AI、微信小程序或创造作品感兴趣的孩子。零基础可学，但需要愿意动手操作；建议准备一台 Windows 或 Mac 电脑，以及一部安装微信的手机。",
  notAudience:
    "不适合只想速成拿证书、完全不愿意动手、或期待一两节课学会所有编程的学习目标。课程更适合希望孩子获得逻辑拆解、产品表达、AI协作、项目展示和真实作品经验的家庭。",
} as const;

export const TEACHER_CONTENT = {
  title: "用产品思维教编程，让孩子成为AI时代的创造者",
  intro:
    "我是 Watson 老师，曾在腾讯、华为及 SaaS 企业从事互联网产品、AI 产品运营和商业化相关工作二十余年，也曾作为腾讯中级讲师讲授产品方法论。过去我参与过腾讯云 AI、微信小程序赛事、支付与会员等真实业务，更深刻地感受到：未来真正稀缺的不是只会照着写代码的人，而是能发现问题、拆解需求、善用 AI、做出产品并清楚表达的人。现在我把这些真实项目经验转化为适合青少年的课程，让孩子从一个能运行的小程序开始，理解技术、产品、责任与创造。",
  cards: [
    {
      title: "腾讯AI与产品经验",
      description:
        "曾在腾讯长期从事产品与运营工作，参与 QQ 会员、QQ 钱包、应用宝、腾讯云 AI 等业务；曾任腾讯云 AI 产品运营负责人。",
    },
    {
      title: "真实项目方法",
      description:
        "连续组织3届大学生腾讯云AI+小程序赛事，熟悉项目从创意、功能设计、技术实现到展示评审的完整过程。",
    },
    {
      title: "教学理念",
      description:
        "先想清楚问题，再动手实现；可以用AI帮忙，但必须理解AI给出的方案；作品要能运行、能解释、能复盘。",
    },
  ],
  achievements: [
    "腾讯中级讲师，曾面向员工讲授产品方法论。",
    "连续组织3届大学生腾讯云AI+小程序赛事。",
    "20年+互联网产品、运营和商业化经验，现专注AI教育与青少年科技课程。",
  ],
  serviceSteps: [
    "购买课程后开通学习权限，在有效期内按课时学习视频",
    "跟随每节课完成阶段任务，记录问题并持续迭代作品",
    "结合直播答疑解决卡点，完成最终测试与项目展示",
  ],
} as const;

export const COURSE_DETAIL_CONTENT = {
  outcomes: [
    "一个围绕“班级情绪日记本”的微信小程序项目作品，可用于演示与复盘。",
    "理解 WXML、WXSS、JS、JSON 各自负责什么，能读懂基础页面结构。",
    "理解账号、班级、API、服务器、数据库、token 等真实产品数据流。",
    "认识匿名显示、隐私保护、管理员可追溯、服务端权限判断等数字责任问题。",
    "掌握使用 AI 辅助产品设计、代码解释、报错排查和测试思路生成的方法。",
    "能讲清楚作品给谁用、解决什么问题、有哪些亮点和不足。",
  ],
  audience: [
    "9-15岁，对编程、AI、微信小程序或创造作品感兴趣的孩子。",
    "零基础或有少量 Scratch / Python / 网页基础，但缺少真实项目经验的孩子。",
    "希望孩子不只学语法，而是完成可展示作品的家庭。",
    "想培养孩子产品思维、逻辑拆解、AI协作和表达展示能力的家长。",
  ],
  notFor: [
    "完全没有学习意愿，只是被家长强迫报名的孩子。",
    "只想速成拿证书、不愿意动手做项目的学习目标。",
    "没有电脑或无法提供学习设备的家庭。",
    "期望一两节课学会所有编程，或短期冲击高阶信息学竞赛的学生。",
  ],
  highlights: [
    "真实作品，不是玩具：围绕微信小程序完成真实项目，不是只做拖拽积木或孤立练习。",
    "产品思维先行：先理解用户、场景、需求和 MVP，再进入代码实现。",
    "AI工具协作：教孩子如何向 AI 提问、判断 AI 输出、用 AI 辅助调试。",
    "隐私与责任教育：通过匿名、举报、管理员追溯和权限控制，让孩子理解数字产品的边界。",
  ],
  requirements:
    "零基础可学，不需要提前掌握编程语言。建议学生具备基本电脑操作能力，能使用键盘输入、复制粘贴、打开文件，并根据老师提示完成软件操作。需要准备一台可联网电脑和一部安装微信的手机。9-11岁孩子建议家长在前1-2节课协助完成环境配置。",
  purchaseNotes: [
    "课程有效期为365天，自支付成功并开通课程权益之日起计算。",
    "有效期内可反复观看已购买课程视频。",
    "本课程为项目制学习，建议按课时顺序学习，不建议跳过前置课时直接操作后续功能。",
    "学员需自备电脑和安装微信的手机，视频观看、小程序预览和代码练习需要稳定网络。",
    "课程不承诺竞赛获奖、升学录取或孩子达到某一编程等级，重点是完成项目作品与建立学习方法。",
    "课程内容仅限购买账号本人或家庭学习使用，不得录屏传播、转售、共享账号或用于机构教学。",
  ],
  refundPolicy: "课程为数字内容。购买后如未开始观看任何付费课时，可在购买后7日内申请退款；如已开始观看付费课时，原则上不支持无理由退款。重复支付或系统故障导致权益未开通等问题，经核实后可退款或补开权益。",
  faq: [
    {
      question: "孩子完全没有编程基础，能学会吗？",
      answer: "可以。课程从产品设计和页面结构讲起，不要求提前学过编程。但孩子需要愿意动手操作，低龄孩子建议家长前期协助完成软件安装和账号准备。",
    },
    {
      question: "这门课和普通少儿编程课有什么不同？",
      answer: "很多课程从语法、刷题或小游戏开始，本课程从一个真实小程序项目开始。孩子会学习需求分析、页面结构、数据流、权限、隐私、测试和展示，更接近真实产品开发流程。",
    },
    {
      question: "学完后小程序可以正式上线吗？",
      answer: "课程会讲解预览、测试和发布流程。孩子可以完成可演示版本；如果要正式发布到微信小程序平台，需要符合微信小程序主体、审核和相关平台规则。",
    },
    {
      question: "AI 会不会替孩子写完所有代码？",
      answer: "不会。AI 是辅助工具，可以帮助解释语法、生成思路和排查错误，但课程会强调孩子必须理解每一步，不做复制粘贴工程师。",
    },
    {
      question: "录播课和直播答疑是什么关系？",
      answer: "录播课是主要学习内容，孩子可按自己的节奏学习；直播答疑用于解答问题、点评思路和补充进阶技巧。具体安排以购买后通知为准。",
    },
  ],
} as const;

export const LESSON_CONTENT = [
  {
    sortOrder: 1,
    title: "第1课：认识小程序与班级日记产品设计",
    summary: "不写代码，先学产品思维。理解小程序是什么，为什么做班级日记，第一版先做哪些功能。完成产品目标卡，学会用AI辅助产品设计。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 2,
    title: "第2课：小程序页面结构：WXML、WXSS、JS",
    summary: "认识小程序的“四人小队”：WXML管骨架，WXSS管皮肤，JS管大脑，JSON管配置。完成第一次真实页面修改。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 3,
    title: "第3课：账号、班级与数据流",
    summary: "理解小程序不是孤岛，学习 API、服务器、数据库、token 的作用，体验注册登录、创建班级和加入班级流程。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 4,
    title: "第4课：发布班级日记：表单与数据提交",
    summary: "学习表单输入、匿名开关、内容不能为空校验和 loading 防重复提交，完成第一篇班级日记发布。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 5,
    title: "第5课：班级日记流：读取、展示与互动",
    summary: "学习日记列表读取、wx:for 列表渲染、onShow 刷新，并体验点赞、评论、详情页和举报隐藏治理。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 6,
    title: "第6课：匿名显示与责任边界",
    summary: "理解匿名显示不是没人知道，而是同学端匿名、管理员必要时可追溯。学习权限可见表和隐私责任。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 7,
    title: "第7课：管理员后台与服务端守门人",
    summary: "学习管理员后台、入班申请、成员管理、举报处理和服务端权限判断，理解前端入口不等于安全边界。",
    durationSec: 90 * 60,
  },
  {
    sortOrder: 8,
    title: "第8课：测试、发布与项目展示",
    summary: "完成最终联调，用不同角色测试项目，记录和修复关键 Bug，准备3分钟项目展示和后续迭代计划。",
    durationSec: 90 * 60,
  },
] as const;

export function formatTemplate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key]?.toString() ?? match);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function mergeSiteConfigWithDefaults(defaultValue: unknown, overrideValue: unknown): unknown {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(overrideValue) ? overrideValue : defaultValue;
  }

  if (isPlainObject(defaultValue)) {
    const override = isPlainObject(overrideValue) ? overrideValue : {};
    return Object.fromEntries(
      Object.entries(defaultValue).map(([key, value]) => [key, mergeSiteConfigWithDefaults(value, override[key])]),
    );
  }

  return overrideValue === undefined || overrideValue === null ? defaultValue : overrideValue;
}

export const DEFAULT_SITE_CONFIG = {
  global: {
    name: SITE_BRAND.name,
    shortName: SITE_BRAND.shortName,
    teacherName: SITE_BRAND.teacherName,
    teacherDisplayName: SITE_BRAND.teacherDisplayName,
    companyName: SITE_BRAND.companyName,
    supportEmail: SITE_BRAND.supportEmail,
    slogan: SITE_BRAND.slogan,
    logo: SITE_BRAND.logo,
    shareImage: SITE_BRAND.shareImage,
    siteTitle: "跟我练AI编程｜Watson老师带孩子用AI做真实小程序",
    siteDescription:
      "前腾讯AI产品专家 Watson 老师设计的青少年 AI 编程项目课，面向9-15岁孩子，8节课从0到1完成微信小程序作品。不只学代码，更学习产品思维、AI协作、隐私责任和项目展示。",
    ogTitle: "跟我练AI编程｜Watson老师带孩子用AI做真实小程序",
    ogDescription: SITE_BRAND.slogan,
    navHomeLabel: "首页",
    navCoursesLabel: "课程",
    navAboutLabel: "关于老师",
    navMyCoursesLabel: "我的课程",
    loginCtaLabel: "登录",
    mainCourseSlug: MAIN_COURSE.slug,
    regularPriceCents: MAIN_COURSE.regularPriceCents,
    ageRange: MAIN_COURSE.ageRange,
    serviceModel: MAIN_COURSE.serviceModel,
    loginEyebrow: "账号密码登录",
    loginTitle: "登录后购买和学习 AI 编程课程",
    loginHint: "首次使用手机号和密码会自动创建账号；之后用同一手机号和密码登录。支付成功后课程会出现在“我的课程”。",
    purchaseHint: "支付成功后自动开通课程权益。未观看付费课时前，7日内可按规则申请退款。",
    orderHelpText: "支付成功后页面会自动跳转到“我的课程”。如果二维码过期，请返回课程页重新发起支付；如已扣款但课程未开通，请保留订单号和支付截图，邮件联系 {supportEmail}。",
    myCoursesIntro: "这里会展示已购买或后台开通的课程、到期时间和学习入口。学习中遇到支付或播放问题，可邮件联系 {supportEmail}。",
    myCoursesEmpty: "暂无已开通课程。你可以先到课程中心查看 AI 小程序项目课，购买成功后会自动出现在这里。",
    myCoursesTitle: "我的课程",
    orderSectionTitle: "订单",
    continueLearningLabel: "继续学习",
    continuePayingLabel: "继续支付",
    orderClosedLabel: "已关闭",
    logoutLabel: "退出",
    currencyPrefix: "¥",
    courseCardCtaLabel: "查看详情",
    courseCoverAltText: "{courseTitle}封面",
    lessonCountUnitLabel: "个课时",
    validityLabelPrefix: "有效期",
    courseCardRegularPriceUnit: "元",
    purchasePaymentLabel: "支付宝",
    purchaseLoadingLabel: "正在创建订单",
    purchaseSignedInLabel: "立即购买",
    purchaseSignedOutLabel: "登录并购买",
    genericRequestError: "请求失败，请稍后再试",
    createOrderError: "创建订单失败，请稍后再试",
    loginSuccessText: "登录成功，正在进入课程中心。",
    registerSuccessText: "账号已创建，正在进入课程中心。",
    loginErrorText: "登录失败",
    phoneLabel: "手机号",
    phonePlaceholder: "请输入手机号",
    passwordLabel: "密码",
    passwordPlaceholder: "至少 6 位密码",
    loginSubmitLabel: "登录 / 注册",
    loginSubmittingLabel: "处理中",
    orderPageEyebrow: "订单支付",
    orderPaidTitle: "支付成功",
    orderClosedTitle: "订单已关闭",
    orderPendingTitle: "待支付",
    orderCourseLabel: "课程",
    orderNoLabel: "订单号",
    orderPaymentMethodLabel: "支付方式",
    orderAmountLabel: "金额",
    orderPaymentSuffix: "支付",
    orderPaidRedirectText: "支付成功，正在进入我的课程...",
    orderClosedHelpText: "订单超时已关闭，请返回课程页重新购买。",
    orderRepurchaseLabel: "重新购买",
    orderScanText: "请使用{paymentLabel}扫码支付",
    orderQrAlt: "支付二维码",
    orderQrLoadingText: "正在生成二维码...",
    orderRemainingPrefix: "剩余支付时间",
    orderCheckingLabel: "正在检查",
    orderCheckLabel: "检查支付状态",
    orderFallbackLinkLabel: "二维码无法识别时打开备用支付链接",
    orderStatusCheckError: "检查支付状态失败",
    orderQrLoadError: "获取支付二维码失败",
    myCoursesValidityLabel: "有效期至",
    myCoursesLessonCountPrefix: "共",
    myCoursesPlayableLessonUnit: "个可播放课时",
    orderExpiresPrefix: "有效期至",
    orderExpiredText: "订单超时已关闭",
  },
  home: {
    title: HOME_CONTENT.title,
    content: HOME_CONTENT.description,
    eyebrow: HOME_CONTENT.eyebrow,
    primaryCtaLabel: "查看课程",
    primaryCtaHref: "/courses",
    secondaryCtaLabel: "了解 Watson 老师",
    secondaryCtaHref: "/about",
    features: HOME_CONTENT.features,
    heroImage: SITE_BRAND.coursePoster,
    heroImageAlt: "AI+小程序编程课推广图",
    earlyBirdBadgeLabel: "早鸟价",
    regularPriceBadgeLabel: "正价",
    audienceLabel: "适合谁",
    audienceTitle: HOME_CONTENT.audienceTitle,
    audience: HOME_CONTENT.audience,
    notAudience: HOME_CONTENT.notAudience,
    teacherLabel: "为什么由 Watson 老师来教？",
    teacherTitle: "把真实互联网项目方法，转化成孩子能做出的作品",
    teacherIntro: TEACHER_CONTENT.intro,
    teacherImage: SITE_BRAND.teachingPhoto,
    teacherImageAlt: "Watson 老师授课照片",
    teacherAchievements: TEACHER_CONTENT.achievements,
    coursesEyebrow: "课程体系",
    coursesTitle: "精选课程",
    coursesLinkLabel: "全部课程 →",
  },
  about: {
    title: TEACHER_CONTENT.title,
    content: TEACHER_CONTENT.intro,
    eyebrow: "关于老师",
    avatarImage: SITE_BRAND.avatar,
    avatarAlt: "Watson 老师头像",
    certificateEyebrow: "讲师背书",
    certificateTitle: "腾讯中级讲师",
    certificateImage: SITE_BRAND.lecturerCertificate,
    certificateAlt: "腾讯中级讲师证书",
    cards: TEACHER_CONTENT.cards,
    achievementsLabel: "代表经历",
    achievements: TEACHER_CONTENT.achievements,
    serviceLabel: "课程服务方式",
    serviceSteps: TEACHER_CONTENT.serviceSteps,
  },
  courses: {
    eyebrow: "课程中心",
    title: "用AI做真实小程序，培养面向未来的创造力",
    content:
      "这里的课程围绕真实产品项目设计，适合9-15岁孩子在家长支持下学习。每门课都回答三个问题：孩子要做出什么作品，过程中学会哪些能力，最后如何展示和复盘。",
    promoEyebrow: "当前主推",
    promoTitle: MAIN_COURSE.listTitle,
    promoText:
      "早鸟价 {price} 元，正价 {regularPrice} 元。购买后 {validityDays} 天内可反复观看。",
    promoServiceText: "{serviceModel}。直播答疑用于解答问题和补充进阶技巧，具体安排以购买后通知为准。",
  },
  courseDetail: {
    eyebrow: "AI编程项目课 · 真实小程序作品",
    badges: ["9-15岁", "零基础可学", "真实项目", "录播+直播答疑"],
    outlineTitle: "课程大纲",
    emptyLessonSummary: "付费后在有效期内观看完整视频。",
    outcomesTitle: "学完你将获得",
    outcomes: COURSE_DETAIL_CONTENT.outcomes,
    audienceTitle: "适合人群",
    audience: COURSE_DETAIL_CONTENT.audience,
    notForTitle: "不适合人群",
    notFor: COURSE_DETAIL_CONTENT.notFor,
    highlightsTitle: "课程特色",
    highlights: COURSE_DETAIL_CONTENT.highlights,
    requirementsTitle: "学习前准备",
    requirements: COURSE_DETAIL_CONTENT.requirements,
    purchaseNotesTitle: "购买须知",
    purchaseNotes: COURSE_DETAIL_CONTENT.purchaseNotes,
    refundTitle: "退款规则",
    refundPolicy: COURSE_DETAIL_CONTENT.refundPolicy,
    faqTitle: "常见问题",
    faq: COURSE_DETAIL_CONTENT.faq,
    priceLabel: "早鸟价",
    regularPriceLabel: "正价",
    validityPrefix: "购买后有效期",
    lessonCountLabel: "课时数量",
    watchMethodLabel: "观看方式",
    watchMethod: "PC / 手机 H5",
    serviceModelLabel: "服务形式",
    ageRangeLabel: "适合年龄",
    sidebarNote: "当前仅展示已上传并可播放的课时。新课时完成视频绑定后会自动进入课程目录。支付成功后进入“我的课程”学习，售后邮箱：{supportEmail}",
  },
} as const;
