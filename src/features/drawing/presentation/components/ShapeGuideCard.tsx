import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeItem} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface ShapeGuideCardProps {
  readonly shape: ShapeItem;
  readonly onStartDrawing: () => void;
}

export function ShapeGuideCard({shape, onStartDrawing}: ShapeGuideCardProps) {
  const [isDemonstrating, setIsDemonstrating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const handleDemonstrate = async () => {
    if (isDemonstrating) return;
    setIsDemonstrating(true);
    drawingAudio.playTone(520, 80);

    for (let i = 0; i < shape.strokeSequence.length; i++) {
      const stepText = shape.strokeSequence[i];
      if (stepText) {
        setActiveStep(i);
        drawingAudio.playTone(580 + i * 50, 80);
        await drawingAudio.speak(stepText);
        await new Promise<void>(resolve => {
          setTimeout(() => resolve(), 800);
        });
      }
    }
    setIsDemonstrating(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {transform: [{scale: bounceAnim}]}]}>
        {/* Shape Swatch */}
        <View style={[styles.shapeHeader, {backgroundColor: shape.color}]}>
          <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
          <Text style={styles.shapeTitle}>{shape.name.toUpperCase()}</Text>
          <Text style={styles.shapeSides}>
            {shape.sides === 0
              ? '0 corners • Round'
              : `${shape.sides} Sides & Corners`}
          </Text>
        </View>

        {/* Fun Fact */}
        <View style={styles.factBox}>
          <Text style={styles.factText}>💡 {shape.funFact}</Text>
        </View>

        {/* Step-by-step Stroke Sequence */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionHeader}>How to Draw a {shape.name}:</Text>
          <View style={styles.stepsList}>
            {shape.strokeSequence.map((step, idx) => {
              const isActive = activeStep === idx && isDemonstrating;
              return (
                <View
                  key={idx}
                  style={[styles.stepItem, isActive && styles.stepItemActive]}>
                  <Text
                    style={[
                      styles.stepText,
                      isActive && styles.stepTextActive,
                    ]}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.btnRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Demonstrate drawing a ${shape.name}`}
            disabled={isDemonstrating}
            onPress={handleDemonstrate}
            style={styles.demoBtn}>
            <Text style={styles.demoBtnText}>
              {isDemonstrating ? '👀 Demonstrating...' : '🎬 Watch How to Draw'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Draw a ${shape.name}`}
            onPress={onStartDrawing}
            style={[styles.drawBtn, {backgroundColor: shape.color}]}>
            <Text style={styles.drawBtnText}>✏️ Try Drawing It!</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  shapeHeader: {
    width: '100%',
    height: 130,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  shapeEmoji: {
    fontSize: 44,
  },
  shapeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  shapeSides: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  factBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  factText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    lineHeight: 16,
  },
  stepsSection: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  stepsList: {
    gap: 6,
  },
  stepItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  stepItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  stepTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  btnRow: {
    gap: 8,
    marginTop: 4,
  },
  demoBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
  },
  demoBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  drawBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  drawBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
