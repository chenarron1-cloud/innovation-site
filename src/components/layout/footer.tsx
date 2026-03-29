import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-bd bg-bg2 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-[20px] font-[500]" style={{ color: "#2825A8" }}>
              創新先生
            </span>
            <p className="mt-3 text-sm text-t2 leading-relaxed">
              AI 創新思維實戰平台
              <br />
              教你用創新思維，讓 AI 幫你做出更有差異化成果
            </p>
          </div>

          {/* 內容 */}
          <div>
            <h4 className="text-sm font-medium text-t1 mb-4">內容</h4>
            <ul className="space-y-2">
              {[
                { href: "/articles", label: "文章" },
                { href: "/courses", label: "課程" },
                { href: "/tools", label: "工具庫" },
                { href: "/cases", label: "作品案例" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-t2 hover:text-ind transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 社群 */}
          <div>
            <h4 className="text-sm font-medium text-t1 mb-4">社群</h4>
            <ul className="space-y-2">
              {[
                { href: "/works", label: "AI 作品投票區" },
                { href: "/wishpool", label: "許願池" },
                { href: "/about", label: "關於創新先生" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-t2 hover:text-ind transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 訂閱 */}
          <div>
            <h4 className="text-sm font-medium text-t1 mb-4">方案</h4>
            <ul className="space-y-2">
              {[
                { href: "/pricing", label: "升級會員" },
                { href: "/account", label: "我的帳戶" },
                { href: "/auth/login", label: "登入" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-t2 hover:text-ind transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-bd flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-t3">© 2026 創新先生，保留所有權利</p>
          <p className="text-xs text-t3">創辦人：陳建銘</p>
        </div>
      </div>
    </footer>
  );
}
