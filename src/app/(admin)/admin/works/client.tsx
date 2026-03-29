"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Check, X, Star, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Work {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  voteCount: number;
  user: { name: string | null; email: string | null };
}

interface Props {
  pending: Work[];
  approved: Work[];
}

const categoryLabels: Record<string, string> = {
  planning: "企劃", marketing: "行銷", product: "產品",
  course: "課程", sales: "銷售", other: "其他",
};

export function AdminWorksClient({ pending: initialPending, approved }: Props) {
  const [pending, setPending] = useState(initialPending);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(id: string, status: string, reason?: string) {
    setLoading(id + status);
    try {
      const res = await fetch(`/api/admin/works/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectReason: reason }),
      });
      if (res.ok) {
        setPending(p => p.filter(w => w.id !== id));
        toast.success(status === "approved" ? "已通過審核" : status === "featured" ? "已設為精選" : "已退件");
      } else {
        toast.error("操作失敗");
      }
    } catch {
      toast.error("網路錯誤");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-[500] text-t1">作品審核管理</h1>
        <Button variant="ghost" size="sm" onClick={() => location.reload()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          重新整理
        </Button>
      </div>

      {/* Pending */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-t1 mb-4 flex items-center gap-2">
          待審核
          {pending.length > 0 && (
            <span className="bg-red text-white text-xs rounded-full px-2 py-0.5">{pending.length}</span>
          )}
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-xl border border-bd bg-bg2 p-8 text-center text-t3">暫無待審核作品</div>
        ) : (
          <div className="space-y-4">
            {pending.map((work) => (
              <div key={work.id} className="rounded-xl border border-bd bg-white p-5">
                <div className="flex gap-5">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-bg2 shrink-0">
                    <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-[500] text-t1">{work.title}</h3>
                        <div className="text-xs text-t3 mt-0.5">
                          {work.user.name} · {work.user.email} · {formatDate(work.createdAt)} · {categoryLabels[work.category]}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-t2 line-clamp-2 mb-3">{work.description}</p>

                    {/* Reject reason */}
                    <Textarea
                      placeholder="退件原因（如需退件請填寫）"
                      value={rejectReason[work.id] || ""}
                      onChange={(e) => setRejectReason(prev => ({ ...prev, [work.id]: e.target.value }))}
                      className="text-sm mb-3 h-16"
                    />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(work.id, "approved")}
                        disabled={!!loading}
                        className="gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        通過
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(work.id, "featured")}
                        disabled={!!loading}
                        className="gap-1"
                      >
                        <Star className="h-3.5 w-3.5" />
                        設為精選
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(work.id, "rejected", rejectReason[work.id])}
                        disabled={!!loading || !rejectReason[work.id]}
                        className="gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        退件
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Already approved */}
      <div>
        <h2 className="text-lg font-medium text-t1 mb-4">已公開作品（最新 20 件）</h2>
        <div className="space-y-2">
          {approved.map((work) => (
            <div key={work.id} className="flex items-center gap-4 rounded-xl border border-bd bg-white p-4">
              <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-bg2 shrink-0">
                <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-t1 truncate">{work.title}</div>
                <div className="text-xs text-t3">{work.user.name} · ❤️ {work.voteCount}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                work.status === "featured" ? "bg-amber/10 text-amber" : "bg-green-50 text-grn-t"
              }`}>
                {work.status === "featured" ? "精選" : "已公開"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateStatus(work.id, "rejected", "違反社群規範")}
                className="text-xs text-red hover:text-red"
              >
                下架
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
