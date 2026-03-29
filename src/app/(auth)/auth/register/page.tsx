"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("email", { email, callbackUrl: "/", redirect: false });
    setLoading(false);
    if (res?.ok) setEmailSent(true);
    else toast.error("發送失敗，請確認 Email 是否正確");
  }

  async function handleGoogleLogin() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  if (emailSent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-[500] text-t1 mb-3">確認信已發送</h1>
          <p className="text-t2 text-[15px] leading-relaxed">
            請前往 <strong>{email}</strong> 收信，點擊連結完成註冊！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[24px] font-[500]" style={{ color: "#2825A8" }}>創新先生</span>
          <h1 className="text-xl font-[500] text-t1 mt-2">免費加入</h1>
          <p className="text-sm text-t2 mt-1">
            已有帳號？<Link href="/auth/login" className="text-ind hover:underline ml-1">登入</Link>
          </p>
        </div>

        <div className="rounded-xl bg-ind-bg border border-ind-bd p-4 mb-6 text-sm text-t1">
          🎉 免費會員可以閱讀所有免費文章、使用基本工具、並為作品投票
        </div>

        <Button variant="outline" className="w-full mb-4 gap-2" onClick={handleGoogleLogin} disabled={loading}>
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          使用 Google 快速加入
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-bd" />
          </div>
          <div className="relative flex justify-center text-xs text-t3 bg-bg px-2">或使用 Email</div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            免費加入
          </Button>
        </form>

        <p className="text-xs text-t3 text-center mt-6">加入即代表同意服務條款與隱私政策</p>
      </div>
    </div>
  );
}
