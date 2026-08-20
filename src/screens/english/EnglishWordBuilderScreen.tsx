import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EnglishHeader,
  WordBuilderGame,
} from '../../features/english/presentation/components';
import {WORD_BUILDING_TASKS} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'WordBuilding'>;

export function EnglishWordBuilderScreen() {
  const navigation = useNavigation<Nav>();

  const handleFinish = (stars: number) => {
    recordEnglishLessonResult(
      'word_building',
      'word_building_intro',
      stars,
      stars * 10,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'word_building',
      title: 'Word Builder Champion',
      stars,
      score: stars * 10,
      totalQuestions: WORD_BUILDING_TASKS.length,
      nextSubModuleId: 'cvc_words',
    });
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Word Building"
        subtitle="Spell words using letter tiles!"
        emoji="📝"
        accentColor="#F97316"
      />

      <View style={styles.content}>
        <WordBuilderGame
          tasks={WORD_BUILDING_TASKS}
          onCompleted={handleFinish}
        />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
