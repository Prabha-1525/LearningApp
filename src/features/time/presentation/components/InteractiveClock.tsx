import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';

type InteractiveClockProps = {
  readonly hour?: number;
  readonly minute?: number;
  readonly targetHour?: number;
  readonly targetMinute?: number;
  readonly isInteractive?: boolean;
  readonly showDigitalTime?: boolean;
  readonly showDayPartTag?: boolean;
  readonly size?: number;
  readonly onTimeChange?: (hour: number, minute: number) => void;
  readonly onMatchSuccess?: () => void;
  readonly showControls?: boolean;
};

const DEFAULT_SIZE = Math.min(Dimensions.get('window').width - 64, 280);

export function InteractiveClock({
  hour: initialHour = 3,
  minute: initialMinute = 0,
  targetHour,
  targetMinute,
  isInteractive = true,
  showDigitalTime = true,
  showDayPartTag = true,
  size = DEFAULT_SIZE,
  onTimeChange,
  onMatchSuccess,
  showControls = true,
}: InteractiveClockProps) {
  const {t} = useTranslation();
  const [currentHour, setCurrentHour] = useState<number>(initialHour);
  const [currentMinute, setCurrentMinute] = useState<number>(initialMinute);
  const [activeHand, setActiveHand] = useState<'hour' | 'minute' | null>(null);
  const [isMatched, setIsMatched] = useState<boolean>(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const clockContainerRef = useRef<View>(null);

  useEffect(() => {
    setCurrentHour(initialHour);
    setCurrentMinute(initialMinute);
  }, [initialHour, initialMinute]);

  const checkTargetMatch = useCallback(
    (h: number, m: number) => {
      if (targetHour !== undefined && targetMinute !== undefined) {
        const normH = h % 12 === 0 ? 12 : h % 12;
        const normTargetH = targetHour % 12 === 0 ? 12 : targetHour % 12;
        const matched = normH === normTargetH && m === targetMinute;
        setIsMatched(matched);
        if (matched) {
          Animated.sequence([
            Animated.spring(bounceAnim, {
              toValue: 1.1,
              friction: 3,
              useNativeDriver: true,
            }),
            Animated.spring(bounceAnim, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }),
          ]).start();
          onMatchSuccess?.();
        }
      }
    },
    [targetHour, targetMinute, onMatchSuccess, bounceAnim],
  );

  const updateTime = useCallback(
    (newHour: number, newMinute: number) => {
      let h = newHour;
      if (h <= 0) {
        h = 12;
      } else if (h > 12) {
        h = ((h - 1) % 12) + 1;
      }
      let m = ((newMinute % 60) + 60) % 60;
      // snap minutes to nearest 5 for clean kids learning
      m = Math.round(m / 5) * 5;
      if (m === 60) {
        m = 0;
      }
      setCurrentHour(h);
      setCurrentMinute(m);
      onTimeChange?.(h, m);
      checkTargetMatch(h, m);
    },
    [onTimeChange, checkTargetMatch],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => isInteractive,
        onMoveShouldSetPanResponder: () => isInteractive,
        onPanResponderGrant: evt => {
          if (!isInteractive) {
            return;
          }
          const {locationX, locationY} = evt.nativeEvent;
          const cx = size / 2;
          const cy = size / 2;
          const dx = locationX - cx;
          const dy = locationY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If touch is within inner 55% radius -> drag hour hand; outside -> minute hand
          if (dist < (size / 2) * 0.55) {
            setActiveHand('hour');
          } else {
            setActiveHand('minute');
          }
        },
        onPanResponderMove: evt => {
          if (!isInteractive) {
            return;
          }
          const {locationX, locationY} = evt.nativeEvent;
          const cx = size / 2;
          const cy = size / 2;
          const dx = locationX - cx;
          const dy = locationY - cy;

          // Compute angle in degrees (0 deg at top 12 o'clock)
          let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          if (angleDeg < 0) {
            angleDeg += 360;
          }

          if (activeHand === 'minute') {
            const min = Math.round((angleDeg / 360) * 60) % 60;
            // Snap to 5-min intervals
            const snappedMin = (Math.round(min / 5) * 5) % 60;
            updateTime(currentHour, snappedMin);
          } else {
            let hr = Math.round(angleDeg / 30);
            if (hr === 0) {
              hr = 12;
            }
            updateTime(hr, currentMinute);
          }
        },
        onPanResponderRelease: () => {
          setActiveHand(null);
        },
      }),
    [isInteractive, size, activeHand, currentHour, currentMinute, updateTime],
  );

  // Hour hand angle: 30 deg per hour + 0.5 deg per minute
  const hourAngle = (currentHour % 12) * 30 + currentMinute * 0.5;
  // Minute hand angle: 6 deg per minute
  const minuteAngle = currentMinute * 6;

  // Day part computation for day/night sky theme
  const dayPart = useMemo(() => {
    if (currentHour >= 6 && currentHour < 12) {
      return {
        label: t('time.dayParts.morning.name', 'Morning'),
        icon: '🌅',
        color: '#D97706',
      };
    }
    if (currentHour === 12 || (currentHour >= 1 && currentHour < 5)) {
      return {
        label: t('time.dayParts.afternoon.name', 'Afternoon'),
        icon: '☀️',
        color: '#2563EB',
      };
    }
    if (currentHour >= 5 && currentHour < 8) {
      return {
        label: t('time.dayParts.evening.name', 'Evening'),
        icon: '🌆',
        color: '#EA580C',
      };
    }
    return {
      label: t('time.dayParts.night.name', 'Night'),
      icon: '🌙',
      color: '#4338CA',
    };
  }, [currentHour, t]);

  const formattedDigital = `${String(currentHour).padStart(2, '0')}:${String(
    currentMinute,
  ).padStart(2, '0')}`;

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <View style={styles.container}>
      {/* Day part & Digital time badge */}
      {showDigitalTime && (
        <View style={styles.topInfoRow}>
          <View
            style={[
              styles.digitalPill,
              isMatched && styles.digitalPillSuccess,
            ]}>
            <Text style={styles.digitalClockIcon}>⏰</Text>
            <Text
              style={[
                styles.digitalTimeText,
                isMatched && styles.digitalTimeSuccess,
              ]}>
              {formattedDigital}
            </Text>
          </View>

          {showDayPartTag && (
            <View
              style={[
                styles.dayPartPill,
                {
                  backgroundColor: `${dayPart.color}15`,
                  borderColor: dayPart.color,
                },
              ]}>
              <Text style={styles.dayPartIcon}>{dayPart.icon}</Text>
              <Text style={[styles.dayPartText, {color: dayPart.color}]}>
                {dayPart.label}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Target hint badge if challenge mode */}
      {targetHour !== undefined && targetMinute !== undefined && (
        <View
          style={[
            styles.targetBanner,
            isMatched ? styles.targetBannerSuccess : styles.targetBannerNormal,
          ]}>
          <Text style={styles.targetBannerText}>
            {isMatched
              ? `🎉 ${t(
                  'time.clock.matchedYay',
                  'Great Job!',
                )} ${formattedDigital}`
              : `🎯 ${t('time.clock.setTarget', 'Set Clock to')}: ${String(
                  targetHour,
                ).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`}
          </Text>
        </View>
      )}

      {/* Analog Clock Face */}
      <Animated.View
        ref={clockContainerRef}
        {...panResponder.panHandlers}
        style={[
          styles.clockFace,
          isMatched ? styles.clockFaceMatched : styles.clockFaceDefault,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          {transform: [{scale: bounceAnim}]},
        ]}>
        {/* Hour Numbers 1 to 12 */}
        {numbers.map((num, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const radius = size / 2 - 28;
          const left = size / 2 + radius * Math.sin(angle) - 14;
          const top = size / 2 - radius * Math.cos(angle) - 14;
          const isSelected =
            currentHour === num || (num === 12 && currentHour === 0);

          return (
            <Pressable
              key={num}
              onPress={() => isInteractive && updateTime(num, currentMinute)}
              style={[
                styles.numberWrap,
                {left, top},
                isSelected && styles.numberWrapSelected,
              ]}>
              <Text
                style={[
                  styles.clockNumber,
                  isSelected && styles.clockNumberSelected,
                ]}>
                {num}
              </Text>
            </Pressable>
          );
        })}

        {/* 12 Minute Tick Marks */}
        {Array.from({length: 12}).map((_, i) => {
          const deg = i * 30;
          return (
            <View
              key={`tick-${i}`}
              style={[
                styles.tickMark,
                {
                  transform: [
                    {rotate: `${deg}deg`},
                    {translateY: -(size / 2 - 6)},
                  ],
                },
              ]}
            />
          );
        })}

        {/* Hour Hand (Short & Blue) */}
        <View
          style={[
            styles.handWrapper,
            {
              transform: [{rotate: `${hourAngle}deg`}],
            },
          ]}>
          <View
            style={[
              styles.hourHand,
              {
                height: size * 0.26,
                top: -size * 0.26,
              },
            ]}
          />
        </View>

        {/* Minute Hand (Long & Coral/Red) */}
        <View
          style={[
            styles.handWrapper,
            {
              transform: [{rotate: `${minuteAngle}deg`}],
            },
          ]}>
          <View
            style={[
              styles.minuteHand,
              {
                height: size * 0.38,
                top: -size * 0.38,
              },
            ]}
          />
        </View>

        {/* Center Pivot Pin */}
        <View style={styles.centerPinOuter}>
          <View style={styles.centerPinInner} />
        </View>

        {/* Interactive touch hint overlay if interactive */}
        {isInteractive && (
          <View style={styles.handLabels}>
            <View style={styles.hourHandTag}>
              <Text style={styles.handTagText}>Hour</Text>
            </View>
            <View style={styles.minuteHandTag}>
              <Text style={styles.handTagText}>Minute</Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Quick Controls / Step Adjusters */}
      {showControls && isInteractive && (
        <View style={styles.controlsRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour - 1, currentMinute)}
            style={styles.stepBtn}>
            <Text style={styles.stepBtnText}>-1 Hr</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour, currentMinute - 30)}
            style={styles.stepBtn}>
            <Text style={styles.stepBtnText}>-30m</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour, 0)}
            style={[styles.stepBtn, styles.stepBtnPrimary]}>
            <Text style={styles.stepBtnPrimaryText}>:00</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour, 30)}
            style={[styles.stepBtn, styles.stepBtnPrimary]}>
            <Text style={styles.stepBtnPrimaryText}>:30</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour, currentMinute + 30)}
            style={styles.stepBtn}>
            <Text style={styles.stepBtnText}>+30m</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateTime(currentHour + 1, currentMinute)}
            style={styles.stepBtn}>
            <Text style={styles.stepBtnText}>+1 Hr</Text>
          </Pressable>
        </View>
      )}

      {/* Drag instruction reminder */}
      {isInteractive && (
        <Text style={styles.dragHint}>
          👉{' '}
          {t(
            'time.clock.dragHint',
            'Touch or drag hands around the clock face!',
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  digitalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  digitalPillSuccess: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  digitalClockIcon: {
    fontSize: 18,
  },
  digitalTimeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  digitalTimeSuccess: {
    color: '#4ADE80',
  },
  dayPartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  dayPartIcon: {
    fontSize: 16,
  },
  dayPartText: {
    fontSize: 14,
    fontWeight: '800',
  },
  targetBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  targetBannerNormal: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  targetBannerSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  targetBannerText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  clockFace: {
    backgroundColor: '#FFFFFF',
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  clockFaceDefault: {
    borderColor: '#3B82F6',
  },
  clockFaceMatched: {
    borderColor: '#10B981',
  },
  numberWrap: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  numberWrapSelected: {
    backgroundColor: '#EFF6FF',
  },
  clockNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  clockNumberSelected: {
    color: '#2563EB',
  },
  tickMark: {
    position: 'absolute',
    width: 3,
    height: 6,
    backgroundColor: '#94A3B8',
    borderRadius: 1.5,
  },
  handWrapper: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourHand: {
    width: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4,
    shadowColor: '#1D4ED8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  minuteHand: {
    width: 5,
    backgroundColor: '#EF4444',
    borderRadius: 3,
    shadowColor: '#DC2626',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  centerPinOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  centerPinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  handLabels: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    gap: 8,
  },
  hourHandTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  minuteHandTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  handTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  stepBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  stepBtnPrimary: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  stepBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  dragHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
});
