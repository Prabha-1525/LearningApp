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
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'ScienceComplete'>;
type Route = RouteProp<ScienceStackParamList, 'ScienceComplete'>;

export function ScienceCompleteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const {title, stars = 3} = route.params;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0FDF4">
      <View style={styles.container}>
        <View style={styles.celebrationCard}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.heading}>
            {t('science.complete.awesome', 'Awesome Science Explorer!')}
          </Text>
          <Text style={styles.subheading}>{title}</Text>

          <View style={styles.starsRow}>
            {Array.from({length: stars}).map((_, i) => (
              <Text key={i} style={styles.star}>
                ⭐
              </Text>
            ))}
          </View>

          <Text style={styles.rewardText}>
            +{stars} {t('science.complete.starsEarned', 'Stars Earned!')}
          </Text>

          <View style={styles.badgePreview}>
            <Text style={styles.badgeEmoji}>🌱🔬🚀</Text>
            <Text style={styles.badgeHint}>
              {t(
                'science.complete.badgeUnlocked',
                'Badge progress updated in your profile!',
              )}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsWrap}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Home')}
            style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>
              🔬 {t('science.complete.exploreMore', 'Explore More Science')}
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
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  trophyEmoji: {
    fontSize: 64,
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#064E3B',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  star: {
    fontSize: 36,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D97706',
  },
  badgePreview: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    gap: 4,
    width: '100%',
    marginTop: 6,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
  },
  buttonsWrap: {
    gap: 12,
  },
  homeBtn: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
