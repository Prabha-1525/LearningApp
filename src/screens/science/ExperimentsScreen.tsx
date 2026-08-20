import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ScienceHeader,
  ExperimentLabView,
} from '../../features/science/presentation/components';
import {
  recordExperimentCompletion,
  recordTopicCompletion,
} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'Experiments'>;

export function ExperimentsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [_completedCount, setCompletedCount] = useState(0);

  const handleExpDone = (expId: string) => {
    recordExperimentCompletion(expId);
    setCompletedCount(c => c + 1);
  };

  const handleFinish = () => {
    recordTopicCompletion('experiments', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'experiments',
      stars: 3,
      title: t('science.topics.experiments.title', 'Simple Experiments'),
      nextTopicId: 'quiz',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F5F3FF">
      <ScienceHeader
        title={t('science.topics.experiments.title', 'Experiments')}
        emoji="🧪"
        accentColor="#7C3AED"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🧪 {t('science.experiments.labTitle', 'Little Lab')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t(
              'science.experiments.labSubtitle',
              'Safe, fun hands-on experiments you can try right here!',
            )}
          </Text>
        </View>

        <ExperimentLabView onExperimentDone={handleExpDone} />

        {/* Complete Lab Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Experiments Lab')} ⭐⭐⭐
          </Text>
        </Pressable>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    gap: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4C1D95',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginTop: 2,
  },
  finishBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
