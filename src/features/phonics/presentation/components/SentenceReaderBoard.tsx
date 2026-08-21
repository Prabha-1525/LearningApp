import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsSentenceItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface SentenceReaderBoardProps {
  readonly sentenceItem: PhonicsSentenceItem;
  readonly onNext?: () => void;
}

export function SentenceReaderBoard({
  sentenceItem,
  onNext,
}: SentenceReaderBoardProps) {
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<
    number | null
  >(null);

  const handleReadFull = async () => {
    for (let i = 0; i < sentenceItem.words.length; i++) {
      setHighlightedWordIndex(i);
      phonicsAudio.speak(sentenceItem.words[i] ?? '');
      await new Promise(r => setTimeout(r, 600));
    }
    setHighlightedWordIndex(null);
  };

  const handleTapWord = (word: string, index: number) => {
    setHighlightedWordIndex(index);
    phonicsAudio.speak(word);
    setTimeout(() => setHighlightedWordIndex(null), 500);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.tag}>📝 READ SIMPLE SENTENCES</Text>

      {/* Picture Visual */}
      <View style={styles.clueBox}>
        <Text style={styles.emoji}>{sentenceItem.emoji}</Text>
      </View>

      {/* Word-by-Word Sentence Shelf */}
      <View style={styles.wordsRow}>
        {sentenceItem.words.map((word, idx) => {
          const isHighlighted = highlightedWordIndex === idx;
          const isFocus = word
            .toLowerCase()
            .includes(sentenceItem.focusWord.toLowerCase());

          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Word ${word}`}
              onPress={() => handleTapWord(word, idx)}
              style={[
                styles.wordTile,
                isHighlighted && styles.wordTileHighlighted,
                isFocus && styles.wordTileFocus,
              ]}>
              <Text
                style={[
                  styles.wordText,
                  isHighlighted && styles.wordTextHighlighted,
                  isFocus && styles.wordTextFocus,
                ]}>
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hintText}>
        💡 Tap any word to hear it, or press "Read Aloud"!
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read sentence aloud"
          onPress={handleReadFull}
          style={styles.readBtn}>
          <Text style={styles.readBtnText}>🔊 Read Aloud</Text>
        </Pressable>

        {onNext && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next sentence"
            onPress={onNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next ➔</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#3B82F6',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  clueBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  emoji: {
    fontSize: 50,
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginVertical: 6,
  },
  wordTile: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordTileHighlighted: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
    transform: [{scale: 1.06}],
  },
  wordTileFocus: {
    borderColor: '#93C5FD',
  },
  wordText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  wordTextHighlighted: {
    color: '#FFFFFF',
  },
  wordTextFocus: {
    color: '#1D4ED8',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  readBtn: {
    flex: 1.4,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#10B981',
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
