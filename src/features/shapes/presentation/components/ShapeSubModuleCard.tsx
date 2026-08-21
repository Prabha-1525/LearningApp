import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeSubModuleConfig} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeSubModuleCardProps {
  readonly config: ShapeSubModuleConfig;
  readonly isUnlocked: boolean;
  readonly isCompleted: boolean;
  readonly stars: number;
  readonly onPress: () => void;
}

export function ShapeSubModuleCard({
  config,
  isUnlocked,
  isCompleted,
  stars,
  onPress,
}: ShapeSubModuleCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isUnlocked) return;
    Animated.spring(scaleAnim, {toValue: 0.96, useNativeDriver: true}).start();
  };

  const handlePressOut = () => {
    if (!isUnlocked) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!isUnlocked) {
      shapesAudio.playTone(220, 100);
      shapesAudio.speak('Complete the previous shape lesson to unlock this!');
      return;
    }
    shapesAudio.playTone(520, 60);
    onPress();
  };

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${config.id}, ${
          isUnlocked ? (isCompleted ? 'Completed' : 'Unlocked') : 'Locked'
        }`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: isUnlocked ? config.bgLightColor : '#F3F4F6',
            borderColor: isUnlocked ? config.accentColor : '#D1D5DB',
            opacity: isUnlocked ? 1 : 0.7,
          },
        ]}>
        {/* Emoji Badge Icon */}
        <View
          style={[
            styles.emojiBox,
            {backgroundColor: isUnlocked ? config.accentColor : '#9CA3AF'},
          ]}>
          <Text style={styles.emojiText}>{config.emoji}</Text>
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {color: isUnlocked ? '#1F2937' : '#6B7280'},
              ]}>
              {config.id.replace('_', ' ').toUpperCase()}
            </Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedCheck}>✓</Text>
              </View>
            )}
            {!isUnlocked && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
          </View>

          {/* Star Ratings */}
          {isUnlocked && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map(sIdx => (
                <Text
                  key={sIdx}
                  style={[
                    styles.starIcon,
                    {opacity: sIdx <= stars ? 1 : 0.25},
                  ]}>
                  ⭐
                </Text>
              ))}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  emojiText: {
    fontSize: 26,
  },
  infoCol: {
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
  completedBadge: {
    backgroundColor: '#10B981',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  lockBadge: {
    backgroundColor: '#E5E7EB',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    fontSize: 14,
  },
});
