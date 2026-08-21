import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {TracingPath} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS_SIZE = Math.min(SCREEN_WIDTH - 32, 340);

interface TracingCanvasProps {
  readonly pathItem: TracingPath;
  readonly onFinishPath?: () => void;
}

export function TracingCanvas({pathItem, onFinishPath}: TracingCanvasProps) {
  const [reachedIndices, setReachedIndices] = useState<number[]>([]);
  const [userTrail, setUserTrail] = useState<{x: number; y: number}[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;

  const scaleFactor = CANVAS_SIZE / 260;
  const scaledPoints = pathItem.points.map(pt => ({
    x: pt.x * scaleFactor,
    y: pt.y * scaleFactor,
  }));

  const checkProximity = (touchX: number, touchY: number) => {
    scaledPoints.forEach((pt, idx) => {
      const dist = Math.hypot(touchX - pt.x, touchY - pt.y);
      if (dist < 40 && !reachedIndices.includes(idx)) {
        setReachedIndices(prev => {
          const updated = [...prev, idx];
          if (updated.length >= scaledPoints.length && !isCompleted) {
            setIsCompleted(true);
            drawingAudio.playSuccessChime();
            drawingAudio.speak('Great tracing! Perfect line!');
            Animated.spring(successScale, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }).start();
            if (onFinishPath) onFinishPath();
          } else {
            drawingAudio.playTone(480 + idx * 40, 40);
          }
          return updated;
        });
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        setUserTrail([{x: locationX, y: locationY}]);
        checkProximity(locationX, locationY);
      },
      onPanResponderMove: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        setUserTrail(prev => [
          ...prev.slice(-30),
          {x: locationX, y: locationY},
        ]);
        checkProximity(locationX, locationY);
      },
      onPanResponderRelease: () => {
        setUserTrail([]);
      },
    }),
  ).current;

  const handleReset = () => {
    setReachedIndices([]);
    setUserTrail([]);
    setIsCompleted(false);
    successScale.setValue(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {pathItem.emoji} {pathItem.title}
        </Text>
        <Text style={styles.subtitle}>{pathItem.subtitle}</Text>
      </View>

      {/* Tracing Area */}
      <View
        style={[styles.canvasBox, {width: CANVAS_SIZE, height: CANVAS_SIZE}]}
        {...panResponder.panHandlers}>
        {/* Dotted Guideline Path */}
        {scaledPoints.map((pt, idx) => {
          const isReached = reachedIndices.includes(idx);
          return (
            <View
              key={idx}
              style={[
                styles.dotPoint,
                {
                  left: pt.x - 14,
                  top: pt.y - 14,
                  backgroundColor: isReached ? '#10B981' : '#E5E7EB',
                  borderColor: isReached ? '#059669' : '#9CA3AF',
                },
              ]}>
              <Text style={styles.dotNum}>{idx + 1}</Text>
            </View>
          );
        })}

        {/* Live User Finger Trail */}
        {userTrail.map((pt, pIdx) => (
          <View
            key={pIdx}
            pointerEvents="none"
            style={[
              styles.trailDot,
              {
                left: pt.x - 8,
                top: pt.y - 8,
              },
            ]}
          />
        ))}

        {/* Success Overlay */}
        {isCompleted && (
          <Animated.View
            style={[
              styles.celebrationCard,
              {transform: [{scale: successScale}]},
            ]}>
            <Text style={styles.celebrationEmoji}>🌟 ⭐ ✨</Text>
            <Text style={styles.celebrationTitle}>Awesome Tracing!</Text>
          </Animated.View>
        )}
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset tracing"
          onPress={handleReset}
          style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>🔄 Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  headerRow: {
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  canvasBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#374151',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dotPoint: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotNum: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F2937',
  },
  trailDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#60A5FA',
    opacity: 0.8,
  },
  celebrationCard: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 22,
  },
  celebrationTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  actionRow: {
    width: '100%',
    alignItems: 'center',
  },
  resetBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
});
