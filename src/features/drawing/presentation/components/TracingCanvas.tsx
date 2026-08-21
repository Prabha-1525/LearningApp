import React, {useEffect, useRef, useState} from 'react';
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
  const [reachedCount, setReachedCount] = useState<number>(0);
  const [liveTrail, setLiveTrail] = useState<{x: number; y: number}[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for next target dot
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Reset state when path changes
  useEffect(() => {
    setReachedCount(0);
    setLiveTrail([]);
    setIsCompleted(false);
    successScale.setValue(0);
  }, [pathItem.id, successScale]);

  const scaleFactor = CANVAS_SIZE / 260;
  const scaledPoints = pathItem.points.map(pt => ({
    x: pt.x * scaleFactor,
    y: pt.y * scaleFactor,
  }));

  const checkProximity = (touchX: number, touchY: number) => {
    if (isCompleted) return;

    // Check if next required point is within touch range
    const targetIdx = reachedCount;
    if (targetIdx < scaledPoints.length) {
      const targetPt = scaledPoints[targetIdx];
      if (!targetPt) return;

      const dist = Math.hypot(touchX - targetPt.x, touchY - targetPt.y);
      if (dist < 42) {
        const newCount = targetIdx + 1;
        setReachedCount(newCount);
        drawingAudio.playTone(480 + newCount * 50, 60);

        if (newCount >= scaledPoints.length) {
          setIsCompleted(true);
          drawingAudio.playSuccessChime();
          drawingAudio.speak('Great tracing! Perfect line!');
          Animated.spring(successScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start();
          if (onFinishPath) onFinishPath();
        }
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        setLiveTrail([{x: locationX, y: locationY}]);
        checkProximity(locationX, locationY);
      },
      onPanResponderMove: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        setLiveTrail(prev => [
          ...prev.slice(-40),
          {x: locationX, y: locationY},
        ]);
        checkProximity(locationX, locationY);
      },
      onPanResponderRelease: () => {
        setLiveTrail([]);
      },
    }),
  ).current;

  const handleReset = () => {
    setReachedCount(0);
    setLiveTrail([]);
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

      {/* Tracing Canvas Frame */}
      <View
        style={[styles.canvasBox, {width: CANVAS_SIZE, height: CANVAS_SIZE}]}
        {...panResponder.panHandlers}>
        {/* Render Guideline Connecting Line Segments (Dotted Gray) */}
        {scaledPoints.map((pt, idx) => {
          if (idx === 0) return null;
          const prev = scaledPoints[idx - 1];
          if (!prev) return null;

          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const isSegmentCompleted = reachedCount > idx;

          return (
            <View
              key={`line_${idx}`}
              pointerEvents="none"
              style={[
                styles.segmentLine,
                {
                  left: prev.x,
                  top: prev.y - 3,
                  width: dist,
                  height: isSegmentCompleted ? 6 : 4,
                  backgroundColor: isSegmentCompleted ? '#10B981' : '#D1D5DB',
                  transform: [{rotate: `${angle}deg`}],
                  transformOrigin: 'left center',
                },
                !isSegmentCompleted && styles.dashedGuideline,
              ]}
            />
          );
        })}

        {/* Render Dotted Path Circles with Numbers & Active Highlights */}
        {scaledPoints.map((pt, idx) => {
          const isReached = reachedCount > idx;
          const isNextTarget = reachedCount === idx;

          return (
            <View
              key={`dot_${idx}`}
              pointerEvents="none"
              style={[
                styles.dotPoint,
                {
                  left: pt.x - 16,
                  top: pt.y - 16,
                  backgroundColor: isReached
                    ? '#10B981'
                    : isNextTarget
                    ? '#DBEAFE'
                    : '#FFFFFF',
                  borderColor: isReached
                    ? '#059669'
                    : isNextTarget
                    ? '#3B82F6'
                    : '#9CA3AF',
                },
                isNextTarget && styles.nextTargetGlow,
              ]}>
              {isNextTarget ? (
                <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                  <Text style={styles.nextTargetText}>✏️</Text>
                </Animated.View>
              ) : isReached ? (
                <Text style={styles.checkText}>✓</Text>
              ) : (
                <Text style={styles.dotNum}>{idx + 1}</Text>
              )}
            </View>
          );
        })}

        {/* Live Finger Trail */}
        {liveTrail.map((pt, pIdx) => (
          <View
            key={`trail_${pIdx}`}
            pointerEvents="none"
            style={[
              styles.trailDot,
              {
                left: pt.x - 10,
                top: pt.y - 10,
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
            <Text style={styles.celebrationSub}>
              You traced the whole path!
            </Text>
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
  segmentLine: {
    position: 'absolute',
    borderRadius: 3,
  },
  dashedGuideline: {
    opacity: 0.6,
  },
  dotPoint: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  nextTargetGlow: {
    borderWidth: 3,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  dotNum: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4B5563',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  nextTargetText: {
    fontSize: 14,
  },
  trailDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34D399',
    opacity: 0.75,
    zIndex: 5,
  },
  celebrationCard: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#10B981',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  celebrationEmoji: {
    fontSize: 24,
  },
  celebrationTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  celebrationSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
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
    paddingVertical: 9,
    borderRadius: 14,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
});
