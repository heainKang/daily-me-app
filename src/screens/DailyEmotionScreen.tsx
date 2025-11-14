import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { saveResponse, getUserProfile, getTodayResponses } from '../utils/storage';
import { performDailyAnalysis } from '../utils/mbtiAnalysis';
import { saveDailyAnalysis } from '../utils/storage';
import { QuestionResponse } from '../types';

type DailyEmotionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DailyEmotion'>;

interface Props {
  navigation: DailyEmotionScreenNavigationProp;
}

type EmotionType = 'great' | 'good' | 'normal' | 'sad' | 'tired';

const emotions = [
  { id: 'great', emoji: '😊', label: '좋음', color: '#10b981' },
  { id: 'good', emoji: '🙂', label: '괜찮음', color: '#06b6d4' },
  { id: 'normal', emoji: '😐', label: '평범', color: '#6b7280' },
  { id: 'sad', emoji: '😢', label: '우울', color: '#8b5cf6' },
  { id: 'tired', emoji: '😴', label: '피곤', color: '#f59e0b' },
];

const DailyEmotionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [emotionText, setEmotionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    else if (hour >= 12 && hour < 18) return 'afternoon';
    else return 'evening';
  };

  const handleEmotionSelect = (emotionId: EmotionType) => {
    setSelectedEmotion(emotionId);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      Alert.alert('감정 선택', '오늘 기분을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 감정을 A/B 선택으로 매핑 (분석을 위해)
      const selectedOption = ['great', 'good'].includes(selectedEmotion) ? 'A' : 'B';
      
      const response: QuestionResponse = {
        questionId: `emotion_${new Date().toISOString().split('T')[0]}`,
        selectedOption,
        timestamp: new Date(),
        timeSlot: getCurrentTimeSlot() as any,
        emotionType: selectedEmotion,
        emotionText: emotionText.trim(),
      };

      await saveResponse(response);

      // 일일 분석 수행
      const profile = await getUserProfile();
      const today = new Date().toISOString().split('T')[0];
      
      const analysis = performDailyAnalysis(
        today,
        [response],
        profile.baseMBTI
      );

      await saveDailyAnalysis(analysis);

      // 결과 화면으로 이동
      Alert.alert(
        '기록 완료! 🎉',
        '오늘의 감정이 기록되었습니다.',
        [
          {
            text: '분석 보기',
            onPress: () => {
              navigation.replace('DailyReport', { date: today });
            },
          },
          {
            text: '홈으로',
            onPress: () => {
              navigation.navigate('Home');
            },
            style: 'cancel',
          },
        ]
      );

    } catch (error) {
      console.error('Error saving emotion:', error);
      Alert.alert('오류', '감정 기록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeSlotGreeting = () => {
    const timeSlot = getCurrentTimeSlot();
    switch (timeSlot) {
      case 'morning':
        return '🌅 좋은 아침이에요!';
      case 'afternoon':
        return '☀️ 오후 잘 보내고 계신가요?';
      case 'evening':
        return '🌙 하루 수고하셨어요!';
      default:
        return '💭 안녕하세요!';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getTimeSlotGreeting()}</Text>
        <Text style={styles.question}>오늘 기분은 어떠신가요?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.emotionsGrid}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.emotionButton,
                selectedEmotion === emotion.id && [
                  styles.emotionButtonSelected,
                  { borderColor: emotion.color }
                ]
              ]}
              onPress={() => handleEmotionSelect(emotion.id as EmotionType)}
              disabled={isLoading}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={[
                styles.emotionLabel,
                selectedEmotion === emotion.id && { color: emotion.color }
              ]}>
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>
            더 자세히 얘기하고 싶다면? (선택사항)
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: 오늘은 회사에서 좋은 일이 있었어요..."
            placeholderTextColor="#9ca3af"
            value={emotionText}
            onChangeText={setEmotionText}
            multiline
            maxLength={200}
            editable={!isLoading}
          />
          <Text style={styles.textInputCounter}>
            {emotionText.length}/200
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedEmotion && styles.submitButtonActive,
            isLoading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedEmotion || isLoading}
        >
          <Text style={[
            styles.submitButtonText,
            selectedEmotion && styles.submitButtonTextActive
          ]}>
            {isLoading ? '기록 중...' : '오늘 감정 기록하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 8,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  emotionButton: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionButtonSelected: {
    borderWidth: 3,
    backgroundColor: '#f8fafc',
  },
  emotionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  textInputContainer: {
    marginBottom: 32,
  },
  textInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textInputCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#6366f1',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  submitButtonTextActive: {
    color: '#ffffff',
  },
});

export default DailyEmotionScreen;