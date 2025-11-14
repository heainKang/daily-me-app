# 📱 Daily Me - 일일 감정 분석 앱

## 📌 프로젝트 소개

**Daily Me**는 하루의 감정을 MBTI 분석을 통해 이해하고, 맞춤형 조언을 제공하는 감정 관리 모바일 앱입니다.
매일 세 번의 명언을 통해 감정을 기록하고, 일일 분석 결과를 확인할 수 있습니다.

---

## 🎯 주요 기능

### 1️⃣ **MBTI 기반 감정 분석**
- 초기 MBTI 설정 (16가지 성향)
- 하루 3번의 명언에 대한 감정 응답
- MBTI와 감정 분석을 통한 맞춤형 피드백

### 2️⃣ **오늘의 명언 (Quote of The Day)**
- 아침(🌅 9시), 점심(☀️ 12시), 저녁(🌙 6시) 3개 명언 제공
- 각 명언에 대해 "공감돼요" 또는 "별로예요" 선택
- Push 알림으로 일정 시간에 자동 안내
- 알림 On/Off 토글 기능

### 3️⃣ **일일 리포트 (Daily Report)**
- 하루 감정 분석 결과 표시 (행복, 좋음, 평범, 우울, 피곤)
- 시간대별 맞춤형 행동 제안
- 감정별 테마 색상 적용

### 4️⃣ **감정 기록 조회 (History)**
- 최근 7일간의 감정 기록 표시
- 감정 분포 통계 (행복, 좋음, 평범, 우울, 피곤)
- 일별 상세 기록 조회

### 5️⃣ **홈 화면 (Home)**
- 오늘의 감정 상태 빠른 입력
- 감정별 이모지 선택 (😊, 🙂, 😐, 😢, 😴)
- 감정 입력 및 메모 작성
- 오늘의 명언 접근 및 알림 토글

---

## 🛠 개발 환경

### 필수 요구사항
- **Node.js**: 18.x 이상
- **npm** 또는 **yarn**
- **Expo CLI**: 글로벌 설치 (`npm install -g expo-cli`)
- **Xcode**: iOS 개발 (Mac 필수)
- **Android Studio**: Android 개발

### 설치된 패키지

| 패키지 | 버전 | 용도 |
|--------|------|------|
| expo | ~54.0.23 | 모바일 앱 프레임워크 |
| react | 19.1.0 | UI 라이브러리 |
| react-native | 0.81.5 | 모바일 개발 |
| @react-navigation | 7.x | 화면 네비게이션 |
| expo-notifications | 0.32.12 | Push 알림 |
| sentiment | 5.0.2 | 감정 분석 |
| @react-native-async-storage | 2.2.0 | 로컬 데이터 저장 |
| typescript | ~5.9.2 | 타입 안정성 |

---

## 📁 프로젝트 구조

```
daily-me-app/
├── src/
│   ├── screens/                 # 화면 컴포넌트
│   │   ├── WelcomeScreen.tsx   # 시작 화면
│   │   ├── InitialMBTIScreen.tsx # MBTI 선택 화면
│   │   ├── HomeScreen.tsx       # 홈 화면 (감정 입력)
│   │   ├── QuoteOfTheDayScreen.tsx # 오늘의 명언
│   │   ├── QuestionScreen.tsx   # 감정 표현 화면
│   │   ├── DailyReportScreen.tsx # 일일 분석 리포트
│   │   ├── HistoryScreen.tsx    # 7일 감정 기록
│   │   └── DailyEmotionScreen.tsx # 일일 감정 화면
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx     # 화면 네비게이션 구조
│   │
│   ├── utils/
│   │   ├── storage.ts           # AsyncStorage 데이터 관리
│   │   ├── quotes.ts            # 명언 데이터베이스
│   │   ├── mbtiAnalysis.ts      # MBTI 감정 분석 로직
│   │   └── notificationUtils.ts # Push 알림 스케줄링
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript 타입 정의
│   │
│   └── styles/
│       └── colors.ts            # 공통 색상 팔레트
│
├── assets/                       # 앱 아이콘, 스플래시
│   ├── icon.png                 # 앱 아이콘 (1024x1024)
│   └── splash.png               # 스플래시 이미지 (1242x2436)
│
├── App.tsx                       # 메인 진입점
├── app.json                      # Expo 앱 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # 의존성 관리
└── README.md                     # 프로젝트 문서
```

