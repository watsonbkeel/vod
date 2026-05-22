import { jsonOk } from "@/lib/api";
import { featuredCourses } from "@/lib/mock-data";

export async function GET() {
  return jsonOk({ courses: featuredCourses });
}
