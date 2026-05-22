import type { Persona } from "@/lib/personas";
import type { ChatLine, ChemistryResult, Venue } from "@/lib/conversation";

interface DateResult {
  venue: Venue;
  conversation: ChatLine[];
  chemistry: ChemistryResult;
}

function genderKo(gender: Persona["gender"]) {
  return gender === "female" ? "여성" : gender === "male" ? "남성" : "기타";
}

function buildPrompt(a: Persona, b: Persona): string {
  return `너는 소개팅 시뮬레이터야. 아래 두 사람이 소개팅으로 **식당에서 직접 만나 마주 앉아** 나누는 대화를 만들어줘.

[${a.name}] ${a.age}세 ${genderKo(a.gender)}
${a.personaText}

[${b.name}] ${b.age}세 ${genderKo(b.gender)}
${b.personaText}

먼저 두 사람 페르소나에 어울리는 소개팅 장소를 직접 골라:
- 조용하고 내향적인 조합 → 차분한 양식 레스토랑이나 일식집, 오마카세
- 텐션 높고 활동적인 조합 → 분위기 좋은 비스트로, 와인바, 왁자한 이자카야
- 미식/취향이 뚜렷하면 그에 맞는 컨셉 가게
- 애매하면 무난하게 적당한 양식 레스토랑이나 일식집으로.
가게는 그럴듯한 가상의 상호명을 붙여줘(예: "트라토리아 보나", "스시 모리").

목표: 실제 소개팅 현장 같은, 그 사람의 인생이 묻어나는 대화. 모범답안 같은 FM 대화도, 의미 없이 가벼운 잡담도 금지.

먼저 머릿속으로 두 사람의 궁합을 판단해라(잘 맞음 / 보통 / 잘 안 맞음). 그리고 그 판단이 **점수만이 아니라 대화 흐름 자체에서 느껴지게** 만들어라:
- 잘 맞으면: 초반 탐색 후 점점 달아오른다. 같은 취미·가치관에 "어 저도요!" 하고 맞장구, 서로 말투·개그 코드를 받아치며 티키타카, 농담이 먹히고 웃음이 늘고, 뒤로 갈수록 호칭이 편해지고 다음 약속 얘기까지 자연스럽게.
- 보통이면: 무난하게 흘러간다. 예의 바르고 나쁘진 않은데 확 타오르진 않음. 적당한 질문과 대답, 살짝의 정적, "괜찮은 사람이네" 정도의 온도.
- 잘 안 맞으면: 미묘하게 식는 게 보이게. 농담이 안 먹혀서 어색해지거나, 대화가 자꾸 끊기고, 한쪽만 신나거나, 가치관이 부딪혀서 살짝 불편한 정적이 생기거나, 영혼 없는 리액션("아 네...", "그렇구나")이 늘어남. 대놓고 싸우진 말고 "음... 이건 좀 아닌가" 싶은 결로.
- 점수(chemistry.score)는 이 대화의 실제 온도와 반드시 일치해야 한다. 대화는 화기애애한데 점수만 낮거나 그 반대면 안 됨.

대화 규칙:
- 가장 중요: 두 사람의 **직업, 나이대, 살아온 배경**에서 실제로 나올 법한 구체적인 화제를 깊이 있게 다뤄라. "취미 뭐예요?" 수준이 아니라, 그 직업이면 겪는 현실(야근·이직·번아웃·프로젝트, 업계 얘기), 그 나이대의 고민(커리어, 결혼·연애관, 돈, 부모님, 친구들 근황), 살아오며 쌓인 경험과 가치관이 드러나게.
- 페르소나에 적힌 내용을 전부 욱여넣지 마라. 20여 마디 안에 다 못 쓴다. 자연스럽게 한두 가닥의 주제를 잡아 파고들면서 "둘이 맞는 구석이 있나"를 탐색해 나가는 과정이면 충분하다. 안 쓰고 넘어가는 설정이 있어도 됨.
- 관심사도 나이·직업·성향에 맞게 현실적으로. 28살 개발자라면 막연한 "독서"가 아니라 구체적인 작품·기술·취미 디테일이 나와야 진짜 같다.
- 직접 만나서 입으로 말하는 구어체("아 진짜요?", "음... 글쎄요", "그쵸 ㅎㅎ"). 가게 상황(자리, 메뉴, 주문, 음식)은 양념으로만 가볍게.
- 페르소나 성격을 과감하게 살려. 내향적이면 말 짧고 머뭇, 텐션 높으면 적극적으로. MBTI·말버릇을 대사에 녹여.
- 같은 사람이 연달아 말할 수도 있어(speaker 연속 OK). 강제로 번갈지 마.
- 광고 카피처럼 매끈한 문장 말고, 생각하며 말하는 진짜 사람의 말투로.

총 18~24개의 발화. 첫 발화는 ${a.name}(speaker 0)가 시작.

반드시 아래 JSON 형식만 출력해. 다른 텍스트 금지.
{
  "venue": {
    "name": "가게 상호명",
    "type": "양식 레스토랑 / 일식집 / 이자카야 등",
    "reason": "이 두 사람에게 이 가게를 고른 이유 한 줄"
  },
  "conversation": [
    {"speaker": 0, "text": "..."},
    {"speaker": 1, "text": "..."}
  ],
  "chemistry": {
    "score": 정수,
    "verdict": "한 줄 총평 (이모지 포함)",
    "goodPoints": ["...", "...", "..."],
    "concerns": ["...", "..."]
  }
}
score는 두 사람의 실제 궁합을 솔직하게 반영한 30~99 사이 정수(잘 안 맞으면 낮게). verdict는 점수에 맞는 솔직한 톤. goodPoints 2~3개, concerns 1~2개, 대화에서 실제로 드러난 근거로.`;
}

