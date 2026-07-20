import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {CHILD_AVATARS, type ChildAvatarId} from '@assets';

import {AvatarCard} from './AvatarCard';

type AvatarGridProps = {
  readonly selectedId: string | null;
  readonly onSelect: (id: ChildAvatarId) => void;
};

const COLUMNS = 3;
const GAP = 12;

export function AvatarGrid({selectedId, onSelect}: AvatarGridProps) {
  const {width: windowWidth} = useWindowDimensions();
  // Match AppSafeAreaView horizontal padding (~24 on phone).
  const contentWidth = Math.max(280, windowWidth - 48);
  const cardSize = Math.floor((contentWidth - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.grid}>
      {CHILD_AVATARS.map(avatar => (
        <AvatarCard
          key={avatar.id}
          avatar={avatar}
          size={cardSize}
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
    rowGap: GAP,
  },
});
