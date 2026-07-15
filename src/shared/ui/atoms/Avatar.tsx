import {StyleSheet, View} from 'react-native';

import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

const AVATAR_COLORS = [
  '#0F8B8D',
  '#F4B400',
  '#FF6B4A',
  '#3D9A5F',
  '#4DB7E8',
  '#E4578C',
] as const;

export type AvatarProps = {
  readonly name: string;
  readonly avatarKey?: string;
  readonly size?: number;
  readonly testID?: string;
};

function colorForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? '#0F8B8D';
}

/**
 * Atom — circular child identity glyph.
 * Modules must not invent their own avatar chrome.
 */
export function Avatar({name, avatarKey, size = 72, testID}: AvatarProps) {
  const {theme} = useTheme();
  const key = avatarKey ?? name;
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      testID={testID}
      accessibilityLabel={`${name} avatar`}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colorForKey(key),
          borderColor: theme.colors.surface,
          borderWidth: 3,
        },
      ]}>
      <AppText
        variant={size >= 72 ? 'title' : 'headline'}
        style={{color: theme.colors.actionPrimaryLabel}}>
        {initial}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
