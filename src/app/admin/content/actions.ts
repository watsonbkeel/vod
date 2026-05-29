"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { getDefaultSiteSettings } from "@/lib/site-settings";

const contentSchema = z.object({
  key: z.enum(["home", "about"]),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

function getString(formData: FormData, name: string, fallback = "") {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : fallback;
}

function getNumber(formData: FormData, name: string, fallback: number) {
  const value = Number(getString(formData, name));
  return Number.isFinite(value) ? value : fallback;
}

function getStringList(formData: FormData, name: string, fallback: readonly string[]) {
  const value = getString(formData, name);
  return value
    ? value.split("\n").map((item) => item.trim()).filter(Boolean)
    : [...fallback];
}

function getTextItems(formData: FormData, prefix: string, fallback: readonly { title: string; description: string }[]) {
  return fallback.map((item, index) => ({
    title: getString(formData, `${prefix}.${index}.title`, item.title),
    description: getString(formData, `${prefix}.${index}.description`, item.description),
  }));
}

function getFaqItems(formData: FormData, fallback: readonly { question: string; answer: string }[]) {
  return fallback.map((item, index) => ({
    question: getString(formData, `courseDetail.faq.${index}.question`, item.question),
    answer: getString(formData, `courseDetail.faq.${index}.answer`, item.answer),
  }));
}

export async function updateSiteContent(formData: FormData) {
  await requireAdminSession();
  const body = contentSchema.parse(Object.fromEntries(formData));

  await prisma.siteContent.upsert({
    where: { key: body.key },
    update: {
      title: body.title,
      content: body.content,
    },
    create: {
      key: body.key,
      title: body.title,
      content: body.content,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");
}

export async function updateSiteConfig(formData: FormData) {
  await requireAdminSession();
  const defaults = getDefaultSiteSettings();
  const config = {
    global: {
      name: getString(formData, "global.name", defaults.global.name),
      shortName: getString(formData, "global.shortName", defaults.global.shortName),
      teacherName: getString(formData, "global.teacherName", defaults.global.teacherName),
      teacherDisplayName: getString(formData, "global.teacherDisplayName", defaults.global.teacherDisplayName),
      companyName: getString(formData, "global.companyName", defaults.global.companyName),
      supportEmail: getString(formData, "global.supportEmail", defaults.global.supportEmail),
      slogan: getString(formData, "global.slogan", defaults.global.slogan),
      logo: getString(formData, "global.logo", defaults.global.logo),
      shareImage: getString(formData, "global.shareImage", defaults.global.shareImage),
      siteTitle: getString(formData, "global.siteTitle", defaults.global.siteTitle),
      siteDescription: getString(formData, "global.siteDescription", defaults.global.siteDescription),
      ogTitle: getString(formData, "global.ogTitle", defaults.global.ogTitle),
      ogDescription: getString(formData, "global.ogDescription", defaults.global.ogDescription),
      navHomeLabel: getString(formData, "global.navHomeLabel", defaults.global.navHomeLabel),
      navCoursesLabel: getString(formData, "global.navCoursesLabel", defaults.global.navCoursesLabel),
      navAboutLabel: getString(formData, "global.navAboutLabel", defaults.global.navAboutLabel),
      navMyCoursesLabel: getString(formData, "global.navMyCoursesLabel", defaults.global.navMyCoursesLabel),
      loginCtaLabel: getString(formData, "global.loginCtaLabel", defaults.global.loginCtaLabel),
      mainCourseSlug: getString(formData, "global.mainCourseSlug", defaults.global.mainCourseSlug),
      regularPriceCents: getNumber(formData, "global.regularPriceCents", defaults.global.regularPriceCents),
      ageRange: getString(formData, "global.ageRange", defaults.global.ageRange),
      serviceModel: getString(formData, "global.serviceModel", defaults.global.serviceModel),
      loginEyebrow: getString(formData, "global.loginEyebrow", defaults.global.loginEyebrow),
      loginTitle: getString(formData, "global.loginTitle", defaults.global.loginTitle),
      loginHint: getString(formData, "global.loginHint", defaults.global.loginHint),
      purchaseHint: getString(formData, "global.purchaseHint", defaults.global.purchaseHint),
      orderHelpText: getString(formData, "global.orderHelpText", defaults.global.orderHelpText),
      myCoursesIntro: getString(formData, "global.myCoursesIntro", defaults.global.myCoursesIntro),
      myCoursesEmpty: getString(formData, "global.myCoursesEmpty", defaults.global.myCoursesEmpty),
      myCoursesTitle: getString(formData, "global.myCoursesTitle", defaults.global.myCoursesTitle),
      orderSectionTitle: getString(formData, "global.orderSectionTitle", defaults.global.orderSectionTitle),
      continueLearningLabel: getString(formData, "global.continueLearningLabel", defaults.global.continueLearningLabel),
      continuePayingLabel: getString(formData, "global.continuePayingLabel", defaults.global.continuePayingLabel),
      orderClosedLabel: getString(formData, "global.orderClosedLabel", defaults.global.orderClosedLabel),
      logoutLabel: getString(formData, "global.logoutLabel", defaults.global.logoutLabel),
      currencyPrefix: getString(formData, "global.currencyPrefix", defaults.global.currencyPrefix),
      courseCardCtaLabel: getString(formData, "global.courseCardCtaLabel", defaults.global.courseCardCtaLabel),
      courseCoverAltText: getString(formData, "global.courseCoverAltText", defaults.global.courseCoverAltText),
      lessonCountUnitLabel: getString(formData, "global.lessonCountUnitLabel", defaults.global.lessonCountUnitLabel),
      validityLabelPrefix: getString(formData, "global.validityLabelPrefix", defaults.global.validityLabelPrefix),
      courseCardRegularPriceUnit: getString(formData, "global.courseCardRegularPriceUnit", defaults.global.courseCardRegularPriceUnit),
      purchasePaymentLabel: getString(formData, "global.purchasePaymentLabel", defaults.global.purchasePaymentLabel),
      purchaseLoadingLabel: getString(formData, "global.purchaseLoadingLabel", defaults.global.purchaseLoadingLabel),
      purchaseSignedInLabel: getString(formData, "global.purchaseSignedInLabel", defaults.global.purchaseSignedInLabel),
      purchaseSignedOutLabel: getString(formData, "global.purchaseSignedOutLabel", defaults.global.purchaseSignedOutLabel),
      genericRequestError: getString(formData, "global.genericRequestError", defaults.global.genericRequestError),
      createOrderError: getString(formData, "global.createOrderError", defaults.global.createOrderError),
      loginSuccessText: getString(formData, "global.loginSuccessText", defaults.global.loginSuccessText),
      registerSuccessText: getString(formData, "global.registerSuccessText", defaults.global.registerSuccessText),
      loginErrorText: getString(formData, "global.loginErrorText", defaults.global.loginErrorText),
      phoneLabel: getString(formData, "global.phoneLabel", defaults.global.phoneLabel),
      phonePlaceholder: getString(formData, "global.phonePlaceholder", defaults.global.phonePlaceholder),
      passwordLabel: getString(formData, "global.passwordLabel", defaults.global.passwordLabel),
      passwordPlaceholder: getString(formData, "global.passwordPlaceholder", defaults.global.passwordPlaceholder),
      loginSubmitLabel: getString(formData, "global.loginSubmitLabel", defaults.global.loginSubmitLabel),
      loginSubmittingLabel: getString(formData, "global.loginSubmittingLabel", defaults.global.loginSubmittingLabel),
      orderPageEyebrow: getString(formData, "global.orderPageEyebrow", defaults.global.orderPageEyebrow),
      orderPaidTitle: getString(formData, "global.orderPaidTitle", defaults.global.orderPaidTitle),
      orderClosedTitle: getString(formData, "global.orderClosedTitle", defaults.global.orderClosedTitle),
      orderPendingTitle: getString(formData, "global.orderPendingTitle", defaults.global.orderPendingTitle),
      orderCourseLabel: getString(formData, "global.orderCourseLabel", defaults.global.orderCourseLabel),
      orderNoLabel: getString(formData, "global.orderNoLabel", defaults.global.orderNoLabel),
      orderPaymentMethodLabel: getString(formData, "global.orderPaymentMethodLabel", defaults.global.orderPaymentMethodLabel),
      orderAmountLabel: getString(formData, "global.orderAmountLabel", defaults.global.orderAmountLabel),
      orderPaymentSuffix: getString(formData, "global.orderPaymentSuffix", defaults.global.orderPaymentSuffix),
      orderPaidRedirectText: getString(formData, "global.orderPaidRedirectText", defaults.global.orderPaidRedirectText),
      orderClosedHelpText: getString(formData, "global.orderClosedHelpText", defaults.global.orderClosedHelpText),
      orderRepurchaseLabel: getString(formData, "global.orderRepurchaseLabel", defaults.global.orderRepurchaseLabel),
      orderScanText: getString(formData, "global.orderScanText", defaults.global.orderScanText),
      orderQrAlt: getString(formData, "global.orderQrAlt", defaults.global.orderQrAlt),
      orderQrLoadingText: getString(formData, "global.orderQrLoadingText", defaults.global.orderQrLoadingText),
      orderRemainingPrefix: getString(formData, "global.orderRemainingPrefix", defaults.global.orderRemainingPrefix),
      orderCheckingLabel: getString(formData, "global.orderCheckingLabel", defaults.global.orderCheckingLabel),
      orderCheckLabel: getString(formData, "global.orderCheckLabel", defaults.global.orderCheckLabel),
      orderFallbackLinkLabel: getString(formData, "global.orderFallbackLinkLabel", defaults.global.orderFallbackLinkLabel),
      orderStatusCheckError: getString(formData, "global.orderStatusCheckError", defaults.global.orderStatusCheckError),
      orderQrLoadError: getString(formData, "global.orderQrLoadError", defaults.global.orderQrLoadError),
      myCoursesValidityLabel: getString(formData, "global.myCoursesValidityLabel", defaults.global.myCoursesValidityLabel),
      myCoursesLessonCountPrefix: getString(formData, "global.myCoursesLessonCountPrefix", defaults.global.myCoursesLessonCountPrefix),
      myCoursesPlayableLessonUnit: getString(formData, "global.myCoursesPlayableLessonUnit", defaults.global.myCoursesPlayableLessonUnit),
      orderExpiresPrefix: getString(formData, "global.orderExpiresPrefix", defaults.global.orderExpiresPrefix),
      orderExpiredText: getString(formData, "global.orderExpiredText", defaults.global.orderExpiredText),
    },
    home: {
      title: getString(formData, "home.title", defaults.home.title),
      content: getString(formData, "home.content", defaults.home.content),
      eyebrow: getString(formData, "home.eyebrow", defaults.home.eyebrow),
      primaryCtaLabel: getString(formData, "home.primaryCtaLabel", defaults.home.primaryCtaLabel),
      primaryCtaHref: getString(formData, "home.primaryCtaHref", defaults.home.primaryCtaHref),
      secondaryCtaLabel: getString(formData, "home.secondaryCtaLabel", defaults.home.secondaryCtaLabel),
      secondaryCtaHref: getString(formData, "home.secondaryCtaHref", defaults.home.secondaryCtaHref),
      features: getTextItems(formData, "home.features", defaults.home.features),
      heroImage: getString(formData, "home.heroImage", defaults.home.heroImage),
      heroImageAlt: getString(formData, "home.heroImageAlt", defaults.home.heroImageAlt),
      earlyBirdBadgeLabel: getString(formData, "home.earlyBirdBadgeLabel", defaults.home.earlyBirdBadgeLabel),
      regularPriceBadgeLabel: getString(formData, "home.regularPriceBadgeLabel", defaults.home.regularPriceBadgeLabel),
      audienceLabel: getString(formData, "home.audienceLabel", defaults.home.audienceLabel),
      audienceTitle: getString(formData, "home.audienceTitle", defaults.home.audienceTitle),
      audience: getString(formData, "home.audience", defaults.home.audience),
      notAudience: getString(formData, "home.notAudience", defaults.home.notAudience),
      teacherLabel: getString(formData, "home.teacherLabel", defaults.home.teacherLabel),
      teacherTitle: getString(formData, "home.teacherTitle", defaults.home.teacherTitle),
      teacherIntro: getString(formData, "home.teacherIntro", defaults.home.teacherIntro),
      teacherImage: getString(formData, "home.teacherImage", defaults.home.teacherImage),
      teacherImageAlt: getString(formData, "home.teacherImageAlt", defaults.home.teacherImageAlt),
      teacherAchievements: getStringList(formData, "home.teacherAchievements", defaults.home.teacherAchievements),
      coursesEyebrow: getString(formData, "home.coursesEyebrow", defaults.home.coursesEyebrow),
      coursesTitle: getString(formData, "home.coursesTitle", defaults.home.coursesTitle),
      coursesLinkLabel: getString(formData, "home.coursesLinkLabel", defaults.home.coursesLinkLabel),
    },
    about: {
      title: getString(formData, "about.title", defaults.about.title),
      content: getString(formData, "about.content", defaults.about.content),
      eyebrow: getString(formData, "about.eyebrow", defaults.about.eyebrow),
      avatarImage: getString(formData, "about.avatarImage", defaults.about.avatarImage),
      avatarAlt: getString(formData, "about.avatarAlt", defaults.about.avatarAlt),
      certificateEyebrow: getString(formData, "about.certificateEyebrow", defaults.about.certificateEyebrow),
      certificateTitle: getString(formData, "about.certificateTitle", defaults.about.certificateTitle),
      certificateImage: getString(formData, "about.certificateImage", defaults.about.certificateImage),
      certificateAlt: getString(formData, "about.certificateAlt", defaults.about.certificateAlt),
      cards: getTextItems(formData, "about.cards", defaults.about.cards),
      achievementsLabel: getString(formData, "about.achievementsLabel", defaults.about.achievementsLabel),
      achievements: getStringList(formData, "about.achievements", defaults.about.achievements),
      serviceLabel: getString(formData, "about.serviceLabel", defaults.about.serviceLabel),
      serviceSteps: getStringList(formData, "about.serviceSteps", defaults.about.serviceSteps),
    },
    courses: {
      eyebrow: getString(formData, "courses.eyebrow", defaults.courses.eyebrow),
      title: getString(formData, "courses.title", defaults.courses.title),
      content: getString(formData, "courses.content", defaults.courses.content),
      promoEyebrow: getString(formData, "courses.promoEyebrow", defaults.courses.promoEyebrow),
      promoTitle: getString(formData, "courses.promoTitle", defaults.courses.promoTitle),
      promoText: getString(formData, "courses.promoText", defaults.courses.promoText),
      promoServiceText: getString(formData, "courses.promoServiceText", defaults.courses.promoServiceText),
    },
    courseDetail: {
      eyebrow: getString(formData, "courseDetail.eyebrow", defaults.courseDetail.eyebrow),
      badges: getStringList(formData, "courseDetail.badges", defaults.courseDetail.badges),
      outlineTitle: getString(formData, "courseDetail.outlineTitle", defaults.courseDetail.outlineTitle),
      emptyLessonSummary: getString(formData, "courseDetail.emptyLessonSummary", defaults.courseDetail.emptyLessonSummary),
      outcomesTitle: getString(formData, "courseDetail.outcomesTitle", defaults.courseDetail.outcomesTitle),
      outcomes: getStringList(formData, "courseDetail.outcomes", defaults.courseDetail.outcomes),
      audienceTitle: getString(formData, "courseDetail.audienceTitle", defaults.courseDetail.audienceTitle),
      audience: getStringList(formData, "courseDetail.audience", defaults.courseDetail.audience),
      notForTitle: getString(formData, "courseDetail.notForTitle", defaults.courseDetail.notForTitle),
      notFor: getStringList(formData, "courseDetail.notFor", defaults.courseDetail.notFor),
      highlightsTitle: getString(formData, "courseDetail.highlightsTitle", defaults.courseDetail.highlightsTitle),
      highlights: getStringList(formData, "courseDetail.highlights", defaults.courseDetail.highlights),
      requirementsTitle: getString(formData, "courseDetail.requirementsTitle", defaults.courseDetail.requirementsTitle),
      requirements: getString(formData, "courseDetail.requirements", defaults.courseDetail.requirements),
      purchaseNotesTitle: getString(formData, "courseDetail.purchaseNotesTitle", defaults.courseDetail.purchaseNotesTitle),
      purchaseNotes: getStringList(formData, "courseDetail.purchaseNotes", defaults.courseDetail.purchaseNotes),
      refundTitle: getString(formData, "courseDetail.refundTitle", defaults.courseDetail.refundTitle),
      refundPolicy: getString(formData, "courseDetail.refundPolicy", defaults.courseDetail.refundPolicy),
      faqTitle: getString(formData, "courseDetail.faqTitle", defaults.courseDetail.faqTitle),
      faq: getFaqItems(formData, defaults.courseDetail.faq),
      priceLabel: getString(formData, "courseDetail.priceLabel", defaults.courseDetail.priceLabel),
      regularPriceLabel: getString(formData, "courseDetail.regularPriceLabel", defaults.courseDetail.regularPriceLabel),
      validityPrefix: getString(formData, "courseDetail.validityPrefix", defaults.courseDetail.validityPrefix),
      lessonCountLabel: getString(formData, "courseDetail.lessonCountLabel", defaults.courseDetail.lessonCountLabel),
      watchMethodLabel: getString(formData, "courseDetail.watchMethodLabel", defaults.courseDetail.watchMethodLabel),
      watchMethod: getString(formData, "courseDetail.watchMethod", defaults.courseDetail.watchMethod),
      serviceModelLabel: getString(formData, "courseDetail.serviceModelLabel", defaults.courseDetail.serviceModelLabel),
      ageRangeLabel: getString(formData, "courseDetail.ageRangeLabel", defaults.courseDetail.ageRangeLabel),
      sidebarNote: getString(formData, "courseDetail.sidebarNote", defaults.courseDetail.sidebarNote),
    },
  };

  await prisma.siteContent.upsert({
    where: { key: "site-config" },
    update: {
      title: config.global.siteTitle,
      content: config.global.siteDescription,
      metadata: config,
    },
    create: {
      key: "site-config",
      title: config.global.siteTitle,
      content: config.global.siteDescription,
      metadata: config,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/courses");
  revalidatePath("/courses/[slug]", "page");
  revalidatePath("/login");
  revalidatePath("/my-courses");
  revalidatePath("/admin/content");
}
