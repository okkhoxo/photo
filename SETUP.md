# 설정 가이드

## 1. Gemini API 키 발급

1. [Google AI Studio](https://ai.google.dev/)에 접속합니다
2. 우측 상단의 "API 키 가져오기" 클릭
3. 새 API 키를 생성하거나 기존 키를 사용합니다
4. API 키를 복사합니다

## 2. Firebase 프로젝트 설정

### 2.1 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "absence-photobooth")
4. Google 애널리틱스는 선택사항
5. 프로젝트 생성 완료

### 2.2 Firestore Database 설정

1. 왼쪽 메뉴에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (나중에 보안 규칙 설정 가능)
4. 위치 선택 (asia-northeast3 - 서울 권장)

### 2.3 Firestore 초기 데이터 설정

Firestore 콘솔에서 수동으로 다음 문서를 생성합니다:

**컬렉션 ID**: `statistics`
**문서 ID**: `global`
**필드**:
- `totalParticipants` (number): 0
- `selectedAI` (number): 0
- `confirmedAsReal` (number): 0

### 2.4 웹 앱 추가 및 구성 가져오기

1. 프로젝트 개요 페이지에서 웹 앱 아이콘 (</>) 클릭
2. 앱 닉네임 입력 (예: "photobooth-web")
3. Firebase SDK 추가 - "구성" 섹션의 값들을 복사:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력합니다:

```env
# Gemini API Key (1단계에서 발급받은 키)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (2.4단계에서 복사한 값들)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Base URL (개발 환경)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Firebase 보안 규칙 설정 (프로덕션 배포 시)

Firestore Database → 규칙 탭에서 다음 규칙을 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 세션 데이터: 누구나 생성 및 읽기 가능
    match /sessions/{sessionId} {
      allow create: if true;
      allow read: if true;
    }

    // 통계: 누구나 읽기 가능, 서버만 쓰기 가능
    match /statistics/{statId} {
      allow read: if true;
      allow write: if true;  // 프로덕션에서는 더 엄격한 규칙 권장
    }
  }
}
```

## 5. 카메라 셔터 사운드 (선택사항)

촬영 시 소리를 재생하려면:

1. 카메라 셔터 사운드 MP3 파일을 준비합니다
2. `public/shutter.mp3` 파일로 저장합니다

무료 셔터 사운드:
- [Freesound](https://freesound.org/)
- [Pixabay](https://pixabay.com/sound-effects/)

## 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 7. 테스트 체크리스트

- [ ] 메인 페이지가 정상적으로 로드됨
- [ ] 촬영 페이지에서 카메라 권한 요청됨
- [ ] 3초 후 자동 촬영 작동
- [ ] AI 이미지 생성 (약 5-10초 소요)
- [ ] 3장의 이미지가 표시됨
- [ ] 이미지 선택 가능
- [ ] 확인 질문 페이지 작동
- [ ] 반전 페이지 애니메이션 작동
- [ ] QR 코드 생성됨
- [ ] QR 코드 스캔 시 결과 페이지 표시
- [ ] 통계가 정상적으로 업데이트됨

## 8. 문제 해결

### "API key not configured" 오류
→ `.env.local` 파일이 올바르게 설정되었는지 확인
→ 개발 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

### 카메라가 작동하지 않음
→ 브라우저에서 카메라 권한이 허용되었는지 확인
→ HTTPS 연결 필요 (localhost는 예외)

### Firebase 연결 오류
→ Firebase 구성이 올바른지 확인
→ Firestore Database가 활성화되었는지 확인
→ `statistics/global` 문서가 생성되었는지 확인

### 이미지 생성이 너무 느림
→ Gemini API 요청이 순차적으로 처리됨 (각 500ms 간격)
→ 네트워크 연결 상태 확인

## 9. 프로덕션 배포

### Vercel 배포 (권장)

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com) 접속 및 로그인
3. "Import Project" 선택
4. GitHub 저장소 선택
5. 환경 변수 설정:
   - 모든 `.env.local` 내용을 Environment Variables에 추가
   - `NEXT_PUBLIC_BASE_URL`을 배포된 도메인으로 변경
6. Deploy 클릭

### 기타 플랫폼
- Netlify
- AWS Amplify
- Google Cloud Run

## 10. 주의사항

- Gemini API는 사용량에 따라 과금될 수 있습니다
- Firebase 무료 티어 제한을 확인하세요
- 프로덕션 환경에서는 더 엄격한 보안 규칙을 적용하세요
- 개인 정보 보호 정책을 준수하세요
