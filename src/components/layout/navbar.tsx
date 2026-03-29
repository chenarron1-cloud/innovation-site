"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, ChevronDown, LogOut, User, Settings, CreditCard } from "lucide-react";
import { getAvatarInitial } from "@/lib/utils";

const navLinks = [
  { href: "/articles", label: "文章" },
  { href: "/courses", label: "課程" },
  { href: "/tools", label: "工具庫" },
  { href: "/works", label: "AI 作品" },
  { href: "/wishpool", label: "許願池" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bd bg-bg/80 backdrop-blur-md">
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-ind" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-[20px] font-[500] tracking-tight"
              style={{ color: "#2825A8", fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              創新先生
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-ind",
                  pathname?.startsWith(link.href) ? "text-ind" : "text-t2"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-bg2 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {getAvatarInitial(session.user.name, session.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-t1 max-w-[100px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-t2" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-bd bg-white shadow-lg py-1">
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-t1 hover:bg-bg2"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          後台管理
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-t1 hover:bg-bg2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        我的帳戶
                      </Link>
                      <Link
                        href="/account/billing"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-t1 hover:bg-bg2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <CreditCard className="h-4 w-4" />
                        帳務資訊
                      </Link>
                      <hr className="my-1 border-bd" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red hover:bg-bg2"
                      >
                        <LogOut className="h-4 w-4" />
                        登出
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">登入</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/pricing">升級方案</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-t2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-bd bg-bg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-sm font-medium py-2 transition-colors",
                  pathname?.startsWith(link.href) ? "text-ind" : "text-t2"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-bd" />
            {session ? (
              <div className="space-y-2">
                <Link href="/account" className="block text-sm text-t1 py-2" onClick={() => setMobileOpen(false)}>
                  我的帳戶
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block text-sm text-red py-2"
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>登入</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link href="/pricing" onClick={() => setMobileOpen(false)}>升級</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
