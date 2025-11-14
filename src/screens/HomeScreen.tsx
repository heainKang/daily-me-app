// 📱 HomeScreen.tsx - 메인 홈 화면 컴포넌트
// 사용자가 일일 감정을 입력하고 즉시 분석을 시작하는 중심 화면

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,        // 📦 기본 컨테이너 컴포넌트
  Text,        // 📝 텍스트 표시 컴포넌트  
  StyleSheet,  // 🎨 스타일 정의를 위한 객체
  TouchableOpacity, // 👆 터치 가능한 버튼 컴포넌트
  SafeAreaView,     // 📱 안전 영역(노치, 홈바 피함) 컴포넌트
  ScrollView,       // 📜 스크롤 가능한 컨테이너 컴포넌트
  TextInput,        // ⌨️ 텍스트 입력 컴포넌트
  Alert,            // 🚨 알림 다이얼로그 컴포넌트
  Dimensions,       // 📏 화면 크기 정보 가져오는 API
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';  // 🗺️ 스택 네비게이션 타입
import { useFocusEffect } from '@react-navigation/native';      // 🔄 화면 포커스 이벤트 훅
import { RootStackParamList } from '../navigation/AppNavigator'; // 🗺️ 네비게이션 타입 정의
import { 
  getUserProfile,     // 👤 사용자 프로필 가져오기
  getTodayResponses,  // 📅 오늘의 응답들 가져오기
  getDailyAnalysis,   // 📊 일일 분석 데이터 가져오기
  saveResponse,       // 💾 응답 저장하기
  saveDailyAnalysis   // 💾 분석 결과 저장하기
} from '../utils/storage';
import { performDailyAnalysis } from '../utils/mbtiAnalysis'; // 🧠 MBTI 분석 로직
import { UserProfile, DailyAnalysis, QuestionResponse } from '../types'; // 📋 타입 정의들

// 🗺️ 네비게이션 타입 정의 - Home 화면에서 사용할 네비게이션 프로퍼티
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// 📋 컴포넌트 Props 인터페이스 - navigation 객체를 받아서 화면 이동에 사용
interface Props {
  navigation: HomeScreenNavigationProp; // 🗺️ 다른 화면으로 이동하기 위한 네비게이션 객체
}

// 😊 감정 타입 정의 - 사용자가 선택할 수 있는 5가지 기분 상태
type EmotionType = 'great' | 'good' | 'normal' | 'sad' | 'tired';

// 🎨 감정별 UI 데이터 배열 - 각 감정마다 이모지, 라벨, 색상을 정의
const emotions = [
  { id: 'great', emoji: '😊', label: '좋음', color: '#10b981' },     // 💚 행복 - 초록색 (에메랄드)
  { id: 'good', emoji: '🙂', label: '괜찮음', color: '#06b6d4' },    // 💙 좋음 - 파란색 (시안)
  { id: 'normal', emoji: '😐', label: '평범', color: '#6b7280' },   // 🩶 평범 - 회색 (중성)
  { id: 'sad', emoji: '😢', label: '우울', color: '#8b5cf6' },      // 💜 우울 - 보라색 (바이올렛)
  { id: 'tired', emoji: '😴', label: '피곤', color: '#f59e0b' },    // 💛 피곤 - 주황색 (앰버)
];

