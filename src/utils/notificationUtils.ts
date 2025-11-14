import * as Notifications from 'expo-notifications';
import { ALL_QUOTES } from './quotes';

// 알림 핸들러 설정
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

// 시간대별 명언 가져오기
const getQuoteByTimeSlot = (timeSlot: 'morning' | 'afternoon' | 'evening') => {
  const quotes = ALL_QUOTES.filter(q => q.category === timeSlot);
  if (quotes.length === 0) return null;

  // 날짜 기반으로 일관된 명언 선택 (매일 같은 명언이 나오도록)
  const today = new Date().getTime();
  const index = Math.floor(today / (1000 * 60 * 60 * 24)) % quotes.length;
  return quotes[index];
};

// 알림 스케줄링
export const scheduleQuoteNotifications = async () => {
  try {
    // 기존 알림 모두 취소
    await Notifications.cancelAllScheduledNotificationsAsync();

    const timeSlots = [
      { slot: 'morning' as const, hour: 9, title: '🌅 아침 명언' },
      { slot: 'afternoon' as const, hour: 12, title: '☀️ 점심 명언' },
      { slot: 'evening' as const, hour: 18, title: '🌙 저녁 명언' },
    ];

    // 각 시간대별로 알림 스케줄
    for (const { slot, hour, title } of timeSlots) {
      const quote = getQuoteByTimeSlot(slot);
      if (!quote) continue;

      // 매일 반복되는 알림 설정
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: quote.text,
          data: {
            quoteId: quote.id,
            timeSlot: slot,
          },
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
          type: 'daily',
        },
      });
    }

    console.log('Quote notifications scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

// 모든 알림 취소
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// 알림 권한 요청
export const requestNotificationPermissions = async () => {
  try {
    const permission = await Notifications.requestPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};
