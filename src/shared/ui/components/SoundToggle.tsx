import {StyleSheet, View} from 'react-native';

import {AudioButton} from '../atoms';
import {AppText} from './AppText';
import {useTheme} from '../theme';

export type SoundToggleProps = {
  readonly enabled: boolean;
  readonly onToggle: (enabled: boolean) => void;
  readonly testID?: string;
};

/**
 * @deprecated Prefer AudioButton atom; kept as labeled compound for Settings.
 */
export function SoundToggle({enabled, onToggle, testID}: SoundToggleProps) {
  const {space} = useTheme();

  return (
    <View style={[styles.row, {gap: space.xs}]} testID={testID}>
      <AudioButton enabled={enabled} onToggle={onToggle} />
      <AppText variant="caption" tone="muted">
        {enabled ? 'Sound on' : 'Sound off'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
