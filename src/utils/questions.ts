import { Question } from '../types';

// 초기 MBTI 설정용 질문들 (8개)
export const INITIAL_MBTI_QUESTIONS: Question[] = [
  {
    id: 'initial_energy_1',
    text: '새로운 환경에서 에너지를 얻는 방법은?',
    optionA: {
      text: '사람들과 대화하며 적응하기',
      mbtiWeights: { E: 1 }
    },
    optionB: {
      text: '혼자 조용히 환경 파악하기',
      mbtiWeights: { I: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'initial_info_1',
    text: '정보를 받아들일 때 중요하게 생각하는 것은?',
    optionA: {
      text: '전체적인 맥락과 가능성',
      mbtiWeights: { N: 1 }
    },
    optionB: {
      text: '구체적인 사실과 세부사항',
      mbtiWeights: { S: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'initial_decision_1',
    text: '중요한 결정을 내릴 때 우선시하는 것은?',
    optionA: {
      text: '논리적 분석과 객관성',
      mbtiWeights: { T: 1 }
    },
    optionB: {
      text: '감정과 가치관, 사람들에게 미치는 영향',
      mbtiWeights: { F: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'initial_lifestyle_1',
    text: '일상생활에서 선호하는 스타일은?',
    optionA: {
      text: '계획적이고 체계적으로',
      mbtiWeights: { J: 1 }
    },
    optionB: {
      text: '유연하고 자유롭게',
      mbtiWeights: { P: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'initial_energy_2',
    text: '스트레스 받을 때 회복 방법은?',
    optionA: {
      text: '친구들과 함께 이야기하기',
      mbtiWeights: { E: 1 }
    },
    optionB: {
      text: '혼자 조용한 곳에서 휴식',
      mbtiWeights: { I: 1 }
    },
    timeSlot: 'afternoon'
  },
  {
    id: 'initial_info_2',
    text: '새로운 것을 배울 때 흥미로운 것은?',
    optionA: {
      text: '이론적 개념과 창의적 아이디어',
      mbtiWeights: { N: 1 }
    },
    optionB: {
      text: '실용적 기술과 구체적 방법',
      mbtiWeights: { S: 1 }
    },
    timeSlot: 'afternoon'
  },
  {
    id: 'initial_decision_2',
    text: '갈등 상황에서 해결 방식은?',
    optionA: {
      text: '객관적 기준으로 공정하게',
      mbtiWeights: { T: 1 }
    },
    optionB: {
      text: '모두가 만족할 수 있는 방향으로',
      mbtiWeights: { F: 1 }
    },
    timeSlot: 'evening'
  },
  {
    id: 'initial_lifestyle_2',
    text: '여행 계획을 세울 때 선호하는 방식은?',
    optionA: {
      text: '미리 상세한 일정과 예약',
      mbtiWeights: { J: 1 }
    },
    optionB: {
      text: '대략적 방향만 정하고 즉흥적으로',
      mbtiWeights: { P: 1 }
    },
    timeSlot: 'evening'
  }
];

// 일일 질문 풀 (시간대별로 다양한 질문들)
export const DAILY_QUESTIONS: Question[] = [
  // 아침 질문들
  {
    id: 'morning_energy_1',
    text: '오늘 하루를 시작하는 기분은?',
    optionA: {
      text: '사람들을 만나고 싶은 기분',
      mbtiWeights: { E: 1 }
    },
    optionB: {
      text: '조용히 혼자 시작하고 싶은 기분',
      mbtiWeights: { I: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'morning_lifestyle_1',
    text: '오늘 하루 일정을 생각하면?',
    optionA: {
      text: '계획대로 차근차근 진행하고 싶어',
      mbtiWeights: { J: 1 }
    },
    optionB: {
      text: '상황에 따라 유연하게 하고 싶어',
      mbtiWeights: { P: 1 }
    },
    timeSlot: 'morning'
  },
  {
    id: 'morning_info_1',
    text: '오늘 하고 싶은 일은?',
    optionA: {
      text: '새로운 아이디어나 영감을 찾는 일',
      mbtiWeights: { N: 1 }
    },
    optionB: {
      text: '구체적이고 실용적인 일',
      mbtiWeights: { S: 1 }
    },
    timeSlot: 'morning'
  },

  // 점심 질문들
  {
    id: 'afternoon_decision_1',
    text: '오늘 중요했던 순간은?',
    optionA: {
      text: '논리적으로 문제를 해결한 순간',
      mbtiWeights: { T: 1 }
    },
    optionB: {
      text: '누군가와 공감하고 소통한 순간',
      mbtiWeights: { F: 1 }
    },
    timeSlot: 'afternoon'
  },
  {
    id: 'afternoon_energy_1',
    text: '지금 가장 하고 싶은 것은?',
    optionA: {
      text: '누군가와 대화하거나 함께 시간 보내기',
      mbtiWeights: { E: 1 }
    },
    optionB: {
      text: '혼자만의 시간으로 재충전하기',
      mbtiWeights: { I: 1 }
    },
    timeSlot: 'afternoon'
  },
  {
    id: 'afternoon_lifestyle_1',
    text: '오후 시간을 어떻게 보내고 싶어?',
    optionA: {
      text: '미리 정한 계획에 따라 체계적으로',
      mbtiWeights: { J: 1 }
    },
    optionB: {
      text: '그때그때 떠오르는 대로 자유롭게',
      mbtiWeights: { P: 1 }
    },
    timeSlot: 'afternoon'
  },

  // 저녁 질문들
  {
    id: 'evening_reflection_1',
    text: '오늘 하루를 돌아보면?',
    optionA: {
      text: '계획한 것들을 완료해서 만족스러워',
      mbtiWeights: { J: 1 }
    },
    optionB: {
      text: '예상치 못한 재미있는 일들이 있었어',
      mbtiWeights: { P: 1 }
    },
    timeSlot: 'evening'
  },
  {
    id: 'evening_decision_1',
    text: '오늘 가장 의미있었던 일은?',
    optionA: {
      text: '효율적으로 목표를 달성한 것',
      mbtiWeights: { T: 1 }
    },
    optionB: {
      text: '누군가에게 도움이 된 것',
      mbtiWeights: { F: 1 }
    },
    timeSlot: 'evening'
  },
  {
    id: 'evening_energy_1',
    text: '내일을 위한 에너지 충전 방법은?',
    optionA: {
      text: '사람들과 함께하는 시간',
      mbtiWeights: { E: 1 }
    },
    optionB: {
      text: '혼자만의 조용한 시간',
      mbtiWeights: { I: 1 }
    },
    timeSlot: 'evening'
  }
];

// 시간대별 랜덤 질문 선택
export const getRandomQuestionByTimeSlot = (
  timeSlot: 'morning' | 'afternoon' | 'evening'
): Question => {
  const filteredQuestions = DAILY_QUESTIONS.filter(q => q.timeSlot === timeSlot);
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

// 현재 시간에 따른 시간대 결정
export const getCurrentTimeSlot = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

// 오늘의 질문들 생성 (하루에 3개)
export const generateTodayQuestions = (): Question[] => {
  return [
    getRandomQuestionByTimeSlot('morning'),
    getRandomQuestionByTimeSlot('afternoon'),
    getRandomQuestionByTimeSlot('evening')
  ];
};