import {StyleSheet, View} from 'react-native';

import {PrimaryButton, SecondaryButton} from '../atoms';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type EmptyStateProps = {
  readonly title: string;
  readonly message: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly secondaryActionLabel?: string;
  readonly onSecondaryAction?: () => void;
  readonly testID?: string;
};

/**
 * Molecule — friendly blank slate for any module list/detail.
 */
export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  testID,
}: EmptyStateProps) {
  const {theme, radius, space} = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.lg,
          borderColor: theme.colors.border,
          padding: space.lg,
          gap: space.sm,
        },
      ]}>
      <AppText variant="headline" tone="ink">
        {title}
      </AppText>
      <AppText variant="body" tone="muted">
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} />
      ) : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <SecondaryButton
          label={secondaryActionLabel}
          onPress={onSecondaryAction}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    alignItems: 'stretch',
  },
});
