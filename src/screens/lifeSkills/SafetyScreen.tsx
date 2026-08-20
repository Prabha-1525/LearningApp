import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  LifeSkillsHeader,
  SafetyLesson,
} from '../../features/lifeSkills/presentation/components';
import {recordLifeSkillsTopicCompletion} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'Safety'>;

export function SafetyScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('safety', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.safety.title', 'Personal Safety'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FEF2F2">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.safety.title', 'Personal Safety')}
        subtitle="Stay Safe & Be Smart"
        emoji="🛡️"
        accentColor="#DC2626"
      />
      <SafetyLesson onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
