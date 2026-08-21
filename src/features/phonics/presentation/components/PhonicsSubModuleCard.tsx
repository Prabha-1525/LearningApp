import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {
  PhonicsSubModule,
  SubModuleProgress,
} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface PhonicsSubModuleCardProps {
  readonly subModule: PhonicsSubModule;
  readonly isUnlocked: boolean;
  readonly progress?: SubModuleProgress;
  readonly onPress: (subModule: PhonicsSubModule) => void;
}

export function PhonicsSubModuleCard({
  subModule,
  isUnlocked,
  progress,
  onPress,
}: PhonicsSubModuleCardProps) {
  const isCompleted = progress?.completed ?? false;
  const stars = progress?.stars ?? 0;

  const handlePress = () => {
    if (!isUnlocked) {
      phonicsAudio.playTone(300, 100);
      phonicsAudio.speak(
        'Complete the previous lesson to unlock this activity!',
      );
      return;
    }
    phonicsAudio.playTone(520, 60);
    onPress(subModule);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${subModule.order}. ${subModule.titleKey}`}
      onPress={handlePress}
      style={[
        styles.card,
        {borderColor: isUnlocked ? subModule.color : '#E5E7EB'},
        !isUnlocked && styles.cardLocked,
      ]}>
      {/* Left Icon Badge */}
      <View
        style={[
          styles.iconBox,
          {backgroundColor: isUnlocked ? subModule.color : '#9CA3AF'},
        ]}>
        <Text style={styles.iconText}>
          {isUnlocked ? subModule.icon : '🔒'}
        </Text>
      </View>

      {/* Middle Text Info */}
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, !isUnlocked && styles.textLocked]}
            numberOfLines={1}>
            {subModule.order}. {subModule.id.replace(/_/g, ' ').toUpperCase()}
          </Text>
          {isCompleted && <Text style={styles.checkBadge}>✅</Text>}
        </View>

        <Text style={styles.desc} numberOfLines={1}>
          {isUnlocked ? `${subModule.questionsCount} fun challenges` : 'Locked'}
        </Text>

        {/* Stars Row */}
        {isUnlocked && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Text key={s} style={[styles.star, s > stars && styles.starDim]}>
                ⭐
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Action Arrow */}
      <View style={styles.arrowBox}>
        <Text
          style={[
            styles.arrowText,
            {color: isUnlocked ? subModule.color : '#9CA3AF'},
          ]}>
          {isUnlocked ? '➔' : '🔒'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2.5,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 26,
  },
  infoCol: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    flex: 1,
  },
  textLocked: {
    color: '#6B7280',
  },
  checkBadge: {
    fontSize: 14,
  },
  desc: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  star: {
    fontSize: 13,
  },
  starDim: {
    opacity: 0.25,
  },
  arrowBox: {
    paddingHorizontal: 4,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
