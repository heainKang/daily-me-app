// 📱 App.tsx - Daily Me 앱의 가장 최상위 컴포넌트
// 이 파일이 앱의 시작점입니다!

// 📚 필요한 라이브러리들을 가져오기 (import)
import React from 'react';                              // ⚛️ React: UI를 만들기 위한 핵심 라이브러리
import { StatusBar } from 'expo-status-bar';           // 📶 StatusBar: 화면 상단 상태바 관리
import { View, StyleSheet } from 'react-native';       // 📦 기본 컴포넌트들
import AppNavigator from './src/navigation/AppNavigator'; // 🗺️ 우리가 만든 네비게이션 시스템

// 🎯 메인 App 컴포넌트 정의
// export default: 이 함수를 다른 파일에서 사용할 수 있게 내보냄
export default function App() {
  // 🔄 return: 화면에 보여줄 내용을 반환
  return (
    <View style={styles.appContainer}>
      {/* 🗺️ AppNavigator: 앱의 모든 화면들을 관리하는 네비게이션 시스템 */}
      <AppNavigator />
      
      {/* 📶 StatusBar: 화면 상단의 시간/배터리/신호 표시 영역 스타일 설정 */}
      <StatusBar style="dark" />
    </View>
  );
}

// 🎨 전체 앱 컨테이너 스타일 정의
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,                    // 전체 화면 차지
    minHeight: '100vh',         // 웹에서 전체 뷰포트 높이 보장
    backgroundColor: '#f8fafc', // 기본 배경색 설정
  },
});
