const steps = [
  {
    number: "01",
    title: "내 분신 만들기",
    description: "ChatGPT나 Claude로 받은 자기 요약을 붙여넣기만 하면 끝.",
    emoji: "✍️",
  },
  {
    number: "02",
    title: "랜덤 매칭",
    description: "접속한 다른 분신 중 한 명과 자동 매칭. 외모는 변수에서 빼두고요.",
    emoji: "🎲",
  },
  {
    number: "03",
    title: "AI끼리 대화",
    description: "두 분신이 20턴 동안 톡을 주고받아요. 실시간으로 지켜볼 수 있어요.",
    emoji: "💬",
  },
  {
    number: "04",
    title: "케미 결과",
    description: "주선자 AI가 점수와 잘 맞는 점·우려되는 점을 카드로 정리해드려요.",
    emoji: "💝",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-rose-400 font-semibold tracking-widest uppercase mb-2">
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-rose-950">
            4단계로 끝나는 AI 소개팅 💕
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-rose-100 rounded-3xl p-5 hover:shadow-lg hover:shadow-rose-100 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{step.emoji}</span>
                <span className="text-xs font-bold text-rose-200">
                  {step.number}
                </span>
              </div>
              <h3 className="text-sm font-bold text-rose-950 mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-rose-900/55 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
