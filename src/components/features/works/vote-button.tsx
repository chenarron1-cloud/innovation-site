"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  workId: string;
  initialVoted: boolean;
  initialCount: number;
}

export function WorkVoteButton({ workId, initialVoted, initialCount }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (!session) {
      toast.error("請先登入才能投票");
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/works/${workId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setVoted(data.voted);
        setCount(data.voteCount);
        toast.success(data.voted ? "投票成功！" : "已取消投票");
      }
    } catch {
      toast.error("投票失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl p-3 transition-all min-w-[64px]",
        voted ? "bg-ind text-white" : "bg-bg2 text-t2 hover:bg-ind-bg hover:text-ind"
      )}
    >
      <Heart className={cn("h-5 w-5", voted && "fill-current")} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
