import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import { MindsetQuote } from '../data/mindsetQuotes';

interface QuoteCardProps {
  quote: MindsetQuote;
  variant?: 'default' | 'compact' | 'featured';
  onPress?: () => void;
}

export default function QuoteCard({ quote, variant = 'default', onPress }: QuoteCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const content = (
    <View style={[
      styles.container,
      isCompact && styles.containerCompact,
      isFeatured && styles.containerFeatured,
    ]}>
      <View style={styles.quoteMarkContainer}>
        <Text style={[styles.quoteMark, isFeatured && styles.quoteMarkFeatured]}>"</Text>
      </View>
      <Text style={[
        styles.quoteText,
        isCompact && styles.quoteTextCompact,
        isFeatured && styles.quoteTextFeatured,
      ]}>
        {quote.text}
      </Text>
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={[styles.author, isFeatured && styles.authorFeatured]}>
          {quote.author}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  containerCompact: {
    padding: 16,
  },
  containerFeatured: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  quoteMarkContainer: {
    marginBottom: 8,
  },
  quoteMark: {
    fontSize: 48,
    fontWeight: '200',
    color: COLORS.textMuted,
    lineHeight: 48,
    fontFamily: FONT.heading,
  },
  quoteMarkFeatured: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 28,
    fontFamily: FONT.body,
    letterSpacing: 0.2,
  },
  quoteTextCompact: {
    fontSize: 15,
    lineHeight: 22,
  },
  quoteTextFeatured: {
    color: COLORS.white,
    fontSize: 20,
    lineHeight: 30,
  },
  footer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  divider: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 12,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: FONT.body,
  },
  authorFeatured: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
