import React, { useState, useEffect } from 'react';
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
import { RootStackParamList } from '../navigation/AppNavigator';
import { ALL_QUOTES } from '../utils/quotes';
import { Quote } from '../utils/quotes';

type QuoteOfTheDayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuoteOfTheDay'
>;

interface Props {
  navigation: QuoteOfTheDayScreenNavigationProp;
}

interface QuoteItem {
  quote: Quote;
  emoji: string;
  timeLabel: string;
}

const QuoteOfTheDayScreen: React.FC<Props> = ({ navigation }) => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);

  useEffect(() => {
    loadTodayQuotes();
  }, []);

  // 🌅 오늘의 3개 명언 로드 (아침/점심/저녁)
  const loadTodayQuotes = () => {
    const timeSlots = [
      { slot: 'morning' as const, emoji: '🌅', label: '아침 명언' },
      { slot: 'afternoon' as const, emoji: '☀️', label: '점심 명언' },
      { slot: 'evening' as const, emoji: '🌙', label: '저녁 명언' },
    ];

    const todayQuotes: QuoteItem[] = [];

    for (const { slot, emoji, label } of timeSlots) {
      const quotesBySlot = ALL_QUOTES.filter(q => q.category === slot);
      if (quotesBySlot.length > 0) {
        // 날짜 기반으로 일관된 명언 선택 (매일 같은 명언)
        const today = new Date().getTime();
        const index = Math.floor(today / (1000 * 60 * 60 * 24)) % quotesBySlot.length;
        const quote = quotesBySlot[index];

        todayQuotes.push({
          quote,
          emoji,
          timeLabel: label,
        });
      }
    }

    setQuotes(todayQuotes);
  };

  // 명언을 탭했을 때 - 질문 화면으로 이동
  const handleQuotePress = (quoteId: string, timeSlot: 'morning' | 'afternoon' | 'evening') => {
    navigation.navigate('Question', {
      questionId: quoteId,
      timeSlot,
      from: 'QuoteOfTheDay', // 어디서 왔는지 표시
    });
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
          <Text style={styles.headerTitle}>✨ 오늘의 명언</Text>
          <Text style={styles.headerSubtitle}>
            하루를 응원하는 3개의 명언을 만나보세요
          </Text>
        </View>

        {/* 명언 카드들 */}
        <View style={styles.quotesContainer}>
          {quotes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quoteCard}
              onPress={() => handleQuotePress(item.quote.id, item.quote.category)}
              activeOpacity={0.8}
            >
              {/* 상단 시간 정보 */}
              <View style={styles.quoteHeader}>
                <Text style={styles.quoteEmoji}>{item.emoji}</Text>
                <Text style={styles.quoteTimeLabel}>{item.timeLabel}</Text>
              </View>

              {/* 명언 텍스트 */}
              <Text style={styles.quoteText}>{item.quote.text}</Text>

              {/* 하단 상호작용 안내 */}
              <View style={styles.quoteFooter}>
                <Text style={styles.quoteFooterText}>탭하여 감정 표현하기 →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 안내 문구 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 팁</Text>
          <Text style={styles.infoText}>
            각 명언을 탭하면 감정 표현 화면으로 넘어갑니다. "공감돼요" 또는 "별로예요"로 선택하면 당신의 감정을 더 잘 이해할 수 있어요!
          </Text>
        </View>
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
    textAlign: 'center',
  },
  quotesContainer: {
    marginBottom: 24,
    gap: 16,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  quoteTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: 24,
    marginBottom: 16,
  },
  quoteFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quoteFooterText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#4f46e5',
    lineHeight: 20,
  },
});

export default QuoteOfTheDayScreen;
