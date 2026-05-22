"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PersonaCard from "@/components/PersonaCard";
import {
  createPersona,
  deletePersona,
  getPersonas,
  type Gender,
  type Persona,
} from "@/lib/personas";
import { MODEL_OPTIONS } from "@/lib/conversation";

const PROMPT_TEMPLATE = `너는 지금부터 나의 모든 대화 기록과 언어 습관을 분석해서 무의식적인 언어 습관과 사고 패턴까지 찾아내는 '수석 페르소나 추출 전문가'야.
우리가 그동안 나누었던 대화들, 내가 주로 묻는 질문들, 그리고 나의 말투를 심층 분석하여, '나와 똑같이 생각하고 말하는 소개팅용 AI 아바타'를 만들기 위한 프로필 스크립트를 작성해 줘.
단순한 요약이 아니라, 내가 인지하지 못하는 미세한 특징까지 잡아내야 해.

[전제 조건]
- 만약 분석할 만한 대화 기록이 충분하지 않다면, 페르소나를 지어내지 말고, "분석할 대화가 부족합니다. 5분 정도 자유롭게 대화한 뒤 다시 시도해 주세요" 라고만 답해.

[출력 지침]
- 결과는 반드시 아래의 양식에 맞춰서 마크다운 헤더(###)를 유지한 채 상세한 줄글로 작성
- 출력 총 길이는 공백 포함 1000-1500자 사이로 작성

[출력 형식 - 반드시 준수]
### 1. 나의 기본 성향과 관심사, 직업
- (나의 핵심 성격, 유추되는 MBTI, 직업, 평소 가장 관심 있어 하는 주제나 취미를 분석해서 적어줘.)
### 2. 인간관계 및 대화 호불호
- (내가 긍정적으로 반응하는 대화 주제와, 극도로 싫어하거나 피하고 싶은 상황/사람의 유형을 분석해 줘. 소개팅 시뮬레이션에서 '상대방과 잘 맞는지' 판단할 핵심 기준이 될 거야.)
### 3. 나의 리얼한 대화 스타일
- (나의 평균적인 문장 길이, 자주 쓰는 단어나 이모티콘(예: ㅋㅋㅋ, ㅎㅎ, 아 진짜요?, ㅠㅠ 등), 존댓말/반말 여부, 전반적인 말투의 온도를 구체적으로 묘사해 줘. 마지막에 "사용자가 실제로 쓸 법한 짧은 발화 예시 2-3개"를 따옴표로 묶어 그대로 적어줘. 예: "그거 ㄹㅇ 공감되네 ㅋㅋ", "아 그건 좀 별로일 듯")
### 4. 1인칭 핵심 행동 지침 (Core Prompt)
- (다른 AI가 이 내용을 바탕으로 나를 완벽하게 연기할 수 있도록, 나만의 '1인칭 핵심 행동 지침'을 1인칭 시점으로 작성해 줘. 예시: "나는 호기심이 많고 질문하는 것을 좋아해. 대답은 보통 한두 줄로 짧게 하고, 말끝에 'ㅋㅋㅋ'를 자주 붙여. 감정적인 공감보다는 해결책을 찾는 대화를 선호해.")`;

const SAMPLE = `28살 개발자. INTP고 조용하고 깊이 있는 대화를 좋아함. 주말엔 등산 가거나 필름카메라 들고 동네 산책함. 새로운 기술 파보는 거 좋아하고 혼자만의 시간도 중요하게 생각해. 말투는 차분한 편이고 "음 그건 좀..." 처럼 신중하게 말함. 깊은 주제로 오래 얘기하는 거 좋아함.`;

