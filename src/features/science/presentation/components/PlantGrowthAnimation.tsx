import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import {PLANT_GROWTH_STAGES} from '../../domain/catalog/scienceData';

type PlantGrowthAnimationProps = {
  readonly onGrowthComplete?: () => void;
};

export function PlantGrowthAnimation({
  onGrowthComplete,
}: PlantGrowthAnimationProps) {
  const {t} = useTranslation();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [sunCount, setSunCount] = useState(0);

  const scale = useSharedValue(1);

  const currentStage =
    PLANT_GROWTH_STAGES[currentStageIdx] ?? PLANT_GROWTH_STAGES[0];

  const handleAction = (type: 'water' | 'sun') => {
    scale.value = withSequence(
      withSpring(1.3, {damping: 4, stiffness: 200}),
      withSpring(1, {damping: 6, stiffness: 150}),
    );

    if (type === 'water') {
      const nextW = waterCount + 1;
      setWaterCount(nextW);
      if (nextW % 2 === 0 && currentStageIdx < PLANT_GROWTH_STAGES.length - 1) {
        const nextStage = currentStageIdx + 1;
        setCurrentStageIdx(nextStage);
        if (nextStage === PLANT_GROWTH_STAGES.length - 1) {
          onGrowthComplete?.();
        }
      }
    } else {
      const nextS = sunCount + 1;
      setSunCount(nextS);
      if (nextS % 2 === 0 && currentStageIdx < PLANT_GROWTH_STAGES.length - 1) {
        const nextStage = currentStageIdx + 1;
        setCurrentStageIdx(nextStage);
        if (nextStage === PLANT_GROWTH_STAGES.length - 1) {
          onGrowthComplete?.();
        }
      }
    }
  };

  const animatedPlantStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Garden Ground Illustration */}
      <View style={styles.skyView}>
        <View style={styles.sunCorner}>
          <Text style={styles.sunEmoji}>☀️</Text>
        </View>
        <Animated.View style={[styles.plantWrap, animatedPlantStyle]}>
          <Text style={styles.plantEmoji}>{currentStage.emoji}</Text>
        </Animated.View>
      </View>
      <View style={styles.soilView}>
        <Text style={styles.stageTitle}>
          {t(currentStage.nameKey, currentStage.id)}
        </Text>
        <Text style={styles.stageDesc}>
          {t(currentStage.descKey, 'Give water and sun to help it grow!')}
        </Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {PLANT_GROWTH_STAGES.map((st, idx) => (
          <View
            key={st.id}
            style={[
              styles.dot,
              idx === currentStageIdx && styles.activeDot,
              idx < currentStageIdx && styles.doneDot,
            ]}>
            <Text style={styles.dotEmoji}>{st.emoji}</Text>
          </View>
        ))}
      </View>

      {/* Interaction Buttons */}
      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => handleAction('water')}
          style={[styles.actionBtn, styles.waterBtn]}>
          <Text style={styles.actionEmoji}>💧</Text>
          <Text style={styles.actionLabel}>
            {t('science.plants.waterPlant', 'Water Plant')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => handleAction('sun')}
          style={[styles.actionBtn, styles.sunBtn]}>
          <Text style={styles.actionEmoji}>☀️</Text>
          <Text style={styles.actionLabel}>
            {t('science.plants.giveSun', 'Give Sunlight')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  skyView: {
    height: 180,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  sunCorner: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  sunEmoji: {
    fontSize: 40,
  },
  plantWrap: {
    alignItems: 'center',
    marginBottom: -10,
  },
  plantEmoji: {
    fontSize: 80,
  },
  soilView: {
    backgroundColor: '#78350F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FEF3C7',
  },
  stageDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FDE68A',
    textAlign: 'center',
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FEF9C3',
  },
  dot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  activeDot: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    transform: [{scale: 1.1}],
  },
  doneDot: {
    borderColor: '#059669',
    backgroundColor: '#D1FAE5',
  },
  dotEmoji: {
    fontSize: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  waterBtn: {
    backgroundColor: '#38BDF8',
  },
  sunBtn: {
    backgroundColor: '#F59E0B',
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
