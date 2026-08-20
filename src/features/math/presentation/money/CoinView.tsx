import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type {CoinDenomination} from '../../domain/money/types';

interface CoinViewProps {
  value: CoinDenomination;
  size?: number;
  isSelected?: boolean;
  onPress?: () => void;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const COIN_CONFIG: Record<
  CoinDenomination,
  {
    outerBg: string;
    rimColor: string;
    innerBg?: string;
    textColor: string;
    accentRing?: string;
    shape?: 'round' | 'dodecagon';
  }
> = {
  1: {
    outerBg: '#E2E8F0',
    rimColor: '#94A3B8',
    textColor: '#334155',
  },
  2: {
    outerBg: '#CBD5E1',
    rimColor: '#64748B',
    textColor: '#1E293B',
  },
  5: {
    outerBg: '#FDE047',
    rimColor: '#CA8A04',
    textColor: '#854D0E',
    accentRing: '#EAB308',
  },
  10: {
    outerBg: '#CBD5E1',
    rimColor: '#CA8A04',
    innerBg: '#FEF08A',
    textColor: '#713F12',
    accentRing: '#EAB308',
  },
  20: {
    outerBg: '#FEF08A',
    rimColor: '#94A3B8',
    innerBg: '#F1F5F9',
    textColor: '#0F172A',
    accentRing: '#CA8A04',
  },
};

export function CoinView({
  value,
  size = 64,
  isSelected,
  onPress,
  showLabel = false,
  style,
  disabled = false,
}: CoinViewProps) {
  const config = COIN_CONFIG[value] ?? COIN_CONFIG[1];
  const innerSize = Math.round(size * 0.68);
  const fontSize = Math.round(size * 0.32);
  const symbolSize = Math.round(size * 0.2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`₹${value} coin`}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.outerBg,
          borderColor: isSelected ? '#3B82F6' : config.rimColor,
          borderWidth: isSelected ? 3 : Math.max(2, Math.round(size * 0.05)),
          transform: [{scale: pressed ? 0.94 : 1}],
        },
        isSelected && styles.selectedGlow,
        style,
      ]}>
      {/* Outer coin rim ridge pattern */}
      <View
        style={[
          styles.rimPattern,
          {
            width: size - 6,
            height: size - 6,
            borderRadius: (size - 6) / 2,
            borderColor: config.rimColor,
          },
        ]}>
        {/* Bi-metallic inner core if present */}
        {config.innerBg ? (
          <View
            style={[
              styles.innerCore,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                backgroundColor: config.innerBg,
                borderColor: config.accentRing ?? config.rimColor,
              },
            ]}>
            <Text
              style={[
                styles.rupeeSymbol,
                {fontSize: symbolSize, color: config.textColor},
              ]}>
              ₹
            </Text>
            <Text
              style={[styles.coinValue, {fontSize, color: config.textColor}]}>
              {value}
            </Text>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text
              style={[
                styles.rupeeSymbol,
                {fontSize: symbolSize, color: config.textColor},
              ]}>
              ₹
            </Text>
            <Text
              style={[styles.coinValue, {fontSize, color: config.textColor}]}>
              {value}
            </Text>
          </View>
        )}
      </View>

      {showLabel && (
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>₹{value}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGlow: {
    shadowColor: '#3B82F6',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  rimPattern: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCore: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeSymbol: {
    fontWeight: '800',
    lineHeight: undefined,
    marginTop: -2,
  },
  coinValue: {
    fontWeight: '900',
    marginTop: -4,
  },
  labelPill: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
