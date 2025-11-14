import sentiment from 'sentiment';
import { MBTIPersonality, MBTIScore, QuestionResponse, DailyAnalysis } from '../types';
import { ALL_QUOTES } from './quotes';
import { INITIAL_MBTI_QUESTIONS } from './questions';

// 감정 분석기 초기화
const sentimentAnalyzer = new sentiment();

// MBTI 성격 매핑
const MBTI_PERSONALITIES: MBTIPersonality[] = [
  'ENFP', 'ENFJ', 'ENTJ', 'ENTP',
  'ESFP', 'ESFJ', 'ESTJ', 'ESTP',
  'INFP', 'INFJ', 'INTJ', 'INTP',
  'ISFP', 'ISFJ', 'ISTJ', 'ISTP'
];

// MBTI 점수를 성격 타입으로 변환
export const scoreToMBTI = (scores: MBTIScore): MBTIPersonality => {
  // 점수가 모두 0인 경우 기본값 사용
  if (Object.values(scores).every(score => score === 0)) {
    console.log('All scores are 0, using default MBTI');
    return 'ENFP'; // 기본값
  }

  const e = scores.E >= scores.I ? 'E' : 'I';
  const n = scores.N >= scores.S ? 'N' : 'S';
  const t = scores.T >= scores.F ? 'T' : 'F';
  const j = scores.J >= scores.P ? 'J' : 'P';
  
  const result = `${e}${n}${t}${j}` as MBTIPersonality;
  console.log('Calculated MBTI type:', result);
  return result;
};

