import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  CodingChallengeArena,
  CodingHeader,
} from '../../features/coding/presentation/components';
import {recordCodingTopicCompletion} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'CodingChallenge'>;

export function CodingChallengeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleFinish = useCallback(
    (score: number) => {
      const starsEarned = score >= 8 ? 3 : score >= 5 ? 2 : 1;
      recordCodingTopicCompletion('challenge', starsEarned);
      navigation.navigate('CodingComplete', {
        starsEarned,
        topicTitle: t('coding.topics.challenge.title', 'Coding Challenge'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EEF2FF">
      <CodingHeader
        title={t('coding.topics.challenge.title', 'Coding Challenge')}
        subtitle="10 Questions Logic Arena"
        emoji="🎯"
        accentColor="#4F46E5"
      />
      <CodingChallengeArena onFinish={handleFinish} />
    </AppSafeAreaView>
  );
}
