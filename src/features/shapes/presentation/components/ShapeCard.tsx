import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {ShapeDefinition} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeCardProps {
  readonly shape: ShapeDefinition;
  readonly onNext?: () => void;
}

export function ShapeCard({shape, onNext}: ShapeCardProps) {
  const bounceAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
    shapesAudio.speak(shape.audioPronunciation);
  }, [shape, bounceAnim]);

  const handleHearAudio = () => {
    shapesAudio.playTone(523, 80);
    shapesAudio.speak(shape.audioPronunciation);
  };

  const handleTapShape = () => {
    shapesAudio.playTone(659, 80);
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    shapesAudio.speak(`This is a ${shape.name}! ${shape.description}`);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {backgroundColor: shape.lightColor, borderColor: shape.color},
          {transform: [{scale: bounceAnim}]},
        ]}>
        {/* Interactive Shape Display */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Interactive ${shape.name}`}
          onPress={handleTapShape}
          style={[styles.shapeBadge, {backgroundColor: shape.color}]}>
          <Animated.Text
            style={[styles.shapeEmoji, {transform: [{rotate: spin}]}]}>
            {shape.emoji}
          </Animated.Text>
        </Pressable>

        {/* Shape Name & Speaker */}
        <View style={styles.titleRow}>
          <Text style={[styles.shapeName, {color: shape.darkColor}]}>
            {shape.name.toUpperCase()}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listen to pronunciation"
            onPress={handleHearAudio}
            style={[styles.audioBtn, {backgroundColor: shape.color}]}>
            <Text style={styles.audioBtnText}>🔊</Text>
          </Pressable>
        </View>

        {/* Short Description */}
        <Text style={styles.description}>{shape.description}</Text>

        {/* Property Badges */}
        <View style={styles.propertiesRow}>
          <View style={[styles.propBadge, {borderColor: shape.color}]}>
            <Text style={styles.propLabel}>Sides</Text>
            <Text style={[styles.propValue, {color: shape.darkColor}]}>
              {shape.sides === 0 ? '0 (Round)' : `${shape.sides} Sides`}
            </Text>
          </View>
          <View style={[styles.propBadge, {borderColor: shape.color}]}>
            <Text style={styles.propLabel}>Corners</Text>
            <Text style={[styles.propValue, {color: shape.darkColor}]}>
              {shape.corners === 0
                ? '0 (No corners)'
                : `${shape.corners} Corners`}
            </Text>
          </View>
        </View>

        {/* Real-World Examples Carousel */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Real World Examples:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.examplesScroll}>
            {shape.realWorldExamples.map(ex => (
              <Pressable
                key={ex.id}
                accessibilityRole="button"
                accessibilityLabel={`${ex.name}: ${ex.description}`}
                onPress={() => {
                  shapesAudio.playTone(587, 80);
                  shapesAudio.speak(`${ex.name}! ${ex.description}`);
                }}
                style={[styles.examplePill, {borderColor: shape.color}]}>
                <Text style={styles.exampleEmoji}>{ex.emoji}</Text>
                <Text style={styles.exampleName}>{ex.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Fun Fact */}
        <View style={styles.funFactBox}>
          <Text style={styles.funFactTitle}>💡 Fun Fact</Text>
          <Text style={styles.funFactText}>{shape.funFact}</Text>
        </View>
      </Animated.View>

      {/* Next Button */}
      {onNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next shape"
          onPress={onNext}
          style={[styles.nextBtn, {backgroundColor: shape.color}]}>
          <Text style={styles.nextBtnText}>Next Shape ➔</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 3,
    padding: 18,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shapeBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  shapeEmoji: {
    fontSize: 56,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shapeName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBtnText: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  propertiesRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  propBadge: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  propLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  propValue: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  examplesContainer: {
    width: '100%',
    gap: 6,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  examplesScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  examplePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exampleEmoji: {
    fontSize: 18,
  },
  exampleName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  funFactBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  funFactTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
    marginBottom: 2,
  },
  funFactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
