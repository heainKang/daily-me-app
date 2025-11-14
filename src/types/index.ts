// 🧩 types/index.ts - 앱에서 사용하는 모든 데이터 타입들을 정의하는 파일
// TypeScript는 데이터의 형태를 미리 정의해서 오류를 방지합니다!

// 🧠 MBTI 관련 타입들
// MBTIType: MBTI의 각 개별 문자를 정의 (E외향 vs I내향, N직관 vs S감각, T사고 vs F감정, J판단 vs P인식)
export type MBTIType = 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P';

// MBTIPersonality: 16가지 MBTI 성격 유형 정의 (ENFP, INFJ 등)
export type MBTIPersonality = 'ENFP' | 'ENFJ' | 'ENTJ' | 'ENTP' | 'ESFP' | 'ESFJ' | 'ESTJ' | 'ESTP' | 'INFP' | 'INFJ' | 'INTJ' | 'INTP' | 'ISFP' | 'ISFJ' | 'ISTJ' | 'ISTP';

// MBTIScore: 각 MBTI 성향의 점수를 저장하는 객체 구조
export interface MBTIScore {
  E: number;  // 외향성 점수
  I: number;  // 내향성 점수
  N: number;  // 직관 점수
  S: number;  // 감각 점수
  T: number;  // 사고 점수
  F: number;  // 감정 점수
  J: number;  // 판단 점수
  P: number;  // 인식 점수
}

// ❓ 질문 관련 타입들
// Question: 사용자에게 보여줄 질문의 구조를 정의
export interface Question {
  id: string;                    // 🆔 질문의 고유 ID
  text: string;                  // 📝 질문 텍스트 내용
  optionA: {                     // 🅰️ 첫 번째 선택지
    text: string;                // 📝 선택지 텍스트
    mbtiWeights: Partial<MBTIScore>; // ⚖️ 이 선택지가 어떤 MBTI 성향에 영향을 주는지
  };
  optionB: {                     // 🅱️ 두 번째 선택지
    text: string;                // 📝 선택지 텍스트  
    mbtiWeights: Partial<MBTIScore>; // ⚖️ 이 선택지가 어떤 MBTI 성향에 영향을 주는지
  };
  timeSlot: 'morning' | 'afternoon' | 'evening'; // ⏰ 언제 물어볼 질문인지 (아침/점심/저녁)
}

// QuestionResponse: 사용자가 질문에 답한 내용을 저장하는 구조
export interface QuestionResponse {
  questionId: string;            // 🆔 어떤 질문에 대한 답변인지
  selectedOption: 'A' | 'B';     // ✅ 사용자가 선택한 옵션 (A 또는 B)
  timestamp: Date;               // 📅 언제 답변했는지 시간 기록
  timeSlot: 'morning' | 'afternoon' | 'evening'; // ⏰ 어느 시간대에 답변했는지
  emotionType?: 'great' | 'good' | 'normal' | 'sad' | 'tired'; // 😊 감정 타입 (새로운 방식)
  emotionText?: string;          // 💬 감정에 대한 추가 텍스트 (선택사항)
}

// 📊 분석 결과 타입들
// DailyAnalysis: 하루 동안의 사용자 데이터를 분석한 결과를 저장
export interface DailyAnalysis {
  date: string;                  // 📅 분석 날짜 (YYYY-MM-DD 형식)
  mbtiScores: MBTIScore;         // 🧠 그날의 MBTI 점수들
  dominantType: MBTIPersonality; // 👑 가장 강하게 나타난 MBTI 유형
  sentiment: {                   // 😊 감정 분석 결과
    score: number;               // 📈 감정 점수 (-1: 부정적, +1: 긍정적)
    comparative: number;         // 📊 비교 점수 (전체 텍스트 대비)
  };
  responses: QuestionResponse[]; // 📝 그날 답변한 모든 질문들
  feedback: string;              // 💬 AI가 분석한 피드백 메시지
  recommendations: string[];     // 💡 개선을 위한 추천사항들
}

// UserProfile: 사용자의 기본 정보를 저장
export interface UserProfile {
  baseMBTI: MBTIPersonality | null; // 🧬 사용자의 기본 MBTI 성격 (처음 설정한 것)
  isBaseMBTISet: boolean;        // ✅ 기본 MBTI가 설정되었는지 확인 플래그
  createdAt: Date;               // 📅 프로필이 생성된 날짜
  totalResponses: number;        // 🔢 지금까지 답변한 총 질문 수
}

// 💾 저장소 관련 타입들
// StorageData: 앱이 폰에 저장하는 모든 데이터의 구조
export interface StorageData {
  userProfile: UserProfile;      // 👤 사용자 프로필 정보
  dailyAnalyses: DailyAnalysis[]; // 📊 일별 분석 결과들의 배열
  responses: QuestionResponse[]; // 📝 모든 질문 답변들의 배열
}