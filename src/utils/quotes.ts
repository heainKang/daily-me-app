// 명언 기반 일일 질문 시스템

export interface Quote {
  id: string;
  text: string;
  category: 'morning' | 'afternoon' | 'evening';
  mbtiWeights: {
    positive: { [key: string]: number }; // "공감돼요" 선택시
    negative: { [key: string]: number }; // "별로예요" 선택시
  };
}

// 아침 명언들 (활력, 시작, 에너지)
const MORNING_QUOTES: Quote[] = [
  {
    id: 'morning_1',
    text: '새로운 하루, 새로운 기회가 시작됩니다',
    category: 'morning',
    mbtiWeights: {
      positive: { E: 1, N: 1 }, // 외향적, 직감적
      negative: { I: 1, S: 1 }   // 내향적, 현실적
    }
  },
  {
    id: 'morning_2', 
    text: '오늘도 계획한 일들을 차근차근 해나가봅시다',
    category: 'morning',
    mbtiWeights: {
      positive: { J: 1, S: 1 }, // 판단적, 현실적
      negative: { P: 1, N: 1 }  // 인식적, 직감적
    }
  },
  {
    id: 'morning_3',
    text: '혼자만의 시간으로 하루를 조용히 시작해보세요',
    category: 'morning',
    mbtiWeights: {
      positive: { I: 1, F: 1 }, // 내향적, 감정적
      negative: { E: 1, T: 1 }  // 외향적, 사고적
    }
  },
  {
    id: 'morning_4',
    text: '오늘은 무엇을 배우고 발견할까요?',
    category: 'morning',
    mbtiWeights: {
      positive: { N: 1, P: 1 }, // 직감적, 인식적
      negative: { S: 1, J: 1 }  // 현실적, 판단적
    }
  },
  {
    id: 'morning_5',
    text: '논리적으로 생각하고 효율적으로 행동하는 하루가 되길',
    category: 'morning',
    mbtiWeights: {
      positive: { T: 1, J: 1 }, // 사고적, 판단적
      negative: { F: 1, P: 1 }  // 감정적, 인식적
    }
  }
];

// 점심 명언들 (중간 점검, 균형)
const AFTERNOON_QUOTES: Quote[] = [
  {
    id: 'afternoon_1',
    text: '지금까지 잘 해왔어요. 오후도 화이팅!',
    category: 'afternoon',
    mbtiWeights: {
      positive: { F: 1, E: 1 }, // 감정적, 외향적
      negative: { T: 1, I: 1 }  // 사고적, 내향적
    }
  },
  {
    id: 'afternoon_2',
    text: '완벽하지 않아도 괜찮습니다. 진전이 중요해요',
    category: 'afternoon',
    mbtiWeights: {
      positive: { F: 1, P: 1 }, // 감정적, 인식적
      negative: { T: 1, J: 1 }  // 사고적, 판단적
    }
  },
  {
    id: 'afternoon_3',
    text: '오늘의 목표를 점검해보는 시간입니다',
    category: 'afternoon',
    mbtiWeights: {
      positive: { J: 1, T: 1 }, // 판단적, 사고적
      negative: { P: 1, F: 1 }  // 인식적, 감정적
    }
  },
  {
    id: 'afternoon_4',
    text: '동료들과 함께 나누는 점심시간이 소중해요',
    category: 'afternoon',
    mbtiWeights: {
      positive: { E: 1, F: 1 }, // 외향적, 감정적
      negative: { I: 1, T: 1 }  // 내향적, 사고적
    }
  },
  {
    id: 'afternoon_5',
    text: '조용히 나만의 시간을 가져보세요',
    category: 'afternoon',
    mbtiWeights: {
      positive: { I: 1, S: 1 }, // 내향적, 현실적
      negative: { E: 1, N: 1 }  // 외향적, 직감적
    }
  }
];

// 저녁 명언들 (반성, 마무리, 휴식)
const EVENING_QUOTES: Quote[] = [
  {
    id: 'evening_1',
    text: '오늘 하루도 수고했어요. 스스로를 격려해주세요',
    category: 'evening',
    mbtiWeights: {
      positive: { F: 1, I: 1 }, // 감정적, 내향적
      negative: { T: 1, E: 1 }  // 사고적, 외향적
    }
  },
  {
    id: 'evening_2',
    text: '오늘의 성과를 객관적으로 평가해보세요',
    category: 'evening',
    mbtiWeights: {
      positive: { T: 1, J: 1 }, // 사고적, 판단적
      negative: { F: 1, P: 1 }  // 감정적, 인식적
    }
  },
  {
    id: 'evening_3',
    text: '내일은 또 다른 가능성이 기다리고 있어요',
    category: 'evening',
    mbtiWeights: {
      positive: { N: 1, P: 1 }, // 직감적, 인식적
      negative: { S: 1, J: 1 }  // 현실적, 판단적
    }
  },
  {
    id: 'evening_4',
    text: '사랑하는 사람들과 시간을 보내는 저녁이 되길',
    category: 'evening',
    mbtiWeights: {
      positive: { F: 1, E: 1 }, // 감정적, 외향적
      negative: { T: 1, I: 1 }  // 사고적, 내향적
    }
  },
  {
    id: 'evening_5',
    text: '규칙적인 저녁 루틴으로 하루를 마무리해보세요',
    category: 'evening',
    mbtiWeights: {
      positive: { J: 1, S: 1 }, // 판단적, 현실적  
      negative: { P: 1, N: 1 }  // 인식적, 직감적
    }
  }
];

// 모든 명언을 합친 배열
export const ALL_QUOTES: Quote[] = [
  ...MORNING_QUOTES,
  ...AFTERNOON_QUOTES, 
  ...EVENING_QUOTES
];

// 시간대별 명언 가져오기
export const getQuotesByTimeSlot = (timeSlot: 'morning' | 'afternoon' | 'evening'): Quote[] => {
  return ALL_QUOTES.filter(quote => quote.category === timeSlot);
};

// 랜덤 명언 선택
export const getRandomQuote = (timeSlot: 'morning' | 'afternoon' | 'evening'): Quote => {
  const quotes = getQuotesByTimeSlot(timeSlot);
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

// 날짜 기반 고정 명언 선택 (매일 같은 명언, 하지만 날마다 다름)
export const getQuoteByDate = (date: string, timeSlot: 'morning' | 'afternoon' | 'evening'): Quote => {
  const quotes = getQuotesByTimeSlot(timeSlot);
  const dateNum = new Date(date).getDate();
  const index = dateNum % quotes.length;
  return quotes[index];
};

// 현재 시간대 결정
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

// 오늘의 3개 명언 생성
export const getTodayQuotes = (date: string = new Date().toISOString().split('T')[0]): Quote[] => {
  return [
    getQuoteByDate(date, 'morning'),
    getQuoteByDate(date, 'afternoon'), 
    getQuoteByDate(date, 'evening')
  ];
};