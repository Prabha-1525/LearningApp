import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type ScienceHeaderProps = {
  readonly title: string;
  readonly emoji: string;
  readonly accentColor?: string;
  readonly score?: number;
  readonly totalScore?: number;
  readonly onBack: () => void;
};

export function ScienceHeader({
  title,
  emoji,
  accentColor = '#10B981',
  score,
  totalScore,
  onBack,
}: ScienceHeaderProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back', 'Back')}
        onPress={onBack}
        style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      <View style={styles.titleWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.title, {color: accentColor}]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {score !== undefined && totalScore !== undefined ? (
        <View style={styles.scorePill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.scoreText}>
            {score}/{totalScore}
          </Text>
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backIcon: {
    fontSize: 28,
    color: '#334155',
    lineHeight: 32,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 8,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starIcon: {
    fontSize: 14,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  placeholder: {
    width: 40,
  },
});
