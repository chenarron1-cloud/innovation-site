import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDate, isPremiumUser } from "@/lib/utils";
import { PaywallGate } from "@/components/features/paywall-gate";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await db.article.findUnique({ where: { slug: params.slug } });
  if (!article) return {};
  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const [article, session] = await Promise.all([
    db.article.findUnique({
      where: { slug: params.slug, status: "published" },
      include: { author: { select: { name: true } }, category: true },
    }),
    getServerSession(authOptions),
  ]);

  if (!article) notFound();

  const canAccess = !article.isPremium || isPremiumUser(session?.user?.role);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Person", name: article.author.name },
    ...(article.isPremium ? {
      isAccessibleForFree: false,
      hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".paywall-content" },
    } : {}),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-t3 mb-6">
        <a href="/articles" className="hover:text-ind">文章</a>
        {article.category && <> <span>/</span> <span className="text-t2">{article.category.name}</span></>}
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-[500] text-t1 mb-4 leading-tight" style={{ wordBreak: "keep-all" }}>
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-t3">
          <span>{article.author.name}</span>
          <span>·</span>
          <span>{article.publishedAt ? formatDate(article.publishedAt) : ""}</span>
          {article.isPremium && <span className="text-amber font-medium">· 付費文章</span>}
        </div>
      </header>

      {/* Cover */}
      {article.coverImage && (
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 bg-bg2">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <PaywallGate isPremium={article.isPremium} canAccess={canAccess}>
        <div className="prose paywall-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      </PaywallGate>
    </div>
  );
}
