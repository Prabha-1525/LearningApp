import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {StarCelebration} from '../../features/brainGames/presentation/components/StarCelebration';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type RouteProps = RouteProp<BrainGamesStackParamList, 'GameComplete'>;
type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'GameComplete'>;

const MESSAGES: Record<number, string> = {
  0: '😊 Try again — you can do it!',
  1: '🌟 Good job! Keep going!',
  2: '🎉 Wow, that was great!',
  3: '🏆 Perfect! You are a champion!',
};

export function GameCompleteScreen() {
  const {t} = useTranslation();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const {stars, nextGame} = route.params;

  const message = MESSAGES[stars] ?? MESSAGES[0];

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FAFEFF">
      <View style={styles.container}>
        {/* Celebration */}
        <StarCelebration stars={stars} message={message} />

        {/* Action buttons */}
        <View style={styles.actions}>
          {nextGame && (
            <Pressable
              testID="btn-next-game"
              accessibilityRole="button"
              accessibilityLabel={t(
                'brainGames.complete.nextGame',
                'Next Game',
              )}
              style={[styles.btn, styles.primaryBtn]}
              onPress={() =>
                navigation.navigate(nextGame as any, {level: 1} as any)
              }>
              <Text style={styles.primaryBtnText}>
                {t('brainGames.complete.nextGame', 'Next Game')} →
              </Text>
            </Pressable>
          )}

          <Pressable
            testID="btn-play-again"
            accessibilityRole="button"
            accessibilityLabel={t(
              'brainGames.complete.playAgain',
              'Play Again',
            )}
            style={[styles.btn, styles.secondaryBtn]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryBtnText}>
              {t('brainGames.complete.playAgain', '🔄 Play Again')}
            </Text>
          </Pressable>

          <Pressable
            testID="btn-home"
            accessibilityRole="button"
            accessibilityLabel={t('brainGames.complete.home', 'Back to Games')}
            style={[styles.btn, styles.ghostBtn]}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.ghostBtnText}>
              {t('brainGames.complete.home', '🏠 Back to Games')}
            </Text>
          </Pressable>
        </View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 40,
  },
  actions: {
    gap: 14,
  },
  btn: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#E0E7FF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  ghostBtn: {
    backgroundColor: '#F1F5F9',
  },
  ghostBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
});
