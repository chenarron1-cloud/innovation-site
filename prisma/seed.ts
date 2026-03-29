import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await db.user.upsert({
    where: { email: "admin@yourdomain.com" },
    update: {},
    create: {
      email: "admin@yourdomain.com",
      name: "陳建銘",
      role: "admin",
      title: "創辦人",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create categories
  const categories = [
    { name: "AI 思維", slug: "ai-thinking" },
    { name: "行銷創新", slug: "marketing" },
    { name: "職場應用", slug: "workplace" },
    { name: "課程設計", slug: "education" },
    { name: "創業", slug: "startup" },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // Create sample tools
  const tools = [
    { name: "創新企劃生成器", slug: "innovation-planner", category: "企劃", description: "輸入你的目標，AI 幫你生成有差異化的企劃框架", isPremium: false, freeLimit: 5 },
    { name: "競品差異化分析", slug: "competitive-analysis", category: "行銷", description: "分析競品弱點，找出你的差異化切入點", isPremium: false, freeLimit: 3 },
    { name: "課程大綱設計師", slug: "course-outline", category: "教育", description: "用創新思維設計吸引人的課程結構", isPremium: true, freeLimit: 1 },
    { name: "銷售文案優化器", slug: "sales-copy", category: "銷售", description: "讓你的文案更有說服力，轉換率提升", isPremium: true, freeLimit: 1 },
  ];

  for (const tool of tools) {
    await db.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool,
    });
  }
  console.log("✅ Tools created");

  // Create sample demo works (for cold start)
  const demoWorks = [
    {
      title: "用 AI 重新設計 IG 內容策略，觸及率提升 3 倍",
      description: "我使用創新先生的差異化思維框架，搭配 Claude API，重新分析了我們品牌的受眾痛點，生成了一整套 IG 內容策略。結果發布第一個月，觸及率從原本的 500 飆升到 1,500，互動率也從 1.2% 提升到 4.8%。\n\n關鍵方法：用「反常識」框架找到受眾沒被說過的話，再用 AI 快速生成 30 天的貼文腳本。",
      category: "marketing" as const,
      imageUrl: "https://utfs.io/f/demo1",
      tags: ["IG行銷", "內容策略", "創新思維"],
      voteCount: 128,
      viewCount: 890,
      monthYear: "2026-03",
      status: "approved" as const,
    },
  ];

  for (const work of demoWorks) {
    await db.work.create({
      data: { ...work, userId: admin.id },
    }).catch(() => {}); // ignore duplicates
  }
  console.log("✅ Demo works created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
