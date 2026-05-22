export default function Footer() {
  return (
    <footer className="border-t border-rose-100 py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-rose-900/40">
          © 2026 twinmatch · Multi-Agent Dating Platform
        </p>
        <div className="flex items-center gap-5">
          <a href="#" className="text-xs text-rose-900/40 hover:text-rose-500 transition-colors">
            개인정보처리방침
          </a>
          <a href="#" className="text-xs text-rose-900/40 hover:text-rose-500 transition-colors">
            이용약관
          </a>
          <a href="#" className="text-xs text-rose-900/40 hover:text-rose-500 transition-colors">
            문의
          </a>
        </div>
      </div>
    </footer>
  );
}
