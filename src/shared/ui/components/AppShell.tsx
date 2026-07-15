import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useWindowDimensions} from 'react-native';

import {getScreenHorizontalPadding, useTheme} from '../theme';

export type AppShellProps = {
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly padded?: boolean;
  readonly edges?: {
    readonly top?: boolean;
    readonly bottom?: boolean;
  };
  readonly testID?: string;
};

/**
 * Canvas background + safe area + responsive horizontal padding.
 */
export function AppShell({
  children,
  style,
  padded = true,
  edges = {top: true, bottom: true},
  testID,
}: AppShellProps) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const {theme} = useTheme();
  const horizontal = padded ? getScreenHorizontalPadding(width) : 0;

  return (
    <View
      testID={testID}
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.canvas,
          paddingTop: edges.top === false ? 0 : insets.top,
          paddingBottom: edges.bottom === false ? 0 : insets.bottom,
          paddingHorizontal: horizontal,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
