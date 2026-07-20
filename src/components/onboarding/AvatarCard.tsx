import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import type {ChildAvatarDef} from '@assets';

type AvatarCardProps = {
  readonly avatar: ChildAvatarDef;
  readonly selected: boolean;
  readonly onPress: () => void;
  readonly size: number;
};

export function AvatarCard({avatar, selected, onPress, size}: AvatarCardProps) {
  const imageSize = Math.round(size * 0.62);

  return (
    <Pressable
      testID={`avatar-${avatar.id}`}
      accessibilityRole="button"
      accessibilityState={{selected}}
      accessibilityLabel={avatar.label}
      onPress={onPress}
      style={[
        styles.card,
        {width: size, height: size + 22},
        selected && styles.selected,
      ]}>
      <View style={[styles.imageFrame, {width: imageSize, height: imageSize}]}>
        {avatar.image ? (
          <Image
            source={avatar.image}
            style={{width: imageSize, height: imageSize}}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.emoji}>{avatar.emoji}</Text>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.label, selected && styles.labelSelected]}>
        {avatar.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selected: {
    borderColor: '#F4A020',
    backgroundColor: '#FFF6E0',
  },
  imageFrame: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#EAF6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 32},
  label: {fontSize: 12, fontWeight: '700', color: '#5B6B74'},
  labelSelected: {color: '#7A3E00'},
});
