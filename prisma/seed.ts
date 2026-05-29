import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { HOME_CONTENT, LESSON_CONTENT, MAIN_COURSE, TEACHER_CONTENT } from "../src/lib/site-content";

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
    update: {
      title: HOME_CONTENT.title,
      content: HOME_CONTENT.description,
      metadata: {
        heroTitle: HOME_CONTENT.title,
        heroSubtitle: HOME_CONTENT.description,
      },
    },
    create: {
      key: "home",
      title: HOME_CONTENT.title,
      content: HOME_CONTENT.description,
      metadata: {
        heroTitle: HOME_CONTENT.title,
        heroSubtitle: HOME_CONTENT.description,
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "about" },
    update: {
      title: TEACHER_CONTENT.title,
      content: TEACHER_CONTENT.intro,
    },
    create: {
      key: "about",
      title: TEACHER_CONTENT.title,
      content: TEACHER_CONTENT.intro,
    },
  });
  const existingMainCourse = await prisma.course.findUnique({ where: { slug: MAIN_COURSE.slug } });
  const legacyCourse = existingMainCourse ? null : await prisma.course.findUnique({ where: { slug: "aicoding-1" } });
  const courseData = {
    title: MAIN_COURSE.title,
    slug: MAIN_COURSE.slug,
    coverUrl: MAIN_COURSE.coverUrl,
    summary: MAIN_COURSE.summary,
    description: MAIN_COURSE.description,
    priceCents: MAIN_COURSE.earlyBirdPriceCents,
    validityDays: MAIN_COURSE.validityDays,
    status: "published" as const,
    sortOrder: 1,
  };
  const course = existingMainCourse || legacyCourse
    ? await prisma.course.update({ where: { id: (existingMainCourse || legacyCourse)!.id }, data: courseData })
    : await prisma.course.create({ data: courseData });

  for (const lesson of LESSON_CONTENT) {
    const existing = await prisma.lesson.findFirst({
      where: { courseId: course.id, sortOrder: lesson.sortOrder },
    });

    const data = {
      courseId: course.id,
      title: lesson.title,
      summary: lesson.summary,
      sortOrder: lesson.sortOrder,
      durationSec: lesson.durationSec,
      status: existing?.mediaAssetId ? "published" as const : "draft" as const,
    };

    if (existing) {
      await prisma.lesson.update({ where: { id: existing.id }, data });
    } else {
      await prisma.lesson.create({ data });
    }
  }

  await prisma.course.updateMany({
    where: {
      slug: { not: MAIN_COURSE.slug },
      lessons: { none: { mediaAsset: { status: "uploaded" } } },
    },
    data: { status: "archived" },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
