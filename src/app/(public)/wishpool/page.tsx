"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "收到許願", color: "bg-bg2 text-t3" },
  in_progress: { label: "製作中", color: "bg-ind-bg text-ind" },
  completed: { label: "已完成", color: "bg-green-50 text-grn-t" },
  declined: { label: "暫不實作", color: "bg-red/10 text-red" },
};

export default function WishpoolPage() {
  const { data: session } = useSession();
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchWishes() {
    const res = await fetch("/api/wishpool");
    const data = await res.json();
    setWishes(data);
    setLoading(false);
  }

  useEffect(() => { fetchWishes(); }, []);

  async function vote(wishId: string) {
    if (!session) { toast.error("請先登入才能投票"); return; }
    const res = await fetch(`/api/wishpool/${wishId}/vote`, { method: "POST" });
    if (res.ok) {
      fetchWishes();
      toast.success("已投票！");
    }
  }

  async function submitWish(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { toast.error("請先登入才能許願"); return; }
    setSubmitting(true);
    const res = await fetch("/api/wishpool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success("許願成功！");
      setShowForm(false); setTitle(""); setContent("");
      fetchWishes();
    } else {
      const err = await res.json();
      toast.error(err.error || "許願失敗");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[36px] font-[500] text-t1 mb-2">許願池</h1>
          <p className="text-t2 text-[15px]">告訴創新先生你想學什麼，高票許願優先製作</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          許一個願
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-ind-bd bg-ind-bg p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-t1">新增許願</h3>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-t3" /></button>
          </div>
          <form onSubmit={submitWish} className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="你想要什麼內容？（簡短標題）" required />
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="可以詳細說明你的需求..." rows={3} />
            <Button type="submit" disabled={submitting} size="sm">送出許願</Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-bd bg-white p-4 animate-pulse">
              <div className="h-4 bg-bg2 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {wishes.map((wish: any) => {
            const s = statusConfig[wish.status] || statusConfig.pending;
            return (
              <div key={wish.id} className="flex items-center gap-4 rounded-xl border border-bd bg-white p-4 hover:border-ind-bd transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-t1 font-medium">{wish.title}</p>
                  {wish.content && <p className="text-sm text-t2 mt-1 line-clamp-2">{wish.content}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${s.color}`}>{s.label}</span>
                <button
                  onClick={() => vote(wish.id)}
                  className="flex items-center gap-1.5 text-sm text-ind font-medium hover:bg-ind-bg rounded-lg px-3 py-1.5 transition-all shrink-0"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {wish._count?.votes || 0}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
