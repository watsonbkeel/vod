"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

const contentSchema = z.object({
  key: z.enum(["home", "about"]),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

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
