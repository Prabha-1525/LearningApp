import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {ScienceHeader} from '../../features/science/presentation/components';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'WaterEarthLesson'>;

const WATER_STATES = [
  {
    id: 'solid',
    nameKey: 'science.water.solid',
    tempText: 'Cold ❄️',
    emoji: '🧊',
    descKey: 'science.water.solidDesc',
  },
  {
    id: 'liquid',
    nameKey: 'science.water.liquid',
    tempText: 'Room Temp 💧',
    emoji: '💧',
    descKey: 'science.water.liquidDesc',
  },
  {
    id: 'gas',
    nameKey: 'science.water.gas',
    tempText: 'Hot Steam ♨️',
    emoji: '♨️',
    descKey: 'science.water.gasDesc',
  },
];

const WATER_CYCLE_STEPS = [
  {
    id: '1',
    emoji: '☀️',
    nameKey: 'science.water.evap',
    descKey: 'science.water.evapDesc',
  },
  {
    id: '2',
    emoji: '☁️',
    nameKey: 'science.water.cond',
    descKey: 'science.water.condDesc',
  },
  {
    id: '3',
    emoji: '🌧️',
    nameKey: 'science.water.precip',
    descKey: 'science.water.precipDesc',
  },
  {
    id: '4',
    emoji: '🌊',
    nameKey: 'science.water.collect',
    descKey: 'science.water.collectDesc',
  },
];

const EARTH_ELEMENTS = [
  {
    id: 'oceans',
    emoji: '🌊',
    nameKey: 'science.earth.oceans',
    descKey: 'science.earth.oceansDesc',
  },
  {
    id: 'land',
    emoji: '🏔️',
    nameKey: 'science.earth.land',
    descKey: 'science.earth.landDesc',
  },
  {
    id: 'forests',
    emoji: '🌲',
    nameKey: 'science.earth.forests',
    descKey: 'science.earth.forestsDesc',
  },
  {
    id: 'care',
    emoji: '🌱',
    nameKey: 'science.earth.care',
    descKey: 'science.earth.careDesc',
  },
];

export function WaterEarthLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [selectedState, setSelectedState] = useState(WATER_STATES[1]);
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  const handleFinish = () => {
    recordTopicCompletion('water', 3);
    recordTopicCompletion('earth', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'water',
      stars: 3,
      title: t('science.topics.water.title', 'Water & Earth'),
      nextTopicId: 'experiments',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFEFF">
      <ScienceHeader
        title={t('science.topics.water.title', 'Water & Earth')}
        emoji="🌊"
        accentColor="#0891B2"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Section 1: States of Water */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            💧 {t('science.water.statesTitle', '3 States of Water')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t(
              'science.water.statesSubtitle',
              'Water can freeze into ice or boil into steam!',
            )}
          </Text>
        </View>

        <View style={styles.statesRow}>
          {WATER_STATES.map(st => {
            const isSelected = st.id === selectedState.id;
            return (
              <Pressable
                key={st.id}
                accessibilityRole="button"
                onPress={() => setSelectedState(st)}
                style={[
                  styles.stateCard,
                  isSelected && styles.activeStateCard,
                ]}>
                <Text style={styles.stateEmoji}>{st.emoji}</Text>
                <Text
                  style={[
                    styles.stateName,
                    isSelected && styles.activeStateName,
                  ]}>
                  {t(st.nameKey, st.id)}
                </Text>
                <Text style={styles.stateTemp}>{st.tempText}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.stateInfoBox}>
          <Text style={styles.stateInfoTitle}>
            {selectedState.emoji} {t(selectedState.nameKey, selectedState.id)}
          </Text>
          <Text style={styles.stateInfoDesc}>
            {t(selectedState.descKey, '')}
          </Text>
        </View>

        {/* Section 2: Water Cycle Story */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🔄 {t('science.water.cycleTitle', 'The Water Cycle')}
          </Text>
        </View>

        <View style={styles.cycleCard}>
          <View style={styles.cycleStepCenter}>
            <Text style={styles.cycleEmoji}>
              {WATER_CYCLE_STEPS[activeCycleStep].emoji}
            </Text>
            <Text style={styles.cycleStepName}>
              {t(WATER_CYCLE_STEPS[activeCycleStep].nameKey, '')}
            </Text>
            <Text style={styles.cycleStepDesc}>
              {t(WATER_CYCLE_STEPS[activeCycleStep].descKey, '')}
            </Text>
          </View>

          <View style={styles.cycleDotsRow}>
            {WATER_CYCLE_STEPS.map((step, idx) => (
              <Pressable
                key={step.id}
                accessibilityRole="button"
                onPress={() => setActiveCycleStep(idx)}
                style={[
                  styles.cycleDot,
                  idx === activeCycleStep && styles.activeCycleDot,
                ]}>
                <Text style={styles.cycleDotText}>{step.emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section 3: Caring for Earth */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🌎 {t('science.earth.title', 'Our Wonderful Earth')}
          </Text>
        </View>

        <View style={styles.earthGrid}>
          {EARTH_ELEMENTS.map(el => (
            <View key={el.id} style={styles.earthItem}>
              <Text style={styles.earthEmoji}>{el.emoji}</Text>
              <Text style={styles.earthName}>{t(el.nameKey, el.id)}</Text>
              <Text style={styles.earthDesc}>{t(el.descKey, '')}</Text>
            </View>
          ))}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Water & Earth')} ⭐⭐⭐
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
    color: '#155E75',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
    marginTop: 2,
  },
  statesRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  stateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CFFAFE',
    gap: 4,
  },
  activeStateCard: {
    borderColor: '#0891B2',
    backgroundColor: '#ECFEFF',
    transform: [{scale: 1.05}],
  },
  stateEmoji: {
    fontSize: 32,
  },
  stateName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#155E75',
  },
  activeStateName: {
    color: '#0E7490',
    fontWeight: '900',
  },
  stateTemp: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stateInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#A5F3FC',
    alignItems: 'center',
    gap: 6,
  },
  stateInfoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#155E75',
  },
  stateInfoDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    textAlign: 'center',
    lineHeight: 20,
  },
  cycleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    gap: 12,
  },
  cycleStepCenter: {
    alignItems: 'center',
    gap: 6,
  },
  cycleEmoji: {
    fontSize: 48,
  },
  cycleStepName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0369A1',
  },
  cycleStepDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284C7',
    textAlign: 'center',
  },
  cycleDotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cycleDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  activeCycleDot: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
    transform: [{scale: 1.15}],
  },
  cycleDotText: {
    fontSize: 20,
  },
  earthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  earthItem: {
    width: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CFFAFE',
    gap: 4,
  },
  earthEmoji: {
    fontSize: 32,
  },
  earthName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#155E75',
  },
  earthDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  finishBtn: {
    backgroundColor: '#0891B2',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#0891B2',
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
