import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type {NoteDenomination} from '../../domain/money/types';

interface NoteViewProps {
  value: NoteDenomination;
  width?: number;
  height?: number;
  isSelected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  compact?: boolean;
}

const NOTE_THEMES: Record<
  NoteDenomination,
  {
    bg: string;
    border: string;
    darkAccent: string;
    lightPattern: string;
    textColor: string;
    title: string;
  }
> = {
  10: {
    bg: '#D7CCC8',
    border: '#8D6E63',
    darkAccent: '#5D4037',
    lightPattern: '#EFEBE9',
    textColor: '#3E2723',
    title: 'Chocolate Brown',
  },
  20: {
    bg: '#F0F4C3',
    border: '#C0CA33',
    darkAccent: '#9E9D24',
    lightPattern: '#F9FBE7',
    textColor: '#827717',
    title: 'Greenish Yellow',
  },
  50: {
    bg: '#B2EBF2',
    border: '#00ACC1',
    darkAccent: '#00838F',
    lightPattern: '#E0F7FA',
    textColor: '#006064',
    title: 'Fluorescent Blue',
  },
  100: {
    bg: '#E1BEE7',
    border: '#8E24AA',
    darkAccent: '#6A1B9A',
    lightPattern: '#F3E5F5',
    textColor: '#4A148C',
    title: 'Lavender Purple',
  },
  200: {
    bg: '#FFE0B2',
    border: '#FB8C00',
    darkAccent: '#E65100',
    lightPattern: '#FFF3E0',
    textColor: '#BF360C',
    title: 'Bright Orange',
  },
  500: {
    bg: '#CFD8DC',
    border: '#546E7A',
    darkAccent: '#37474F',
    lightPattern: '#ECEFF1',
    textColor: '#263238',
    title: 'Stone Grey',
  },
};

export function NoteView({
  value,
  width = 160,
  height,
  isSelected,
  onPress,
  style,
  disabled = false,
  compact = false,
}: NoteViewProps) {
  const computedHeight = height ?? Math.round(width * 0.48);
  const theme = NOTE_THEMES[value] ?? NOTE_THEMES[10];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`₹${value} note`}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({pressed}) => [
        styles.noteContainer,
        {
          width,
          height: computedHeight,
          backgroundColor: theme.bg,
          borderColor: isSelected ? '#2563EB' : theme.border,
          borderWidth: isSelected ? 3 : 1.5,
          transform: [{scale: pressed ? 0.96 : 1}],
        },
        isSelected && styles.selectedNote,
        style,
      ]}>
      {/* Decorative inner security frame */}
      <View style={[styles.innerFrame, {borderColor: theme.darkAccent}]}>
        {/* Left Side: Watermark & Reserve Bank Stamp */}
        <View style={styles.leftSection}>
          <View
            style={[
              styles.watermarkCircle,
              {backgroundColor: theme.lightPattern, borderColor: theme.border},
            ]}>
            <Text style={[styles.watermarkSymbol, {color: theme.darkAccent}]}>
              ₹
            </Text>
          </View>
          {!compact && (
            <Text
              numberOfLines={1}
              style={[styles.rbiHeader, {color: theme.darkAccent}]}>
              RESERVE BANK OF INDIA
            </Text>
          )}
        </View>

        {/* Security Thread line */}
        <View
          style={[styles.securityThread, {backgroundColor: theme.border}]}
        />

        {/* Center/Right Side: Denomination and Rupee Value */}
        <View style={styles.rightSection}>
          <View style={styles.valueRow}>
            <Text style={[styles.rupeeSign, {color: theme.textColor}]}>₹</Text>
            <Text style={[styles.valueText, {color: theme.textColor}]}>
              {value}
            </Text>
          </View>
          {!compact && (
            <View
              style={[styles.badgePill, {backgroundColor: theme.darkAccent}]}>
              <Text style={styles.badgeText}>₹{value} RUPEES</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedNote: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  watermarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkSymbol: {
    fontSize: 12,
    fontWeight: '800',
  },
  rbiHeader: {
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  securityThread: {
    width: 2,
    height: '90%',
    marginHorizontal: 6,
    opacity: 0.7,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  rupeeSign: {
    fontSize: 14,
    fontWeight: '800',
  },
  valueText: {
    fontSize: 20,
    fontWeight: '900',
  },
  badgePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
