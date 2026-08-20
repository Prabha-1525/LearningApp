import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {homeChessIcon} from '@assets';

export type FavoriteGameCardProps = {
  readonly title: string;
  readonly description: string;
  readonly buttonLabel?: string;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function FavoriteGameCard({
  title = 'Chess Mastery',
  description = 'Master the board with logic!',
  buttonLabel = 'Play Now',
  onPress,
  testID,
}: FavoriteGameCardProps) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.leftCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          onPress={onPress}
          style={({pressed}) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}>
          <Text style={styles.playButtonText}>{buttonLabel}</Text>
        </Pressable>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.tiltedCard}>
          <Image
            source={homeChessIcon}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <View style={styles.imgTagContainer}>
            <Text style={styles.imgTagText}>img</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF8EE',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F5C26B',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  leftCol: {
    flex: 1.2,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#78350F',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7A88',
    marginBottom: 4,
  },
  playButton: {
    backgroundColor: '#78350F',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
    shadowColor: '#522409',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playButtonPressed: {
    opacity: 0.85,
    transform: [{scale: 0.97}],
  },
  playButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rightCol: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiltedCard: {
    width: 110,
    height: 120,
    backgroundColor: '#DCDCDC',
    borderRadius: 14,
    padding: 8,
    transform: [{rotate: '8deg'}],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A2A4A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#CECECE',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  imgTagContainer: {
    position: 'absolute',
    bottom: 18,
  },
  imgTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
  },
});