export default function NewAgentPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [personaText, setPersonaText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    setPersonas(getPersonas());
  }, []);

  const missing: string[] = [];
  if (!name.trim()) missing.push("이름");
  if (!age || Number(age) <= 0) missing.push("나이");
  if (personaText.trim().length < 50) missing.push("페르소나 텍스트 (50자 이상)");
  const canSubmit = missing.length === 0 && !loading;

  async function handleCreate() {
    if (!canSubmit) return;
    if (personas.length >= 2) {
      alert("소개팅은 최대 2명만 가능합니다");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createPersona({
        name: name.trim(),
        age: Number(age),
        gender,
        personaText: personaText.trim(),
      });
      setPersonas(getPersonas());
      setName("");
      setAge("");
      setGender("female");
      setPersonaText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    deletePersona(id);
    setPersonas(getPersonas());
  }

  function copyPrompt() {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const canStartDate = personas.length >= 2;

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 스텝 헤더 */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold text-rose-400 tracking-widest mb-2">
              STEP 01
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-rose-950">
              분신을 만들 차례예요 💕
            </h1>
            <p className="text-sm text-rose-900/55 mt-2">
              나를 닮은 AI를 만들고, 두 명 이상 모이면 소개팅을 시작할 수 있어요.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* 폼 */}
            <div className="lg:col-span-3 bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-rose-950 mb-5">
                기본 정보
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-rose-900/60 mb-1.5">
                    이름 또는 닉네임
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="민준"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-rose-100 bg-rose-50/40 focus:outline-none focus:border-rose-300 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-900/60 mb-1.5">
                    나이
                  </label>
                  <input
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="28"
                    inputMode="numeric"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-rose-100 bg-rose-50/40 focus:outline-none focus:border-rose-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-rose-900/60 mb-1.5">
                  성별
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      ["female", "여성"],
                      ["male", "남성"],
                      ["other", "기타"],
                    ] as [Gender, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setGender(value)}
                      className={`flex-1 py-2.5 text-sm rounded-xl border transition-colors ${
                        gender === value
                          ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent"
                          : "bg-rose-50/40 text-rose-900/60 border-rose-100 hover:border-rose-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-rose-900/60">
                    페르소나 텍스트
                  </label>
                  <button
                    type="button"
                    onClick={() => setPersonaText(SAMPLE)}
                    className="text-xs text-rose-400 hover:text-rose-600 font-medium"
                  >
                    샘플로 채우기
                  </button>
                </div>
                <textarea
                  value={personaText}
                  onChange={(e) => setPersonaText(e.target.value)}
                  rows={6}
                  placeholder="성격, 취미, 가치관, 좋아하는 대화 주제, 말투, MBTI, 주말에 하는 일 등을 자유롭게 적어주세요."
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-rose-100 bg-rose-50/40 focus:outline-none focus:border-rose-300 focus:bg-white transition-colors resize-none leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      personaText.trim().length >= 50
                        ? "text-rose-400"
                        : "text-rose-900/35"
                    }`}
                  >
                    {personaText.trim().length} / 최소 50자
                  </span>
                </div>
              </div>

              {missing.length > 0 && (name || age || personaText) && (
                <p className="text-xs text-rose-400 mb-3">
                  필요한 항목: {missing.join(", ")}
                </p>
              )}

              {error && (
                <p className="text-xs text-red-500 mb-3">{error}</p>
              )}

              <button
                onClick={handleCreate}
                disabled={!canSubmit}
                className="w-full py-3.5 text-sm font-bold rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:shadow-lg hover:enabled:shadow-rose-200 transition-all"
              >
                {loading ? "분신 생성 중… ✨" : "분신 생성하기 ♥"}
              </button>
            </div>

            {/* 가이드 */}
            <div className="lg:col-span-2 bg-rose-50/50 border border-rose-100 rounded-3xl p-6">
              <h2 className="text-base font-bold text-rose-950 mb-2">
                페르소나 텍스트 만드는 법
              </h2>
              <p className="text-xs text-rose-900/55 leading-relaxed mb-4">
                평소 쓰던 ChatGPT, Claude, Gemini에 아래 프롬프트를 붙여넣으세요.
                무의식적인 언어 습관·사고 패턴까지 추출해서 4가지 섹션으로
                정리된 결과를 받은 뒤, 그대로 아래 텍스트 박스에 붙여넣기만 하면 돼요.
              </p>

              <div>
                <div className="flex justify-end mb-1">
                  <button
                    onClick={copyPrompt}
                    className="text-[11px] font-medium bg-rose-100 text-rose-500 px-2.5 py-1 rounded-full hover:bg-rose-200 transition-colors"
                  >
                    {copied ? "복사됨 ✓" : "복사"}
                  </button>
                </div>
                <pre className="text-[11px] text-rose-900/70 bg-white rounded-2xl p-4 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto border border-rose-100">
                  {PROMPT_TEMPLATE}
                </pre>
              </div>

              <p className="text-[11px] text-rose-900/45 leading-relaxed mt-4">
                <span className="font-semibold text-rose-500">안심하세요.</span>{" "}
                입력한 텍스트는 매칭이 끝나면 자동으로 삭제되고, 별도로 저장하지
                않습니다.
              </p>
            </div>
          </div>

          {/* 생성된 페르소나 목록 */}
          {personas.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-rose-950">
                  내 분신 {personas.length}명
                </h2>
                <span className="text-xs text-rose-900/45">
                  {canStartDate
                    ? "준비 완료! 소개팅을 시작할 수 있어요"
                    : `소개팅 시작까지 ${2 - personas.length}명 더 필요해요`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {personas.map((p, i) => (
                  <PersonaCard
                    key={p.id}
                    persona={p}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() =>
                    router.push(
                      selectedModel
                        ? `/date?model=${encodeURIComponent(selectedModel)}`
                        : "/date",
                    )
                  }
                  disabled={!canStartDate}
                  className="inline-block px-10 py-4 text-sm font-bold rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-lg enabled:hover:shadow-rose-200 enabled:hover:scale-105 transition-all"
                >
                  소개팅 시작하기 💕
                </button>

                {/* 테스트할 AI 모델 선택 */}
                <div className="mt-6 mx-auto max-w-md bg-white border border-rose-100 rounded-2xl px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-bold text-rose-900/60 mb-2 text-left">
                    🤖 테스트할 AI 모델
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MODEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedModel(opt.value)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                          selectedModel === opt.value
                            ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent"
                            : "bg-rose-50/50 text-rose-900/60 border-rose-100 hover:border-rose-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
