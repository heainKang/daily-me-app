import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ALL_QUOTES } from '../utils/quotes';
import { saveResponse, getUserProfile, getTodayResponses } from '../utils/storage';
import { performDailyAnalysis } from '../utils/mbtiAnalysis';
import { saveDailyAnalysis } from '../utils/storage';
import { QuestionResponse } from '../types';
import { Quote } from '../utils/quotes';

type QuestionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Question'>;
type QuestionScreenRouteProp = RouteProp<RootStackParamList, 'Question'>;

interface Props {
  navigation: QuestionScreenNavigationProp;
  route: QuestionScreenRouteProp;
}

const QuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { questionId, timeSlot } = route.params;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 명언 찾기
    const foundQuote = ALL_QUOTES.find(q => q.id === questionId);
    setQuote(foundQuote || null);
  }, [questionId]);

  const handleOptionSelect = async (option: 'positive' | 'negative') => {
    if (!quote) return;

    setIsLoading(true);

    try {
      // 응답 저장 (A/B를 positive/negative로 매핑)
      const response: QuestionResponse = {
        questionId: quote.id,
        selectedOption: option === 'positive' ? 'A' : 'B',
        timestamp: new Date(),
        timeSlot: quote.category,
      };

      await saveResponse(response);

      // 오늘의 모든 응답 확인
      const todayResponses = await getTodayResponses();
      
      // 3개 질문을 모두 완료했는지 확인
      if (todayResponses.length === 3) {
        // 일일 분석 수행
        const profile = await getUserProfile();
        const today = new Date().toISOString().split('T')[0];
        
        const analysis = performDailyAnalysis(
          today,
          todayResponses,
          profile.baseMBTI
        );

        await saveDailyAnalysis(analysis);

        // 완료 메시지
        Alert.alert(
          '오늘 분석 완료! 🎉',
          `당신의 오늘은 ${analysis.dominantType} 성향이었어요!\n\n자세한 분석을 확인해보세요.`,
          [
            {
              text: '분석 보기',
              onPress: () => {
                navigation.replace('DailyReport', { date: today });
              },
            },
            {
              text: '나중에',
              onPress: () => {
                navigation.navigate('Home');
              },
              style: 'cancel',
            },
          ]
        );
      } else {
        // 아직 완료되지 않음
        Alert.alert(
          '답변 완료! ✅',
          '답변이 저장되었습니다.',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }

    } catch (error) {
      console.error('Error saving response:', error);
      Alert.alert('오류', '답변 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!quote) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>명언을 찾을 수 없습니다.</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getTimeSlotLabel = (timeSlot: string) => {
    switch (timeSlot) {
      case 'morning': return '🌅 아침 명언';
      case 'afternoon': return '☀️ 점심 명언';
      case 'evening': return '🌙 저녁 명언';
      default: return '💭 명언';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeSlotLabel}>
          {getTimeSlotLabel(quote.category)}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{quote.text}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.optionA]}
            onPress={() => handleOptionSelect('positive')}
            disabled={isLoading}
          >
            <View style={styles.optionHeader}>
              <Text style={[styles.optionLabel, { color: '#10b981' }]}>😊</Text>
            </View>
            <Text style={styles.optionText}>공감돼요</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.optionB]}
            onPress={() => handleOptionSelect('negative')}
            disabled={isLoading}
          >
            <View style={styles.optionHeader}>
              <Text style={[styles.optionLabel, { color: '#6b7280' }]}>😐</Text>
            </View>
            <Text style={styles.optionText}>별로예요</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          이 명언에 대한 당신의 느낌은?
        </Text>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>저장 중...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  timeSlotLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  questionText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 36,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#e2e8f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  optionA: {
    borderColor: '#fed7aa',
  },
  optionB: {
    borderColor: '#a7f3d0',
  },
  optionHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    lineHeight: 40,
  },
  optionText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuestionScreen;