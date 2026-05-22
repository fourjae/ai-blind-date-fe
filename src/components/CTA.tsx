import Link from "next/link";

export default function CTA() {
  return (
    <section id="create" className="px-6 pb-14">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 rounded-[32px] px-8 py-12 text-center text-white shadow-xl shadow-rose-200/60">
        <div className="text-3xl mb-3">💝</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
          내 분신을 만들어볼까요?
        </h2>
        <p className="text-white/85 text-sm md:text-base leading-relaxed mb-7">
          회원가입 없이 30초면 됩니다. AI가 먼저 만나보고 알려드릴게요.
        </p>
        <Link
          href="/agents/new"
          className="inline-block bg-white text-rose-500 text-sm font-bold px-9 py-3.5 rounded-full hover:scale-105 transition-transform"
        >
          내 분신 만들기 ♥
        </Link>
      </div>
    </section>
  );
}
