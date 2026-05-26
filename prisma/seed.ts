import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.ADMIN_SEED_USERNAME ?? "admin";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "change-me-now";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, role: "owner" },
  });

  await prisma.siteContent.upsert({
    where: { key: "home" },
    update: {},
    create: {
      key: "home",
      title: "把复杂知识讲清楚的系统课程",
      content: "这里是个人品牌首页内容，可在后台编辑。",
      metadata: {
        heroTitle: "专注实战教学的精品课程",
        heroSubtitle: "系统化课程、付费学习、长期有效。",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "about" },
    update: {},
    create: {
      key: "about",
      title: "关于我",
      content: "这里填写个人经历、专业成果、课程理念与代表案例。",
    },
  });
  const course = await prisma.course.upsert({
    where: { slug: "practical-training" },
    update: {
      title: "系统实战训练营",
      summary: "把复杂知识拆成清晰路径，用 8 个核心课时完成从理解到实践的闭环。",
      description: "这是一门面向实战结果的系统课程，适合希望跟随清晰路径完成学习、练习和复盘的学员。",
      priceCents: 199900,
      validityDays: 365,
      status: "published",
      sortOrder: 1,
    },
    create: {
      title: "系统实战训练营",
      slug: "practical-training",
      summary: "把复杂知识拆成清晰路径，用 8 个核心课时完成从理解到实践的闭环。",
      description: "这是一门面向实战结果的系统课程，适合希望跟随清晰路径完成学习、练习和复盘的学员。",
      priceCents: 199900,
      validityDays: 365,
      status: "published",
      sortOrder: 1,
    },
  });

  const lessons = [
    "课程导学与学习路径",
    "核心概念与方法框架",
    "真实案例拆解",
    "关键步骤实操演示",
    "常见问题与误区",
    "进阶策略与工具",
    "综合演练",
    "总结复盘与后续计划",
  ];

  for (const [index, title] of lessons.entries()) {
    const existing = await prisma.lesson.findFirst({
      where: { courseId: course.id, sortOrder: index + 1 },
    });

    const data = {
      courseId: course.id,
      title,
      summary: "付费后在有效期内观看完整视频。",
      sortOrder: index + 1,
      status: "published" as const,
    };

    if (existing) {
      await prisma.lesson.update({ where: { id: existing.id }, data });
    } else {
      await prisma.lesson.create({ data });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
