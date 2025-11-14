# 오늘의 나는 (Daily Me)

하루 3번의 질문으로 나를 더 알아가는 MBTI 분석 앱

## 📱 주요 기능

- **일일 3회 질문**: 아침 9시, 점심 12시, 저녁 6시 알림
- **MBTI 분석**: 답변 패턴을 통한 실시간 성향 분석  
- **감정 추적**: 감정 상태 분석 및 피드백
- **개인 맞춤 추천**: 일일 분석 결과에 따른 맞춤 조언
- **완전 오프라인**: 모든 데이터는 기기에만 저장

## 🚀 실행 방법

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 웹에서 실행
npm run web

# Android에서 실행  
npm run android

# iOS에서 실행
npm run ios
```

### 배포

#### 웹 배포 (Vercel)

```bash
# 빌드
npm run build:web

# Vercel 배포
npx vercel --prod
```

#### 앱스토어 배포

```bash  
# Android APK 빌드
npm run build:android

# iOS IPA 빌드  
npm run build:ios
```

## 🏗️ 기술 스택

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Analysis**: Sentiment.js
- **Platform**: Web, iOS, Android

## 📋 앱 플로우

1. **환영 화면**: 앱 소개 및 시작
2. **MBTI 설정**: 8개 초기 질문 또는 건너뛰기  
3. **홈 화면**: 일일 진행률 및 질문 목록
4. **질문 화면**: 이진 선택 질문 답변
5. **리포트 화면**: 일일 MBTI 분석 결과

## 🧠 분석 원리

- **MBTI 점수**: E/I, N/S, T/F, J/P 각 축별 점수 계산
- **감정 분석**: 선택 패턴을 통한 감정 상태 분석
- **비교 분석**: 기본 MBTI vs 일일 성향 비교
- **맞춤 피드백**: 성향과 감정에 따른 개인화 추천

## 📂 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트  
├── navigation/          # 네비게이션 설정
├── screens/            # 화면 컴포넌트
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
│   ├── storage.ts      # 로컬 저장소 관리
│   ├── mbtiAnalysis.ts # MBTI 분석 로직
│   └── questions.ts    # 질문 데이터베이스
```

## 🔒 개인정보 보호

- 모든 데이터는 사용자 기기에만 저장
- 서버 전송 없음
- 언제든 데이터 삭제 가능
- 완전 오프라인 동작

## 📄 라이선스

MIT License