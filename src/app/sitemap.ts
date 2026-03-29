import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://yourdomain.com";

  const staticRoutes = [
    "", "/articles", "/courses", "/tools", "/works", "/wishpool", "/pricing", "/about",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const articles = await db.article.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  }).catch(() => []);

  const articleRoutes = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const works = await db.work.findMany({
    where: { status: { in: ["approved", "featured"] } },
    select: { id: true, updatedAt: true },
  }).catch(() => []);

  const workRoutes = works.map((w) => ({
    url: `${baseUrl}/works/${w.id}`,
    lastModified: w.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...workRoutes];
}
