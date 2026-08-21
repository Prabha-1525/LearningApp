import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {AnimalSubModuleConfig} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalSubModuleCardProps {
  readonly config: AnimalSubModuleConfig;
  readonly isUnlocked: boolean;
  readonly isCompleted: boolean;
  readonly stars: number;
  readonly onPress: () => void;
}

export function AnimalSubModuleCard({
  config,
  isUnlocked,
  isCompleted,
  stars,
  onPress,
}: AnimalSubModuleCardProps) {
  const {t} = useTranslation();

  const handlePress = () => {
    if (isUnlocked) {
      animalsAudio.playTone(520, 60);
      onPress();
    } else {
      animalsAudio.playTone(260, 120);
      animalsAudio.speak(
        'Complete the previous animal adventure to unlock this one!',
      );
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: isUnlocked ? config.bgLightColor : '#F3F4F6',
      borderColor: isUnlocked ? config.accentColor : '#D1D5DB',
      opacity: isUnlocked ? 1 : 0.75,
    },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(config.titleKey, {defaultValue: config.id})}
      onPress={handlePress}
      style={cardStyle}>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.emojiBox,
            {backgroundColor: isUnlocked ? config.accentColor : '#9CA3AF'},
          ]}>
          <Text style={styles.emojiText}>{config.emoji}</Text>
        </View>

        <View style={styles.textColumn}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {color: isUnlocked ? '#1F2937' : '#6B7280'},
              ]}>
              {t(config.titleKey, {defaultValue: config.id})}
            </Text>
            {isCompleted && <Text style={styles.checkIcon}>✅</Text>}
            {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
          </View>
          <Text style={styles.subtitle}>
            {t(config.subtitleKey, {defaultValue: ''})}
          </Text>

          {isUnlocked && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map(sIdx => (
                <Text
                  key={sIdx}
                  style={[styles.star, {opacity: sIdx <= stars ? 1 : 0.25}]}>
                  ⭐
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 2.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emojiBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emojiText: {
    fontSize: 32,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  checkIcon: {
    fontSize: 16,
  },
  lockIcon: {
    fontSize: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  star: {
    fontSize: 14,
  },
});
