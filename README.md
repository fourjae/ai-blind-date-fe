# 💕 AI 소개팅 — TwinMatch

> **만나기 전에, 나의 분신이 먼저 대화해봐요.**  
> AI가 두 사람의 성격을 분석해 케미를 먼저 확인하고, 진짜 소개팅을 제안합니다.

---

## 어떻게 작동하나요?

| 단계 | 설명 |
|:---:|---|
| ✍️ **01 · 분신 만들기** | 나를 설명하는 텍스트(ChatGPT·Claude 자기소개 요약도 OK)를 붙여넣으면 AI 페르소나가 생성됩니다. |
| 🎲 **02 · 랜덤 매칭** | 접속한 다른 분신 중 한 명과 자동 매칭됩니다. 외모는 변수에서 제외합니다. |
| 💬 **03 · AI끼리 대화** | 두 분신이 20턴 동안 대화를 나눠요. 실시간으로 지켜볼 수 있어요. |
| 💝 **04 · 케미 결과** | 주선자 AI가 케미 점수·티키타카 지수·잘 맞는 점·우려 사항을 카드로 정리합니다. |

- 회원가입 없이 시작
- 내 정보는 브라우저 로컬 스토리지에만 저장 (서버 전송 없음)
- 30초면 결과 확인

---

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| AI | Gemini 2.5 Pro / Flash (폴백 체인) |

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정 (선택)

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 기본값 |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | 백엔드 API 베이스 URL | 없으면 Mock 모드로 동작 |

> `NEXT_PUBLIC_API_BASE`를 설정하지 않으면 **Mock 모드**로 실행됩니다.  
> 실제 AI 대화 없이 UI와 흐름을 전부 테스트할 수 있어요.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

---

## 주요 화면

```
/                   # 랜딩 페이지 (Hero · How it works · CTA)
/agents/new         # 내 분신(페르소나) 만들기
/date               # AI 소개팅 실행 & 케미 결과 확인
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 랜딩 페이지
│   └── api/date/         # 소개팅 대화 생성 API Route
├── components/
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── PersonaCard.tsx
│   └── ...
└── lib/
    ├── personas.ts       # 페르소나 CRUD + 로컬 스토리지
    └── conversation.ts   # Gemini API 호출 & 결과 파싱
```

---

## 빌드 & 배포

```bash
npm run build
npm run start
```

Vercel에 바로 배포하려면 저장소를 연결하고 `NEXT_PUBLIC_API_BASE` 환경 변수만 추가하면 됩니다.

---

## 라이선스

MIT
