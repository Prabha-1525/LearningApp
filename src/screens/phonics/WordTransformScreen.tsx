import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  PhonicsHeader,
  WordTransformationBoard,
} from '../../features/phonics/presentation/components';
import {WORD_TRANSFORMATIONS} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'WordTransform'>;

export function WordTransformScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);

  const sampleTransforms = WORD_TRANSFORMATIONS.slice(0, 3);
  const currentTransform = sampleTransforms[currentIdx] ?? sampleTransforms[0]!;

  const handleNextTransform = () => {
    if (currentIdx < sampleTransforms.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const res = recordPhonicsLessonResult('word_transform', 100, 3);
      navigation.replace('PhonicsLessonComplete', {
        subModuleId: 'word_transform',
        title: 'Sound Switcher',
        starsEarned: 3,
        scorePercent: 100,
        unlockedNextId: res.unlockedNextId,
      });
    }
  };

  return (
    <AppSafeAreaView>
      <PhonicsHeader
        title="Change One Sound"
        subtitle={`Challenge ${currentIdx + 1} of ${sampleTransforms.length}`}
        accentColor="#EAB308"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <WordTransformationBoard
            key={currentTransform.id}
            transformItem={currentTransform}
            onNext={handleNextTransform}
          />
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  cardWrap: {
    width: '100%',
  },
});
