import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type GameCardProps = {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly stars: number;
  readonly isUnlocked: boolean;
  readonly accentColor: string;
  readonly onPress?: () => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
};

export function GameCard({
  icon,
  title,
  description,
  stars,
  isUnlocked,
  accentColor,
  onPress,
  style,
  testID,
}: GameCardProps) {
  const opacity = isUnlocked ? 1 : 0.6;

  return (
    <Pressable
      testID={testID}
      disabled={!isUnlocked}
      accessibilityRole="button"
      accessibilityLabel={`${title} game`}
      accessibilityState={{disabled: !isUnlocked}}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {borderColor: accentColor, opacity},
        pressed && isUnlocked && styles.pressed,
        style,
      ]}>
      {/* Top ribbon colour bar */}
      <View style={[styles.ribbon, {backgroundColor: accentColor}]} />

      <View style={styles.content}>
        <View
          style={[styles.iconCircle, {backgroundColor: `${accentColor}25`}]}>
          <Text style={styles.iconText}>{icon}</Text>
          {!isUnlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {description}
          </Text>

          {/* Stars row */}
          <View style={styles.starsRow}>
            {Array.from({length: 3}).map((_, i) => (
              <Text
                key={`star-${i}`}
                style={[styles.star, {opacity: i < stars ? 1 : 0.25}]}>
                ⭐
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 7,
  },
  pressed: {
    transform: [{scale: 0.97}],
    opacity: 0.88,
  },
  ribbon: {
    height: 6,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  star: {
    fontSize: 16,
  },
});
