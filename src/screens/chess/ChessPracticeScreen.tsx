import {useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AppSafeAreaView} from '@components';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppText, PrimaryButton, TopAppBar, space, useTheme} from '@shared/ui';

import type {ChessStackParamList} from '@navigation/chessTypes';

type Props = NativeStackScreenProps<ChessStackParamList, 'Practice'>;

const LIGHT = '#F0E6D2';
const DARK = '#6B9B76';
const BOARD_SIZE = 4;

/**
 * Kid practice: tap the light squares (color vision + board awareness).
 */
export function ChessPracticeScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {radius, space: themeSpace} = useTheme();
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(t('chess.practice.prompt'));

  const targets = useMemo(() => {
    const lights: string[] = [];
    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        if ((r + c) % 2 === 0) {
          lights.push(`${r}-${c}`);
        }
      }
    }
    return new Set(lights);
  }, []);

  const [found, setFound] = useState<Set<string>>(new Set());

  const onTap = (row: number, col: number) => {
    const id = `${row}-${col}`;
    const isLight = targets.has(id);
    if (!isLight) {
      setMessage(t('chess.practice.dark'));
      return;
    }
    if (found.has(id)) {
      setMessage(t('chess.practice.already'));
      return;
    }
    const next = new Set(found);
    next.add(id);
    setFound(next);
    setScore(next.size);
    if (next.size >= targets.size) {
      setMessage(t('chess.practice.win'));
    } else {
      setMessage(t('chess.practice.good'));
    }
  };

  const cell = 64;

  return (
    <AppSafeAreaView testID="chess-practice-screen">
      <TopAppBar
        title={t('chess.practice.title')}
        subtitle={t('chess.practice.subtitle')}
        onBack={() => navigation.goBack()}
      />
      <View style={[styles.body, {gap: themeSpace.md}]}>
        <AppText variant="body" tone="muted" style={styles.center}>
          {message}
        </AppText>
        <AppText variant="headline" tone="ink" style={styles.center}>
          {t('chess.practice.score', {score, total: targets.size})}
        </AppText>
        <View
          style={[
            styles.board,
            {
              borderRadius: radius.md,
              width: cell * BOARD_SIZE,
              height: cell * BOARD_SIZE,
            },
          ]}>
          {Array.from({length: BOARD_SIZE}, (_, row) => (
            <View key={`r${row}`} style={styles.row}>
              {Array.from({length: BOARD_SIZE}, (__, col) => {
                const isDark = (row + col) % 2 === 1;
                const id = `${row}-${col}`;
                const selected = found.has(id);
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isDark
                        ? t('chess.practice.darkSquare')
                        : t('chess.practice.lightSquare')
                    }
                    onPress={() => onTap(row, col)}
                    style={[
                      styles.cell,
                      {
                        width: cell,
                        height: cell,
                        backgroundColor: isDark ? DARK : LIGHT,
                        opacity: selected ? 0.55 : 1,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
        <PrimaryButton
          label={t('chess.practice.done')}
          onPress={() => navigation.navigate('Hub')}
        />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    paddingBottom: space.xl,
  },
  center: {
    textAlign: 'center',
  },
  board: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3D9A5F',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {},
});
