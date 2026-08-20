import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import {BODY_PARTS, type BodyPart} from '../../domain/catalog/scienceData';

type BodyExplorerViewProps = {
  readonly onPartSelected?: (part: BodyPart) => void;
};

export function BodyExplorerView({onPartSelected}: BodyExplorerViewProps) {
  const {t} = useTranslation();
  const [selectedPart, setSelectedPart] = useState<BodyPart>(BODY_PARTS[0]);

  const scale = useSharedValue(1);

  const handleSelect = (part: BodyPart) => {
    scale.value = withSequence(
      withSpring(1.25, {damping: 4, stiffness: 200}),
      withSpring(1, {damping: 6, stiffness: 150}),
    );
    setSelectedPart(part);
    onPartSelected?.(part);
  };

  const animatedPreviewStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Featured Body Part Card */}
      <View style={[styles.featuredCard, {borderColor: selectedPart.color}]}>
        <Animated.View
          style={[
            styles.avatarCircle,
            {backgroundColor: `${selectedPart.color}20`},
            animatedPreviewStyle,
          ]}>
          <Text style={styles.featuredEmoji}>{selectedPart.emoji}</Text>
        </Animated.View>
        <Text style={[styles.featuredName, {color: selectedPart.color}]}>
          {t(selectedPart.nameKey, selectedPart.id)}
        </Text>
        <View style={styles.senseBadge}>
          <Text style={styles.senseText}>{t(selectedPart.senseKey, '')}</Text>
        </View>
        <Text style={styles.factText}>💡 {t(selectedPart.funFactKey, '')}</Text>
      </View>

      {/* Interactive Grid of Parts */}
      <Text style={styles.gridHeading}>
        {t(
          'science.body.tapPrompt',
          'Tap a body part to learn its superpower!',
        )}
      </Text>

      <View style={styles.grid}>
        {BODY_PARTS.map(part => {
          const isSelected = part.id === selectedPart.id;
          return (
            <Pressable
              key={part.id}
              accessibilityRole="button"
              onPress={() => handleSelect(part)}
              style={[
                styles.partCard,
                isSelected && [
                  styles.selectedPartCard,
                  {borderColor: part.color},
                ],
              ]}>
              <Text style={styles.partEmoji}>{part.emoji}</Text>
              <Text
                style={[
                  styles.partName,
                  isSelected && {color: part.color, fontWeight: '900'},
                ]}>
                {t(part.nameKey, part.id)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featuredEmoji: {
    fontSize: 48,
  },
  featuredName: {
    fontSize: 24,
    fontWeight: '900',
  },
  senseBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 8,
  },
  senseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  factText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  gridHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  partCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedPartCard: {
    borderWidth: 2.5,
    backgroundColor: '#F8FAFC',
    transform: [{scale: 1.05}],
  },
  partEmoji: {
    fontSize: 28,
  },
  partName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
});
