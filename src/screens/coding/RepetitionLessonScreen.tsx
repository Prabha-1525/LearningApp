import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  CodingHeader,
  RepetitionLoopsGame,
} from '../../features/coding/presentation/components';
import {recordCodingTopicCompletion} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'RepetitionLesson'>;

export function RepetitionLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordCodingTopicCompletion('loops', stars);
      navigation.navigate('CodingComplete', {
        starsEarned: stars,
        topicTitle: t('coding.topics.loops.title', 'Repeat (Loops)'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <CodingHeader
        title={t('coding.topics.loops.title', 'Repeat (Loops)')}
        subtitle="Visual Loops & Repetition Blocks"
        emoji="🔁"
        accentColor="#D97706"
      />
      <RepetitionLoopsGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
