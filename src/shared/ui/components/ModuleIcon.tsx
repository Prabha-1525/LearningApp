import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

const MODULE_GLYPHS: Record<string, string> = {
  chess: 'C',
  math: 'M',
  english: 'E',
  tamil: 'T',
  science: 'S',
  memory: 'Me',
  drawing: 'D',
};

export type ModuleIconProps = {
  readonly iconKey: string;
  readonly accentColor: string;
  readonly size?: number;
};

/**
 * Geometric module glyph until illustrated icons are added.
 */
export function ModuleIcon({iconKey, accentColor, size = 56}: ModuleIconProps) {
  const {theme, radius} = useTheme();
  const glyph = MODULE_GLYPHS[iconKey] ?? iconKey.slice(0, 1).toUpperCase();

  return (
    <View
      accessibilityLabel={`${iconKey} module`}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: `${accentColor}22`,
          borderColor: accentColor,
        },
      ]}>
      <AppText
        variant="headline"
        style={{color: accentColor || theme.colors.actionPrimary}}>
        {glyph}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
