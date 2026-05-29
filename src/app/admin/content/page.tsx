import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteConfig } from "./actions";

function TextInput({ label, name, value, type = "text", hint }: { label: string; name: string; value: string | number; type?: string; hint?: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input name={name} type={type} defaultValue={value} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" />
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{hint}</span> : null}
    </label>
  );
}

function TextArea({ label, name, value, rows = 4 }: { label: string; name: string; value: string; rows?: number }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea name={name} defaultValue={value} rows={rows} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" />
    </label>
  );
}

function ListArea({ label, name, value, rows = 5 }: { label: string; name: string; value: readonly string[]; rows?: number }) {
  return <TextArea label={`${label}（每行一条）`} name={name} value={value.join("\n")} rows={rows} />;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

export default async function AdminContentPage() {
  await requireAdminSession();
  const config = await getSiteSettings();

  return (
    <AdminShell title="站点内容">
      <form action={updateSiteConfig} className="space-y-6">
        <div className="rounded-3xl bg-cyan-50 p-5 text-sm leading-6 text-cyan-900 ring-1 ring-cyan-100">
          这里管理前台可调整的标题、正文、按钮、图片路径、SEO、购买说明和课程详情模块。图片路径可使用 `public` 下的 URL，例如 `/assets/images/brand/genwolian-ai-logo.png`，也可使用公网可访问的 COS HTTPS URL。
        </div>

        <Section title="全站品牌、SEO 与导航">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="站点名" name="global.name" value={config.global.name} />
            <TextInput label="短站点名" name="global.shortName" value={config.global.shortName} />
            <TextInput label="讲师名" name="global.teacherName" value={config.global.teacherName} />
            <TextInput label="讲师展示名" name="global.teacherDisplayName" value={config.global.teacherDisplayName} />
            <TextInput label="主体/版权主体" name="global.companyName" value={config.global.companyName} />
            <TextInput label="售后邮箱" name="global.supportEmail" value={config.global.supportEmail} />
            <TextInput label="Logo 图片路径" name="global.logo" value={config.global.logo} hint="建议 512 x 512 px 正方形，PNG/SVG 优先；页面实际显示约 34 x 34 px。" />
            <TextInput label="分享图路径" name="global.shareImage" value={config.global.shareImage} hint="建议 1200 x 630 px 横图，或 1024 x 1024 px 正方形；需公网可访问，不要使用会过期的签名 URL。" />
            <TextInput label="主课程 slug" name="global.mainCourseSlug" value={config.global.mainCourseSlug} />
            <TextInput label="正价（分）" name="global.regularPriceCents" value={config.global.regularPriceCents} type="number" />
            <TextInput label="适合年龄" name="global.ageRange" value={config.global.ageRange} />
            <TextInput label="服务形式" name="global.serviceModel" value={config.global.serviceModel} />
            <TextInput label="导航：首页" name="global.navHomeLabel" value={config.global.navHomeLabel} />
            <TextInput label="导航：课程" name="global.navCoursesLabel" value={config.global.navCoursesLabel} />
            <TextInput label="导航：关于" name="global.navAboutLabel" value={config.global.navAboutLabel} />
            <TextInput label="导航：我的课程" name="global.navMyCoursesLabel" value={config.global.navMyCoursesLabel} />
            <TextInput label="未登录按钮" name="global.loginCtaLabel" value={config.global.loginCtaLabel} />
          </div>
          <TextInput label="全站口号" name="global.slogan" value={config.global.slogan} />
          <TextInput label="SEO 标题" name="global.siteTitle" value={config.global.siteTitle} />
          <TextArea label="SEO 描述" name="global.siteDescription" value={config.global.siteDescription} />
          <TextInput label="OG 分享标题" name="global.ogTitle" value={config.global.ogTitle} />
          <TextArea label="OG 分享描述" name="global.ogDescription" value={config.global.ogDescription} />
        </Section>

        <Section title="首页">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="首屏标签" name="home.eyebrow" value={config.home.eyebrow} />
            <TextInput label="主标题" name="home.title" value={config.home.title} />
            <TextInput label="主按钮文案" name="home.primaryCtaLabel" value={config.home.primaryCtaLabel} />
            <TextInput label="主按钮链接" name="home.primaryCtaHref" value={config.home.primaryCtaHref} />
            <TextInput label="次按钮文案" name="home.secondaryCtaLabel" value={config.home.secondaryCtaLabel} />
            <TextInput label="次按钮链接" name="home.secondaryCtaHref" value={config.home.secondaryCtaHref} />
            <TextInput label="首屏图片路径" name="home.heroImage" value={config.home.heroImage} hint="建议 1600 x 900 px，16:9 横图，主体居中，避免文字贴边。" />
            <TextInput label="首屏图片 alt" name="home.heroImageAlt" value={config.home.heroImageAlt} />
            <TextInput label="早鸟价标签" name="home.earlyBirdBadgeLabel" value={config.home.earlyBirdBadgeLabel} />
            <TextInput label="正价标签" name="home.regularPriceBadgeLabel" value={config.home.regularPriceBadgeLabel} />
          </div>
          <TextArea label="首屏正文" name="home.content" value={config.home.content} rows={5} />
          <div className="grid gap-4 lg:grid-cols-3">
            {config.home.features.map((feature, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-4">
                <TextInput label={`卖点 ${index + 1} 标题`} name={`home.features.${index}.title`} value={feature.title} />
                <div className="mt-4">
                  <TextArea label={`卖点 ${index + 1} 说明`} name={`home.features.${index}.description`} value={feature.description} />
                </div>
              </div>
            ))}
          </div>
          <TextInput label="适合谁标签" name="home.audienceLabel" value={config.home.audienceLabel} />
          <TextInput label="适合谁标题" name="home.audienceTitle" value={config.home.audienceTitle} />
          <TextArea label="适合谁说明" name="home.audience" value={config.home.audience} />
          <TextArea label="不适合谁说明" name="home.notAudience" value={config.home.notAudience} />
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="老师模块标签" name="home.teacherLabel" value={config.home.teacherLabel} />
            <TextInput label="老师模块标题" name="home.teacherTitle" value={config.home.teacherTitle} />
            <TextInput label="老师图片路径" name="home.teacherImage" value={config.home.teacherImage} hint="建议 1200 x 900 px，4:3 横图，适合授课照或工作照。" />
            <TextInput label="老师图片 alt" name="home.teacherImageAlt" value={config.home.teacherImageAlt} />
            <TextInput label="课程区标签" name="home.coursesEyebrow" value={config.home.coursesEyebrow} />
            <TextInput label="课程区标题" name="home.coursesTitle" value={config.home.coursesTitle} />
            <TextInput label="全部课程链接文案" name="home.coursesLinkLabel" value={config.home.coursesLinkLabel} />
          </div>
          <TextArea label="老师模块正文" name="home.teacherIntro" value={config.home.teacherIntro} rows={5} />
          <ListArea label="老师模块背书" name="home.teacherAchievements" value={config.home.teacherAchievements} />
        </Section>

        <Section title="关于老师">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="页面标签" name="about.eyebrow" value={config.about.eyebrow} />
            <TextInput label="页面标题" name="about.title" value={config.about.title} />
            <TextInput label="头像路径" name="about.avatarImage" value={config.about.avatarImage} hint="建议 800 x 800 px 正方形头像，面部居中，背景干净。" />
            <TextInput label="头像 alt" name="about.avatarAlt" value={config.about.avatarAlt} />
            <TextInput label="证书模块标签" name="about.certificateEyebrow" value={config.about.certificateEyebrow} />
            <TextInput label="证书模块标题" name="about.certificateTitle" value={config.about.certificateTitle} />
            <TextInput label="证书图片路径" name="about.certificateImage" value={config.about.certificateImage} hint="建议宽度不低于 1600 px，保持原证书比例，文字需要清晰可辨。" />
            <TextInput label="证书图片 alt" name="about.certificateAlt" value={config.about.certificateAlt} />
          </div>
          <TextArea label="关于正文" name="about.content" value={config.about.content} rows={6} />
          <div className="grid gap-4 lg:grid-cols-3">
            {config.about.cards.map((card, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-4">
                <TextInput label={`卡片 ${index + 1} 标题`} name={`about.cards.${index}.title`} value={card.title} />
                <div className="mt-4">
                  <TextArea label={`卡片 ${index + 1} 正文`} name={`about.cards.${index}.description`} value={card.description} />
                </div>
              </div>
            ))}
          </div>
          <TextInput label="代表经历标题" name="about.achievementsLabel" value={config.about.achievementsLabel} />
          <ListArea label="代表经历" name="about.achievements" value={config.about.achievements} />
          <TextInput label="服务流程标题" name="about.serviceLabel" value={config.about.serviceLabel} />
          <ListArea label="服务流程步骤" name="about.serviceSteps" value={config.about.serviceSteps} />
        </Section>

        <Section title="课程中心">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="页面标签" name="courses.eyebrow" value={config.courses.eyebrow} />
            <TextInput label="页面标题" name="courses.title" value={config.courses.title} />
            <TextInput label="主推标签" name="courses.promoEyebrow" value={config.courses.promoEyebrow} />
            <TextInput label="主推标题" name="courses.promoTitle" value={config.courses.promoTitle} />
          </div>
          <TextArea label="页面说明" name="courses.content" value={config.courses.content} />
          <TextArea label="主推价格说明" name="courses.promoText" value={config.courses.promoText} />
          <TextArea label="主推服务说明" name="courses.promoServiceText" value={config.courses.promoServiceText} />
        </Section>

        <Section title="课程详情">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="详情页标签" name="courseDetail.eyebrow" value={config.courseDetail.eyebrow} />
            <TextInput label="大纲标题" name="courseDetail.outlineTitle" value={config.courseDetail.outlineTitle} />
            <TextInput label="无简介时默认课时说明" name="courseDetail.emptyLessonSummary" value={config.courseDetail.emptyLessonSummary} />
            <TextInput label="学完获得标题" name="courseDetail.outcomesTitle" value={config.courseDetail.outcomesTitle} />
            <TextInput label="适合人群标题" name="courseDetail.audienceTitle" value={config.courseDetail.audienceTitle} />
            <TextInput label="不适合人群标题" name="courseDetail.notForTitle" value={config.courseDetail.notForTitle} />
            <TextInput label="课程特色标题" name="courseDetail.highlightsTitle" value={config.courseDetail.highlightsTitle} />
            <TextInput label="学习准备标题" name="courseDetail.requirementsTitle" value={config.courseDetail.requirementsTitle} />
            <TextInput label="购买须知标题" name="courseDetail.purchaseNotesTitle" value={config.courseDetail.purchaseNotesTitle} />
            <TextInput label="退款规则标题" name="courseDetail.refundTitle" value={config.courseDetail.refundTitle} />
            <TextInput label="FAQ 标题" name="courseDetail.faqTitle" value={config.courseDetail.faqTitle} />
          </div>
          <ListArea label="详情页标签 badges" name="courseDetail.badges" value={config.courseDetail.badges} />
          <ListArea label="学完获得" name="courseDetail.outcomes" value={config.courseDetail.outcomes} rows={7} />
          <ListArea label="适合人群" name="courseDetail.audience" value={config.courseDetail.audience} />
          <ListArea label="不适合人群" name="courseDetail.notFor" value={config.courseDetail.notFor} />
          <ListArea label="课程特色" name="courseDetail.highlights" value={config.courseDetail.highlights} />
          <TextArea label="学习前准备正文" name="courseDetail.requirements" value={config.courseDetail.requirements} rows={5} />
          <ListArea label="购买须知" name="courseDetail.purchaseNotes" value={config.courseDetail.purchaseNotes} rows={7} />
          <TextArea label="退款规则正文" name="courseDetail.refundPolicy" value={config.courseDetail.refundPolicy} rows={4} />
          <div className="grid gap-4 lg:grid-cols-2">
            {config.courseDetail.faq.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-4">
                <TextInput label={`FAQ ${index + 1} 问题`} name={`courseDetail.faq.${index}.question`} value={faq.question} />
                <div className="mt-4">
                  <TextArea label={`FAQ ${index + 1} 回答`} name={`courseDetail.faq.${index}.answer`} value={faq.answer} rows={4} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="价格标签" name="courseDetail.priceLabel" value={config.courseDetail.priceLabel} />
            <TextInput label="正价标签" name="courseDetail.regularPriceLabel" value={config.courseDetail.regularPriceLabel} />
            <TextInput label="有效期前缀" name="courseDetail.validityPrefix" value={config.courseDetail.validityPrefix} />
            <TextInput label="课时数量标签" name="courseDetail.lessonCountLabel" value={config.courseDetail.lessonCountLabel} />
            <TextInput label="观看方式标签" name="courseDetail.watchMethodLabel" value={config.courseDetail.watchMethodLabel} />
            <TextInput label="观看方式" name="courseDetail.watchMethod" value={config.courseDetail.watchMethod} />
            <TextInput label="服务形式标签" name="courseDetail.serviceModelLabel" value={config.courseDetail.serviceModelLabel} />
            <TextInput label="适合年龄标签" name="courseDetail.ageRangeLabel" value={config.courseDetail.ageRangeLabel} />
          </div>
          <TextArea label="侧边栏说明" name="courseDetail.sidebarNote" value={config.courseDetail.sidebarNote} />
        </Section>

        <Section title="登录、购买、订单、我的课程">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="登录页标签" name="global.loginEyebrow" value={config.global.loginEyebrow} />
            <TextInput label="登录页标题" name="global.loginTitle" value={config.global.loginTitle} />
          </div>
          <TextArea label="登录页说明" name="global.loginHint" value={config.global.loginHint} />
          <TextArea label="购买按钮下说明" name="global.purchaseHint" value={config.global.purchaseHint} />
          <TextArea label="订单页帮助文案" name="global.orderHelpText" value={config.global.orderHelpText} rows={4} />
          <div className="grid gap-4 lg:grid-cols-2">
            <TextInput label="我的课程页标题" name="global.myCoursesTitle" value={config.global.myCoursesTitle} />
            <TextInput label="订单区标题" name="global.orderSectionTitle" value={config.global.orderSectionTitle} />
            <TextInput label="继续学习按钮" name="global.continueLearningLabel" value={config.global.continueLearningLabel} />
            <TextInput label="继续支付按钮" name="global.continuePayingLabel" value={config.global.continuePayingLabel} />
            <TextInput label="订单关闭标签" name="global.orderClosedLabel" value={config.global.orderClosedLabel} />
            <TextInput label="退出登录按钮" name="global.logoutLabel" value={config.global.logoutLabel} />
            <TextInput label="金额符号" name="global.currencyPrefix" value={config.global.currencyPrefix} />
            <TextInput label="课程卡片按钮" name="global.courseCardCtaLabel" value={config.global.courseCardCtaLabel} />
            <TextInput label="课程封面 alt 模板" name="global.courseCoverAltText" value={config.global.courseCoverAltText} />
            <TextInput label="课时单位" name="global.lessonCountUnitLabel" value={config.global.lessonCountUnitLabel} />
            <TextInput label="有效期前缀" name="global.validityLabelPrefix" value={config.global.validityLabelPrefix} />
            <TextInput label="正价单位" name="global.courseCardRegularPriceUnit" value={config.global.courseCardRegularPriceUnit} />
            <TextInput label="支付方式名称" name="global.purchasePaymentLabel" value={config.global.purchasePaymentLabel} />
            <TextInput label="购买加载文案" name="global.purchaseLoadingLabel" value={config.global.purchaseLoadingLabel} />
            <TextInput label="已登录购买按钮" name="global.purchaseSignedInLabel" value={config.global.purchaseSignedInLabel} />
            <TextInput label="未登录购买按钮" name="global.purchaseSignedOutLabel" value={config.global.purchaseSignedOutLabel} />
            <TextInput label="通用请求错误" name="global.genericRequestError" value={config.global.genericRequestError} />
            <TextInput label="创建订单错误" name="global.createOrderError" value={config.global.createOrderError} />
            <TextInput label="登录成功提示" name="global.loginSuccessText" value={config.global.loginSuccessText} />
            <TextInput label="注册成功提示" name="global.registerSuccessText" value={config.global.registerSuccessText} />
            <TextInput label="登录失败提示" name="global.loginErrorText" value={config.global.loginErrorText} />
            <TextInput label="手机号标签" name="global.phoneLabel" value={config.global.phoneLabel} />
            <TextInput label="手机号占位" name="global.phonePlaceholder" value={config.global.phonePlaceholder} />
            <TextInput label="密码标签" name="global.passwordLabel" value={config.global.passwordLabel} />
            <TextInput label="密码占位" name="global.passwordPlaceholder" value={config.global.passwordPlaceholder} />
            <TextInput label="登录提交按钮" name="global.loginSubmitLabel" value={config.global.loginSubmitLabel} />
            <TextInput label="登录提交中" name="global.loginSubmittingLabel" value={config.global.loginSubmittingLabel} />
            <TextInput label="订单页标签" name="global.orderPageEyebrow" value={config.global.orderPageEyebrow} />
            <TextInput label="订单已支付标题" name="global.orderPaidTitle" value={config.global.orderPaidTitle} />
            <TextInput label="订单关闭标题" name="global.orderClosedTitle" value={config.global.orderClosedTitle} />
            <TextInput label="订单待支付标题" name="global.orderPendingTitle" value={config.global.orderPendingTitle} />
            <TextInput label="订单课程字段" name="global.orderCourseLabel" value={config.global.orderCourseLabel} />
            <TextInput label="订单号字段" name="global.orderNoLabel" value={config.global.orderNoLabel} />
            <TextInput label="支付方式字段" name="global.orderPaymentMethodLabel" value={config.global.orderPaymentMethodLabel} />
            <TextInput label="订单金额字段" name="global.orderAmountLabel" value={config.global.orderAmountLabel} />
            <TextInput label="支付方式后缀" name="global.orderPaymentSuffix" value={config.global.orderPaymentSuffix} />
            <TextInput label="支付成功跳转提示" name="global.orderPaidRedirectText" value={config.global.orderPaidRedirectText} />
            <TextInput label="订单关闭提示" name="global.orderClosedHelpText" value={config.global.orderClosedHelpText} />
            <TextInput label="重新购买按钮" name="global.orderRepurchaseLabel" value={config.global.orderRepurchaseLabel} />
            <TextInput label="扫码支付提示" name="global.orderScanText" value={config.global.orderScanText} />
            <TextInput label="支付二维码 alt" name="global.orderQrAlt" value={config.global.orderQrAlt} />
            <TextInput label="支付二维码加载文案" name="global.orderQrLoadingText" value={config.global.orderQrLoadingText} />
            <TextInput label="剩余支付时间前缀" name="global.orderRemainingPrefix" value={config.global.orderRemainingPrefix} />
            <TextInput label="检查中按钮" name="global.orderCheckingLabel" value={config.global.orderCheckingLabel} />
            <TextInput label="检查支付按钮" name="global.orderCheckLabel" value={config.global.orderCheckLabel} />
            <TextInput label="备用支付链接" name="global.orderFallbackLinkLabel" value={config.global.orderFallbackLinkLabel} />
            <TextInput label="检查支付错误" name="global.orderStatusCheckError" value={config.global.orderStatusCheckError} />
            <TextInput label="获取二维码错误" name="global.orderQrLoadError" value={config.global.orderQrLoadError} />
            <TextInput label="我的课程有效期字段" name="global.myCoursesValidityLabel" value={config.global.myCoursesValidityLabel} />
            <TextInput label="我的课程课时数前缀" name="global.myCoursesLessonCountPrefix" value={config.global.myCoursesLessonCountPrefix} />
            <TextInput label="我的课程课时单位" name="global.myCoursesPlayableLessonUnit" value={config.global.myCoursesPlayableLessonUnit} />
            <TextInput label="订单有效期字段" name="global.orderExpiresPrefix" value={config.global.orderExpiresPrefix} />
            <TextInput label="订单过期文案" name="global.orderExpiredText" value={config.global.orderExpiredText} />
          </div>
          <TextArea label="我的课程说明" name="global.myCoursesIntro" value={config.global.myCoursesIntro} />
          <TextArea label="我的课程空状态" name="global.myCoursesEmpty" value={config.global.myCoursesEmpty} />
        </Section>

        <button className="sticky bottom-4 rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-800">
          保存全部站点内容
        </button>
      </form>
    </AdminShell>
  );
}
