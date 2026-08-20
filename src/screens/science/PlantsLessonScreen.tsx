import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ScienceHeader,
  PlantGrowthAnimation,
} from '../../features/science/presentation/components';
import {
  PLANT_PARTS,
  PLANT_NEEDS,
} from '../../features/science/domain/catalog/scienceData';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'PlantsLesson'>;

export function PlantsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [selectedPart, setSelectedPart] = useState(PLANT_PARTS[0]);
  const [_growthDone, setGrowthDone] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const handleFinish = () => {
    recordTopicCompletion('plants', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'plants',
      stars: 3,
      title: t('science.topics.plants.title', 'Plants'),
      nextTopicId: 'human-body',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0FDF4">
      <ScienceHeader
        title={t('science.topics.plants.title', 'Plants')}
        emoji="🌱"
        accentColor="#10B981"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Section 1: Animated Growth Sequencer */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🌱 {t('science.plants.growthTitle', 'How Plants Grow')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t(
              'science.plants.growthSubtitle',
              'Tap water and sun to watch the seed grow into a plant!',
            )}
          </Text>
        </View>

        <PlantGrowthAnimation onGrowthComplete={() => setGrowthDone(true)} />

        {/* Section 2: Plant Anatomy Explorer */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🌿 {t('science.plants.partsTitle', 'Parts of a Plant')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t(
              'science.plants.partsSubtitle',
              'Tap each part to learn its job:',
            )}
          </Text>
        </View>

        <View style={styles.partsGrid}>
          {PLANT_PARTS.map(part => {
            const isSelected = part.id === selectedPart.id;
            return (
              <Pressable
                key={part.id}
                accessibilityRole="button"
                onPress={() => setSelectedPart(part)}
                style={[styles.partBtn, isSelected && styles.activePartBtn]}>
                <Text style={styles.partEmoji}>{part.emoji}</Text>
                <Text
                  style={[
                    styles.partLabel,
                    isSelected && styles.activePartLabel,
                  ]}>
                  {t(part.nameKey, part.id)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Active Part Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>{selectedPart.emoji}</Text>
          <Text style={styles.infoTitle}>
            {t(selectedPart.nameKey, selectedPart.id)}
          </Text>
          <Text style={styles.infoDesc}>{t(selectedPart.functionKey, '')}</Text>
        </View>

        {/* Section 3: What Plants Need */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ☀️ {t('science.plants.needsTitle', 'What Plants Need')}
          </Text>
        </View>

        <View style={styles.needsRow}>
          {PLANT_NEEDS.map(need => (
            <View key={need.id} style={styles.needCard}>
              <Text style={styles.needEmoji}>{need.emoji}</Text>
              <Text style={styles.needName}>{t(need.nameKey, need.id)}</Text>
              <Text style={styles.needDesc}>{t(need.descKey, '')}</Text>
            </View>
          ))}
        </View>

        {/* Section 4: Mini Quiz Challenge */}
        <View style={styles.quizBox}>
          <Text style={styles.quizQuestion}>
            ❓ {t('science.plants.quizQ', 'What does a plant need to grow?')}
          </Text>
          <View style={styles.quizOptions}>
            {[
              {id: 'sun', emoji: '☀️', text: 'Sunlight & Water', correct: true},
              {id: 'toy', emoji: '🧸', text: 'Teddy Bear', correct: false},
              {id: 'car', emoji: '🚗', text: 'Toy Car', correct: false},
            ].map(opt => {
              const isChosen = quizAnswer === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  accessibilityRole="button"
                  onPress={() => setQuizAnswer(opt.id)}
                  style={[
                    styles.quizOptBtn,
                    isChosen &&
                      (opt.correct ? styles.correctOptBtn : styles.wrongOptBtn),
                  ]}>
                  <Text style={styles.quizOptEmoji}>{opt.emoji}</Text>
                  <Text style={styles.quizOptText}>{opt.text}</Text>
                </Pressable>
              );
            })}
          </View>

          {quizAnswer === 'sun' && (
            <View style={styles.quizSuccess}>
              <Text style={styles.quizSuccessText}>
                🎉 Great job! Plants need water, sun, soil, and air!
              </Text>
            </View>
          )}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Plant Lesson')} ⭐⭐⭐
          </Text>
        </Pressable>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    gap: 18,
  },
  sectionHeader: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  partsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  partBtn: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  activePartBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    transform: [{scale: 1.04}],
  },
  partEmoji: {
    fontSize: 28,
  },
  partLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  activePartLabel: {
    color: '#065F46',
    fontWeight: '900',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    gap: 6,
  },
  infoEmoji: {
    fontSize: 40,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
  },
  infoDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
  },
  needsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  needCard: {
    width: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  needEmoji: {
    fontSize: 32,
  },
  needName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  needDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  quizBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  quizQuestion: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  quizOptions: {
    gap: 8,
  },
  quizOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  correctOptBtn: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  wrongOptBtn: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  quizOptEmoji: {
    fontSize: 22,
  },
  quizOptText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  quizSuccess: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 12,
  },
  quizSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    textAlign: 'center',
  },
  finishBtn: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
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
