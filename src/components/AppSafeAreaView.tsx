import type {ReactNode} from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {SafeAreaView, type Edge} from 'react-native-safe-area-context';
import {useWindowDimensions} from 'react-native';

import {screenBackground} from '@assets';
import {getScreenHorizontalPadding, useTheme} from '@shared/ui';

export type AppSafeAreaViewProps = {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly contentStyle?: StyleProp<ViewStyle>;
  readonly edges?: readonly Edge[];
  readonly backgroundColor?: string;
  /**
   * Full-bleed background. Defaults to `screenBackground`.
   * Pass `null` for a solid `backgroundColor` / theme canvas only.
   */
  readonly backgroundImage?: ImageSourcePropType | null;
  readonly padded?: boolean;
  readonly statusBarStyle?: 'dark-content' | 'light-content';
  readonly testID?: string;
};

const DEFAULT_EDGES: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

/**
 * Common screen chrome: full-bleed background image + SafeAreaView.
 * Home, games, and auth screens all share the fantasy path art by default.
 */
export function AppSafeAreaView({
  children,
  style,
  contentStyle,
  edges = DEFAULT_EDGES,
  backgroundColor,
  backgroundImage = screenBackground,
  padded = true,
  statusBarStyle = 'dark-content',
  testID,
}: AppSafeAreaViewProps) {
  const {theme} = useTheme();
  const {width} = useWindowDimensions();
  const canvas = backgroundColor ?? theme.colors.canvas;
  const horizontal = padded ? getScreenHorizontalPadding(width) : 0;
  const hasImage = backgroundImage != null;

  const body = (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[
        styles.flex,
        hasImage ? styles.transparent : {backgroundColor: canvas},
        {paddingHorizontal: horizontal},
        contentStyle,
      ]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={hasImage ? 'transparent' : canvas}
        translucent={hasImage}
      />
      {children}
    </SafeAreaView>
  );

  if (!hasImage) {
    return (
      <View style={[styles.root, {backgroundColor: canvas}, style]}>
        {body}
      </View>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.root, style]}
      resizeMode="cover"
      imageStyle={styles.imageFill}>
      {body}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
});
