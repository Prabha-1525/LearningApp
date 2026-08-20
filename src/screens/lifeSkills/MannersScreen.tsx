import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  LifeSkillsHeader,
  MannersGame,
} from '../../features/lifeSkills/presentation/components';
import {
  recordLifeSkillsTopicCompletion,
  recordMannersScenarioSolved,
} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'Manners'>;

export function MannersScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleSolved = useCallback(() => {
    recordMannersScenarioSolved();
  }, []);

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('manners', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.manners.title', 'Good Manners'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F5F3FF">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.manners.title', 'Good Manners')}
        subtitle="Magic Words & Kindness"
        emoji="🤝"
        accentColor="#7C3AED"
      />
      <MannersGame
        onScenarioSolved={handleSolved}
        onComplete={handleComplete}
      />
    </AppSafeAreaView>
  );
}
