import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {MascotSpot} from './MascotSpot';
import {RewardCard} from './RewardCard';

export type RewardBurstProps = {
  readonly title: string;
  readonly detail: string;
  readonly starsEarned: number;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Celebration pattern for the Reward screen.
 * When reduceMotion is true, skips decorative mascot emphasis.
 */
export function RewardBurst({
  title,
  detail,
  starsEarned,
  reduceMotion = false,
  testID,
}: RewardBurstProps) {
  const {space} = useTheme();

  return (
    <View style={[styles.wrap, {gap: space.lg}]} testID={testID}>
      {reduceMotion ? null : <MascotSpot mood="cheer" label="Nice work" />}
      <AppText variant="display" tone="ink" style={styles.center}>
        You did it!
      </AppText>
      <RewardCard title={title} detail={detail} starsEarned={starsEarned} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'stretch',
  },
  center: {
    textAlign: 'center',
  },
});