---

## 🚀 설치 및 실행

### 1. 프로젝트 설치
```bash
cd /Users/keyonbit/my_project/daily-me-app
npm install
```

### 2. 로컬 개발 서버 실행
```bash
# 웹 버전 실행
npm start web

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android
```

### 3. 개발 중 주의사항
- **캐시 문제**: 변경사항이 반영 안 되면 시크릿 모드/브라우저 캐시 삭제
- **알림 테스트**: 웹 버전에서는 Push 알림이 제한됨 (모바일에서 테스트 권장)
- **AsyncStorage**: 데이터는 로컬에 저장되므로 기기마다 독립적

---

## 📊 주요 데이터 타입

### UserProfile (사용자 프로필)
```typescript
{
  userId: string;
  baseMBTI: string;           // 사용자 MBTI (ENFP 등)
  notificationsEnabled: boolean; // 알림 활성화 여부
}
```

### QuestionResponse (감정 응답)
```typescript
{
  questionId: string;         // 명언 ID
  selectedOption: 'A' | 'B';  // A: 공감, B: 별로
  emotionType?: string;       // 감정 유형
  emotionText?: string;       // 감정 메모
  timestamp: Date;
  timeSlot: string;          // morning, afternoon, evening
}
```

### DailyAnalysis (일일 분석)
```typescript
{
  date: string;              // YYYY-MM-DD
  feedback: string;          // AI 피드백 메시지
  dominantType: string;      // 우세 감정
  emotionCounts: {
    great: number;
    good: number;
    normal: number;
    sad: number;
    tired: number;
  };
}
```

---

## 🎨 감정 분류 및 색상

| 감정 | 이모지 | 한글명 | 기본색 | 보조색 |
|------|--------|--------|--------|--------|
| great | 😊 | 행복 | #10b981 | #d1fae5 |
| good | 🙂 | 좋음 | #06b6d4 | #cffafe |
| normal | 😐 | 평범 | #6b7280 | #f3f4f6 |
| sad | 😢 | 우울 | #8b5cf6 | #ede9fe |
| tired | 😴 | 피곤 | #f59e0b | #fef3c7 |

---

## 📱 앱 플로우

1. **환영 화면** (WelcomeScreen) → 앱 소개 및 시작
2. **MBTI 설정** (InitialMBTIScreen) → 사용자 MBTI 입력
3. **홈 화면** (HomeScreen) → 일일 감정 입력 및 명언 접근
4. **오늘의 명언** (QuoteOfTheDayScreen) → 3개 명언 표시
5. **감정 표현** (QuestionScreen) → 명언에 대한 감정 선택
6. **일일 리포트** (DailyReportScreen) → 하루 분석 결과 확인
7. **감정 기록** (HistoryScreen) → 7일 통계 및 기록 조회

---

## 🔐 보안 및 개인정보

- 모든 데이터는 **로컬 저장소**에만 저장
- 서버 연동 없음 (완전 오프라인 동작)
- 감정 데이터는 외부로 전송되지 않음
- Push 알림: Expo 서버를 통해 스케줄링

---

## 🐛 트러블슈팅

### 1. "명언을 찾을 수 없습니다" 에러
→ `src/utils/quotes.ts`에서 명언 데이터 확인

### 2. Push 알림이 안 옴
→ 알림 권한 확인 및 `notificationsEnabled` 토글 확인

### 3. 감정 데이터가 저장 안 됨
→ 브라우저 캐시 삭제 후 재시작

### 4. 웹에서 화면이 깜빡임
→ 개발 서버 재시작 (`npm start web`)

---

## 🏗️ 기술 스택

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Analysis**: Sentiment.js
- **Notifications**: expo-notifications
- **Platform**: Web, iOS, Android

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

**마지막 업데이트**: 2025년 11월 14일