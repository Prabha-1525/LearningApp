import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {SubModuleConfig} from '../../domain/entities/englishEntities';

interface EnglishSubModuleCardProps {
  readonly config: SubModuleConfig;
  readonly isUnlocked: boolean;
  readonly isCompleted: boolean;
  readonly starsEarned: number;
  readonly onPress: () => void;
}

export function EnglishSubModuleCard({
  config,
  isUnlocked,
  isCompleted,
  starsEarned,
  onPress,
}: EnglishSubModuleCardProps) {
  const {t} = useTranslation();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{transform: [{scale: scaleAnim}]}, styles.wrapper]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(config.titleKey, config.id)}
        disabled={!isUnlocked}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.card,
          isUnlocked ? styles.cardUnlocked : styles.cardLocked,
          isUnlocked && {borderColor: config.accentColor},
        ]}>
        {/* Left Icon Pill */}
        <View
          style={[
            styles.iconBox,
            isUnlocked ? styles.iconBoxUnlocked : styles.iconBoxLocked,
            isUnlocked && {
              backgroundColor: config.bgLightColor,
              borderColor: config.accentColor,
            },
          ]}>
          <Text style={styles.emoji}>{isUnlocked ? config.emoji : '🔒'}</Text>
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                isUnlocked ? styles.titleUnlocked : styles.titleLocked,
              ]}
              numberOfLines={1}>
              {t(config.titleKey, config.id)}
            </Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.checkIcon}>✅</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.subtitle,
              isUnlocked ? styles.subtitleUnlocked : styles.subtitleLocked,
            ]}
            numberOfLines={1}>
            {t(config.subtitleKey, '')}
          </Text>

          {/* Stars / Lock hint */}
          <View style={styles.footerRow}>
            {isUnlocked ? (
              <View style={styles.starsRow}>
                {[1, 2, 3].map(s => (
                  <Text key={s} style={styles.star}>
                    {s <= starsEarned ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.lockedText}>
                {t('english.lockedHint', 'Complete previous step')}
              </Text>
            )}
          </View>
        </View>

        {/* Right Arrow */}
        <View style={styles.rightArrowBox}>
          <Text
            style={[
              styles.rightArrow,
              isUnlocked ? {color: config.accentColor} : styles.arrowLocked,
            ]}>
            {isUnlocked ? '➔' : '🔒'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedBadge: {
    marginLeft: 4,
  },
  checkIcon: {
    fontSize: 14,
  },
  footerRow: {
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 13,
    color: '#F59E0B',
  },
  lockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  rightArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightArrow: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardUnlocked: {
    backgroundColor: '#FFFFFF',
  },
  cardLocked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  iconBoxUnlocked: {
    backgroundColor: '#EFF6FF',
  },
  iconBoxLocked: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
  },
  titleUnlocked: {
    color: '#111827',
  },
  titleLocked: {
    color: '#9CA3AF',
  },
  subtitleUnlocked: {
    color: '#6B7280',
  },
  subtitleLocked: {
    color: '#9CA3AF',
  },
  arrowLocked: {
    color: '#D1D5DB',
  },
});
