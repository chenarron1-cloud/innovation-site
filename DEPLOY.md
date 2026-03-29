# 創新先生 — 部署指南

## 快速開始

### 1. 複製環境變數
```bash
cp .env.example .env
```

填入以下必要變數：
- `DATABASE_URL` — PostgreSQL 連線字串（推薦 Supabase）
- `NEXTAUTH_SECRET` — 隨機字串（執行 `openssl rand -base64 32`）
- `NEXTAUTH_URL` — 你的網站網址（如 `https://yoursite.com`）
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe
- `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` — Stripe Price IDs
- `RESEND_API_KEY` — Resend 郵件服務
- `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` — UploadThing 圖片上傳

### 2. 資料庫設定（Supabase）
```bash
# 安裝依賴（如尚未安裝）
npm install

# 推送資料庫 Schema
npx prisma db push

# 建立初始資料（管理員帳號、分類、範例工具）
npx ts-node prisma/seed.ts
```

### 3. Stripe 設定
1. 至 stripe.com 建立帳號，完成 KYC 驗證
2. 建立兩個 Product + Price：
   - 月訂閱：NT$299 / month（recurring）
   - 年訂閱：NT$2490 / year（recurring）
3. 取得 Price IDs，填入 `.env`
4. 設定 Webhook（`https://yoursite.com/api/webhooks/stripe`）監聽以下事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 4. 本機開發
```bash
npm run dev
```
瀏覽器開啟 http://localhost:3000

### 5. 部署到 Vercel
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

在 Vercel 控制台設定所有環境變數。

---

## 第一次上線後

### 設定管理員帳號
1. 用你的 Email 登入
2. 在資料庫直接更新 role：
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

### 冷啟動策略（作品投票區）
1. 以 Admin 帳號上傳 5-10 件示範作品
2. 在後台審核通過這些作品
3. 透過電子報通知現有學員
4. 在文章 / 課程頁底部加入「分享你的成果」CTA

---

## 頁面結構

| 路由 | 說明 |
|------|------|
| `/` | 首頁（9 個區塊） |
| `/articles` | 文章列表 |
| `/articles/[slug]` | 文章頁（含付費牆） |
| `/courses` | 課程列表 |
| `/tools` | 工具庫 |
| `/works` | AI 作品投票區 ★ |
| `/works/[id]` | 作品詳細頁 |
| `/wishpool` | 許願池 |
| `/pricing` | 方案頁 |
| `/account` | 會員帳戶 |
| `/admin` | 後台管理（Admin 限定） |
| `/admin/works` | 作品審核管理 ★ |
| `/admin/articles` | 文章管理 |
| `/admin/members` | 會員管理 |

---

## 技術棧

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Auth**: NextAuth.js v4 (Email Magic Link + Google OAuth)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Images**: UploadThing (S3)
- **Email**: Resend
- **AI**: Anthropic Claude API
- **Deploy**: Vercel

---

## 環境變數完整清單

```env
# Database
DATABASE_URL=""

# NextAuth
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_MONTHLY=""
STRIPE_PRICE_ANNUAL=""

# Email
RESEND_API_KEY=""

# AI
ANTHROPIC_API_KEY=""

# UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```
