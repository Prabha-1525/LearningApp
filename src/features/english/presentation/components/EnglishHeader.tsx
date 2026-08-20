import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface EnglishHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly starsCount?: number;
  readonly onBack?: () => void;
}

export function EnglishHeader({
  title,
  subtitle,
  emoji = '🔤',
  accentColor = '#3B82F6',
  starsCount,
  onBack,
}: EnglishHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={[styles.backBtn, {borderColor: accentColor}]}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {typeof starsCount === 'number' && (
        <View style={styles.starsPill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starsText}>{starsCount}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginTop: -4,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  starIcon: {
    fontSize: 15,
  },
  starsText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
});
