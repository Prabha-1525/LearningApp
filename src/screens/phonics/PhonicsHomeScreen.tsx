import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  PhonicsProgressTracker,
  PhonicsSubModuleCard,
} from '../../features/phonics/presentation/components';
import {PHONICS_SUBMODULES} from '../../features/phonics/domain/catalog/phonicsData';
import {readPhonicsProgress} from '../../features/phonics/data/progress/phonicsProgress';
import type {
  PhonicsProgress,
  PhonicsSubModule,
} from '../../features/phonics/domain/entities/phonicsEntities';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'PhonicsHome'>;

export function PhonicsHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<PhonicsProgress>(
    readPhonicsProgress(),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readPhonicsProgress());
    }, []),
  );

  const handleSelectSubModule = (sub: PhonicsSubModule) => {
    switch (sub.id) {
      case 'letter_sounds':
        navigation.navigate('LetterSounds');
        break;
      case 'sound_recognition':
        navigation.navigate('SoundRecognition');
        break;
      case 'letter_matching':
        navigation.navigate('LetterMatching');
        break;
      case 'beginning_sounds':
        navigation.navigate('BeginningSounds');
        break;
      case 'ending_sounds':
        navigation.navigate('EndingSounds');
        break;
      case 'slow_blending':
        navigation.navigate('SlowBlending');
        break;
      case 'cvc_words':
        navigation.navigate('CVCWords');
        break;
      case 'word_builder':
        navigation.navigate('WordBuilder');
        break;
      case 'word_families':
        navigation.navigate('WordFamilies');
        break;
      case 'word_transform':
        navigation.navigate('WordTransform');
        break;
      case 'hear_choose_word':
        navigation.navigate('HearChooseWord');
        break;
      case 'picture_to_word':
        navigation.navigate('PictureToWord');
        break;
      case 'read_words':
        navigation.navigate('ReadWords');
        break;
      case 'read_sentences':
        navigation.navigate('ReadSentences');
        break;
      case 'phonics_games':
        navigation.navigate('PhonicsGames');
        break;
      case 'phonics_challenge':
        navigation.navigate('PhonicsChallenge');
        break;
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Phonics"
        subtitle="Let's learn sounds and read words!"
        stars={progress.totalStars}
        starVariant="green"
        accentColor="#3B82F6"
        audioPromptText="Welcome to Phonics! Tap any unlocked activity to start learning sounds and reading words!"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Progress Tracker */}
        <PhonicsProgressTracker progress={progress} />

        {/* Submodules List */}
        <View style={styles.grid}>
          {PHONICS_SUBMODULES.map(sub => {
            const isUnlocked = progress.unlockedSubModuleIds.includes(sub.id);
            const subProgress = progress.subModuleProgress[sub.id];

            return (
              <PhonicsSubModuleCard
                key={sub.id}
                subModule={sub}
                isUnlocked={isUnlocked}
                progress={subProgress}
                onPress={handleSelectSubModule}
              />
            );
          })}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },
  grid: {
    gap: 12,
  },
});