function isValidResult(r: unknown): r is DateResult {
  if (!r || typeof r !== "object") return false;
  const obj = r as Record<string, unknown>;
  const conv = obj.conversation;
  const chem = obj.chemistry as Record<string, unknown> | undefined;
  return (
    Array.isArray(conv) &&
    conv.length > 0 &&
    conv.every(
      (l) =>
        l &&
        typeof l === "object" &&
        (l as ChatLine).speaker !== undefined &&
        typeof (l as ChatLine).text === "string",
    ) &&
    !!chem &&
    typeof chem.score === "number" &&
    Array.isArray(chem.goodPoints) &&
    Array.isArray(chem.concerns)
  );
}

// 무료 티어에서 쓸 수 있는 모델을 품질 순으로 시도한다.
// pro 가 할당량 초과(429)면 자동으로 flash 로 폴백.
const MODELS: { model: string; thinkingBudget?: number }[] = [
  { model: "gemini-2.5-pro" },
  { model: "gemini-2.5-flash", thinkingBudget: 0 },
];

interface GeminiAttempt {
  ok: boolean;
  result?: DateResult;
  status?: number;
  error?: string;
}

async function callModel(
  apiKey: string,
  model: string,
  thinkingBudget: number | undefined,
  prompt: string,
): Promise<GeminiAttempt> {
  const generationConfig: Record<string, unknown> = {
    responseMimeType: "application/json",
    temperature: 1.1,
  };
  if (thinkingBudget !== undefined) {
    generationConfig.thinkingConfig = { thinkingBudget };
  }

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      },
    );
  } catch {
    return { ok: false, error: "연결 실패" };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, error: await res.text() };
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const reason =
      data?.candidates?.[0]?.finishReason ?? data?.promptFeedback?.blockReason;
    return { ok: false, error: reason ?? "빈 응답" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "JSON 파싱 실패" };
  }
  if (!isValidResult(parsed)) {
    return { ok: false, error: "형식 불일치" };
  }

  // speaker 를 항상 0/1 숫자로 정규화 (Gemini 가 문자열로 줄 때 대비).
  parsed.conversation = parsed.conversation.map((line) => ({
    ...line,
    speaker: Number(line.speaker) === 1 ? 1 : 0,
  }));

  return { ok: true, result: parsed };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY가 설정되지 않았어요" },
      { status: 500 },
    );
  }

  let personaA: Persona;
  let personaB: Persona;
  let model: string | undefined;
  try {
    ({ personaA, personaB, model } = (await request.json()) as {
      personaA: Persona;
      personaB: Persona;
      model?: string;
    });
  } catch {
    return Response.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }
  if (!personaA?.personaText || !personaB?.personaText) {
    return Response.json(
      { error: "두 페르소나 정보가 모두 필요해요" },
      { status: 400 },
    );
  }

  const prompt = buildPrompt(personaA, personaB);

  // 특정 모델이 지정되면 그 모델만(폴백 없이) 시도해 정직하게 결과/오류를 보여준다.
  // 미지정이면 품질 순 폴백 체인.
  const tryList = model
    ? [{ model, thinkingBudget: model.includes("flash") ? 0 : undefined }]
    : MODELS;

  let lastError = "대화를 생성하지 못했어요";
  for (const { model: m, thinkingBudget } of tryList) {
    const attempt = await callModel(apiKey, m, thinkingBudget, prompt);
    if (attempt.ok && attempt.result) {
      return Response.json({ ...attempt.result, modelUsed: m });
    }
    lastError = attempt.error ?? lastError;
    // 폴백 체인일 때만 429·404·503 에서 다음 모델로 넘어간다.
    if (model || ![429, 404, 503].includes(attempt.status ?? 0)) break;
  }

  return Response.json({ error: `Gemini 오류: ${lastError}` }, { status: 502 });
}
