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
import type {GeneralKnowledgeStackParamList} from '../../navigation/generalKnowledgeTypes';

type Nav = NativeStackNavigationProp<
  GeneralKnowledgeStackParamList,
  'CategoryComplete'
>;
type Route = RouteProp<GeneralKnowledgeStackParamList, 'CategoryComplete'>;

export function GKCategoryCompleteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {categoryTitle} = route.params;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <View style={styles.container}>
        <View style={styles.trophyCircle}>
          <Text style={styles.trophyEmoji}>🎉 🌟</Text>
        </View>

        <Text style={styles.title}>
          {t('generalKnowledge.categoryComplete.title', 'Category Mastered!')}
        </Text>
        <Text style={styles.sub}>
          You completed all lessons in{' '}
          <Text style={styles.topicBold}>{categoryTitle}</Text>!
        </Text>

        <View style={styles.badgeCard}>
          <Text style={styles.badgeEmoji}>🏆 🚗 👩‍⚕️ 🌳</Text>
          <Text style={styles.badgeHint}>
            {t(
              'generalKnowledge.categoryComplete.badgeEarned',
              'You earned a new Knowledge Explorer achievement!',
            )}
          </Text>
        </View>

        <View style={styles.btnRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Home')}
            style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              🏠 {t('generalKnowledge.backToHub', 'Back to GK Hub')}
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
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    color: '#B45309',
    textAlign: 'center',
  },
  topicBold: {
    fontWeight: '900',
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FCD34D',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    marginVertical: 10,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
  },
  btnRow: {
    width: '100%',
    marginTop: 10,
  },
  primaryBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#F59E0B',
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
