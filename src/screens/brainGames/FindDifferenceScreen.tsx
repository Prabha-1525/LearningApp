import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {DIFFERENCE_LEVELS} from '../../features/brainGames/domain/catalog/differenceData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<
  BrainGamesStackParamList,
  'FindDifference'
>;

const {width} = Dimensions.get('window');
const GRID_SIZE = 3;
const CELL_SIZE = Math.floor((width - 56) / GRID_SIZE / 2);

export function FindDifferenceScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [levelIdx, setLevelIdx] = useState(0);
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [shownWrong, setShownWrong] = useState(false);

  const level = DIFFERENCE_LEVELS[levelIdx] ?? DIFFERENCE_LEVELS[0];

  const bounceValue = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{scale: bounceValue.value}],
  }));

  const handleRightCellPress = useCallback(
    (idx: number) => {
      if (found || shownWrong) {
        return;
      }
      if (idx === level.diffIndex) {
        bounceValue.value = withSequence(
          withSpring(1.08, {damping: 8}),
          withSpring(1, {damping: 12}),
        );
        setFound(true);
        setScore(s => s + 1);
        setTimeout(() => {
          setFound(false);
          setWrongIdx(null);
          const nextL = levelIdx + 1;
          if (nextL < DIFFERENCE_LEVELS.length) {
            setLevelIdx(nextL);
          } else {
            const stars =
              score >= DIFFERENCE_LEVELS.length - 1
                ? 3
                : score >= Math.floor(DIFFERENCE_LEVELS.length * 0.5)
                ? 2
                : 1;
            recordGameCompletion('find-the-difference', stars);
            navigation.navigate('GameComplete', {
              gameId: 'find-the-difference',
              stars,
            });
          }
        }, 1000);
      } else {
        setWrongIdx(idx);
        setShownWrong(true);
        setTimeout(() => {
          setWrongIdx(null);
          setShownWrong(false);
        }, 700);
      }
    },
    [
      bounceValue,
      found,
      level.diffIndex,
      levelIdx,
      navigation,
      score,
      shownWrong,
    ],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF2F8">
      <GameHeader
        title={t(
          'brainGames.games.findDifference.title',
          'Find the Difference',
        )}
        emoji="🔍"
        accentColor="#BE185D"
        score={score}
        totalScore={DIFFERENCE_LEVELS.length}
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.prompt}>
          {t(
            'brainGames.findDifference.prompt',
            'Find the one that is different!',
          )}
        </Text>

        {found && (
          <Text style={styles.foundText}>
            {t('brainGames.correct', '🎉 Found it!')}
          </Text>
        )}

        <Animated.View style={[styles.panelsRow, bounceStyle]}>
          {/* Left panel — original */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>
              {t('brainGames.findDifference.original', 'Original')}
            </Text>
            <View style={styles.grid}>
              {level.leftGrid.map((cell, i) => (
                <View
                  key={`left-${i}`}
                  style={[styles.cell, {width: CELL_SIZE, height: CELL_SIZE}]}>
                  <Text
                    style={[styles.cellEmoji, {fontSize: CELL_SIZE * 0.55}]}>
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Right panel — has one different item */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>
              {t('brainGames.findDifference.find', 'Spot it!')}
            </Text>
            <View style={styles.grid}>
              {level.rightGrid.map((cell, i) => (
                <Pressable
                  key={`right-${i}`}
                  testID={`diff-cell-${i}`}
                  style={[
                    styles.cell,
                    {width: CELL_SIZE, height: CELL_SIZE},
                    i === level.diffIndex && found && styles.foundCell,
                    i === wrongIdx && styles.wrongCell,
                  ]}
                  onPress={() => handleRightCellPress(i)}>
                  <Text
                    style={[styles.cellEmoji, {fontSize: CELL_SIZE * 0.55}]}>
                    {cell}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
  prompt: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9D174D',
    textAlign: 'center',
  },
  foundText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    textAlign: 'center',
  },
  panelsRow: {
    flexDirection: 'row',
    gap: 0,
    alignItems: 'flex-start',
  },
  panel: {
    flex: 1,
    gap: 8,
    alignItems: 'center',
  },
  panelLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#BE185D',
  },
  divider: {
    width: 2,
    backgroundColor: '#FBCFE8',
    alignSelf: 'stretch',
    marginHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FBCFE8',
  },
  foundCell: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
    borderWidth: 2.5,
  },
  wrongCell: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 2.5,
  },
  cellEmoji: {
    textAlign: 'center',
  },
});
