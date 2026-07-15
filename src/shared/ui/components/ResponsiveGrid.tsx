import {
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';

import {getModuleGridColumns, useTheme} from '../theme';

export type ResponsiveGridProps = {
  readonly children: React.ReactNode;
  readonly gap?: number;
  readonly columns?: number;
  readonly style?: ViewStyle;
  readonly testID?: string;
};

/**
 * Phone / tablet column rules for module lists and avatar grids.
 */
export function ResponsiveGrid({
  children,
  gap,
  columns,
  style,
  testID,
}: ResponsiveGridProps) {
  const {width} = useWindowDimensions();
  const {space} = useTheme();
  const colCount = columns ?? getModuleGridColumns(width);
  const gutter = gap ?? space.sm;
  const itemWidthPercent = `${100 / colCount}%` as `${number}%`;

  const items = Array.isArray(children) ? children : [children];

  return (
    <View
      testID={testID}
      style={[styles.wrap, {marginHorizontal: -gutter / 2}, style]}>
      {items.filter(Boolean).map((child, index) => (
        <View
          key={`grid-item-${index}`}
          style={{
            width: itemWidthPercent,
            paddingHorizontal: gutter / 2,
            marginBottom: gutter,
          }}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
