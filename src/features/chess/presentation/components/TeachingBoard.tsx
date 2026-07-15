import {useEffect, type ReactNode} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {AppText, useTheme} from '@shared/ui';

import {
  FILES,
  HIGHLIGHT_COLORS,
  PIECE_GLYPH,
  RANKS,
  type HighlightTone,
  type PieceMap,
  type Square,
  isLightSquare,
} from '../../domain/board/squares';

const LIGHT = '#F0E6D2';
const DARK = '#6B9B76';
const SELECTED = '#F5C84C';

export type TeachingBoardProps = {
  readonly size: number;
  readonly pieces: PieceMap;
  readonly highlights?: readonly Square[];
  readonly highlightTone?: HighlightTone;
  readonly selectedFrom?: Square | null;
  readonly interactive?: boolean;
  readonly onSquarePress?: (square: Square) => void;
  readonly testID?: string;
};

function PulseCell({
  baseColor,
  pulseColor,
  children,
  size,
}: {
  baseColor: string;
  pulseColor: string;
  children: ReactNode;
  size: number;
}) {
  const opacity = useSharedValue(0.35);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.85, {duration: 700}), -1, true);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFill,
    backgroundColor: pulseColor,
    opacity: opacity.value,
  }));
  return (
    <View style={{width: size, height: size, backgroundColor: baseColor}}>
      <Animated.View style={style} />
      <View style={[styles.cellContent, {width: size, height: size}]}>
        {children}
      </View>
    </View>
  );
}

/**
 * Interactive teaching board with highlights and piece glyphs.
 */
export function TeachingBoard({
  size,
  pieces,
  highlights = [],
  highlightTone = 'teach',
  selectedFrom = null,
  interactive = false,
  onSquarePress,
  testID,
}: TeachingBoardProps) {
  const {radius} = useTheme();
  const cell = size / 8;
  const highlightSet = new Set(highlights);

  return (
    <View
      testID={testID}
      accessibilityLabel="Chess teaching board"
      style={[
        styles.board,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
        },
      ]}>
      {RANKS.map(rank => (
        <View key={`r${rank}`} style={styles.row}>
          {FILES.map(file => {
            const sq = `${file}${rank}` as Square;
            const piece = pieces[sq];
            const lit = highlightSet.has(sq);
            const selected = selectedFrom === sq;
            const base = selected ? SELECTED : isLightSquare(sq) ? LIGHT : DARK;
            const glyph = piece ? PIECE_GLYPH[piece] : null;

            const content = glyph ? (
              <AppText
                variant="title"
                style={{fontSize: cell * 0.58, lineHeight: cell * 0.72}}>
                {glyph}
              </AppText>
            ) : null;

            const inner = lit ? (
              <PulseCell
                baseColor={base}
                pulseColor={HIGHLIGHT_COLORS[highlightTone]}
                size={cell}>
                {content}
              </PulseCell>
            ) : (
              <View
                style={[
                  styles.cellContent,
                  {
                    width: cell,
                    height: cell,
                    backgroundColor: base,
                  },
                ]}>
                {content}
              </View>
            );

            if (!interactive) {
              return (
                <View key={sq} style={{width: cell, height: cell}}>
                  {inner}
                </View>
              );
            }

            return (
              <Pressable
                key={sq}
                accessibilityRole="button"
                accessibilityLabel={sq}
                onPress={() => onSquarePress?.(sq)}
                style={{width: cell, height: cell}}>
                {inner}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3D9A5F',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cellContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
