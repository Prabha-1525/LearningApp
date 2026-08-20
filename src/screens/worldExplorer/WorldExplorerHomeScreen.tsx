import {ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components';
import {
  ActivityCard,
  ExplorerHeader,
} from '@features/worldExplorer/presentation/components';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'Home'>;

export function WorldExplorerHomeScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {countries} = useCountries();
  const {progress, checkUnlocked} = useWorldExplorerProgress();

  const totalCountries = countries.length || 50;
  const exploredCount = progress.exploredCountryCodes.length;
  const learnedFlagsCount = progress.learnedFlagCodes.length;
  const exploredContinentsCount = progress.exploredContinents.length;
  const learnedCapitalsCount = progress.learnedCapitals.length;
  const exploredLandmarksCount = progress.exploredLandmarkIds.length;

  return (
    <AppSafeAreaView testID="world-explorer-home-screen" padded={false}>
      <ExplorerHeader
        title={t('worldExplorer.title', {defaultValue: 'World Explorer'})}
        subtitle={t('worldExplorer.subtitle', {
          defaultValue: "Let's explore the world!",
        })}
        stars={progress.stars}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate('Tabs', {screen: 'HomeTab'});
            }
          }
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 1. Countries Card */}
        <ActivityCard
          icon="🌎"
          title={t('worldExplorer.activities.countries', {
            defaultValue: 'Countries',
          })}
          description={t('worldExplorer.activities.countriesDesc', {
            defaultValue: 'Learn about different countries',
          })}
          progressText={t('worldExplorer.labels.explored', {
            done: exploredCount,
            total: totalCountries,
            defaultValue: `Explored ${exploredCount} / ${totalCountries}`,
          })}
          stars={Math.min(3, Math.floor(exploredCount / 4))}
          isUnlocked={checkUnlocked('countries')}
          accentColor="#FF9F1C"
          onPress={() => navigation.navigate('CountryList', {})}
          testID="activity-countries"
        />

        {/* 2. Flags Card */}
        <ActivityCard
          icon="🚩"
          title={t('worldExplorer.activities.flags', {defaultValue: 'Flags'})}
          description={t('worldExplorer.activities.flagsDesc', {
            defaultValue: 'Learn and identify country flags',
          })}
          progressText={t('worldExplorer.labels.learned', {
            done: learnedFlagsCount,
            total: totalCountries,
            defaultValue: `Learned ${learnedFlagsCount} / ${totalCountries}`,
          })}
          stars={Math.min(3, Math.floor(learnedFlagsCount / 3))}
          isUnlocked={checkUnlocked('flags')}
          accentColor="#3B82F6"
          onPress={() => navigation.navigate('FlagLearning', {})}
          testID="activity-flags"
        />

        {/* 3. Continents Card */}
        <ActivityCard
          icon="🗺️"
          title={t('worldExplorer.activities.continents', {
            defaultValue: 'Continents',
          })}
          description={t('worldExplorer.activities.continentsDesc', {
            defaultValue: 'Explore the seven continents',
          })}
          progressText={t('worldExplorer.labels.explored', {
            done: exploredContinentsCount,
            total: 7,
            defaultValue: `Explored ${exploredContinentsCount} / 7`,
          })}
          stars={Math.min(3, exploredContinentsCount)}
          isUnlocked={checkUnlocked('continents')}
          accentColor="#3D9A5F"
          onPress={() => navigation.navigate('Continents')}
          testID="activity-continents"
        />

        {/* 4. Capitals Card */}
        <ActivityCard
          icon="🏛️"
          title={t('worldExplorer.activities.capitals', {
            defaultValue: 'Capitals',
          })}
          description={t('worldExplorer.activities.capitalsDesc', {
            defaultValue: 'Learn country capital cities',
          })}
          progressText={t('worldExplorer.labels.learned', {
            done: learnedCapitalsCount,
            total: totalCountries,
            defaultValue: `Learned ${learnedCapitalsCount} / ${totalCountries}`,
          })}
          stars={Math.min(3, Math.floor(learnedCapitalsCount / 3))}
          isUnlocked={checkUnlocked('capitals')}
          accentColor="#8B5CF6"
          onPress={() => navigation.navigate('Capitals')}
          testID="activity-capitals"
        />

        {/* 5. Landmarks Card */}
        <ActivityCard
          icon="📍"
          title={t('worldExplorer.activities.landmarks', {
            defaultValue: 'Landmarks',
          })}
          description={t('worldExplorer.activities.landmarksDesc', {
            defaultValue: 'Discover famous world places',
          })}
          progressText={t('worldExplorer.labels.explored', {
            done: exploredLandmarksCount,
            total: 12,
            defaultValue: `Explored ${exploredLandmarksCount} / 12`,
          })}
          stars={Math.min(3, Math.floor(exploredLandmarksCount / 3))}
          isUnlocked={checkUnlocked('landmarks')}
          accentColor="#E4578C"
          onPress={() => navigation.navigate('Landmarks')}
          testID="activity-landmarks"
        />

        {/* 6. Geography Quiz Card */}
        <ActivityCard
          icon="🎯"
          title={t('worldExplorer.activities.quiz', {
            defaultValue: 'Geography Quiz',
          })}
          description={t('worldExplorer.activities.quizDesc', {
            defaultValue: 'Test what you have learned',
          })}
          progressText={t('worldExplorer.labels.quizCount', {
            count: progress.quizCompletedCount,
            defaultValue: `${progress.quizCompletedCount} Quizzes Completed`,
          })}
          stars={Math.min(3, progress.quizCompletedCount)}
          isUnlocked={checkUnlocked('quiz')}
          accentColor="#F59E0B"
          onPress={() => navigation.navigate('Quiz', {difficulty: 'beginner'})}
          testID="activity-quiz"
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
  },
});
