import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {
  ShapeSortingContainer,
  ShapeSortingItem,
  ShapeSortingLevel,
} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeSorterBoardProps {
  readonly level: ShapeSortingLevel;
  readonly onCompleteLevel: (score: number, stars: number) => void;
}

export function ShapeSorterBoard({
  level,
  onCompleteLevel,
}: ShapeSorterBoardProps) {
  const [remainingItems, setRemainingItems] = useState<ShapeSortingItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [sortedMap, setSortedMap] = useState<
    Record<string, ShapeSortingItem[]>
  >({});
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRemainingItems([...level.items]);
    setSelectedItemId(null);
    setSortedMap({});
    successScale.setValue(0);
    shapesAudio.speak(
      `Shape Sorting Level ${level.levelNumber}! ${level.title}. Tap a shape, then tap the right box!`,
    );
  }, [level, successScale]);

  const handleSelectItem = (item: ShapeSortingItem) => {
    setSelectedItemId(item.id);
    shapesAudio.playTone(493, 60);
    shapesAudio.speak(`Selected ${item.shapeId}. Where does it belong?`);
  };

  const handleSelectContainer = (container: ShapeSortingContainer) => {
    if (!selectedItemId) return;

    const currentItem = remainingItems.find(i => i.id === selectedItemId);
    if (!currentItem) return;

    if (currentItem.shapeId === container.targetShapeId) {
      shapesAudio.playSortingSnap();
      shapesAudio.speak(`Great job! In the ${container.title} box!`);

      const updatedRemaining = remainingItems.filter(
        i => i.id !== selectedItemId,
      );
      const updatedSorted = {
        ...sortedMap,
        [container.id]: [...(sortedMap[container.id] ?? []), currentItem],
      };

      setRemainingItems(updatedRemaining);
      setSortedMap(updatedSorted);
      setSelectedItemId(null);

      if (updatedRemaining.length === 0) {
        shapesAudio.playCelebrationFanfare();
        shapesAudio.speak(
          'Fantastic! All shapes are sorted perfectly into their boxes!',
        );
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      }
    } else {
      shapesAudio.playTone(240, 120);
      shapesAudio.speak(
        `Oops, that is not a ${container.targetShapeId}. Try another box!`,
      );
      setSelectedItemId(null);
    }
  };

  const handleFinish = () => {
    onCompleteLevel(level.items.length, 3);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.levelTitle}>{level.title}</Text>
      <Text style={styles.subtitle}>
        Tap a shape below, then tap its matching box:
      </Text>

      {/* Target Containers Row */}
      <View style={styles.containersRow}>
        {level.containers.map(c => {
          const inBox = sortedMap[c.id] ?? [];
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`Sorting box for ${c.title}`}
              onPress={() => handleSelectContainer(c)}
              style={[
                styles.boxCard,
                {borderColor: c.color},
                selectedItemId ? styles.boxCardActive : null,
              ]}>
              <View style={[styles.boxHeader, {backgroundColor: c.color}]}>
                <Text style={styles.boxEmoji}>{c.emoji}</Text>
                <Text style={styles.boxTitle}>{c.title}</Text>
              </View>

              {/* Sorted Items in Box */}
              <View style={styles.boxContent}>
                {inBox.length === 0 ? (
                  <Text style={styles.emptyBoxHint}>Drop here 📥</Text>
                ) : (
                  <View style={styles.sortedItemsRow}>
                    {inBox.map((itm, idx) => (
                      <Text key={idx} style={styles.sortedEmoji}>
                        {itm.emoji}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Items to be sorted */}
      <View style={styles.itemsTray}>
        <Text style={styles.trayTitle}>
          Remaining Shapes ({remainingItems.length}):
        </Text>
        <View style={styles.trayGrid}>
          {remainingItems.map(itm => {
            const isSelected = selectedItemId === itm.id;
            return (
              <Pressable
                key={itm.id}
                accessibilityRole="button"
                accessibilityLabel={`Shape ${itm.shapeId}`}
                onPress={() => handleSelectItem(itm)}
                style={[
                  styles.itemPill,
                  isSelected && styles.itemPillSelected,
                ]}>
                <Text style={styles.itemEmoji}>{itm.emoji}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Level Completion Card */}
      {remainingItems.length === 0 && (
        <Animated.View
          style={[styles.celebrationBox, {transform: [{scale: successScale}]}]}>
          <Text style={styles.celebrationEmoji}>📦 ⭐ 🎉</Text>
          <Text style={styles.celebrationTitle}>Sorting Complete!</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue to next level"
            onPress={handleFinish}
            style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Next Level ➔</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  containersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  boxCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  boxCardActive: {
    borderStyle: 'dashed',
    backgroundColor: '#FEF3C7',
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  boxEmoji: {
    fontSize: 18,
  },
  boxTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  boxContent: {
    padding: 12,
    minHeight: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBoxHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  sortedItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  sortedEmoji: {
    fontSize: 24,
  },
  itemsTray: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  trayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  itemPill: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemPillSelected: {
    borderColor: '#F59E0B',
    borderWidth: 3.5,
    backgroundColor: '#FFFBEB',
    transform: [{scale: 1.1}],
  },
  itemEmoji: {
    fontSize: 32,
  },
  celebrationBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  celebrationEmoji: {
    fontSize: 26,
  },
  celebrationTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#B45309',
  },
  continueBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 16,
    marginTop: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
