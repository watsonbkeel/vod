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
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
