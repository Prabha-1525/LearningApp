import {StyleSheet, View} from 'react-native';

import {CHILD_AVATARS, type ChildAvatarId} from '@assets';

import {AvatarCard} from './AvatarCard';

type AvatarGridProps = {
  readonly selectedId: string | null;
  readonly onSelect: (id: ChildAvatarId) => void;
};

export function AvatarGrid({selectedId, onSelect}: AvatarGridProps) {
  return (
    <View style={styles.grid}>
      {CHILD_AVATARS.map(avatar => (
        <AvatarCard
          key={avatar.id}
          avatar={avatar}
          selected={selectedId === avatar.id}
          onPress={() => onSelect(avatar.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
});
