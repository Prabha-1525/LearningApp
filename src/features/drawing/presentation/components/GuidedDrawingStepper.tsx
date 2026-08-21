import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {GuidedDrawingLesson} from '../../domain/entities/drawingEntities';
import {DrawingCanvas} from './DrawingCanvas';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface GuidedDrawingStepperProps {
  readonly lesson: GuidedDrawingLesson;
  readonly onCompleteLesson?: () => void;
}

export function GuidedDrawingStepper({
  lesson,
  onCompleteLesson,
}: GuidedDrawingStepperProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = lesson.steps[currentStepIdx] ?? lesson.steps[0]!;
  const isLast = currentStepIdx === lesson.steps.length - 1;

  const handleHearStep = () => {
    drawingAudio.playTone(520, 80);
    drawingAudio.speak(currentStep.instruction);
  };

  const handleNextStep = () => {
    if (isLast) {
      drawingAudio.playCelebrationFanfare();
      drawingAudio.speak(
        `Super job! You finished drawing the ${lesson.title}! Now color it any way you like!`,
      );
      if (onCompleteLesson) onCompleteLesson();
    } else {
      drawingAudio.playSuccessChime();
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Step Progress Indicators */}
      <View style={styles.stepsHeader}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            Step {currentStepIdx + 1} of {lesson.steps.length}
          </Text>
        </View>
        <View style={styles.pillsRow}>
          {lesson.steps.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.pill,
                idx === currentStepIdx && styles.pillActive,
                idx < currentStepIdx && styles.pillCompleted,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Step Instruction Card */}
      <View style={styles.instructionCard}>
        <View style={styles.instructionHeader}>
          <Text style={styles.hintEmoji}>{currentStep.hintEmoji ?? '✏️'}</Text>
          <Text style={styles.instructionText}>{currentStep.instruction}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read step instruction aloud"
          onPress={handleHearStep}
          style={styles.voiceBtn}>
          <Text style={styles.voiceBtnText}>🔊 Read Step Aloud</Text>
        </Pressable>
      </View>

      {/* Freehand Canvas for Child to Draw */}
      <DrawingCanvas
        initialTitle={`${lesson.title} - Step ${currentStepIdx + 1}`}
        categoryType="guided_drawing"
      />

      {/* Next Step CTA */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Proceed to next drawing step"
        onPress={handleNextStep}
        style={styles.nextStepBtn}>
        <Text style={styles.nextStepBtnText}>
          {isLast ? 'Finish & Color Artwork! 🎉' : 'Next Step ➔'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  stepsHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  pillActive: {
    width: 24,
    backgroundColor: '#6366F1',
  },
  pillCompleted: {
    backgroundColor: '#10B981',
  },
  instructionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hintEmoji: {
    fontSize: 26,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
  },
  voiceBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  voiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  nextStepBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  nextStepBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
