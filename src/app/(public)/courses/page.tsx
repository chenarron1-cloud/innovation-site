import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 創新課程",
  description: "系統化的 AI 創新思維課程，從基礎到進階，幫你做出不普通的成果。",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-[36px] font-[500] text-t1 mb-3">AI 創新課程</h1>
      <p className="text-t2 text-[17px] mb-10">系統化課程，建立你的 AI 創新思維框架</p>

      <div className="text-center py-20 text-t3">
        <div className="text-4xl mb-4">🎓</div>
        <p>課程即將上線，敬請期待！</p>
      </div>
    </div>
  );
}
