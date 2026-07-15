import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type LoadingProps = {
  readonly label?: string;
  readonly fullScreen?: boolean;
  readonly testID?: string;
};

/**
 * Atom — consistent loading treatment across modules.
 */
export function Loading({label, fullScreen = false, testID}: LoadingProps) {
  const {theme, space} = useTheme();

  return (
    <View
      testID={testID}
      accessibilityLabel={label ?? 'Loading'}
      style={[
        styles.base,
        fullScreen && styles.fullScreen,
        {
          gap: space.sm,
          backgroundColor: fullScreen ? theme.colors.canvas : 'transparent',
        },
      ]}>
      <ActivityIndicator color={theme.colors.actionPrimary} size="large" />
      {label ? (
        <AppText variant="body" tone="muted">
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
  },
});
