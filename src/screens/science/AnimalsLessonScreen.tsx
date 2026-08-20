import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {ScienceHeader} from '../../features/science/presentation/components';
import {
  ANIMALS_DATA,
  type AnimalCategory,
} from '../../features/science/domain/catalog/scienceData';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'AnimalsLesson'>;

const CATEGORIES: {id: AnimalCategory; emoji: string; labelKey: string}[] = [
  {id: 'farm', emoji: '🚜', labelKey: 'science.animals.catFarm'},
  {id: 'wild', emoji: '🌴', labelKey: 'science.animals.catWild'},
  {id: 'sea', emoji: '🌊', labelKey: 'science.animals.catSea'},
  {id: 'birds', emoji: '🪶', labelKey: 'science.animals.catBirds'},
  {id: 'insects', emoji: '🔍', labelKey: 'science.animals.catInsects'},
];

export function AnimalsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [selectedCat, setSelectedCat] = useState<AnimalCategory>('farm');
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS_DATA[0]);

  const filteredAnimals = ANIMALS_DATA.filter(a => a.category === selectedCat);

  const handleFinish = () => {
    recordTopicCompletion('animals', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'animals',
      stars: 3,
      title: t('science.topics.animals.title', 'Animals'),
      nextTopicId: 'space',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <ScienceHeader
        title={t('science.topics.animals.title', 'Animals')}
        emoji="🐾"
        accentColor="#F59E0B"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <Pressable
                key={cat.id}
                accessibilityRole="button"
                onPress={() => {
                  setSelectedCat(cat.id);
                  const firstInCat = ANIMALS_DATA.find(
                    a => a.category === cat.id,
                  );
                  if (firstInCat) setSelectedAnimal(firstInCat);
                }}
                style={[styles.catTab, isSelected && styles.activeCatTab]}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    isSelected && styles.activeCatLabel,
                  ]}>
                  {t(cat.labelKey, cat.id)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Featured Animal Card */}
        <View style={styles.featuredCard}>
          <View style={styles.animalIconBg}>
            <Text style={styles.animalIcon}>{selectedAnimal.emoji}</Text>
          </View>
          <Text style={styles.animalName}>
            {t(selectedAnimal.nameKey, selectedAnimal.id)}
          </Text>

          <View style={styles.soundPill}>
            <Text style={styles.soundText}>
              🔊 Sound: {t(selectedAnimal.soundKey, '')}
            </Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailEmoji}>🏡</Text>
              <Text style={styles.detailLabel}>Habitat</Text>
              <Text style={styles.detailVal}>
                {t(selectedAnimal.habitatKey, '')}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailEmoji}>🍎</Text>
              <Text style={styles.detailLabel}>Food</Text>
              <Text style={styles.detailVal}>
                {t(selectedAnimal.foodKey, '')}
              </Text>
            </View>
          </View>

          <View style={styles.factBox}>
            <Text style={styles.factText}>
              ✨ {t(selectedAnimal.factKey, '')}
            </Text>
          </View>
        </View>

        {/* Animal Selection Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🐾 {t('science.animals.choosePrompt', 'Tap an animal to explore:')}
          </Text>
        </View>

        <View style={styles.animalsGrid}>
          {filteredAnimals.map(animal => {
            const isSelected = animal.id === selectedAnimal.id;
            return (
              <Pressable
                key={animal.id}
                accessibilityRole="button"
                onPress={() => setSelectedAnimal(animal)}
                style={[
                  styles.animalBtn,
                  isSelected && styles.activeAnimalBtn,
                ]}>
                <Text style={styles.gridEmoji}>{animal.emoji}</Text>
                <Text
                  style={[
                    styles.gridName,
                    isSelected && styles.activeGridName,
                  ]}>
                  {t(animal.nameKey, animal.id)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Animals Lesson')} ⭐⭐⭐
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
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  activeCatTab: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  catEmoji: {
    fontSize: 16,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  activeCatLabel: {
    color: '#FFFFFF',
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  animalIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalIcon: {
    fontSize: 50,
  },
  animalName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#78350F',
  },
  soundPill: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  soundText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#854D0E',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 6,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 2,
  },
  detailEmoji: {
    fontSize: 20,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A16207',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#713F12',
    textAlign: 'center',
  },
  factBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    width: '100%',
    marginTop: 4,
  },
  factText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F',
  },
  animalsGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  animalBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  activeAnimalBtn: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    transform: [{scale: 1.05}],
  },
  gridEmoji: {
    fontSize: 32,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 4,
  },
  activeGridName: {
    color: '#92400E',
    fontWeight: '900',
  },
  finishBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#F59E0B',
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
