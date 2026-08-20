import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EmotionsExplorer,
  LifeSkillsHeader,
} from '../../features/lifeSkills/presentation/components';
import {recordLifeSkillsTopicCompletion} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'Emotions'>;

export function EmotionsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('emotions', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.emotions.title', 'My Feelings'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFF1F2">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.emotions.title', 'My Feelings')}
        subtitle="Explore & Understand Emotions"
        emoji="😊"
        accentColor="#E11D48"
      />
      <EmotionsExplorer onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
