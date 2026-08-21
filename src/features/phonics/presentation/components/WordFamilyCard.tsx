import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsWordFamilyItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface WordFamilyCardProps {
  readonly familyItem: PhonicsWordFamilyItem;
  readonly onNext?: () => void;
}

export function WordFamilyCard({familyItem, onNext}: WordFamilyCardProps) {
  const [selectedWord, setSelectedWord] = React.useState<string>(
    familyItem.words[0] ?? '',
  );

  const handleSelectWord = (word: string, _emoji: string) => {
    setSelectedWord(word);
    phonicsAudio.playTone(520, 50);
    phonicsAudio.speak(`${word}! Ends in ${familyItem.familyEnding}!`);
  };

  return (
    <View style={[styles.card, {borderColor: familyItem.color}]}>
      {/* Family Heading Banner */}
      <View style={[styles.headingBanner, {backgroundColor: familyItem.color}]}>
        <Text style={styles.headingTitle}>
          The {familyItem.familyEnding} Word Family
        </Text>
        <Text style={styles.headingSub}>Notice the common ending sounds!</Text>
      </View>

      {/* Interactive Word Shelf */}
      <View style={styles.shelfContainer}>
        {familyItem.words.map((word, idx) => {
          const isSelected = selectedWord === word;
          const emoji = familyItem.emojis[idx] ?? '✨';
          const prefix = word.replace(
            new RegExp(`${familyItem.familyEnding.replace('-', '')}$`, 'i'),
            '',
          );
          const ending = familyItem.familyEnding.replace('-', '').toUpperCase();

          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Word ${word}`}
              onPress={() => handleSelectWord(word, emoji)}
              style={[
                styles.wordPill,
                isSelected && {
                  borderColor: familyItem.color,
                  backgroundColor: '#FFFBEB',
                  transform: [{scale: 1.04}],
                },
              ]}>
              <Text style={styles.wordEmoji}>{emoji}</Text>
              <Text style={styles.wordText}>
                <Text style={styles.prefixText}>{prefix}</Text>
                <Text style={[styles.endingText, {color: familyItem.color}]}>
                  {ending}
                </Text>
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Selected Word Deep Dive */}
      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>
          🔊 Tap any word above to hear the rhyming pattern!
        </Text>
      </View>

      {onNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next family"
          onPress={onNext}
          style={[styles.nextBtn, {backgroundColor: familyItem.color}]}>
          <Text style={styles.nextBtnText}>Next Family ➔</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3.5,
    padding: 18,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headingBanner: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
  },
  headingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headingSub: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  shelfContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginVertical: 4,
  },
  wordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  wordEmoji: {
    fontSize: 22,
  },
  wordText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  prefixText: {
    color: '#1F2937',
  },
  endingText: {
    fontWeight: '900',
  },
  highlightBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
  },
  nextBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
