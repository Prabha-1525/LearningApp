import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {GameHeader} from '../../features/brainGames/presentation/components/GameHeader';
import {SORT_LEVELS} from '../../features/brainGames/domain/catalog/sortItData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'SortIt'>;

export function SortItScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [levelIdx, setLevelIdx] = useState(0);
  const level = SORT_LEVELS[levelIdx] ?? SORT_LEVELS[0];

  const [selected, setSelected] = useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<Record<string, string>>({});
  const [wrongItem, setWrongItem] = useState<string | null>(null);

  const bounceScale = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{scale: bounceScale.value}],
  }));

  const remainingItems = useMemo(
    () => level.items.filter(item => !sortedItems[item.id]),
    [level.items, sortedItems],
  );

  const handleItemSelect = useCallback((itemId: string) => {
    setSelected(prev => (prev === itemId ? null : itemId));
  }, []);

  const handleGroupDrop = useCallback(
    (groupId: string) => {
      if (!selected) {
        return;
      }
      const item = level.items.find(it => it.id === selected);
      if (!item) {
        return;
      }
      if (item.groupId === groupId) {
        bounceScale.value = withSequence(
          withSpring(1.06, {damping: 8}),
          withSpring(1, {damping: 12}),
        );
        setSortedItems(prev => ({...prev, [selected]: groupId}));
        setSelected(null);
        setWrongItem(null);

        // Check if all placed
        const newSorted = {...sortedItems, [selected]: groupId};
        if (Object.keys(newSorted).length === level.items.length) {
          setTimeout(() => {
            const stars = 3;
            recordGameCompletion('sort-it', stars);
            const nextL = levelIdx + 1;
            if (nextL < SORT_LEVELS.length) {
              setLevelIdx(nextL);
              setSortedItems({});
              setSelected(null);
            } else {
              navigation.navigate('GameComplete', {
                gameId: 'sort-it',
                stars,
                nextGame: 'FindDifference',
              });
            }
          }, 500);
        }
      } else {
        setWrongItem(selected);
        setTimeout(() => {
          setWrongItem(null);
          setSelected(null);
        }, 700);
      }
    },
    [bounceScale, level.items, levelIdx, navigation, selected, sortedItems],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EFF6FF">
      <GameHeader
        title={t('brainGames.games.sortIt.title', 'Sort It')}
        emoji="📦"
        accentColor="#2563EB"
        score={Object.keys(sortedItems).length}
        totalScore={level.items.length}
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.prompt}>
          {t('brainGames.sortIt.prompt', 'Tap an item, then tap its group!')}
        </Text>

        {/* Items to sort */}
        <View style={styles.itemsRow}>
          {remainingItems.map(item => (
            <Pressable
              key={item.id}
              testID={`sort-item-${item.id}`}
              style={[
                styles.itemChip,
                selected === item.id && styles.itemChipSelected,
                wrongItem === item.id && styles.itemChipWrong,
              ]}
              onPress={() => handleItemSelect(item.id)}>
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <Text style={styles.itemLabel}>{item.label}</Text>
            </Pressable>
          ))}
          {remainingItems.length === 0 && (
            <Text style={styles.allSorted}>
              {t('brainGames.sortIt.allSorted', '🎉 All sorted!')}
            </Text>
          )}
        </View>

        {/* Groups */}
        <Animated.View style={[styles.groups, bounceStyle]}>
          {level.groups.map(group => {
            const placedItems = level.items.filter(
              item => sortedItems[item.id] === group.id,
            );
            return (
              <Pressable
                key={group.id}
                testID={`sort-group-${group.id}`}
                style={[
                  styles.groupBucket,
                  {backgroundColor: group.color, borderColor: group.color},
                  selected !== null && styles.groupBucketActive,
                ]}
                onPress={() => handleGroupDrop(group.id)}>
                <Text style={styles.groupIcon}>{group.icon}</Text>
                <Text style={styles.groupLabel}>{group.label}</Text>

                {/* Placed items inside */}
                <View style={styles.placedRow}>
                  {placedItems.map(item => (
                    <Text key={`placed-${item.id}`} style={styles.placedEmoji}>
                      {item.emoji}
                    </Text>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
    flexGrow: 1,
  },
  prompt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    textAlign: 'center',
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    minHeight: 80,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#BFDBFE',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemChipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
    transform: [{scale: 1.08}],
  },
  itemChipWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  allSorted: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  groups: {
    flexDirection: 'row',
    gap: 16,
  },
  groupBucket: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    minHeight: 160,
    alignItems: 'center',
    gap: 8,
    borderWidth: 3,
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  groupBucketActive: {
    transform: [{scale: 1.02}],
    shadowOpacity: 0.2,
    elevation: 5,
  },
  groupIcon: {
    fontSize: 28,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  placedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  placedEmoji: {
    fontSize: 26,
  },
});
