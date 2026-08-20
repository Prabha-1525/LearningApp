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
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<
  LifeSkillsStackParamList,
  'LifeSkillsComplete'
>;
type Route = RouteProp<LifeSkillsStackParamList, 'LifeSkillsComplete'>;

export function LifeSkillsCompleteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const {starsEarned = 3, topicTitle = 'Life Skills'} = route.params ?? {};

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <View style={styles.container}>
        {/* Celebration Trophy */}
        <View style={styles.trophyCircle}>
          <Text style={styles.trophyEmoji}>🏆 😊</Text>
        </View>

        <Text style={styles.title}>
          {t('lifeSkills.complete.title', 'Kind Life Skills Star!')}
        </Text>
        <Text style={styles.subtitle}>
          You practiced <Text style={styles.topicBold}>{topicTitle}</Text>!
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
          <Text style={styles.badgeEmoji}>😊🪥❤️🤝🏆</Text>
          <Text style={styles.badgeHint}>
            Check your Badges Tab to see your Life Skills Achievements!
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.btnRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Home')}
            style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {t('lifeSkills.complete.backHome', 'Life Skills Hub 🏠')}
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
    backgroundColor: '#D1FAE5',
    borderWidth: 4,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  trophyEmoji: {
    fontSize: 48,
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
    borderColor: '#6EE7B7',
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
    color: '#065F46',
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
