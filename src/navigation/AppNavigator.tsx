// 🗺️ AppNavigator.tsx - 앱의 모든 화면 이동을 관리하는 네비게이션 시스템
// 마치 웹사이트의 메뉴와 같은 역할을 합니다!

// 📚 필요한 라이브러리들 import
import React from 'react';                              // ⚛️ React 기본 라이브러리
import { NavigationContainer } from '@react-navigation/native';  // 🔗 네비게이션의 최상위 컨테이너
import { createStackNavigator } from '@react-navigation/stack';  // 📚 스택 형태의 화면 전환 (책 넘기기 같은)
import { MBTIPersonality } from '../types';            // 🧩 MBTI 타입 정의

// 🏠 앱의 모든 화면들을 가져오기
import WelcomeScreen from '../screens/WelcomeScreen';           // 🎉 환영 화면 (처음 시작)
import InitialMBTIScreen from '../screens/InitialMBTIScreen';   // 🧠 MBTI 설정 화면
import HomeScreen from '../screens/HomeScreen';                 // 🏠 메인 홈 화면
import QuestionScreen from '../screens/QuestionScreen';         // ❓ 질문 화면
import DailyReportScreen from '../screens/DailyReportScreen';   // 📊 일일 리포트 화면
import HistoryScreen from '../screens/HistoryScreen';           // 📅 감정 히스토리 화면
import QuoteOfTheDayScreen from '../screens/QuoteOfTheDayScreen'; // ✨ 오늘의 명언 화면

// 🗂️ TypeScript 타입 정의: 각 화면에 전달할 수 있는 데이터 형태를 정의
export type RootStackParamList = {
  Welcome: undefined;        // 환영 화면 - 데이터 전달 안함
  InitialMBTI: undefined;    // MBTI 설정 화면 - 데이터 전달 안함
  Home: undefined;           // 홈 화면 - 데이터 전달 안함
  Question: {                // 질문 화면 - 아래 데이터들을 전달해야 함
    questionId: string;      // 질문 ID
    timeSlot: 'morning' | 'afternoon' | 'evening'; // 시간대 (아침/점심/저녁)
    from?: 'QuoteOfTheDay';  // 어디서 온 화면인지 (옵션)
  };
  DailyReport: {             // 일일 리포트 화면 - 아래 데이터를 전달해야 함
    date: string;            // 날짜 정보
  };
  History: undefined;        // 감정 히스토리 화면 - 데이터 전달 안함
  QuoteOfTheDay: undefined;  // 오늘의 명언 화면 - 데이터 전달 안함
};

// 📚 스택 네비게이터 생성 (화면을 책처럼 쌓아서 관리)
const Stack = createStackNavigator<RootStackParamList>();

// 🎯 AppNavigator 컴포넌트 정의
const AppNavigator = () => {
  // 🔄 화면에 보여줄 네비게이션 구조를 return
  return (
    // 🔗 NavigationContainer: 모든 네비게이션을 감싸는 최상위 컨테이너
    <NavigationContainer>
      {/* 📚 Stack.Navigator: 스택 방식으로 화면들을 관리 */}
      <Stack.Navigator
        initialRouteName="Welcome"  // 🏠 앱 시작시 보여줄 첫 화면
        screenOptions={{
          // 🎨 모든 화면에 적용될 기본 헤더 스타일
          headerStyle: {
            backgroundColor: '#6366f1',  // 💜 헤더 배경색 (보라색)
          },
          headerTintColor: '#fff',       // ⚪ 헤더 텍스트 색상 (흰색)
          headerTitleStyle: {
            fontWeight: 'bold',          // 🔖 헤더 제목을 굵게
          },
        }}
      >
        {/* 🎉 환영 화면 - 첫 시작 화면 */}
        <Stack.Screen 
          name="Welcome"                 // 화면 이름 (네비게이션에서 사용)
          component={WelcomeScreen}      // 실제 보여줄 컴포넌트
          options={{ headerShown: false }} // 헤더 숨기기 (환영화면에는 헤더 불필요)
        />
        
        {/* 🧠 MBTI 설정 화면 */}
        <Stack.Screen 
          name="InitialMBTI" 
          component={InitialMBTIScreen}
          options={{ title: 'MBTI 설정' }}  // 헤더에 표시될 제목
        />
        
        {/* 🏠 메인 홈 화면 */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '오늘의 나는' }}  // 헤더 제목
        />
        
        {/* ❓ 질문 화면 */}
        <Stack.Screen 
          name="Question" 
          component={QuestionScreen}
          options={{ title: '질문' }}
        />
        
        {/* 📊 일일 리포트 화면 */}
        <Stack.Screen
          name="DailyReport"
          component={DailyReportScreen}
          options={{ title: '일일 리포트' }}
        />

        {/* 📅 감정 히스토리 화면 */}
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: '감정 히스토리' }}
        />

        {/* ✨ 오늘의 명언 화면 */}
        <Stack.Screen
          name="QuoteOfTheDay"
          component={QuoteOfTheDayScreen}
          options={{ title: '오늘의 명언' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;