import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {ContinentInfo} from '../../domain/catalog/continents';

export type ContinentCardProps = {
  readonly continent: ContinentInfo;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function ContinentCard({
  continent,
  onPress,
  testID,
}: ContinentCardProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Continent ${continent.name}`}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {borderColor: continent.color},
        pressed && styles.pressed,
      ]}>
      <View
        style={[styles.iconWrap, {backgroundColor: `${continent.color}20`}]}>
        <Text style={styles.iconText}>{continent.icon}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.nameText}>{continent.name}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {continent.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 6,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
});
