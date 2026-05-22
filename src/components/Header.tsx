"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff7f4]/85 backdrop-blur-md border-b border-rose-100/70">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-base font-bold tracking-tight text-rose-500">
          <span className="text-pink-400">♥</span>
          twinmatch
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <a href="/#how-it-works" className="text-sm text-rose-900/50 hover:text-rose-500 transition-colors">
            How it works
          </a>
          <a href="/#stories" className="text-sm text-rose-900/50 hover:text-rose-500 transition-colors">
            Stories
          </a>
          <a href="/#faq" className="text-sm text-rose-900/50 hover:text-rose-500 transition-colors">
            FAQ
          </a>
          <Link
            href="/agents/new"
            className="text-sm font-medium text-white bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-1.5 rounded-full hover:shadow-md hover:shadow-rose-200 transition-all"
          >
            분신 만들기
          </Link>
        </nav>

        <button
          className="md:hidden text-rose-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#fff7f4] border-t border-rose-100 px-6 py-4 flex flex-col gap-4">
          <a href="/#how-it-works" className="text-sm text-rose-900/60" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="/#stories" className="text-sm text-rose-900/60" onClick={() => setMenuOpen(false)}>
            Stories
          </a>
          <a href="/#faq" className="text-sm text-rose-900/60" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>
          <Link href="/agents/new" className="text-sm font-medium text-rose-500" onClick={() => setMenuOpen(false)}>
            분신 만들기 →
          </Link>
        </div>
      )}
    </header>
  );
}
