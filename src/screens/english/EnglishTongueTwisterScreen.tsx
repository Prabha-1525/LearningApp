import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {TongueTwisterView} from '../../features/english/presentation/components';
import {TONGUE_TWISTERS_DATA} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'TongueTwisters'>;

export function EnglishTongueTwisterScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentTwister =
    TONGUE_TWISTERS_DATA[currentIdx] ?? TONGUE_TWISTERS_DATA[0];

  const handleNext = () => {
    if (currentIdx >= TONGUE_TWISTERS_DATA.length - 1) {
      recordEnglishLessonResult(
        'tongue_twisters',
        'tongue_twisters_intro',
        3,
        100,
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'tongue_twisters',
        title: 'Twister Master',
        stars: 3,
        score: 100,
        totalQuestions: TONGUE_TWISTERS_DATA.length,
        nextSubModuleId: 'reading_challenge',
      });
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Tongue Twisters"
        subtitle="Fun pronunciation and sound practice!"
        emoji="👅"
        accentColor="#84CC16"
        titleColor="#84CC16"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {currentTwister && (
          <TongueTwisterView twister={currentTwister} onNext={handleNext} />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
});
