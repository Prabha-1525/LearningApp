import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  EnglishSubModuleCard,
  ReadingProgressTracker,
} from '../../features/english/presentation/components';
import {ENGLISH_SUB_MODULES} from '../../features/english/domain/catalog/englishData';
import {
  isSubModuleUnlocked,
  readEnglishProgress,
} from '../../features/english/data/progress/englishProgress';
import type {EnglishProgress} from '../../features/english/domain/entities/englishEntities';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'Home'>;

export function EnglishHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<EnglishProgress>(
    readEnglishProgress(),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readEnglishProgress());
    }, []),
  );

  const handleOpenSubModule = (
    config: (typeof ENGLISH_SUB_MODULES)[number],
  ) => {
    switch (config.id) {
      case 'alphabet':
        navigation.navigate('Alphabet');
        break;
      case 'capital_small':
        navigation.navigate('CapitalSmall');
        break;
      case 'letter_sounds':
      case 'beginning_sounds':
        navigation.navigate('LetterSounds');
        break;
      case 'letter_objects':
        navigation.navigate('LetterObjects');
        break;
      case 'phonics':
        navigation.navigate('Phonics');
        break;
      case 'sound_blending':
        navigation.navigate('SoundBlending');
        break;
      case 'word_building':
        navigation.navigate('WordBuilding');
        break;
      case 'cvc_words':
        navigation.navigate('CVCWords');
        break;
      case 'sight_words':
        navigation.navigate('SightWords');
        break;
      case 'tongue_twisters':
        navigation.navigate('TongueTwisters');
        break;
      case 'sentence_reading':
        navigation.navigate('SentenceReading');
        break;
      case 'short_stories':
        navigation.navigate('ShortStories');
        break;
      case 'reading_challenge':
        navigation.navigate('ReadingChallenge');
        break;
      default:
        navigation.navigate('Alphabet');
        break;
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={t('english.title', 'English Learning')}
        subtitle={t('english.subtitle', 'Learn Letters & Read Simple Words')}
        emoji="🔤"
        accentColor="#3B82F6"
        titleColor="#3B82F6"
        stars={progress.totalStars}
        starVariant="green"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Reading Progress Tracker Widget */}
        <ReadingProgressTracker progress={progress} />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('english.learningPath', '🎯 Step-by-Step Learning Path')}
          </Text>
          <Text style={styles.sectionDesc}>
            {t(
              'english.learningPathDesc',
              'Follow the path from ABC to reading real stories!',
            )}
          </Text>
        </View>

        {/* 14 Sub-module cards */}
        <View style={styles.subModulesList}>
          {ENGLISH_SUB_MODULES.map(config => {
            const unlocked = isSubModuleUnlocked(config.id, progress);
            const completed = progress.completedSubModules.includes(config.id);
            const stars =
              progress.lessonsProgress[config.id]?.stars ?? (completed ? 3 : 0);

            return (
              <EnglishSubModuleCard
                key={config.id}
                config={config}
                isUnlocked={unlocked}
                isCompleted={completed}
                starsEarned={stars}
                onPress={() => handleOpenSubModule(config)}
              />
            );
          })}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionHeader: {
    marginTop: 4,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  sectionDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  subModulesList: {
    width: '100%',
  },
});
