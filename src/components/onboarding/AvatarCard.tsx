import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import type {ChildAvatarDef} from '@assets';

type AvatarCardProps = {
  readonly avatar: ChildAvatarDef;
  readonly selected: boolean;
  readonly onPress: () => void;
};

export function AvatarCard({avatar, selected, onPress}: AvatarCardProps) {
  return (
    <Pressable
      testID={`avatar-${avatar.id}`}
      accessibilityRole="button"
      accessibilityState={{selected}}
      accessibilityLabel={avatar.label}
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}>
      {avatar.image ? (
        <Image source={avatar.image} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{avatar.emoji}</Text>
        </View>
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {avatar.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    aspectRatio: 0.85,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#F4A020',
    backgroundColor: '#FFF6E0',
    shadowColor: '#F4A020',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  image: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
  },
  emojiWrap: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#EAF6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 36},
  label: {fontSize: 12, fontWeight: '700', color: '#5B6B74'},
  labelSelected: {color: '#7A3E00'},
});
