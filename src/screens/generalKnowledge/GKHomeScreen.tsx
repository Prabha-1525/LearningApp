import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  GKCategoryCard,
  GKHeader,
} from '../../features/generalKnowledge/presentation/components';
import {GK_CATEGORIES} from '../../features/generalKnowledge/domain/catalog/gkData';
import {readGKProgress} from '../../features/generalKnowledge/data/progress/gkProgress';
import type {GKProgress} from '../../features/generalKnowledge/domain/entities/gkEntities';
import type {GeneralKnowledgeStackParamList} from '../../navigation/generalKnowledgeTypes';

type Nav = NativeStackNavigationProp<GeneralKnowledgeStackParamList, 'Home'>;

export function GKHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<GKProgress>(readGKProgress());

  useFocusEffect(
    useCallback(() => {
      setProgress(readGKProgress());
    }, []),
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <GKHeader
        title={t('generalKnowledge.home.title', 'General Knowledge')}
        subtitle={t(
          'generalKnowledge.home.subtitle',
          "Let's discover something new!",
        )}
        emoji="🗣️"
        accentColor="#F59E0B"
        starsCount={progress.totalStars}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Grand GK Challenge Banner */}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('FinalChallenge')}
          style={styles.challengeBanner}>
          <View style={styles.challengeLeft}>
            <Text style={styles.challengeEmoji}>🎯 🏆</Text>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>
                {t('generalKnowledge.challengeBanner.title', 'GK Master Arena')}
              </Text>
              <Text style={styles.challengeSub}>
                {t(
                  'generalKnowledge.challengeBanner.sub',
                  '10 Fun Mixed Questions',
                )}
              </Text>
            </View>
          </View>
          <View style={styles.challengeAction}>
            <Text style={styles.challengeBtnText}>Play ▶</Text>
          </View>
        </Pressable>

        {/* Categories Header */}
        <Text style={styles.sectionHeader}>
          {t('generalKnowledge.home.sectionHeader', 'Explore Categories:')}
        </Text>

        {/* Categories List */}
        {GK_CATEGORIES.map(cat => (
          <GKCategoryCard
            key={cat.id}
            category={cat}
            lessonsProgress={progress.lessonsProgress}
            onPress={() =>
              navigation.navigate('Category', {categoryId: cat.id})
            }
          />
        ))}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#7C3AED',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#7C3AED',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  challengeEmoji: {
    fontSize: 32,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  challengeSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E9D5FF',
    marginTop: 2,
  },
  challengeAction: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  challengeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7C3AED',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#374151',
    marginHorizontal: 20,
    marginBottom: 12,
  },
});
