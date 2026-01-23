import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MindsetQuote, getDailyQuote, getRandomQuote } from '../data/mindsetQuotes';

const DAILY_QUOTE_KEY = '@pinnacle_daily_quote';
const DAILY_QUOTE_DATE_KEY = '@pinnacle_daily_quote_date';

interface UseDailyFocusReturn {
  dailyQuote: MindsetQuote | null;
  refreshQuote: () => void;
  isLoading: boolean;
}

export function useDailyFocus(): UseDailyFocusReturn {
  const [dailyQuote, setDailyQuote] = useState<MindsetQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem(DAILY_QUOTE_DATE_KEY);
      
      if (storedDate === today) {
        const storedQuote = await AsyncStorage.getItem(DAILY_QUOTE_KEY);
        if (storedQuote) {
          setDailyQuote(JSON.parse(storedQuote));
          setIsLoading(false);
          return;
        }
      }
      
      const newQuote = getDailyQuote();
      await AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(newQuote));
      await AsyncStorage.setItem(DAILY_QUOTE_DATE_KEY, today);
      setDailyQuote(newQuote);
    } catch (error) {
      const fallbackQuote = getDailyQuote();
      setDailyQuote(fallbackQuote);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQuote = () => {
    const newQuote = getRandomQuote();
    setDailyQuote(newQuote);
    AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(newQuote)).catch(() => {});
  };

  return {
    dailyQuote,
    refreshQuote,
    isLoading,
  };
}
