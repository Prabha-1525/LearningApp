import {Image, StyleSheet, Text, View} from 'react-native';

import {leoWave} from '@assets';

type LeoCoachBannerProps = {
  readonly caption: string;
  readonly tone?: 'default' | 'encourage' | 'correct';
};

/** Leo avatar + speech bubble — reusable coach strip. */
export function LeoCoachBanner({
  caption,
  tone = 'default',
}: LeoCoachBannerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        <Image source={leoWave} style={styles.leo} resizeMode="contain" />
      </View>
      <View
        style={[
          styles.bubble,
          tone === 'encourage' && styles.bubbleEncourage,
          tone === 'correct' && styles.bubbleCorrect,
        ]}>
        <Text style={styles.bubbleText}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7E6',
    borderWidth: 3,
    borderColor: '#F5A623',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leo: {width: 56, height: 56},
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#93C5FD',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleEncourage: {
    borderColor: '#F5A623',
    backgroundColor: '#FFF8E7',
  },
  bubbleCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
    lineHeight: 22,
  },
});
