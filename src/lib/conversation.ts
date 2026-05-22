import type { Persona } from "./personas";

export interface ChatLine {
  speaker: 0 | 1;
  text: string;
}

export interface ChemistryResult {
  score: number;
  goodPoints: string[];
  concerns: string[];
  verdict: string;
}

export interface Venue {
  name: string;
  type: string;
  reason: string;
}

// "자동"은 서버 폴백 체인(품질 순). 나머지는 해당 모델로만 호출(테스트용).
export const MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "자동(폴백)" },
  { value: "gemini-3.5-flash", label: "3.5 Flash" },
  { value: "gemini-3.1-flash-lite", label: "3.1 Flash-Lite" },
  { value: "gemini-3.1-flash-lite-preview", label: "3.1 Flash-Lite Preview" },
  { value: "gemini-2.5-flash", label: "2.5 Flash" },
  { value: "gemini-2.5-flash-lite", label: "2.5 Flash-Lite" },
  { value: "gemini-2.5-pro", label: "2.5 Pro" },
];

export interface DateResult {
  venue: Venue;
  conversation: ChatLine[];
  chemistry: ChemistryResult;
  modelUsed?: string;
}

// model 을 지정하면 그 모델로만 호출(테스트용), 미지정이면 서버 폴백 체인.
export async function fetchDateResult(
  a: Persona,
  b: Persona,
  model?: string
): Promise<DateResult> {
  const res = await fetch("/api/date", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personaA: a, personaB: b, model }),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "알 수 없는 오류" }));
    throw new Error(error ?? "소개팅 데이터를 불러오지 못했어요");
  }
  return res.json();
}
