import { jsonOk } from "@/lib/api";
import { getPublishedCourses } from "@/lib/courses";

export async function GET() {
  const courses = await getPublishedCourses();

  return jsonOk({ courses });
}
