import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  LifeSkillsHeader,
  LifeSkillsQuizArena,
} from '../../features/lifeSkills/presentation/components';
import {recordLifeSkillsTopicCompletion} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<
  LifeSkillsStackParamList,
  'LifeSkillsQuiz'
>;

export function LifeSkillsQuizScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleFinish = useCallback(
    (score: number) => {
      const starsEarned = score >= 8 ? 3 : score >= 5 ? 2 : 1;
      recordLifeSkillsTopicCompletion('quiz', starsEarned);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned,
        topicTitle: t('lifeSkills.topics.quiz.title', 'Kind Star Arena'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.quiz.title', 'Life Skills Arena')}
        subtitle="10 Kind & Smart Questions"
        emoji="🎯"
        accentColor="#059669"
      />
      <LifeSkillsQuizArena onFinish={handleFinish} />
    </AppSafeAreaView>
  );
}
