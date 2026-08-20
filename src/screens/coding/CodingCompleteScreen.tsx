import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'CodingComplete'>;
type Route = RouteProp<CodingStackParamList, 'CodingComplete'>;

export function CodingCompleteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const {starsEarned = 3, topicTitle = 'Lesson'} = route.params ?? {};

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0FDF4">
      <View style={styles.container}>
        {/* Celebration Trophy */}
        <View style={styles.trophyCircle}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </View>

        <Text style={styles.title}>
          {t('coding.complete.title', 'Awesome Coding Champion!')}
        </Text>
        <Text style={styles.subtitle}>
          You completed <Text style={styles.topicBold}>{topicTitle}</Text>!
        </Text>

        {/* Stars Award */}
        <View style={styles.starsRow}>
          {Array.from({length: 3}).map((_, i) => (
            <Text
              key={i}
              style={[
                styles.starEmoji,
                i < starsEarned ? styles.starFilled : styles.starEmpty,
              ]}>
              ⭐
            </Text>
          ))}
        </View>

        {/* Badges preview hint */}
        <View style={styles.badgePreview}>
          <Text style={styles.badgeEmoji}>🤖🧩🐛💻🏆</Text>
          <Text style={styles.badgeHint}>
            Check your Badges Tab to see your Coding Achievements!
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Home')}
            style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {t('coding.complete.backHome', 'Logic & Coding Hub 🏠')}
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  trophyCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FEF3C7',
    borderWidth: 4,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  trophyEmoji: {
    fontSize: 54,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#047857',
    textAlign: 'center',
  },
  topicBold: {
    fontWeight: '900',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 10,
  },
  starEmoji: {
    fontSize: 40,
  },
  starFilled: {
    transform: [{scale: 1.15}],
  },
  starEmpty: {
    opacity: 0.3,
  },
  badgePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    textAlign: 'center',
  },
  btnRow: {
    width: '100%',
    marginTop: 14,
  },
  primaryBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
