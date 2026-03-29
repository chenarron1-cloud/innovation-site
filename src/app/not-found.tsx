import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-ind-bg mb-4">404</div>
        <h1 className="text-2xl font-[500] text-t1 mb-3">找不到這個頁面</h1>
        <p className="text-t2 mb-8">這個頁面不存在或已被移除</p>
        <Button asChild>
          <Link href="/">回到首頁</Link>
        </Button>
      </div>
    </div>
  );
}
