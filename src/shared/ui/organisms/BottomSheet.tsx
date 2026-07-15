import type {ReactNode} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useFadeIn, useSlideUp} from '../animations';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type BottomSheetProps = {
  readonly visible: boolean;
  readonly title?: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Organism — slide-up sheet for parent gates, pickers, and module options.
 */
export function BottomSheet({
  visible,
  title,
  children,
  onClose,
  reduceMotion = false,
  testID,
}: BottomSheetProps) {
  const {theme, radius, space} = useTheme();
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeIn(visible, reduceMotion);
  const sheetStyle = useSlideUp(visible, reduceMotion, 48);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={[styles.backdrop, {backgroundColor: theme.colors.overlay}]}
          onPress={onClose}
          accessibilityLabel="Dismiss sheet"
        />
        <Animated.View
          testID={testID}
          style={[
            styles.sheet,
            fadeStyle,
            sheetStyle,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              paddingHorizontal: space.lg,
              paddingTop: space.lg,
              paddingBottom: Math.max(insets.bottom, space.lg),
              gap: space.md,
            },
          ]}>
          <View
            style={[styles.handle, {backgroundColor: theme.colors.border}]}
          />
          {title ? (
            <AppText variant="title" tone="ink">
              {title}
            </AppText>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    zIndex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    marginBottom: 4,
  },
});
