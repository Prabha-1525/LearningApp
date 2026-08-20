import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  GKHeader,
  GKLessonFlow,
} from '../../features/generalKnowledge/presentation/components';
import {GK_CATEGORIES} from '../../features/generalKnowledge/domain/catalog/gkData';
import {recordGKLessonResult} from '../../features/generalKnowledge/data/progress/gkProgress';
import type {GeneralKnowledgeStackParamList} from '../../navigation/generalKnowledgeTypes';

type Nav = NativeStackNavigationProp<GeneralKnowledgeStackParamList, 'Lesson'>;
type Route = RouteProp<GeneralKnowledgeStackParamList, 'Lesson'>;

export function GKLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {categoryId, lessonId} = route.params;

  const category =
    GK_CATEGORIES.find(c => c.id === categoryId) ?? GK_CATEGORIES[0];
  const lesson =
    category.lessons.find(l => l.id === lessonId) ?? category.lessons[0];

  const [nextLessonId, setNextLessonId] = useState<string | null>(null);

  const handleLessonComplete = useCallback(
    (starsEarned: number) => {
      const result = recordGKLessonResult(category.id, lesson.id, starsEarned);
      if (result.nextLessonUnlockedId) {
        setNextLessonId(result.nextLessonUnlockedId);
      }
      if (result.categoryCompleted) {
        setTimeout(() => {
          navigation.navigate('CategoryComplete', {
            categoryId: category.id,
            categoryTitle: t(category.titleKey, category.id),
          });
        }, 1200);
      }
    },
    [category.id, category.titleKey, lesson.id, navigation, t],
  );

  const handleNextLesson = useCallback(() => {
    if (nextLessonId) {
      navigation.replace('Lesson', {
        categoryId: category.id,
        lessonId: nextLessonId,
      });
    } else {
      navigation.goBack();
    }
  }, [category.id, navigation, nextLessonId]);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <GKHeader
        title={t(lesson.titleKey, lesson.id)}
        subtitle={t(category.titleKey, category.id)}
        emoji={lesson.emoji}
        accentColor={lesson.accentColor}
        onBack={() => navigation.goBack()}
      />
      <GKLessonFlow
        key={lesson.id}
        lesson={lesson}
        onComplete={handleLessonComplete}
        onNextLesson={nextLessonId ? handleNextLesson : undefined}
        onBackToCategory={() => navigation.goBack()}
      />
    </AppSafeAreaView>
  );
}
