import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

type HomeSubjectCardProps = {
  readonly title: string;
  readonly image: ImageSourcePropType | null;
  readonly progressPercent: number;
  readonly showNewBadge?: boolean;
  readonly playLabel: string;
  readonly onPress: () => void;
  readonly testID?: string;
};

const GRID_GAP = 14;
const H_PAD = 20;

/**
 * Home subject tile — image, progress bar, PLAY (matches product mock).
 */
export function HomeSubjectCard({
  title,
  image,
  progressPercent,
  showNewBadge = false,
  playLabel,
  onPress,
  testID,
}: HomeSubjectCardProps) {
  const {width} = useWindowDimensions();
  const cardWidth = Math.floor((width - H_PAD * 2 - GRID_GAP) / 2);
  const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${clamped} percent, ${playLabel}`}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {width: cardWidth},
        pressed && styles.pressed,
      ]}>
      <View style={styles.imageBox}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        {showNewBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, {width: `${clamped}%`}]} />
        </View>
        <Text style={styles.percent}>{clamped}%</Text>
      </View>

      <View style={styles.playButton}>
        <Text style={styles.playIcon}>▶</Text>
        <Text style={styles.playLabel}>{playLabel.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
}

export const HOME_GRID_GAP = GRID_GAP;
export const HOME_H_PAD = H_PAD;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    gap: 10,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{scale: 0.98}],
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F6F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E85D4C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 8,
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
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  playLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
