import {Modal, Pressable, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import type {ReactNode} from 'react';

import {useFadeIn, useSlideUp} from '../animations';
import {PrimaryButton, SecondaryButton} from '../atoms';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type DialogProps = {
  readonly visible: boolean;
  readonly title: string;
  readonly message?: string;
  readonly children?: ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm?: () => void;
  readonly onCancel: () => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Molecule — centered confirm/info dialog for shell and modules.
 */
export function Dialog({
  visible,
  title,
  message,
  children,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  reduceMotion = false,
  testID,
}: DialogProps) {
  const {theme, radius, space} = useTheme();
  const fadeStyle = useFadeIn(visible, reduceMotion);
  const panelStyle = useSlideUp(visible, reduceMotion, 16);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}>
      <View style={styles.root} testID={testID}>
        <Pressable
          style={[styles.backdrop, {backgroundColor: theme.colors.overlay}]}
          onPress={onCancel}
          accessibilityLabel="Dismiss dialog"
        />
        <Animated.View
          style={[
            styles.panel,
            fadeStyle,
            panelStyle,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: radius.lg,
              padding: space.lg,
              gap: space.md,
              borderColor: theme.colors.border,
            },
          ]}>
          <AppText variant="title" tone="ink">
            {title}
          </AppText>
          {message ? (
            <AppText variant="body" tone="muted">
              {message}
            </AppText>
          ) : null}
          {children}
          <View style={[styles.actions, {gap: space.sm}]}>
            {onConfirm ? (
              <PrimaryButton label={confirmLabel} onPress={onConfirm} />
            ) : null}
            <SecondaryButton label={cancelLabel} onPress={onCancel} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  panel: {
    zIndex: 1,
    borderWidth: 1,
  },
  actions: {
    marginTop: 4,
  },
});
