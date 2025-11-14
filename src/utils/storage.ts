import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageData, UserProfile, DailyAnalysis, QuestionResponse } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  DAILY_ANALYSES: 'dailyAnalyses',
  RESPONSES: 'responses',
};

// 기본값들
const defaultUserProfile: UserProfile = {
  baseMBTI: null,
  isBaseMBTISet: false,
  createdAt: new Date(),
  totalResponses: 0,
  notificationsEnabled: true,
};

// 사용자 프로필 관리
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : defaultUserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return defaultUserProfile;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// 일일 분석 관리
export const getDailyAnalyses = async (): Promise<DailyAnalysis[]> => {
  try {
    const analyses = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_ANALYSES);
    return analyses ? JSON.parse(analyses) : [];
  } catch (error) {
    console.error('Error getting daily analyses:', error);
    return [];
  }
};

export const saveDailyAnalysis = async (analysis: DailyAnalysis): Promise<void> => {
  try {
    const analyses = await getDailyAnalyses();
    const existingIndex = analyses.findIndex(a => a.date === analysis.date);
    
    if (existingIndex >= 0) {
      analyses[existingIndex] = analysis;
    } else {
      analyses.push(analysis);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_ANALYSES, JSON.stringify(analyses));
  } catch (error) {
    console.error('Error saving daily analysis:', error);
    throw error;
  }
};

// 응답 관리
export const getResponses = async (): Promise<QuestionResponse[]> => {
  try {
    const responses = await AsyncStorage.getItem(STORAGE_KEYS.RESPONSES);
    return responses ? JSON.parse(responses) : [];
  } catch (error) {
    console.error('Error getting responses:', error);
    return [];
  }
};

export const saveResponse = async (response: QuestionResponse): Promise<void> => {
  try {
    const responses = await getResponses();
    responses.push(response);
    await AsyncStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
    
    // 사용자 프로필 응답 수 업데이트
    const profile = await getUserProfile();
    profile.totalResponses = responses.length;
    await saveUserProfile(profile);
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
};

// 오늘 날짜 응답 가져오기
export const getTodayResponses = async (): Promise<QuestionResponse[]> => {
  try {
    const responses = await getResponses();
    const today = new Date().toISOString().split('T')[0];
    return responses.filter(response => 
      new Date(response.timestamp).toISOString().split('T')[0] === today
    );
  } catch (error) {
    console.error('Error getting today responses:', error);
    return [];
  }
};

// 특정 날짜의 분석 가져오기
export const getDailyAnalysis = async (date: string): Promise<DailyAnalysis | null> => {
  try {
    const analyses = await getDailyAnalyses();
    return analyses.find(analysis => analysis.date === date) || null;
  } catch (error) {
    console.error('Error getting daily analysis:', error);
    return null;
  }
};

// 데이터 초기화 (개발용)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};