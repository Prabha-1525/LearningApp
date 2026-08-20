import React, {useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {EnglishHeader} from '../../features/english/presentation/components';
import {LETTER_OBJECTS_DATA} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'LetterObjects'>;

export function EnglishLetterObjectsScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const currentItem = LETTER_OBJECTS_DATA[currentIdx];
  const isLast = currentIdx === LETTER_OBJECTS_DATA.length - 1;

  const options = React.useMemo(() => {
    if (!currentItem) return [];
    const correctOpt = {
      objectName: currentItem.objectName,
      emoji: currentItem.emoji,
      isCorrect: true,
    };
    const distractorOpts = currentItem.distractors.map(d => ({
      ...d,
      isCorrect: false,
    }));
    return [correctOpt, ...distractorOpts].sort((a, b) =>
      a.objectName.localeCompare(b.objectName),
    );
  }, [currentItem]);

  const handleSelect = (opt: (typeof options)[number]) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt.objectName);
    setIsCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      setScore(prev => prev + 1);
      englishAudio.playSuccessChime();
      englishAudio.speak(
        `Correct! ${currentItem.letter} is for ${opt.objectName}!`,
      );
    } else {
      englishAudio.playTryAgainTone();
      englishAudio.speak(
        `Try again! ${currentItem.letter} is for ${currentItem.objectName}.`,
      );
    }

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score;
      const total = LETTER_OBJECTS_DATA.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      recordEnglishLessonResult(
        'letter_objects',
        'letter_objects_quiz',
        stars,
        score,
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'letter_objects',
        title: 'Letter-Object Champion',
        stars,
        score,
        totalQuestions: total,
        nextSubModuleId: 'phonics',
      });
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  if (!currentItem) return null;

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Letter & Object Match"
        subtitle="Which object matches the letter?"
        emoji="🖼️"
        accentColor="#10B981"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Progress Dots */}
        <View style={styles.progressRow}>
          {LETTER_OBJECTS_DATA.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIdx && styles.dotActive,
                idx < currentIdx && styles.dotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Hero Letter Card */}
        <Animated.View
          style={[styles.targetCard, {transform: [{scale: bounceAnim}]}]}>
          <Text style={styles.promptLabel}>
            Which object starts with letter:
          </Text>
          <View style={styles.letterPill}>
            <Text style={styles.targetLetter}>{currentItem.letter}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Hear prompt for letter ${currentItem.letter}`}
            onPress={() =>
              englishAudio.speak(
                `Which object starts with letter ${currentItem.letter}?`,
              )
            }
            style={styles.listenBtn}>
            <Text style={styles.listenBtnText}>🔊 Listen Prompt</Text>
          </Pressable>
        </Animated.View>

        {/* 3 Large Object Options */}
        <View style={styles.optionsList}>
          {options.map(opt => {
            const isSelected = selectedOption === opt.objectName;
            const showSuccess = selectedOption !== null && opt.isCorrect;
            const showWrong = isSelected && !opt.isCorrect;

            return (
              <Pressable
                key={opt.objectName}
                accessibilityRole="button"
                accessibilityLabel={`Object ${opt.objectName}`}
                disabled={selectedOption !== null}
                onPress={() => handleSelect(opt)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                  showSuccess && styles.optionSuccess,
                  showWrong && styles.optionWrong,
                ]}>
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text style={styles.optionName}>{opt.objectName}</Text>
                {showSuccess && <Text style={styles.badgeEmoji}>✅</Text>}
                {showWrong && <Text style={styles.badgeEmoji}>💡</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Next Action */}
        {selectedOption !== null && (
          <View
            style={[
              styles.feedbackCard,
              isCorrect ? styles.feedbackSuccess : styles.feedbackWrong,
            ]}>
            <Text style={styles.feedbackText}>
              {isCorrect
                ? `🌟 Super! ${currentItem.sentence}`
                : `💡 Remember: ${currentItem.sentence}`}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNext}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>
                {isLast ? 'Complete Matching ⭐' : 'Next Letter ➔'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  targetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10B981',
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  letterPill: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: '#ECFDF5',
    borderWidth: 2.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLetter: {
    fontSize: 56,
    fontWeight: '900',
    color: '#065F46',
  },
  listenBtn: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  optionsList: {
    width: '100%',
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionWrong: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  optionEmoji: {
    fontSize: 40,
  },
  optionName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    flex: 1,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  feedbackCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  feedbackSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
