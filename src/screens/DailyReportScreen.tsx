import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getDailyAnalysis, getUserProfile, getTodayResponses } from '../utils/storage';
import { DailyAnalysis, UserProfile, QuestionResponse } from '../types';
import { getTodayQuotes } from '../utils/quotes';

type DailyReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DailyReport'>;
type DailyReportScreenRouteProp = RouteProp<RootStackParamList, 'DailyReport'>;

interface Props {
  navigation: DailyReportScreenNavigationProp;
  route: DailyReportScreenRouteProp;
}

// 감정별 테마 색상 정의
const emotionThemes = {
  great: {
    primary: '#10b981',
    secondary: '#d1fae5',
    gradient: ['#10b981', '#059669'],
    emoji: '😊',
    name: '행복'
  },
  good: {
    primary: '#06b6d4',
    secondary: '#cffafe', 
    gradient: ['#06b6d4', '#0891b2'],
    emoji: '🙂',
    name: '좋음'
  },
  normal: {
    primary: '#6b7280',
    secondary: '#f3f4f6',
    gradient: ['#6b7280', '#4b5563'],
    emoji: '😐',
    name: '평범'
  },
  sad: {
    primary: '#8b5cf6',
    secondary: '#ede9fe',
    gradient: ['#8b5cf6', '#7c3aed'],
    emoji: '😢',
    name: '우울'
  },
  tired: {
    primary: '#f59e0b',
    secondary: '#fef3c7',
    gradient: ['#f59e0b', '#d97706'],
    emoji: '😴',
    name: '피곤'
  }
};

const DailyReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const { date } = route.params;
  const [analysis, setAnalysis] = useState<DailyAnalysis | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [todayResponse, setTodayResponse] = useState<QuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      const analysisData = await getDailyAnalysis(date);
      const profileData = await getUserProfile();
      const responses = await getTodayResponses();
      
      setAnalysis(analysisData);
      setUserProfile(profileData);
      
      // 감정이 있는 응답 찾기
      const emotionResponse = responses.find(r => r.emotionType);
      setTodayResponse(emotionResponse || null);
      
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    else if (hour >= 12 && hour < 18) return 'afternoon';
    else return 'evening';
  };

  const getTimeGreeting = () => {
    const timeSlot = getCurrentTimeSlot();
    switch (timeSlot) {
      case 'morning':
        return '🌅 좋은 아침이에요';
      case 'afternoon':
        return '☀️ 좋은 오후예요';
      case 'evening':
        return '🌙 오늘 하루 수고하셨어요';
      default:
        return '💭 안녕하세요';
    }
  };

  const getEmotionTheme = () => {
    if (!todayResponse?.emotionType) {
      return emotionThemes.normal;
    }
    return emotionThemes[todayResponse.emotionType];
  };

  const getActionRecommendations = () => {
    const emotion = todayResponse?.emotionType || 'normal';
    const mbti = userProfile?.baseMBTI;
    const timeSlot = getCurrentTimeSlot();
    
    const recommendations = {
      great: [
        '📝 오늘의 좋은 순간을 일기에 기록해보세요',
        '💌 소중한 사람에게 안부 인사를 보내보세요', 
        '🌟 이 기분을 오래 간직할 수 있는 작은 일을 해보세요'
      ],
      good: [
        '☕ 좋아하는 음료와 함께 잠시 쉬어보세요',
        '🚶‍♀️ 가벼운 산책으로 기분을 더 좋게 만들어보세요',
        '🎵 기분 좋은 음악을 들어보세요'
      ],
      normal: [
        '🌱 새로운 작은 목표를 하나 세워보세요',
        '📚 평소 관심 있던 책을 읽어보세요',
        '🫖 따뜻한 차 한잔과 함께 마음을 정리해보세요'
      ],
      sad: [
        '🛁 따뜻한 차 한잔과 함께 휴식을 취해보세요',
        '🎵 좋아하는 음악을 들으며 마음을 달래보세요',
        '📱 신뢰하는 사람에게 마음을 털어놓아보세요'
      ],
      tired: [
        '🛌 충분한 휴식을 취하세요',
        '🧘‍♀️ 간단한 명상이나 심호흡을 해보세요',
        '💤 일찍 잠자리에 들어보세요'
      ]
    };

    const timeRecommendations = {
      morning: '🌅 오늘 하루 목표를 세우고 긍정적인 마음으로 시작해보세요',
      afternoon: '🚶‍♀️ 잠깐 산책을 하며 오후 에너지를 충전해보세요',
      evening: '🌙 오늘 하루를 되돌아보며 감사한 점 3가지를 생각해보세요'
    };

    return [...recommendations[emotion], timeRecommendations[timeSlot]];
  };

  const handleViewQuotes = () => {
    // ✨ 오늘의 명언 화면으로 이동
    navigation.navigate('QuoteOfTheDay');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>분석 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>분석 결과를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const theme = getEmotionTheme();
  const recommendations = getActionRecommendations();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.secondary }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <Text style={styles.timeGreeting}>{getTimeGreeting()}</Text>
          <View style={styles.emotionDisplay}>
            <Text style={styles.emotionEmoji}>{theme.emoji}</Text>
            <Text style={styles.emotionName}>{theme.name}</Text>
          </View>
        </View>

        {/* 분석 결과 카드 */}
        <View style={styles.analysisCard}>
          <Text style={styles.analysisTitle}>오늘의 분석</Text>
          <Text style={styles.analysisText}>{analysis.feedback}</Text>
          
          {todayResponse?.emotionText && (
            <View style={styles.userTextContainer}>
              <Text style={styles.userTextLabel}>오늘 한마디:</Text>
              <Text style={styles.userText}>"{todayResponse.emotionText}"</Text>
            </View>
          )}
        </View>

        {/* 행동 제안 카드 */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>💡 오늘 해보면 좋을 것들</Text>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* 명언 보기 버튼 */}
        <TouchableOpacity 
          style={[styles.quotesButton, { backgroundColor: theme.primary }]} 
          onPress={handleViewQuotes}
        >
          <Text style={styles.quotesButtonText}>💌 오늘의 명언 보기 ▶️</Text>
        </TouchableOpacity>

        {/* 홈으로 버튼 */}
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>⬅ 홈으로</Text>
        </TouchableOpacity>

        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',      // 웹에서 전체 화면 높이 보장
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,       // 하단 여백 추가
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  timeGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  emotionDisplay: {
    alignItems: 'center',
  },
  emotionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emotionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  analysisText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  userTextContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
  },
  userTextLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
  },
  recommendationText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    flex: 1,
  },
  quotesButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  quotesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  homeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default DailyReportScreen;