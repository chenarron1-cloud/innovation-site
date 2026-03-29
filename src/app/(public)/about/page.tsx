import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於創新先生",
  description: "創新先生 Mr. Innovation — AI 創新思維實戰平台，創辦人陳建銘。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-[36px] font-[500] text-t1 mb-8">關於創新先生</h1>

      <div className="prose">
        <p>
          創新先生是一個以 AI 創新思維為核心的實戰學習平台，由陳建銘創辦。
        </p>

        <h2>我們的定位</h2>
        <p>
          這不是教你怎麼問 AI 的網站，而是教你怎麼用<strong>創新思維</strong>，讓 AI 幫你做出更有差異化成果的網站。
        </p>
        <p>
          我們相信 AI 只是工具，真正讓成果不普通的，是背後的思維框架。
        </p>

        <h2>目標受眾</h2>
        <ul>
          <li>上班族 / 職場工作者</li>
          <li>創業者 / 自由工作者</li>
          <li>行銷 / 產品人員</li>
          <li>教育者 / 課程設計師</li>
          <li>企劃與銷售人員</li>
        </ul>

        <h2>聯絡我們</h2>
        <p>
          有任何問題或合作邀約，歡迎透過電子郵件聯繫。
        </p>
      </div>
    </div>
  );
}
