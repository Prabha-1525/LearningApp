import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {GKLessonCard} from '../../features/generalKnowledge/presentation/components';
import {GK_CATEGORIES} from '../../features/generalKnowledge/domain/catalog/gkData';
import {
  isLessonUnlocked,
  readGKProgress,
} from '../../features/generalKnowledge/data/progress/gkProgress';
import type {GKProgress} from '../../features/generalKnowledge/domain/entities/gkEntities';
import type {GeneralKnowledgeStackParamList} from '../../navigation/generalKnowledgeTypes';

type Nav = NativeStackNavigationProp<
  GeneralKnowledgeStackParamList,
  'Category'
>;
type Route = RouteProp<GeneralKnowledgeStackParamList, 'Category'>;

export function GKCategoryScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {categoryId} = route.params;

  const category =
    GK_CATEGORIES.find(c => c.id === categoryId) ?? GK_CATEGORIES[0];
  const [progress, setProgress] = useState<GKProgress>(readGKProgress());

  useFocusEffect(
    useCallback(() => {
      setProgress(readGKProgress());
    }, []),
  );

  const completedCount = category.lessons.filter(
    l => progress.lessonsProgress[l.id]?.completed,
  ).length;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <LearningHeader
        title={t(category.titleKey, category.id)}
        subtitle={`${completedCount}/${category.lessons.length} Completed`}
        emoji={category.emoji}
        accentColor={category.accentColor}
        titleColor={category.accentColor}
        stars={progress.totalStars}
        starVariant="green"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Progress header note */}
        <View style={[styles.banner, {borderColor: category.accentColor}]}>
          <Text style={styles.bannerEmoji}>💡</Text>
          <Text style={styles.bannerText}>
            {t(
              'generalKnowledge.unlockTip',
              'Finish each lesson quiz with 2+ stars to unlock the next!',
            )}
          </Text>
        </View>

        {category.lessons.map(lesson => {
          const unlocked = isLessonUnlocked(category.id, lesson.id, progress);
          const lessonProgress = progress.lessonsProgress[lesson.id];

          return (
            <GKLessonCard
              key={lesson.id}
              lesson={lesson}
              isUnlocked={unlocked}
              progress={lessonProgress}
              onPress={() =>
                navigation.navigate('Lesson', {
                  categoryId: category.id,
                  lessonId: lesson.id,
                })
              }
            />
          );
        })}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  bannerEmoji: {
    fontSize: 18,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    flex: 1,
  },
});
