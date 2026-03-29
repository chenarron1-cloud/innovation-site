"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { WorkCard } from "@/components/features/works/work-card";
import { UploadWorkForm } from "@/components/features/works/upload-work-form";
import { Button } from "@/components/ui/button";
import { canUploadWork } from "@/lib/utils";
import { Trophy, Upload, Filter, TrendingUp, Clock, Eye, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const categories = [
  { value: "all", label: "全部" },
  { value: "planning", label: "企劃" },
  { value: "marketing", label: "行銷" },
  { value: "product", label: "產品" },
  { value: "course", label: "課程" },
  { value: "sales", label: "銷售" },
  { value: "other", label: "其他" },
];

const sortOptions = [
  { value: "votes", label: "最高票", icon: TrendingUp },
  { value: "newest", label: "最新", icon: Clock },
  { value: "views", label: "最多瀏覽", icon: Eye },
];

export default function WorksPage() {
  const { data: session } = useSession();
  const [works, setWorks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("votes");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  async function fetchWorks() {
    setLoading(true);
    const params = new URLSearchParams({ category, sort, page: page.toString() });
    const res = await fetch(`/api/works?${params}`);
    const data = await res.json();
    setWorks(data.works || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }

  async function fetchLeaderboard() {
    const res = await fetch("/api/works/leaderboard");
    const data = await res.json();
    setLeaderboard(data);
  }

  async function fetchStats() {
    const res = await fetch("/api/works/stats");
    const data = await res.json();
    setStats(data);
  }

  useEffect(() => { fetchWorks(); }, [category, sort, page]);
  useEffect(() => { fetchLeaderboard(); fetchStats(); }, []);

  const canUpload = canUploadWork(session?.user?.role);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[36px] font-[500] text-t1 mb-2" style={{ wordBreak: "keep-all" }}>
            AI 作品創意比一比
          </h1>
          <p className="text-t2 text-[17px]" style={{ wordBreak: "keep-all" }}>
            看看大家用創新思維 + AI 做出了什麼不普通的成果，為你喜歡的作品投票！
          </p>
        </div>
        {session ? (
          canUpload ? (
            <Button onClick={() => setShowUpload(true)} className="gap-2 shrink-0">
              <Upload className="h-4 w-4" />
              上傳我的作品
            </Button>
          ) : (
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/pricing">升級會員才能上傳</Link>
            </Button>
          )
        ) : (
          <Button asChild className="shrink-0">
            <Link href="/auth/login">登入後可上傳作品</Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "作品件數", value: stats.totalWorks },
            { label: "總票數", value: stats.totalVotes },
            { label: "創作者人數", value: stats.totalCreators },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-bd bg-white p-4 text-center">
              <div className="text-2xl font-bold text-ind">{s.value}</div>
              <div className="text-sm text-t2 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-ind text-white"
                  : "bg-bg2 text-t2 hover:bg-ind-bg hover:text-ind"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Sort */}
        <div className="flex gap-2">
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setSort(value); setPage(1); }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-all ${
                sort === value ? "bg-ind-bg text-ind border border-ind-bd" : "text-t2 hover:text-t1"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Works grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-xl border border-bd bg-white p-4 animate-pulse">
              <div className="w-full aspect-video bg-bg2 rounded-lg mb-4" />
              <div className="h-4 bg-bg2 rounded mb-2 w-3/4" />
              <div className="h-3 bg-bg2 rounded mb-1 w-full" />
              <div className="h-3 bg-bg2 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-t2 text-[15px] mb-4">還沒有作品，成為第一個上傳的人！</p>
          {canUpload && (
            <Button onClick={() => setShowUpload(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              上傳作品
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {works.map((work, i) => (
            <WorkCard key={work.id} work={work} rank={sort === "votes" && page === 1 ? i + 1 : undefined} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} size="sm">上一頁</Button>
          <span className="flex items-center px-4 text-sm text-t2">{page} / {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} size="sm">下一頁</Button>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-[500] text-t1 mb-6 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber" />
            本月排行榜
          </h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((work: any, i: number) => (
              <Link key={work.id} href={`/works/${work.id}`} className="block">
                <div className={`flex items-center gap-4 rounded-xl border p-4 hover:shadow-sm transition-all ${
                  i === 0 ? "border-yellow-300 bg-[#FFFDF5]" :
                  i === 1 ? "border-gray-200 bg-gray-50" :
                  i === 2 ? "border-orange-200 bg-orange-50" :
                  "border-bd bg-white"
                }`}>
                  <div className="text-2xl font-bold w-10 text-center" style={{
                    color: i === 0 ? "#B45309" : i === 1 ? "#6B7280" : i === 2 ? "#C2410C" : "#A89D92"
                  }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-[500] text-t1 truncate">{work.title}</div>
                    <div className="text-xs text-t3 mt-0.5">{work.user?.name}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-ind shrink-0">
                    ❤️ {work.voteCount} 票
                  </div>
                  {/* Progress bar */}
                  <div className="hidden sm:block w-24">
                    <div className="h-1.5 bg-bg2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ind rounded-full"
                        style={{ width: `${Math.min(100, (work.voteCount / (leaderboard[0]?.voteCount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upload CTA */}
      <div className="mt-16 rounded-2xl bg-ind-bg border border-ind-bd p-8 text-center">
        <h3 className="text-xl font-[500] text-t1 mb-2">你也有 AI 創作成果？</h3>
        <p className="text-t2 text-[15px] mb-2">上傳你的作品，讓社群看見你的創新思維</p>
        <p className="text-sm text-t3 mb-6">上傳規則：每月最多 3 件、需付費會員、審核通過後公開</p>
        {canUpload ? (
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            立即上傳
          </Button>
        ) : (
          <Button asChild>
            <Link href="/pricing">升級會員後可上傳</Link>
          </Button>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-bd">
              <h2 className="text-lg font-[500] text-t1">上傳 AI 作品</h2>
              <button onClick={() => setShowUpload(false)} className="text-t3 hover:text-t1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <UploadWorkForm onSuccess={() => { setShowUpload(false); fetchWorks(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
