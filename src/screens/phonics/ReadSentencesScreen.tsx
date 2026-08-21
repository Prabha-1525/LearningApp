import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  PhonicsHeader,
  SentenceReaderBoard,
} from '../../features/phonics/presentation/components';
import {PHONICS_SENTENCES} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'ReadSentences'>;

export function ReadSentencesScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const sentences = PHONICS_SENTENCES.slice(0, 4);
  const currentSentence = sentences[currentIdx] ?? sentences[0]!;

  const handleNext = () => {
    if (currentIdx < sentences.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const res = recordPhonicsLessonResult('read_sentences', 100, 3);
      navigation.replace('PhonicsLessonComplete', {
        subModuleId: 'read_sentences',
        title: 'Reading Hero',
        starsEarned: 3,
        scorePercent: 100,
        unlockedNextId: res.unlockedNextId,
      });
    }
  };

  return (
    <AppSafeAreaView>
      <PhonicsHeader
        title="Read Simple Sentences"
        subtitle={`Sentence ${currentIdx + 1} of ${sentences.length}`}
        accentColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <SentenceReaderBoard
            key={currentSentence.id}
            sentenceItem={currentSentence}
            onNext={handleNext}
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