// 응답들로부터 MBTI 점수 계산
export const calculateMBTIScores = (responses: QuestionResponse[]): MBTIScore => {
  const scores: MBTIScore = {
    E: 0, I: 0,
    N: 0, S: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  console.log('Calculating MBTI scores for responses:', responses);

  responses.forEach(response => {
    const weights = getQuestionWeights(response.questionId, response.selectedOption);
    console.log(`Question ${response.questionId}, Option ${response.selectedOption}:`, weights);
    
    Object.entries(weights).forEach(([key, value]) => {
      if (key in scores && typeof value === 'number') {
        (scores as any)[key] += value;
      }
    });
  });

  console.log('Final MBTI scores:', scores);
  return scores;
};

// 질문별 가중치 반환 (명언과 MBTI 질문 모두 처리)
const getQuestionWeights = (questionId: string, option: 'A' | 'B') => {
  console.log(`Looking for ${questionId} with option ${option}`);
  
  // 명언에서 찾기
  const quote = ALL_QUOTES.find(q => q.id === questionId);
  if (quote) {
    const weights = option === 'A' ? quote.mbtiWeights.positive : quote.mbtiWeights.negative;
    console.log(`Quote weights for ${questionId} option ${option}:`, weights);
    return weights;
  }
  
  // MBTI 초기 질문에서 찾기
  const question = INITIAL_MBTI_QUESTIONS.find(q => q.id === questionId);
  if (question) {
    const weights = option === 'A' ? question.optionA.mbtiWeights : question.optionB.mbtiWeights;
    console.log(`MBTI weights for ${questionId} option ${option}:`, weights);
    return weights;
  }
  
  // 찾지 못한 경우 경고 및 기본값
  console.warn(`Question/Quote not found: ${questionId}`);
  return {};
};

// 감정 분석 수행
export const analyzeSentiment = (text: string) => {
  return sentimentAnalyzer.analyze(text);
};

// 일일 피드백 생성 - 더 따뜻하고 개인화된 메시지
export const generateDailyFeedback = (
  todayMBTI: MBTIPersonality,
  baseMBTI: MBTIPersonality | null,
  sentimentScore: number,
  responses: QuestionResponse[]
): string => {
  const feedbacks: string[] = [];
  
  // 감정 상태에 따른 첫 인사
  if (sentimentScore > 0.3) {
    feedbacks.push("오늘 하루 정말 좋은 에너지가 느껴져요! ✨");
  } else if (sentimentScore > -0.1) {
    feedbacks.push("오늘 하루 수고하셨어요. 🌸");
  } else {
    feedbacks.push("오늘은 조금 힘든 하루였나요? 괜찮아요, 그런 날이 있어요. 💙");
  }
  
  // MBTI 기반 성향 해석 (더 따뜻하게)
  const mbtiInsights = getMBTIInsight(todayMBTI, baseMBTI, sentimentScore);
  feedbacks.push(mbtiInsights);
  
  // 상황별 공감 메시지
  if (sentimentScore < -0.2) {
    feedbacks.push("힘들 때는 혼자 견디려 하지 마세요. 잠시 쉬어가도 괜찮습니다. 🫂");
  } else if (sentimentScore > 0.4) {
    feedbacks.push("이 좋은 기분이 계속 이어지길 바라요. 당신의 긍정 에너지가 주변도 밝게 만들어요! 🌟");
  }
  
  return feedbacks.join('\n\n');
};

// MBTI별 개인화된 인사이트 생성
const getMBTIInsight = (
  todayMBTI: MBTIPersonality,
  baseMBTI: MBTIPersonality | null,
  sentimentScore: number
): string => {
  // 기본 MBTI 기준으로 분석 (매일 MBTI 테스트 하는 게 아니라 감정 상태만 체크)
  const targetMBTI = baseMBTI || todayMBTI;
  
  // MBTI별 성향 해석 (기본 MBTI 기준)
  const insights: { [key: string]: { positive: string; neutral: string; negative: string } } = {
    'ENTJ': {
      positive: "오늘은 리더십이 돋보이는 하루였어요. 목표를 향해 당당히 나아가는 모습이 멋져요!",
      neutral: "체계적이고 효율적인 하루를 보내셨네요. 계획한 일들을 차근차근 해나가는 당신이 대단해요.",
      negative: "오늘은 조금 부담스러운 일들이 많았나요? 완벽하려 하지 마세요. 당신은 이미 충분히 잘하고 있어요."
    },
    'ENFP': {
      positive: "오늘은 창의적인 아이디어가 샘솟는 하루였을 것 같아요! 당신의 열정이 정말 빛나네요 ✨",
      neutral: "새로운 가능성들을 탐색하며 보낸 하루 같아요. 당신의 호기심과 열린 마음이 소중해요.",
      negative: "평소보다 조용한 하루였나요? 때로는 내면을 돌아보는 시간도 필요해요. 충분히 쉬어가세요."
    },
    'INFP': {
      positive: "오늘은 마음이 따뜻한 하루였나봐요. 당신의 따뜻한 마음이 세상을 더 아름답게 만들어요 💕",
      neutral: "자신만의 가치와 신념을 지키며 보낸 조용한 하루였을 것 같아요. 그런 당신이 멋져요.",
      negative: "마음이 복잡한 하루였나요? 감정이 풍부한 만큼 때로는 힘들 수도 있어요. 스스로를 다독여주세요."
    }
    // 다른 MBTI 타입들도 추가 가능
  };
  
  const defaultInsight = {
    positive: "오늘 하루 정말 잘 보내신 것 같아요! 당신의 긍정적인 에너지가 느껴져요 😊",
    neutral: "차분하고 안정된 하루를 보내셨군요. 때로는 이런 평온함도 소중해요.",
    negative: "오늘은 조금 힘든 하루였나요? 그런 날도 있어요. 스스로에게 너그러워지세요."
  };
  
  const mbtiData = insights[targetMBTI] || defaultInsight;
  
  if (sentimentScore > 0.2) return mbtiData.positive;
  else if (sentimentScore > -0.2) return mbtiData.neutral;
  else return mbtiData.negative;
};

// 추천사항 생성 - 더 구체적이고 실용적인 조언
export const generateRecommendations = (
  todayMBTI: MBTIPersonality,
  sentimentScore: number
): string[] => {
  const recommendations: string[] = [];
  
  // 감정 상태에 따른 우선 추천
  if (sentimentScore < -0.3) {
    recommendations.push('🛁 따뜻한 차 한잔과 함께 휴식을 취해보세요');
    recommendations.push('🎵 좋아하는 음악을 들으며 마음을 달래보세요');
    recommendations.push('📱 신뢰하는 사람에게 마음을 털어놓아보세요');
  } else if (sentimentScore > 0.4) {
    recommendations.push('📝 오늘의 좋은 순간을 일기에 기록해보세요');
    recommendations.push('💌 소중한 사람에게 안부 인사를 보내보세요');
    recommendations.push('🌟 이 기분을 오래 간직할 수 있는 작은 일을 해보세요');
  } else {
    // 중성적인 기분일 때는 MBTI별 맞춤 추천
    if (todayMBTI.includes('E')) {
      recommendations.push('☕ 가까운 사람과 커피 한잔 하며 대화해보세요');
    } else {
      recommendations.push('🕯️ 혼자만의 조용한 시간을 가져보세요');
    }
    
    if (todayMBTI.includes('N')) {
      recommendations.push('✍️ 새로운 아이디어를 노트에 적어보세요');
    } else {
      recommendations.push('📋 오늘 해야 할 일들을 정리해보세요');
    }
    
    if (todayMBTI.includes('F')) {
      recommendations.push('💝 감사한 마음을 표현해보세요');
    } else {
      recommendations.push('🎯 오늘의 목표를 점검해보세요');
    }
  }
  
  // 시간대별 추천 추가
  const hour = new Date().getHours();
  if (hour >= 18) {
    recommendations.push('🌙 오늘 하루를 되돌아보며 감사한 점 3가지를 생각해보세요');
  } else if (hour >= 12) {
    recommendations.push('🚶‍♀️ 잠깐 산책을 하며 오후 에너지를 충전해보세요');
  } else {
    recommendations.push('🌅 오늘 하루 목표를 세우고 긍정적인 마음으로 시작해보세요');
  }
  
  return recommendations;
};

// 전체 일일 분석 수행 (명언 기반 감정 분석)
export const performDailyAnalysis = (
  date: string,
  responses: QuestionResponse[],
  baseMBTI: MBTIPersonality | null
): DailyAnalysis => {
  // 명언 응답은 감정 상태만 분석 (MBTI 재계산 안함)
  console.log('Performing daily analysis for quotes, responses:', responses);
  
  // 감정 점수 계산 (긍정 응답 개수 기반)
  const positiveResponses = responses.filter(r => r.selectedOption === 'A').length;
  const totalResponses = responses.length;
  const sentimentScore = totalResponses > 0 ? (positiveResponses / totalResponses) * 2 - 1 : 0; // -1 to 1 범위
  
  console.log(`Sentiment calculation: ${positiveResponses}/${totalResponses} = ${sentimentScore}`);
  
  // 기본 MBTI를 사용 (매일 새로 계산하지 않음)
  const dominantType = baseMBTI || 'ENFP'; // 기본값
  
  // 기본 MBTI 점수 (빈 값으로 설정)
  const mbtiScores: MBTIScore = {
    E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
  };
  
  const feedback = generateDailyFeedback(
    dominantType,
    baseMBTI,
    sentimentScore,
    responses
  );
  
  const recommendations = generateRecommendations(
    dominantType,
    sentimentScore
  );
  
  return {
    date,
    mbtiScores, // 빈 값
    dominantType, // 기본 MBTI 사용
    sentiment: {
      score: sentimentScore,
      comparative: sentimentScore
    },
    responses,
    feedback,
    recommendations
  };
};