# AI 소개팅 — TwinMatch

AI 페르소나끼리 대화를 나누고 케미를 분석하는 소개팅 시뮬레이션 앱입니다.

## 동작 방식

1. 자기소개 텍스트를 입력해 AI 페르소나를 생성합니다.
2. 다른 사용자의 페르소나와 랜덤으로 매칭됩니다.
3. 두 페르소나가 20턴 동안 대화를 주고받습니다.
4. 케미 점수, 티키타카 지수, 잘 맞는 점, 우려 사항을 카드로 확인합니다.

회원가입 없이 사용할 수 있으며, 입력한 정보는 브라우저 로컬 스토리지에만 저장됩니다.

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| AI | Gemini 2.5 Pro / Flash |

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열어보세요.

### 환경 변수

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_API_BASE` | 백엔드 API 베이스 URL |

설정하지 않으면 Mock 모드로 실행됩니다. 실제 AI 호출 없이 UI와 흐름을 확인할 수 있습니다.

## 주요 페이지

```
/               랜딩 페이지
/agents/new     페르소나 생성
/date           소개팅 실행 및 결과 확인
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx
│   └── api/date/
├── components/
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── PersonaCard.tsx
│   └── ...
└── lib/
    ├── personas.ts
    └── conversation.ts
```

## 빌드

```bash
npm run build
npm run start
```

## 라이선스

MIT
