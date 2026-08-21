import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {WordBuildingBoard} from '../../features/phonics/presentation/components';
import {CVC_WORDS_CATALOG} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'WordBuilder'>;

export function WordBuilderScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const wordsToBuild = CVC_WORDS_CATALOG.slice(0, 3);
  const currentWord = wordsToBuild[currentIdx] ?? wordsToBuild[0]!;

  const handleCompleteWord = () => {
    if (currentIdx < wordsToBuild.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const res = recordPhonicsLessonResult('word_builder', 100, 3);
      navigation.replace('PhonicsLessonComplete', {
        subModuleId: 'word_builder',
        title: 'Word Builder Master',
        starsEarned: 3,
        scorePercent: 100,
        unlockedNextId: res.unlockedNextId,
      });
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Word Builder"
        subtitle={`Challenge ${currentIdx + 1} of ${wordsToBuild.length}`}
        accentColor="#F97316"
        titleColor="#F97316"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <WordBuildingBoard
            key={currentWord.id}
            cvcItem={currentWord}
            onComplete={handleCompleteWord}
          />
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  cardWrap: {
    width: '100%',
  },
});
