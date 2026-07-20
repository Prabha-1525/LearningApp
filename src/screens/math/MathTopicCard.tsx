import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

type MathTopicCardProps = {
  readonly title: string;
  readonly image: ImageSourcePropType | null;
  readonly emoji: string;
  readonly heroColor: string;
  readonly progressPercent: number;
  readonly playLabel: string;
  readonly comingSoon?: boolean;
  readonly comingSoonLabel?: string;
  readonly onPress: () => void;
  readonly testID?: string;
};

const GRID_GAP = 14;
const H_PAD = 16;

/**
 * MathAdventure topic card — pastel hero, progress, PLAY.
 */
export function MathTopicCard({
  title,
  image,
  emoji,
  heroColor,
  progressPercent,
  playLabel,
  comingSoon = false,
  comingSoonLabel = 'Soon',
  onPress,
  testID,
}: MathTopicCardProps) {
  const {width} = useWindowDimensions();
  const cardWidth = Math.floor((width - H_PAD * 2 - GRID_GAP) / 2);
  const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{disabled: comingSoon}}
      disabled={comingSoon}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {width: cardWidth, opacity: comingSoon ? 0.72 : 1},
        pressed && !comingSoon && styles.pressed,
      ]}>
      <View style={[styles.hero, {backgroundColor: heroColor}]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.track}>
            <View style={[styles.fill, {width: `${clamped}%`}]} />
          </View>
          <Text style={styles.percent}>{clamped}%</Text>
        </View>

        <View style={[styles.playButton, comingSoon && styles.playSoon]}>
          {comingSoon ? (
            <Text style={styles.playLabel}>
              {comingSoonLabel.toUpperCase()}
            </Text>
          ) : (
            <>
              <Text style={styles.playIcon}>▶</Text>
              <Text style={styles.playLabel}>{playLabel.toUpperCase()}</Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const MATH_TOPIC_GRID_GAP = GRID_GAP;
export const MATH_TOPIC_H_PAD = H_PAD;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  pressed: {
    opacity: 0.94,
    transform: [{scale: 0.98}],
  },
  hero: {
    width: '100%',
    aspectRatio: 1.15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 48,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2A4A',
    minHeight: 36,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#E6EBF0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4CAF50',
  },
  percent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7A88',
    minWidth: 34,
    textAlign: 'right',
  },
  playButton: {
    backgroundColor: '#C9A227',
    borderRadius: 999,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playSoon: {
    backgroundColor: '#B0B8C0',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  playLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