// 🏠 메인 홈 화면 컴포넌트 - React Functional Component 
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // 📊 상태 관리 - React useState 훅들을 사용해서 컴포넌트 상태 관리
  
  // 👤 사용자 프로필 상태 - MBTI 정보와 기본 설정들을 저장
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // 📈 오늘의 분석 결과 상태 - 감정 분석 완료 후 결과를 저장
  const [todayAnalysis, setTodayAnalysis] = useState<DailyAnalysis | null>(null);
  
  // 😊 선택된 감정 상태 - 사용자가 선택한 현재 기분 (5가지 중 하나)
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  
  // 💬 감정 텍스트 상태 - 사용자가 입력한 추가 설명 텍스트
  const [emotionText, setEmotionText] = useState('');
  
  // ⏳ 로딩 상태 - 데이터를 불러오는 동안 로딩 UI 표시용
  const [isLoading, setIsLoading] = useState(true);
  
  // 📤 제출 중 상태 - 감정 데이터를 저장하고 분석하는 동안 버튼 비활성화용
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ 오늘 제출 완료 상태 - 하루에 한 번만 감정 입력하도록 제한하는 플래그
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // 🔄 화면 포커스 이펙트 - 사용자가 이 화면에 들어올 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadData(); // 🔃 데이터 로딩 함수 호출
    }, []) // 🔒 빈 의존성 배열 = 마운트시에만 실행
  );

  // 📥 데이터 로딩 함수 - 화면에 필요한 모든 데이터를 비동기로 가져오는 함수
  const loadData = async () => {
    try {
      setIsLoading(true); // ⏳ 로딩 시작
      
      // 👤 사용자 프로필 로드 - MBTI 정보와 기본 설정 가져오기
      const profile = await getUserProfile();
      setUserProfile(profile);

      // 📅 오늘 날짜 문자열 생성 - YYYY-MM-DD 형식으로 변환
      const today = new Date().toISOString().split('T')[0];
      
      // 📊 오늘의 분석 결과 로드 - 이미 분석이 완료되었다면 가져오기
      const analysis = await getDailyAnalysis(today);
      setTodayAnalysis(analysis);

      // ✅ 오늘 이미 감정을 기록했는지 확인 - 중복 입력 방지
      const responses = await getTodayResponses();
      const hasEmotion = responses.some(r => r.emotionType); // 감정타입이 있는 응답 찾기
      setHasSubmittedToday(hasEmotion);

      // 🔄 이미 기록한 감정이 있다면 UI에 표시 - 사용자가 뭘 선택했는지 보여주기
      if (hasEmotion && responses.length > 0) {
        const lastResponse = responses[responses.length - 1]; // 가장 최근 응답
        setSelectedEmotion(lastResponse.emotionType || null);  // 선택한 감정 복원
        setEmotionText(lastResponse.emotionText || '');        // 입력한 텍스트 복원
      }

    } catch (error) {
      console.error('Error loading data:', error); // 🚨 에러 로깅
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.'); // 사용자에게 에러 알림
    } finally {
      setIsLoading(false); // ⏳ 로딩 종료 (성공/실패 무관하게)
    }
  };

  // ⏰ 현재 시간대 판별 함수 - 현재 시간에 따라 아침/점심/저녁 구분
  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours(); // 현재 시간 (24시간 형식)
    if (hour >= 6 && hour < 12) return 'morning';      // 🌅 오전 6시~12시 = 아침
    else if (hour >= 12 && hour < 18) return 'afternoon'; // ☀️ 오후 12시~6시 = 점심
    else return 'evening';                             // 🌙 오후 6시~오전 6시 = 저녁
  };

  // 👋 시간대별 인사말 생성 함수 - 현재 시간에 맞는 친근한 인사말 반환
  const getTimeGreeting = () => {
    const timeSlot = getCurrentTimeSlot();
    switch (timeSlot) {
      case 'morning':
        return '🌅 좋은 아침이에요!';    // 아침 인사
      case 'afternoon':
        return '☀️ 좋은 오후예요!';     // 점심 인사
      case 'evening':
        return '🌙 오늘도 수고하셨어요!'; // 저녁 인사
      default:
        return '💭 안녕하세요!';        // 기본 인사
    }
  };

  // 😊 메인 인사말 생성 함수 - 사용자의 MBTI 타입을 포함한 개인화된 인사말
  const getMainGreeting = () => {
    // 🧠 사용자 MBTI 가져오기 (없으면 빈 문자열)
    const userName = userProfile?.baseMBTI ? `${userProfile.baseMBTI}` : '';
    return `안녕하세요${userName ? ', ' + userName + '님' : ''}! `; // MBTI 있으면 "안녕하세요, ENFP님!" 형태
  };

  // 👆 감정 선택 핸들러 함수 - 사용자가 감정 버튼을 눌렀을 때 실행
  const handleEmotionSelect = (emotionId: EmotionType) => {
    // ✅ 오늘 이미 제출했다면 선택 불가 (하루 한 번 제한)
    if (!hasSubmittedToday) {
      setSelectedEmotion(emotionId); // 선택한 감정 상태 업데이트
    }
  };

  // 📤 감정 제출 핸들러 함수 - 사용자가 "분석 시작" 버튼을 눌렀을 때 실행되는 메인 로직
  const handleSubmit = async () => {
    // ✅ 유효성 검사 - 감정이 선택되지 않았다면 알림 후 종료
    if (!selectedEmotion) {
      Alert.alert('감정 선택', '오늘 기분을 선택해주세요.');
      return;
    }

    setIsSubmitting(true); // 📤 제출 중 상태 활성화 (버튼 비활성화용)

    try {
      // 🔄 감정을 기존 시스템과 호환되는 A/B 선택으로 매핑
      // 긍정적 감정(great, good) = A, 부정적 감정(normal, sad, tired) = B
      const selectedOption = ['great', 'good'].includes(selectedEmotion) ? 'A' : 'B';
      
      // 📝 응답 객체 생성 - 데이터베이스에 저장할 구조체
      const response: QuestionResponse = {
        questionId: `emotion_${new Date().toISOString().split('T')[0]}`, // 고유 ID (날짜 기반)
        selectedOption,        // A/B 선택 (기존 시스템 호환용)
        timestamp: new Date(), // 📅 현재 시간 타임스탬프
        timeSlot: getCurrentTimeSlot() as any, // ⏰ 현재 시간대 (morning/afternoon/evening)
        emotionType: selectedEmotion,          // 😊 선택한 감정 타입 (새로운 시스템)
        emotionText: emotionText.trim(),       // 💬 사용자가 입력한 추가 텍스트 (공백 제거)
      };

      // 💾 응답 데이터를 로컬 스토리지에 저장
      await saveResponse(response);

      // 🧠 일일 분석 수행 - MBTI + 감정 데이터를 기반으로 개인화된 피드백 생성
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 문자열
      const analysis = performDailyAnalysis(
        today,                           // 📅 분석 날짜
        [response],                      // 📋 오늘의 응답 배열 (현재는 하나)
        userProfile?.baseMBTI || null    // 🧠 기본 MBTI 타입 (없으면 null)
      );

      // 💾 분석 결과를 로컬 스토리지에 저장
      await saveDailyAnalysis(analysis);
      setTodayAnalysis(analysis);     // 상태 업데이트로 UI에 반영
      setHasSubmittedToday(true);     // 오늘 제출 완료 플래그 설정

      // 🎉 성공 알림 및 결과 화면 이동 옵션 제공
      Alert.alert(
        '분석 완료! 🎉',
        '오늘의 감정이 기록되고 분석되었습니다.',
        [
          {
            text: '분석 보기',
            onPress: () => {
              // 🗺️ 분석 결과 화면으로 이동 (오늘 날짜 파라미터와 함께)
              navigation.navigate('DailyReport', { date: today });
            },
          },
          {
            text: '확인',      // 홈에 머물기
            style: 'cancel',   // 취소 스타일 (회색 버튼)
          },
        ]
      );

    } catch (error) {
      console.error('Error saving emotion:', error); // 🚨 에러 로깅
      Alert.alert('오류', '감정 기록 중 오류가 발생했습니다.'); // 사용자에게 에러 알림
    } finally {
      setIsSubmitting(false); // 📤 제출 중 상태 해제 (성공/실패 무관하게)
    }
  };

  // 📊 분석 결과 보기 핸들러 - 오늘의 분석 결과 화면으로 이동
  const handleViewReport = () => {
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    navigation.navigate('DailyReport', { date: today });  // 🗺️ 결과 화면으로 이동
  };

  // 📅 히스토리 보기 핸들러 - 지난 감정 기록들을 볼 수 있는 화면 (준비 중)
  const handleViewHistory = () => {
    // TODO: 히스토리 화면 구현 후 navigation.navigate('History') 로 변경
    Alert.alert('준비중', '감정 히스토리 기능을 준비 중입니다.');
  };

  // ⏳ 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🖼️ 메인 UI 렌더링 - 감정 입력 화면
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={true}               // 스크롤바 표시로 스크롤 가능 여부 확인
        contentContainerStyle={{ 
          flexGrow: 1,                                    // 콘텐츠가 화면을 가득 채우도록
          paddingBottom: 50                               // 하단 여백
        }}
        nestedScrollEnabled={true}                        // 중첩 스크롤 허용
        keyboardShouldPersistTaps="handled"               // 키보드 관련 터치 처리
      >
        {/* 👋 헤더 영역 - 시간대별 인사말과 날짜 표시 */}
        <View style={styles.header}>
          <Text style={styles.timeGreeting}>{getTimeGreeting()}</Text>
          <Text style={styles.mainGreeting}>{getMainGreeting()}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>
        </View>

        {/* 메인 감정 입력 카드 */}
        <View style={styles.emotionCard}>
          <Text style={styles.questionTitle}>
            {hasSubmittedToday ? '오늘 기록한 감정' : '오늘 기분은 어떤가요?'}
          </Text>

          <View style={styles.emotionsGrid}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.emotionButton,
                  selectedEmotion === emotion.id && [
                    styles.emotionButtonSelected,
                    { borderColor: emotion.color }
                  ],
                  hasSubmittedToday && styles.emotionButtonDisabled
                ]}
                onPress={() => handleEmotionSelect(emotion.id as EmotionType)}
                disabled={hasSubmittedToday}
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

          {!hasSubmittedToday && (
            <>
              <View style={styles.textInputContainer}>
                <Text style={styles.textInputLabel}>
                  💬 오늘 하루를 한마디로 표현한다면?
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="예: 오늘은 새로운 시작 같은 하루였어요..."
                  placeholderTextColor="#9ca3af"
                  value={emotionText}
                  onChangeText={(text) => {
                    // 💬 웹에서 실시간 업데이트 보장을 위해 강제 리렌더링
                    if (text.length <= 100) {
                      setEmotionText(text);
                    }
                  }}
                  multiline
                  maxLength={100}
                  editable={!isSubmitting}
                  // 🌐 웹 전용 속성들 추가
                  autoComplete="off"
                  autoCorrect={false}
                  spellCheck={false}
                />
                <Text style={styles.textInputCounter}>
                  {emotionText.length}/100
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  selectedEmotion && styles.submitButtonActive,
                  isSubmitting && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!selectedEmotion || isSubmitting}
              >
                <Text style={[
                  styles.submitButtonText,
                  selectedEmotion && styles.submitButtonTextActive
                ]}>
                  {isSubmitting ? '분석 중...' : '▶️ 분석 시작'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {hasSubmittedToday && emotionText && (
            <View style={styles.submittedTextContainer}>
              <Text style={styles.submittedTextLabel}>오늘의 한마디:</Text>
              <Text style={styles.submittedText}>"{emotionText}"</Text>
            </View>
          )}
        </View>

        {/* 분석 결과 카드 (있을 때만) */}
        {hasSubmittedToday && todayAnalysis && (
          <TouchableOpacity style={styles.resultCard} onPress={handleViewReport}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>📊 오늘의 분석 결과</Text>
              <Text style={styles.resultArrow}>👉</Text>
            </View>
            <Text style={styles.resultPreview} numberOfLines={2}>
              {todayAnalysis.feedback.slice(0, 60)}...
            </Text>
          </TouchableOpacity>
        )}

        {/* 히스토리 버튼 */}
        <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
          <Text style={styles.historyButtonText}>📅 지난 감정 보기</Text>
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
    backgroundColor: '#f8fafc',
    minHeight: '100vh',    // 웹에서 전체 화면 높이 보장
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,        // 상단 패딩 추가
    paddingBottom: 100,    // 하단 패딩 대폭 증가
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  timeGreeting: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 4,
  },
  mainGreeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  emotionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    // 🌐 웹 호환 shadow 스타일
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  emotionButton: {
    width: (width - 120) / 3,
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emotionButtonSelected: {
    borderWidth: 3,
    backgroundColor: '#ffffff',
  },
  emotionButtonDisabled: {
    opacity: 0.6,
  },
  emotionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  textInputContainer: {
    marginBottom: 24,
  },
  textInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  textInputCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6b7280',     // 좀 더 진한 회색으로 변경
    marginTop: 6,         // 간격 조정
    fontWeight: '500',    // 가중치 추가로 더 선명하게
    backgroundColor: 'transparent', // 배경 명시적 지정
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
  submittedTextContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
  },
  submittedTextLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  submittedText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  resultCard: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultArrow: {
    fontSize: 14,
    color: '#c7d2fe',
  },
  resultPreview: {
    fontSize: 14,
    color: '#c7d2fe',
    lineHeight: 20,
  },
  historyButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  bottomSpacing: {
    height: 80,  // 하단 여백을 두 배로 증가 (작은 화면에서 스크롤 여유 공간 확보)
  },
});

export default HomeScreen;