import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';

import {useShake} from '../animations';
import {SecondaryButton} from '../atoms';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type ErrorViewProps = {
  readonly title?: string;
  readonly message: string;
  readonly retryLabel?: string;
  readonly onRetry?: () => void;
  readonly shakeTrigger?: number;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Molecule — kid-safe error surface with optional retry.
 */
export function ErrorView({
  title = 'Something went wrong',
  message,
  retryLabel = 'Try again',
  onRetry,
  shakeTrigger = 0,
  reduceMotion = false,
  testID,
}: ErrorViewProps) {
  const {theme, radius, space} = useTheme();
  const shakeStyle = useShake(shakeTrigger, reduceMotion);

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.wrap,
        shakeStyle,
        {
          backgroundColor: theme.colors.dangerSoft,
          borderRadius: radius.lg,
          borderColor: theme.colors.danger,
          padding: space.lg,
          gap: space.sm,
        },
      ]}>
      <AppText variant="headline" tone="danger">
        {title}
      </AppText>
      <AppText variant="body" tone="ink">
        {message}
      </AppText>
      {onRetry ? (
        <View style={{marginTop: space.xs}}>
          <SecondaryButton label={retryLabel} onPress={onRetry} />
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
  },
});
