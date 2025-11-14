import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getTodayResponses, getDailyAnalysis } from '../utils/storage';
import { UserProfile, DailyAnalysis } from '../types';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

interface EmotionRecord {
  date: string;
  emotionType: string;
  emotionText: string;
  emoji: string;
  label: string;
  color: string;
}

const emotions = [
  { id: 'great', emoji: '😊', label: '좋음', color: '#10b981' },
  { id: 'good', emoji: '🙂', label: '괜찮음', color: '#06b6d4' },
  { id: 'normal', emoji: '😐', label: '평범', color: '#6b7280' },
  { id: 'sad', emoji: '😢', label: '우울', color: '#8b5cf6' },
  { id: 'tired', emoji: '😴', label: '피곤', color: '#f59e0b' },
];

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [statistics, setStatistics] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 화면 진입 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [])
  );

  // 📥 지난 7일 감정 데이터 로드
  const loadHistoryData = async () => {
    try {
      setIsLoading(true);

      // 최근 7일 데이터 생성
      const emotionRecords: EmotionRecord[] = [];
      const stats: { [key: string]: number } = {};

      // 오늘부터 7일 전까지
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        try {
          // 각 날짜의 분석 데이터 가져오기
          const analysis = await getDailyAnalysis(dateStr);

          if (analysis && analysis.responses && analysis.responses.length > 0) {
            // 그날의 감정 정보 추출
            const lastResponse = analysis.responses[analysis.responses.length - 1];
            if (lastResponse.emotionType) {
              const emotionInfo = emotions.find(e => e.id === lastResponse.emotionType);
              if (emotionInfo) {
                emotionRecords.push({
                  date: dateStr,
                  emotionType: lastResponse.emotionType,
                  emotionText: lastResponse.emotionText || '',
                  emoji: emotionInfo.emoji,
                  label: emotionInfo.label,
                  color: emotionInfo.color,
                });

                // 통계 계산
                stats[lastResponse.emotionType] = (stats[lastResponse.emotionType] || 0) + 1;
              }
            }
          }
        } catch (error) {
          // 해당 날짜 데이터 없음 (무시)
        }
      }

      setRecords(emotionRecords);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('오류', '히스토리 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 감정별 통계 렌더링
  const renderStatistics = () => {
    const total = records.length;
    if (total === 0) return null;

    return (
      <View style={styles.statisticsCard}>
        <Text style={styles.statisticsTitle}>📊 지난 7일 감정 통계</Text>
        <View style={styles.statisticsGrid}>
          {emotions.map((emotion) => {
            const count = statistics[emotion.id] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <View key={emotion.id} style={styles.statItem}>
                <Text style={styles.statEmoji}>{emotion.emoji}</Text>
                <Text style={styles.statLabel}>{emotion.label}</Text>
                <View style={styles.statBar}>
                  <View
                    style={[
                      styles.statFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: emotion.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statCount}>
                  {count}회 ({percentage}%)
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // 📋 감정 기록 리스트 렌더링
  const renderRecords = () => {
    if (records.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>지난 7일 감정 기록이 없습니다.</Text>
          <Text style={styles.emptySubText}>감정을 기록해보세요! 😊</Text>
        </View>
      );
    }

    return (
      <View style={styles.recordsContainer}>
        <Text style={styles.recordsTitle}>📝 감정 기록</Text>
        {records.map((record, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.recordCard, { borderLeftColor: record.color }]}
            onPress={() => {
              navigation.navigate('DailyReport', { date: record.date });
            }}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordDateEmoji}>
                <Text style={styles.recordEmoji}>{record.emoji}</Text>
                <View>
                  <Text style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString('ko-KR', {
                      month: 'numeric',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </Text>
                  <Text style={[styles.recordLabel, { color: record.color }]}>
                    {record.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.recordArrow}>→</Text>
            </View>
            {record.emotionText && (
              <Text style={styles.recordText} numberOfLines={1}>
                "{record.emotionText}"
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🗓️ 감정 히스토리</Text>
          <Text style={styles.headerSubtitle}>지난 7일의 감정을 확인해보세요</Text>
        </View>

        {/* 통계 */}
        {renderStatistics()}

        {/* 기록 리스트 */}
        {renderRecords()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statisticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statisticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: 90,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'center',
  },
  statBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  statFill: {
    height: '100%',
    borderRadius: 3,
  },
  statCount: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  recordsContainer: {
    marginBottom: 20,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDateEmoji: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recordEmoji: {
    fontSize: 24,
  },
  recordDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  recordArrow: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  recordText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default HistoryScreen;
