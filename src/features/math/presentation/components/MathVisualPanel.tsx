import {StyleSheet, View} from 'react-native';

import {AppText, useTheme} from '@shared/ui';

import type {MathVisual} from '../../domain/curriculum/types';

type Props = {
  readonly visual?: MathVisual;
  readonly largeNumber?: number;
};

export function MathVisualPanel({visual, largeNumber}: Props) {
  const {radius, space} = useTheme();
  if (!visual && largeNumber == null) {
    return null;
  }

  if (largeNumber != null) {
    return (
      <View style={[styles.bigNumber, {borderRadius: radius.lg}]}>
        <AppText variant="display" tone="ink">
          {largeNumber}
        </AppText>
      </View>
    );
  }

  const v = visual!;

  if (v.type === 'number' && v.number != null) {
    return (
      <View style={styles.center}>
        <AppText variant="display" tone="ink">
          {v.number}
        </AppText>
        {v.emojis ? <EmojiRow emojis={v.emojis} /> : null}
      </View>
    );
  }

  if (v.type === 'objects' && v.emojis) {
    return (
      <View style={styles.center}>
        {v.number != null ? (
          <AppText variant="headline" tone="ink">
            {v.number}
          </AppText>
        ) : null}
        <EmojiRow emojis={v.emojis} />
      </View>
    );
  }

  if (v.type === 'equation' && v.equation) {
    return (
      <View
        style={[styles.equation, {borderRadius: radius.md, padding: space.md}]}>
        <AppText variant="display" tone="ink">
          {v.equation}
        </AppText>
        {v.emojis ? <EmojiRow emojis={v.emojis} /> : null}
      </View>
    );
  }

  if (v.type === 'sequence' && v.sequence) {
    return (
      <View style={styles.row}>
        {v.sequence.map((n, i) => (
          <View
            key={`s${i}`}
            style={[styles.seqBox, {borderRadius: radius.sm}]}>
            <AppText variant="headline" tone="ink">
              {n == null ? '_' : n}
            </AppText>
          </View>
        ))}
      </View>
    );
  }

  if (v.type === 'pattern' && v.pattern) {
    return (
      <View style={styles.row}>
        {v.pattern.map((item, i) => (
          <AppText key={`p${i}`} variant="title" style={styles.patternItem}>
            {item}
          </AppText>
        ))}
      </View>
    );
  }

  if (v.type === 'compare') {
    return (
      <View style={styles.row}>
        <CompareBubble value={v.compareLeft ?? 0} />
        <AppText variant="title" tone="muted">
          ?
        </AppText>
        <CompareBubble value={v.compareRight ?? 0} />
      </View>
    );
  }

  if (v.type === 'shapes' && v.shape) {
    return (
      <AppText variant="display" style={styles.shape}>
        {v.shape}
      </AppText>
    );
  }

  if (v.type === 'colors' && v.color) {
    return (
      <AppText variant="display" style={styles.shape}>
        {v.color}
      </AppText>
    );
  }

  return null;
}

function EmojiRow({emojis}: {emojis: readonly string[]}) {
  return (
    <View style={styles.emojiRow}>
      {emojis.map((emoji, i) => (
        <AppText key={`e${i}`} style={styles.emoji}>
          {emoji}
        </AppText>
      ))}
    </View>
  );
}

function CompareBubble({value}: {value: number}) {
  const {radius} = useTheme();
  return (
    <View style={[styles.compareBubble, {borderRadius: radius.md}]}>
      <AppText variant="headline" tone="ink">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {alignItems: 'center', gap: 12},
  bigNumber: {
    alignSelf: 'center',
    backgroundColor: '#E8FBF3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3D9A5F',
  },
  equation: {
    alignSelf: 'center',
    backgroundColor: '#FFF6E0',
    borderWidth: 2,
    borderColor: '#F4B400',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  seqBox: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF6FB',
    borderWidth: 2,
    borderColor: '#4DB7E8',
  },
  patternItem: {fontSize: 36},
  shape: {fontSize: 72, textAlign: 'center'},
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {fontSize: 40},
  compareBubble: {
    minWidth: 64,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8C2',
    borderWidth: 2,
    borderColor: '#FF9F1C',
  },
});
