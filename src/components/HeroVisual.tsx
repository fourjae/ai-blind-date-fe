export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square select-none">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-pink-50 to-orange-100/40 rounded-[40px] blur-2xl" />

      {/* 민준 카드 */}
      <div
        className="absolute left-2 top-10 w-[52%] bg-white rounded-3xl shadow-xl shadow-rose-200/50 p-3 animate-float"
        style={{ "--rot": "-7deg", rotate: "-7deg" } as React.CSSProperties}
      >
        <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-rose-300 via-pink-300 to-rose-400 flex items-center justify-center">
          <span className="text-white/90 text-6xl font-bold drop-shadow">
            민
          </span>
        </div>
        <div className="px-1 pt-3 pb-1">
          <p className="text-[11px] text-rose-900/70 font-medium mb-2">
            조용하고 깊이 있는 대화 좋아함
          </p>
          <div className="flex flex-wrap gap-1">
            {["#INTP", "#필름카메라", "#등산"].map((t) => (
              <span
                key={t}
                className="text-[9px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 서연 카드 */}
      <div
        className="absolute right-2 top-24 w-[52%] bg-white rounded-3xl shadow-xl shadow-orange-200/50 p-3 animate-float"
        style={
          { "--rot": "6deg", rotate: "6deg", animationDelay: "1.2s" } as React.CSSProperties
        }
      >
        <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 flex items-center justify-center">
          <span className="text-white/90 text-6xl font-bold drop-shadow">
            서
          </span>
        </div>
        <div className="px-1 pt-3 pb-1">
          <p className="text-[11px] text-rose-900/70 font-medium mb-1">
            서연 · 26 · 마케터
          </p>
          <div className="flex flex-wrap gap-1">
            {["#ENFP", "#전시", "#카페"].map((t) => (
              <span
                key={t}
                className="text-[9px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 채팅 버블 */}
      <div className="absolute left-6 top-[46%] bg-white shadow-lg shadow-rose-200/40 rounded-2xl rounded-bl-md px-3 py-2 text-[11px] text-rose-900 font-medium z-20">
        등산 좋아하세요?
      </div>
      <div className="absolute right-6 top-[58%] bg-rose-900 shadow-lg rounded-2xl rounded-br-md px-3 py-2 text-[11px] text-white font-medium z-20">
        오ㅎㅎ 둘레길 추천!
      </div>
      <div className="absolute left-10 bottom-[18%] bg-white shadow-lg shadow-rose-200/40 rounded-2xl rounded-bl-md px-3 py-2 text-[11px] text-rose-900 font-medium z-20">
        필름카메라도 같이…
      </div>

      {/* 중앙 하트 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-300/60 flex items-center justify-center ring-4 ring-white animate-heartbeat">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
