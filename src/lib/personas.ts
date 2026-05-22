export type Gender = "female" | "male" | "other";

export interface Persona {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  personaText: string;
  summary: string;
  tags: string[];
  createdAt: number;
}

export interface CreatePersonaInput {
  name: string;
  age: number;
  gender: Gender;
  personaText: string;
}

const STORAGE_KEY = "twinmatch.personas";

// 나중에 실제 백엔드 엔드포인트로 교체할 지점.
// 환경변수 NEXT_PUBLIC_API_BASE 가 있으면 실제 API를, 없으면 mock 을 사용한다.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function deriveTags(text: string): string[] {
  const mbti = text.match(
    /\b(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/i,
  );
  const tags: string[] = [];
  if (mbti) tags.push("#" + mbti[0].toUpperCase());

  const keywords = [
    "등산",
    "카메라",
    "필름",
    "전시",
    "카페",
    "여행",
    "독서",
    "게임",
    "음악",
    "영화",
    "운동",
    "요리",
    "사진",
  ];
  for (const k of keywords) {
    if (text.includes(k) && tags.length < 4) tags.push("#" + k);
  }
  if (tags.length === 0) tags.push("#대화");
  return tags;
}

function makeSummary(text: string): string {
  const firstSentence = text
    .replace(/\s+/g, " ")
    .split(/[.!?\n]/)[0]
    .trim();
  return firstSentence.length > 0
    ? firstSentence.slice(0, 40)
    : "나를 닮은 AI 분신";
}

export async function createPersona(
  input: CreatePersonaInput,
): Promise<Persona> {
  // 실제 API 모드
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("페르소나 생성에 실패했어요");
    const persona = (await res.json()) as Persona;
    savePersona(persona);
    return persona;
  }

  // Mock 모드: 살짝 지연을 줘서 생성하는 느낌을 준다.
  await new Promise((r) => setTimeout(r, 900));
  const persona: Persona = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
    name: input.name,
    age: input.age,
    gender: input.gender,
    personaText: input.personaText,
    summary: makeSummary(input.personaText),
    tags: deriveTags(input.personaText),
    createdAt: Date.now(),
  };
  savePersona(persona);
  return persona;
}

export function getPersonas(): Persona[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persona[]) : [];
  } catch {
    return [];
  }
}

function savePersona(persona: Persona) {
  if (typeof window === "undefined") return;
  const list = getPersonas();
  list.push(persona);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function deletePersona(id: string) {
  if (typeof window === "undefined") return;
  const list = getPersonas().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
