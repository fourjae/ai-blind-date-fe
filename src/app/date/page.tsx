"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getPersonas, type Persona } from "@/lib/personas";
import {
  fetchDateResult,
  MODEL_OPTIONS,
  type ChatLine,
  type ChemistryResult,
  type Venue,
} from "@/lib/conversation";

const gradients = ["from-rose-300 to-pink-400", "from-amber-300 to-orange-400"];

// 메시지 길이(공백 포함)에 따라 타이핑 로딩 시간을 다르게 준다.
function typingDelay(len: number): number {
  if (len < 40) return 1500;
  if (len < 80) return 3000;
  return 4500;
}

export default function DatePage() {
  const [pair, setPair] = useState<[Persona, Persona] | null>(null);
  const [script, setScript] = useState<ChatLine[]>([]);
  const [visible, setVisible] = useState<ChatLine[]>([]);
  const [typing, setTyping] = useState<0 | 1 | null>(null);
  const [result, setResult] = useState<ChemistryResult | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [notEnough, setNotEnough] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const chemistryRef = useRef<ChemistryResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const runDate = useCallback((a: Persona, b: Persona, model: string) => {
    setTyping(null);
    setResult(null);
    setVenue(null);
    setModelUsed(null);
    setLoadError("");
    chemistryRef.current = null;
    setGenerating(true);

    fetchDateResult(a, b, model || undefined)
      .then(({ venue, conversation, chemistry, modelUsed }) => {
        // 새 대화가 도착하면 그때 이전 대화를 교체한다
        setVisible([]);
        setScript([]);
        chemistryRef.current = chemistry ?? null;
        setVenue(venue);
        setModelUsed(modelUsed ?? null);
        setScript(conversation);
      })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setGenerating(false));
  }, []);

  useEffect(() => {
    const personas = getPersonas();
    if (personas.length < 2) {
      setNotEnough(true);
      return;
    }
    // agents/new 에서 넘겨준 모델(query param)로 시작.
    const model =
      new URLSearchParams(window.location.search).get("model") ?? "";
    setSelectedModel(model);
    const a = personas[0];
    const b = personas[1];
    setPair([a, b]);
    runDate(a, b, model);
  }, [runDate]);

  useEffect(() => {
    if (script.length === 0) return;
    let i = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function next() {
      if (cancelled || i >= script.length) {
        if (!cancelled && chemistryRef.current) {
          timers.push(
            setTimeout(() => setResult(chemistryRef.current), 700),
          );
        }
        return;
      }
      const line = script[i];
      setTyping(line.speaker);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setVisible((v) => [...v, line]);
          setTyping(null);
          i += 1;
          timers.push(setTimeout(next, 500));
        }, typingDelay(line.text.length)),
      );
    }

    next();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [script]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visible, typing, result]);

  if (notEnough) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-6 text-center">
          <div className="text-5xl mb-4">🥲</div>
          <h1 className="text-xl font-bold text-rose-950 mb-2">
            분신이 두 명 필요해요
          </h1>
          <p className="text-sm text-rose-900/55 mb-6">
            소개팅을 시작하려면 최소 두 개의 분신을 만들어 주세요.
          </p>
          <Link
            href="/agents/new"
            className="inline-block px-8 py-3 text-sm font-bold rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white"
          >
            분신 만들러 가기 ♥
          </Link>
        </div>
      </main>
    );
  }

  if (loadError && !pair) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-6 text-center">
          <div className="text-5xl mb-4">😢</div>
          <h1 className="text-xl font-bold text-rose-950 mb-2">오류가 발생했어요</h1>
          <p className="text-sm text-rose-900/55 mb-6">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-8 py-3 text-sm font-bold rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  if (!pair) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-40 text-center">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <p className="text-sm text-rose-900/55">불러오는 중…</p>
        </div>
      </main>
    );
  }

  const total = script.length;
  const turn = visible.length;
  const progress = total > 0 ? Math.round((turn / total) * 100) : 0;

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* 매칭된 페어 헤더 */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <PairAvatar persona={pair[0]} gradient={gradients[0]} />
            <div className="text-center">
              <div className="text-2xl animate-heartbeat">💕</div>
              <p className="text-[11px] text-rose-900/45 mt-0.5">AI 소개팅 중</p>
            </div>
            <PairAvatar persona={pair[1]} gradient={gradients[1]} />
          </div>

          {/* 모델 선택 (테스트용) */}
          <div className="mb-4 mx-auto max-w-md bg-white border border-rose-100 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-rose-900/60">
                🤖 테스트할 AI 모델
              </span>
              {modelUsed && (
                <span className="text-[10px] text-rose-400">
                  사용됨: {modelUsed}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MODEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={generating}
                  onClick={() => setSelectedModel(opt.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
                    selectedModel === opt.value
                      ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent"
                      : "bg-rose-50/50 text-rose-900/60 border-rose-100 hover:border-rose-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={generating}
              onClick={() => runDate(pair[0], pair[1], selectedModel)}
              className="mt-2.5 w-full py-2 text-xs font-bold rounded-full bg-rose-900 text-white disabled:opacity-50 hover:enabled:bg-rose-800 transition-colors"
            >
              {generating ? "생성 중… ✨" : "이 모델로 다시 생성 ↻"}
            </button>
          </div>

          {/* 소개팅 장소 */}
          {venue && (
            <div className="mb-6 mx-auto max-w-md bg-white border border-rose-100 rounded-2xl px-4 py-3 shadow-sm animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-rose-950 truncate">
                    {venue.name}
                    <span className="ml-2 text-[11px] font-medium text-rose-400">
                      {venue.type}
                    </span>
                  </p>
                  <p className="text-[11px] text-rose-900/50 truncate">
                    {venue.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 채팅창 */}
          <div className="bg-white border border-rose-100 rounded-3xl shadow-lg shadow-rose-100/60 overflow-hidden">
            <div className="border-b border-rose-50 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-pink-200" />
              </div>
              <p className="text-xs text-rose-900/45 ml-1">
                {pair[0].name} ♥ {pair[1].name}
              </p>
              {!result && (
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-rose-900/45">실시간</span>
                </div>
              )}
            </div>

            <div
              ref={scrollRef}
              className="px-5 py-5 space-y-3 h-[420px] overflow-y-auto bg-rose-50/30"
            >
              {generating ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-3 animate-pulse">💕</div>
                  <p className="text-sm text-rose-900/55">
                    AI 분신들이 만나고 있어요…
                  </p>
                  <p className="text-[11px] text-rose-900/40 mt-1">
                    {selectedModel
                      ? MODEL_OPTIONS.find((m) => m.value === selectedModel)
                          ?.label
                      : "자동(폴백)"}{" "}
                    모델로 생성 중
                  </p>
                </div>
              ) : loadError && visible.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="text-3xl mb-2">😢</div>
                  <p className="text-sm text-rose-900/60 mb-1">
                    이 모델로는 실패했어요
                  </p>
                  <p className="text-[11px] text-rose-900/40 break-all">
                    {loadError}
                  </p>
                  <p className="text-[11px] text-rose-400 mt-2">
                    다른 모델을 골라 다시 생성해 보세요
                  </p>
                </div>
              ) : (
                <>
                  {visible.map((line, i) => (
                    <Bubble key={i} line={line} pair={pair} />
                  ))}
                  {typing !== null && (
                    <TypingBubble speaker={typing} pair={pair} />
                  )}
                  {loadError && (
                    <div className="mt-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-center">
                      <p className="text-[11px] text-rose-400">
                        ⚠ 재생성 실패 — {loadError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 진행도 */}
            <div className="border-t border-rose-50 px-5 py-3 bg-white">
              <div className="flex items-center gap-3 text-xs text-rose-900/45">
                <span className="tabular-nums">{turn} / {total}턴</span>
                <div className="flex-1 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{result ? "완료 ✓" : `${total - turn}턴 남음`}</span>
              </div>
            </div>
          </div>

          {result && (
            <>
              <div className="mt-6">
                <ResultCard result={result} pair={pair} />
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/agents/new"
                  className="px-7 py-3 text-sm font-medium rounded-full bg-white border border-rose-100 text-rose-500 hover:border-rose-300 transition-colors"
                >
                  다른 분신으로 또 하기
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function PairAvatar({
  persona,
  gradient,
}: {
  persona: Persona;
  gradient: string;
}) {
  return (
    <div className="text-center">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md mx-auto`}
      >
        <span className="text-white text-2xl font-bold drop-shadow">
          {persona.name.slice(0, 1)}
        </span>
      </div>
      <p className="text-xs font-bold text-rose-950 mt-1.5">{persona.name}</p>
      <p className="text-[10px] text-rose-900/45">{persona.age}세</p>
    </div>
  );
}

function Bubble({
  line,
  pair,
}: {
  line: ChatLine;
  pair: [Persona, Persona];
}) {
  const isLeft = line.speaker === 0;
  const persona = pair[line.speaker];
  return (
    <div
      className={`flex items-end gap-2 animate-fade-in-up ${
        isLeft ? "" : "flex-row-reverse"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-gradient-to-br ${
          isLeft ? gradients[0] : gradients[1]
        }`}
      >
        {persona.name.slice(0, 1)}
      </div>
      <div
        className={`max-w-[72%] px-3.5 py-2.5 text-sm shadow-sm ${
          isLeft ? "chat-bubble-left text-rose-950" : "chat-bubble-right"
        }`}
      >
        {line.text}
      </div>
    </div>
  );
}

function TypingBubble({
  speaker,
  pair,
}: {
  speaker: 0 | 1;
  pair: [Persona, Persona];
}) {
  const isLeft = speaker === 0;
  const persona = pair[speaker];
  return (
    <div className={`flex items-end gap-2 ${isLeft ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-sm bg-gradient-to-br ${
          isLeft ? gradients[0] : gradients[1]
        }`}
      >
        {persona.name.slice(0, 1)}
      </div>
      <div
        className={`px-4 py-3 ${
          isLeft ? "chat-bubble-left" : "bg-rose-100 rounded-[20px] rounded-br-md"
        }`}
      >
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  pair,
}: {
  result: ChemistryResult;
  pair: [Persona, Persona];
}) {
  return (
    <div className="animate-fade-in-up bg-white rounded-3xl border-2 border-rose-200 shadow-lg p-6 mt-4">
      <div className="text-center mb-5">
        <p className="text-xs text-rose-400 font-semibold tracking-widest mb-1">
          CHEMISTRY RESULT
        </p>
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
          {result.score}
          <span className="text-2xl">점</span>
        </div>
        <p className="text-sm text-rose-900/70 mt-2 font-medium">
          {result.verdict}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-rose-500 mb-2">✓ 잘 맞는 점</p>
          <ul className="space-y-1.5">
            {result.goodPoints.map((g, i) => (
              <li
                key={i}
                className="text-xs text-rose-900/65 leading-relaxed flex gap-1.5"
              >
                <span className="text-rose-300">•</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-500 mb-2">! 우려되는 점</p>
          <ul className="space-y-1.5">
            {result.concerns.map((c, i) => (
              <li
                key={i}
                className="text-xs text-rose-900/65 leading-relaxed flex gap-1.5"
              >
                <span className="text-amber-300">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-[11px] text-rose-900/40 text-center mt-5">
        {pair[0].name}님과 {pair[1].name}님의 분신이 나눈 대화 분석 결과예요
      </p>
    </div>
  );
}
