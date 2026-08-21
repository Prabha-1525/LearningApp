import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {SoundBlendingBoard} from '../../features/english/presentation/components';
import {BLENDING_WORDS_DATA} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'SoundBlending'>;

export function EnglishBlendingScreen() {
  const navigation = useNavigation<Nav>();

  const handleFinish = (stars: number) => {
    recordEnglishLessonResult(
      'sound_blending',
      'sound_blending_intro',
      stars,
      stars * 10,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'sound_blending',
      title: 'Blending Star',
      stars,
      score: stars * 10,
      totalQuestions: BLENDING_WORDS_DATA.length,
      nextSubModuleId: 'word_building',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Sound Blending"
        subtitle="Tap sounds & blend into words!"
        emoji="🔗"
        accentColor="#6366F1"
        titleColor="#6366F1"
      />

      <View style={styles.content}>
        <SoundBlendingBoard
          items={BLENDING_WORDS_DATA}
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
