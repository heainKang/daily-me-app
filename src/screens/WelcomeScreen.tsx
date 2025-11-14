// 🎉 WelcomeScreen.tsx - 앱을 처음 실행했을 때 보여지는 환영 화면
// 사용자가 처음 앱을 설치했는지, 이미 설정을 완료했는지 확인하는 역할도 합니다

// 📚 필요한 React Native 컴포넌트들과 라이브러리 가져오기
import React, { useEffect, useState } from 'react'; // ⚛️ React 기본 함수들
import {
  View,          // 📦 레이아웃 컨테이너 (div 같은 역할)
  Text,          // 📝 텍스트 표시 컴포넌트
  StyleSheet,    // 🎨 스타일 정의를 위한 도구
  TouchableOpacity, // 👆 터치 가능한 버튼 컴포넌트
  SafeAreaView,  // 📱 안전한 화면 영역 (노치, 홈바 피하기)
  Dimensions,    // 📐 화면 크기 정보를 가져오는 도구
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';     // 🗺️ 네비게이션 타입 정의
import { RootStackParamList } from '../navigation/AppNavigator';   // 🗂️ 우리 앱의 화면 목록
import { getUserProfile } from '../utils/storage';                 // 💾 사용자 정보 가져오기 함수

// 🗂️ TypeScript 타입 정의: 이 화면에서 사용할 네비게이션의 타입
type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

// 🧩 Props: 이 컴포넌트가 받을 데이터의 형태 정의
interface Props {
  navigation: WelcomeScreenNavigationProp; // 🗺️ 화면 이동을 위한 네비게이션 객체
}

// 🎯 WelcomeScreen 컴포넌트 정의
const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  // 📊 상태(state) 정의: 로딩 중인지를 나타내는 변수
  const [isLoading, setIsLoading] = useState(true); // 처음엔 로딩 중(true)으로 시작

  // 🔄 useEffect: 컴포넌트가 화면에 나타날 때 실행되는 함수
  useEffect(() => {
    checkUserProfile(); // 사용자 프로필 확인 함수 실행
  }, []); // [] = 처음 한 번만 실행

  // 👤 사용자 프로필 확인 함수 (비동기 함수 - async/await 사용)
  const checkUserProfile = async () => {
    try {
      // 💾 폰에 저장된 사용자 프로필 정보를 가져옴
      const profile = await getUserProfile();
      setIsLoading(false); // 로딩 완료
      
      // ✅ 이미 MBTI 설정을 완료한 사용자라면
      if (profile.isBaseMBTISet) {
        // 🏠 바로 홈 화면으로 이동 (replace = 뒤로가기 버튼으로 돌아올 수 없음)
        navigation.replace('Home');
      }
      // 아니라면 환영 화면을 계속 보여줌
    } catch (error) {
      // 🚨 오류 발생시 콘솔에 오류 메시지 출력
      console.error('Error checking user profile:', error);
      setIsLoading(false); // 오류가 나도 로딩은 끝냄
    }
  };

  // ▶️ "시작하기" 버튼을 눌렀을 때 실행되는 함수
  const handleStart = () => {
    // 🧠 MBTI 설정 화면으로 이동
    navigation.navigate('InitialMBTI');
  };

  // 🔄 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🎨 실제 환영 화면 UI 렌더링
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* 🎉 상단 헤더 영역 */}
        <View style={styles.header}>
          <Text style={styles.title}>오늘의 나는</Text>
          <Text style={styles.subtitle}>하루 3번의 질문으로{'\n'}나를 더 알아가는 시간</Text>
        </View>

        {/* ⏰ 질문 시간 안내 섹션 */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌅</Text>
            <Text style={styles.featureText}>아침 9시</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>☀️</Text>
            <Text style={styles.featureText}>점심 12시</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌙</Text>
            <Text style={styles.featureText}>저녁 6시</Text>
          </View>
        </View>

        {/* 📖 앱 설명 섹션 */}
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            매일 3번의 간단한 선택으로{'\n'}
            당신의 MBTI 성향과 감정 변화를 분석하여{'\n'}
            개인 맞춤 피드백과 추천을 제공합니다
          </Text>
        </View>

        {/* ▶️ 시작하기 버튼 */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>

        {/* 🔒 개인정보 보호 안내 */}
        <Text style={styles.footer}>
          모든 데이터는 당신의 기기에만 안전하게 저장됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

// 📐 화면 크기 정보 가져오기 (필요한 경우 사용)
const { width, height } = Dimensions.get('window');

// 🎨 스타일 정의 (CSS와 비슷하지만 camelCase 사용)
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // 전체 화면 차지
    backgroundColor: '#f8fafc', // 연한 회색 배경
    minHeight: '100vh',         // 웹에서 전체 화면 높이 보장
  },
  content: {
    flex: 1,                    // 전체 높이 차지
    paddingHorizontal: 24,      // 좌우 여백 24px
    paddingVertical: 40,        // 위아래 여백 40px
    justifyContent: 'space-between', // 요소들을 균등하게 분배
    minHeight: '90vh',          // 최소 화면 높이 보장
  },
  header: {
    alignItems: 'center',       // 가로 중앙 정렬
    marginTop: 60,              // 위쪽 여백
  },
  title: {
    fontSize: 32,               // 큰 제목 글씨 크기
    fontWeight: 'bold',         // 굵은 글씨
    color: '#1e293b',           // 진한 회색
    marginBottom: 16,           // 아래쪽 여백
  },
  subtitle: {
    fontSize: 18,               // 부제목 글씨 크기
    color: '#64748b',           // 중간 회색
    textAlign: 'center',        // 가운데 정렬
    lineHeight: 26,             // 줄 높이 (줄 간격)
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  description: {
    alignItems: 'center',
    marginVertical: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)',
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default WelcomeScreen;