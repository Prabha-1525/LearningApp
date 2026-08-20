import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  COMMAND_METAS,
  DEBUGGING_PUZZLES,
} from '../../domain/catalog/codingData';
import type {
  CodingCommand,
  DebuggingPuzzle,
} from '../../domain/entities/codingEntities';

interface DebuggingGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function DebuggingGame({onComplete}: DebuggingGameProps) {
  const {t} = useTranslation();
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [currentCode, setCurrentCode] = useState<CodingCommand[]>(() => [
    ...(DEBUGGING_PUZZLES[0]?.initialCode ?? []),
  ]);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number>(
    DEBUGGING_PUZZLES[0]?.buggyIndex ?? 1,
  );
  const [isFixed, setIsFixed] = useState<boolean | null>(null);

  const puzzle: DebuggingPuzzle =
    DEBUGGING_PUZZLES[puzzleIndex] ?? DEBUGGING_PUZZLES[0]!;

  const handleSelectSlot = (idx: number) => {
    setSelectedSlotIdx(idx);
    setIsFixed(null);
  };

  const handleReplaceCommand = (cmd: CodingCommand) => {
    const updated = [...currentCode];
    updated[selectedSlotIdx] = cmd;
    setCurrentCode(updated);

    // Check if the fixed command matches puzzle's correct command
    if (
      selectedSlotIdx === puzzle.buggyIndex &&
      cmd === puzzle.correctCommand
    ) {
      setIsFixed(true);
      onComplete?.(3);
    } else {
      setIsFixed(false);
    }
  };

  const handleNextPuzzle = () => {
    const nextIdx = (puzzleIndex + 1) % DEBUGGING_PUZZLES.length;
    setPuzzleIndex(nextIdx);
    const nextP = DEBUGGING_PUZZLES[nextIdx] ?? DEBUGGING_PUZZLES[0]!;
    setCurrentCode([...nextP.initialCode]);
    setSelectedSlotIdx(nextP.buggyIndex);
    setIsFixed(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Puzzle Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {DEBUGGING_PUZZLES.map((pz, idx) => {
          const isSelected = idx === puzzleIndex;
          return (
            <Pressable
              key={pz.id}
              accessibilityRole="button"
              onPress={() => {
                setPuzzleIndex(idx);
                setCurrentCode([...pz.initialCode]);
                setSelectedSlotIdx(pz.buggyIndex);
                setIsFixed(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                🐛 Bug {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🐛 {t('coding.debugging.title', 'Fix the Broken Code')}
        </Text>
        <Text style={styles.cardText}>
          {t(
            'coding.debugging.intro',
            'In coding, a mistake is called a "Bug". Can you find the 1 wrong command and replace it with the correct arrow?',
          )}
        </Text>

        {/* The Current Code with Bug Indicator */}
        <View style={styles.codeBox}>
          <Text style={styles.codeBoxTitle}>
            🔍 Tap the buggy step (highlighted in red):
          </Text>
          <View style={styles.codeSlotsRow}>
            {currentCode.map((cmd, idx) => {
              const isBuggy = idx === puzzle.buggyIndex;
              const isSelected = selectedSlotIdx === idx;
              const meta = COMMAND_METAS.find(c => c.id === cmd);

              return (
                <Pressable
                  key={`slot-${idx}`}
                  accessibilityRole="button"
                  onPress={() => handleSelectSlot(idx)}
                  style={[
                    styles.slotPill,
                    isBuggy && styles.slotPillBuggy,
                    isSelected && styles.slotPillSelected,
                  ]}>
                  {isBuggy && <Text style={styles.bugBadge}>🐛</Text>}
                  <Text style={styles.slotStepNum}>Step {idx + 1}</Text>
                  <Text style={styles.slotCmdIcon}>{meta?.icon ?? '➡️'}</Text>
                  <Text style={styles.slotCmdLabel}>{cmd.toUpperCase()}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Replacement Palette */}
        <View style={styles.paletteBox}>
          <Text style={styles.paletteTitle}>
            🔧 Select Replacement Arrow for Step {selectedSlotIdx + 1}:
          </Text>
          <View style={styles.paletteRow}>
            {COMMAND_METAS.slice(0, 4).map(meta => (
              <Pressable
                key={meta.id}
                accessibilityRole="button"
                onPress={() => handleReplaceCommand(meta.id)}
                style={({pressed}) => [
                  styles.paletteBtn,
                  {borderColor: meta.color},
                  pressed && styles.paletteBtnPressed,
                ]}>
                <Text style={styles.paletteBtnIcon}>{meta.icon}</Text>
                <Text style={[styles.paletteBtnText, {color: meta.color}]}>
                  {t(meta.labelKey, meta.id.toUpperCase())}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Feedback Banner */}
        {isFixed === true && (
          <View style={styles.feedbackSuccess}>
            <Text style={styles.feedbackSuccessText}>
              🎉 HOORAY! You squashed the bug! The robot can now reach the star!
              🌟
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextPuzzle}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>Next Bug Puzzle ❯</Text>
            </Pressable>
          </View>
        )}

        {isFixed === false && (
          <View style={styles.feedbackWrong}>
            <Text style={styles.feedbackWrongText}>
              ❌ That command still does not reach the goal. Try another arrow!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  strip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  codeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  codeBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  codeSlotsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  slotPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  slotPillBuggy: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  slotPillSelected: {
    borderColor: '#3B82F6',
    borderWidth: 3,
    backgroundColor: '#EFF6FF',
    transform: [{scale: 1.05}],
  },
  bugBadge: {
    position: 'absolute',
    top: -8,
    right: -6,
    fontSize: 16,
  },
  slotStepNum: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
  },
  slotCmdIcon: {
    fontSize: 24,
  },
  slotCmdLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E293B',
  },
  paletteBox: {
    gap: 8,
  },
  paletteTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paletteBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    gap: 4,
  },
  paletteBtnPressed: {
    transform: [{scale: 0.95}],
  },
  paletteBtnIcon: {
    fontSize: 24,
  },
  paletteBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  feedbackSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  feedbackWrongText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
});
