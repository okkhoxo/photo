# 부재의 증명사진 / Portraits That Never Existed

AI Photobooth - An experimental art installation exploring the boundaries between reality and AI-generated imagery.

## 작품 개요

이 작품은 사용자가 AI 생성 이미지와 실제 사진을 구분할 수 없다는 것을 체험을 통해 깨닫게 하는 인터랙티브 설치 미술입니다.

### 체험 과정

1. **촬영**: 사용자가 "촬영 시작" 버튼을 클릭하면 3초 후 자동으로 1장의 사진이 촬영됩니다 (카운트다운 없음)
2. **AI 생성**: 촬영된 1장의 원본 이미지를 기반으로 Gemini AI가 미묘하게 다른 3장의 이미지를 생성합니다
3. **선택**: 사용자에게 3장의 AI 생성 이미지가 제시되며, 사용자는 그 중 하나를 선택합니다
4. **확인**: "이 사진이 당신처럼 보입니까?" 질문에 답합니다
5. **반전**: "이 순간은 존재하지 않았습니다" - 모든 사진이 AI로 생성되었음을 밝힙니다
6. **QR 코드**: QR 코드를 스캔하여 자신의 선택과 전체 통계를 확인할 수 있습니다

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Gemini 2.5 Flash Image API
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (optional)
- **QR Code**: react-qr-code

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 정보를 입력하세요:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Base URL for QR codes
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Gemini API 키 발급

1. [Google AI Studio](https://ai.google.dev/) 방문
2. API 키 생성
3. `.env.local`에 추가

### 4. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/) 에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 프로젝트 설정에서 웹 앱 추가 및 구성 정보 복사
4. `.env.local`에 추가

#### Firestore 컬렉션 구조

```
sessions/
  {sessionId}
    - selectedImageIndex: number
    - userConfirmed: boolean
    - timestamp: number
    - revealed: boolean

statistics/
  global
    - totalParticipants: number
    - selectedAI: number
    - confirmedAsReal: number
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 6. 프로덕션 빌드

```bash
npm run build
npm start
```

## 추가 설정

### 카메라 셔터 사운드

`public/shutter.mp3` 파일을 추가하면 촬영 시 셔터 소리가 재생됩니다. (선택사항)

### Firebase 보안 규칙

Firestore 보안 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow create: if true;
      allow read: if true;
    }

    match /statistics/{statId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 프로젝트 구조

```
photo/
├── app/
│   ├── api/
│   │   ├── generate-images/    # Gemini AI 이미지 생성
│   │   ├── save-session/       # Firebase에 세션 저장
│   │   └── get-statistics/     # 통계 조회
│   ├── capture/                # 촬영 페이지
│   ├── select/                 # 이미지 선택 페이지
│   ├── confirm/                # 확인 질문 페이지
│   ├── reveal/                 # 반전 페이지
│   ├── qr/                     # QR 코드 페이지
│   ├── result/[sessionId]/     # 결과 페이지
│   ├── layout.tsx
│   ├── page.tsx                # 메인 페이지
│   └── globals.css
├── components/
│   └── ui/                     # shadcn/ui 컴포넌트
├── lib/
│   ├── firebase.ts             # Firebase 설정
│   ├── types.ts                # TypeScript 타입 정의
│   └── utils.ts                # 유틸리티 함수
├── public/
│   └── shutter.mp3             # 촬영 사운드 (선택사항)
└── package.json
```

## 예술적 의도

이 작품은 다음과 같은 질문을 던집니다:

1. **정체성**: 당신이 "나 같다"고 느낀 것이 존재하지 않았다면?
2. **진실성**: AI와 실제를 구분할 수 없다면 사진의 의미는?
3. **신뢰**: 당신의 갤러리에 있는 사진들, 정말 다 "진짜"입니까?

작품은 판단하지 않고, 경고하지 않습니다. 단지 경험시킵니다. 당신이 속았다는 것을.

## 라이선스

이 프로젝트는 예술 작품으로 제작되었습니다.

## 크레딧

- **작품명**: 부재의 증명사진 (Portraits That Never Existed)
- **제작**: AI Photobooth Project, 2025
- **기술**: Gemini 2.5 Flash Image, Next.js, Firebase
