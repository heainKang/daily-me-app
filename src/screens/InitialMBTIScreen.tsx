import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { INITIAL_MBTI_QUESTIONS } from '../utils/questions';
import { calculateMBTIScores, scoreToMBTI } from '../utils/mbtiAnalysis';
import { getUserProfile, saveUserProfile } from '../utils/storage';
import { QuestionResponse } from '../types';

type InitialMBTIScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InitialMBTI'>;

interface Props {
  navigation: InitialMBTIScreenNavigationProp;
}

const InitialMBTIScreen: React.FC<Props> = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = INITIAL_MBTI_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === INITIAL_MBTI_QUESTIONS.length - 1;

  console.log(`Question ${currentQuestionIndex + 1}/${INITIAL_MBTI_QUESTIONS.length}, isLastQuestion: ${isLastQuestion}`);
  console.log('Current question:', currentQuestion?.text);

  const handleOptionSelect = async (option: 'A' | 'B') => {
    if (isLoading) {
      console.log('Already processing, ignoring click');
      return; // 이미 처리 중이면 무시
    }

    setIsLoading(true); // 즉시 로딩 상태로 설정
    console.log(`Selected option ${option} for question ${currentQuestionIndex + 1}`);
    
    const newResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      selectedOption: option,
      timestamp: new Date(),
      timeSlot: currentQuestion.timeSlot,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    
    console.log(`Total responses so far: ${updatedResponses.length}`);
    console.log(`Is last question: ${isLastQuestion}`);

    if (isLastQuestion) {
      console.log('Last question reached, finalizing MBTI...');
      // 모든 질문 완료 - MBTI 계산 및 저장
      await finalizeMBTI(updatedResponses);
    } else {
      console.log('Moving to next question...');
      // 짧은 피드백 후 다음 질문으로 이동
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        console.log(`Setting question index to ${nextIndex}`);
        setCurrentQuestionIndex(nextIndex);
        setIsLoading(false); // 로딩 해제
      }, 300); // 0.3초 후 다음 질문으로
    }
  };

  const finalizeMBTI = async (finalResponses: QuestionResponse[]) => {
    setIsLoading(true);
    
    try {
      console.log('Finalizing MBTI with responses:', finalResponses);
      
      // MBTI 계산
      const scores = calculateMBTIScores(finalResponses);
      const mbtiType = scoreToMBTI(scores);
      
      console.log('Calculated MBTI type:', mbtiType);

      // 사용자 프로필 업데이트
      const profile = await getUserProfile();
      profile.baseMBTI = mbtiType;
      profile.isBaseMBTISet = true;
      await saveUserProfile(profile);
      
      console.log('Profile saved successfully');

      // 결과 표시 - 웹에서 Alert가 문제일 수 있으므로 직접 네비게이션
      console.log('MBTI calculation completed, navigating to Home');
      
      // Alert 대신 즉시 홈으로 이동 (나중에 결과는 홈에서 보여줄 수 있음)
      setTimeout(() => {
        console.log('Navigating to Home screen after delay');
        navigation.replace('Home');
      }, 500);

      // 임시로 alert 사용 (웹에서 작동 확인용)
      alert(`당신의 MBTI: ${mbtiType}\n\n홈 화면으로 이동합니다.`);
    } catch (error) {
      console.error('Error saving MBTI:', error);
      Alert.alert('오류', `설정 저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'MBTI 설정 건너뛰기',
      '나중에 언제든지 MBTI를 설정할 수 있습니다. 계속하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '건너뛰기',
          onPress: async () => {
            try {
              const profile = await getUserProfile();
              profile.baseMBTI = 'UNSET'; // 미설정 상태로 표시
              profile.isBaseMBTISet = true;
              await saveUserProfile(profile);
              navigation.replace('Home');
            } catch (error) {
              console.error('Error skipping MBTI:', error);
            }
          },
        },
      ]
    );
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>질문을 불러올 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / INITIAL_MBTI_QUESTIONS.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {INITIAL_MBTI_QUESTIONS.length}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.optionA,
              isLoading && styles.optionButtonDisabled
            ]}
            onPress={() => handleOptionSelect('A')}
            disabled={isLoading}
          >
            <Text style={[styles.optionLabel, isLoading && styles.optionLabelDisabled]}>
              {isLoading ? '✓' : 'A'}
            </Text>
            <Text style={[styles.optionText, isLoading && styles.optionTextDisabled]}>
              {currentQuestion.optionA.text}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.optionB,
              isLoading && styles.optionButtonDisabled
            ]}
            onPress={() => handleOptionSelect('B')}
            disabled={isLoading}
          >
            <Text style={[styles.optionLabel, isLoading && styles.optionLabelDisabled]}>
              {isLoading ? '✓' : 'B'}
            </Text>
            <Text style={[styles.optionText, isLoading && styles.optionTextDisabled]}>
              {currentQuestion.optionB.text}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          더 가까운 선택지를 골라주세요
        </Text>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>MBTI 분석 중...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    minHeight: '100vh',      // 웹에서 전체 화면 높이 보장
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    
    paddingVertical: 20,
  },
  optionButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionA: {
    borderColor: '#f59e0b',
  },
  optionB: {
    borderColor: '#06b6d4',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  optionButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    opacity: 0.7,
  },
  optionLabelDisabled: {
    color: '#10b981',
  },
  optionTextDisabled: {
    color: '#94a3b8',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    marginTop: 20,
    marginBottom: 40,
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

export default InitialMBTIScreen;