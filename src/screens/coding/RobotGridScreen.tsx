import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {RobotGridGame} from '../../features/coding/presentation/components';
import {recordRobotMazeSolved} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'RobotGrid'>;

export function RobotGridScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleLevelComplete = useCallback(
    (levelNumber: number, stars: number) => {
      recordRobotMazeSolved(levelNumber, stars);
      if (levelNumber === 9) {
        navigation.navigate('CodingComplete', {
          starsEarned: stars,
          topicTitle: t('coding.topics.robot.title', 'Robot Grid Maze'),
        });
      }
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EFF6FF">
      <LearningHeader
        title={t('coding.topics.robot.title', 'Robot Maze')}
        subtitle="Command Queue & Step Runner"
        emoji="🤖"
        accentColor="#2563EB"
        titleColor="#2563EB"
      />
      <RobotGridGame onLevelComplete={handleLevelComplete} />
    </AppSafeAreaView>
  );
}
