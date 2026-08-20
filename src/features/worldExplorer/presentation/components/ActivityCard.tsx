import {Pressable, StyleSheet, Text, View} from 'react-native';

export type ActivityCardProps = {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly progressText?: string;
  readonly stars?: number;
  readonly isUnlocked?: boolean;
  readonly accentColor?: string;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function ActivityCard({
  icon,
  title,
  description,
  progressText,
  stars = 0,
  isUnlocked = true,
  accentColor = '#3B82F6',
  onPress,
  testID,
}: ActivityCardProps) {
  return (
    <Pressable
      testID={testID}
      disabled={!isUnlocked}
      accessibilityRole="button"
      accessibilityLabel={`${title} activity`}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {
          borderColor: accentColor,
          opacity: isUnlocked ? 1 : 0.55,
        },
        pressed && isUnlocked && styles.pressed,
      ]}>
      <View style={[styles.iconWrap, {backgroundColor: `${accentColor}1D`}]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{title}</Text>
          {!isUnlocked && <Text style={styles.lockBadge}>🔒</Text>}
        </View>

        <Text style={styles.descriptionText} numberOfLines={2}>
          {description}
        </Text>

        {progressText ? (
          <View style={styles.progressRow}>
            <Text style={[styles.progressText, {color: accentColor}]}>
              {progressText}
            </Text>
            {stars > 0 && (
              <View style={styles.starRow}>
                {Array.from({length: Math.min(3, stars)}).map((_, i) => (
                  <Text key={`act-star-${i}`} style={styles.starIcon}>
                    ★
                  </Text>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#1E293B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 6,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 30,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  lockBadge: {
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starIcon: {
    fontSize: 14,
    color: '#F59E0B',
  },
});
