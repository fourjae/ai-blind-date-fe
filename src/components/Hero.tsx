import Link from "next/link";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-rose-100/50 to-transparent blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs text-rose-500 mb-5 bg-white/70 border border-rose-100 rounded-full px-4 py-1.5 shadow-sm">
            <span>✦</span>
            AI가 먼저 만나보는 소개팅
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-rose-950 leading-[1.15] mb-5">
            만나기 전에,
            <br />
            나의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">분신</span>이
            <br />
            먼저 대화해봐요
          </h1>

          <p className="text-sm md:text-base text-rose-900/60 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            내 말투와 성격을 그대로 복제한 AI가 상대방 AI와 먼저 20턴을
            나눠보고, 진짜 케미가 맞을 때 사람을 연결해드려요. 💕
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-7">
            <Link
              href="/agents/new"
              className="w-full sm:w-auto bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-rose-200 transition-all"
            >
              내 분신 만들기 ♥
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto bg-white text-rose-500 text-sm font-medium px-8 py-3.5 rounded-full border border-rose-100 hover:border-rose-300 transition-colors"
            >
              어떻게 작동해요?
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
            {["회원가입 없이 시작", "내 정보는 저장 안 됨", "30초면 결과 확인"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-rose-900/50">
                <span className="text-pink-400">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="order-first md:order-last">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
