import {useCallback, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {space, useTheme} from '@shared/ui';

import {markLessonComplete} from '@features/chess/data/lessonProgress';
import {
  getLesson,
  nextLessonId,
} from '@features/chess/domain/curriculum/lessons';
import {
  isChessLessonId,
  type ChessLessonId,
} from '@features/chess/domain/curriculum/types';
import {
  ChessBoard,
  ChessCoachFooter,
  ChessInstructionCard,
  ChessPieceIntro,
  ChessProgress,
} from '@features/chess/presentation/components';
import {useLessonPlayer} from '@features/chess/presentation/hooks/useLessonPlayer';
import type {ChessStackParamList} from '@navigation/chessTypes';

type Props = NativeStackScreenProps<ChessStackParamList, 'Lesson'>;

function resolveLessonId(raw: string): ChessLessonId {
  const stripped = raw.replace(/^chess\./, '');
  if (isChessLessonId(stripped)) {
    return stripped;
  }
  return 'pawn';
}

export function ChessLessonScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace} = useTheme();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );

  const lessonId = resolveLessonId(route.params.lessonId);
  const lesson = getLesson(lessonId);
  const player = useLessonPlayer(lesson);

  const [showCelebration, setShowCelebration] = useState(false);

  const title = player.preferTamil ? lesson.titleTa : lesson.titleEn;
  const nextId = nextLessonId(lessonId);
  const nextLesson = nextId ? getLesson(nextId) : null;

  const finishLesson = useCallback(async () => {
    const earnedStars = player.calculatedStars;
    markLessonComplete(lessonId, earnedStars);

    const repo = createMmkvGamificationRepository();
    const result = await grantRewards(repo, {
      childId: asChildId(activeChildId),
      source: 'lesson',
      moduleId: ModuleId.Chess,
      reasonCode: `chess.lesson.${lessonId}.complete`,
      stars: earnedStars,
      xp: 20,
    });
    if (result.ok) {
      dispatch(
        applyGrantResult({
          snapshot: result.value.snapshot,
          celebrations: result.value.celebrations,
        }),
      );
    }
    setShowCelebration(true);
  }, [activeChildId, dispatch, lessonId, player.calculatedStars]);

  const onContinue = useCallback(() => {
    if (player.isLast) {
      void finishLesson();
      return;
    }
    player.goNext();
  }, [finishLesson, player]);

  const onGoToNextLesson = () => {
    setShowCelebration(false);
    if (nextId) {
      navigation.replace('Lesson', {lessonId: nextId});
    } else {
      navigation.navigate('Hub');
    }
  };

  const onGoToHub = () => {
    setShowCelebration(false);
    navigation.navigate('Hub');
  };

  const interactive = player.phase === 'practicing';
  const highlights =
    player.feedbackTone === 'error' || player.showingHint
      ? player.step?.practice?.targets ?? player.step?.highlights
      : player.feedbackTone === 'success'
      ? player.step?.practice?.targets
      : player.selectedFrom
      ? [player.selectedFrom, ...(player.step?.highlights ?? [])]
      : player.step?.highlights;

  const tone =
    player.feedbackTone === 'error'
      ? 'error'
      : player.feedbackTone === 'success'
      ? 'success'
      : player.showingHint
      ? 'teach'
      : player.step?.highlightTone;

  const isIntroStep =
    player.step?.id.endsWith('-intro') ||
    (!player.step?.practice && !player.step?.demo && player.stepIndex === 0);

  const activeSquare = player.selectedFrom ?? player.step?.practice?.from;

  return (
    <AppSafeAreaView testID="chess-lesson-screen" padded={false}>
      {/* Top Navigation & Step Dot Progress Header */}
      <ChessProgress
        title={title}
        currentStep={player.stepIndex}
        totalSteps={player.stepCount}
        stars={player.calculatedStars}
        onBack={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('Hub')
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.sm}]}
        showsVerticalScrollIndicator={false}>
        {/* Tamil Instruction Card directly above the board */}
        {!isIntroStep && (
          <ChessInstructionCard
            titleTa={lesson.titleTa}
            pieceSymbol={lesson.pieceSymbol}
            instructionTa={player.caption}
            onReplayAudio={player.replaySpeech}
          />
        )}

        {isIntroStep ? (
          <ChessPieceIntro
            titleTa={lesson.titleTa}
            subtitleTa={lesson.subtitleTa}
            pieceSymbol={lesson.pieceSymbol}
            descriptionTa={player.caption}
          />
        ) : (
          <View style={styles.boardWrapper}>
            <ChessBoard
              pieces={player.pieces}
              highlights={highlights}
              highlightTone={tone}
              selectedFrom={player.selectedFrom}
              interactive={interactive}
              dimUnusedPieces={lesson.order <= 6}
              activePieceSquare={activeSquare}
              onSquarePress={sq => {
                void player.onSquarePress(sq);
              }}
              testID="chess-board"
            />
          </View>
        )}
      </ScrollView>

      {/* Child-friendly Tamil Coach Footer */}
      <ChessCoachFooter
        instructionTa={player.caption}
        onReplayAudio={player.replaySpeech}
        onShowHint={player.phase === 'practicing' ? player.showHint : undefined}
        onContinue={
          player.phase === 'readyNext' ||
          player.phase === 'listening' ||
          isIntroStep
            ? onContinue
            : undefined
        }
        continueLabel={
          player.isLast
            ? t('chess.lesson.finish', {defaultValue: 'முடி (Finish)'})
            : t('common.next', {defaultValue: 'அடுத்து (Next)'})
        }
        isAnswered={player.phase === 'readyNext'}
      />

      {/* Celebration Modal on Completion */}
      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
        onRequestClose={onGoToNextLesson}>
        <View style={styles.modalBackdrop}>
          <View style={styles.celebrationCard}>
            <View style={styles.starBadgeRow}>
              {Array.from({length: 3}).map((_, sIdx) => (
                <Text
                  key={`earned-star-${sIdx}`}
                  style={[
                    styles.earnedStar,
                    sIdx < player.calculatedStars && styles.earnedStarActive,
                  ]}>
                  ★
                </Text>
              ))}
            </View>

            <Text style={styles.congratsTitle}>அருமை! (Awesome!)</Text>
            <Text style={styles.congratsDesc}>
              நீ {lesson.titleTa} பாடத்தை வெற்றிகரமாக முடித்துவிட்டாய்!
            </Text>

            <View style={styles.modalActions}>
              {nextLesson ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onGoToNextLesson}
                  style={({pressed}) => [
                    styles.primaryNextBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <Text style={styles.primaryNextBtnText}>
                    அடுத்த பாடம்:{' '}
                    {player.preferTamil
                      ? nextLesson.titleTa
                      : nextLesson.titleEn}{' '}
                    ➔
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={onGoToHub}
                style={({pressed}) => [
                  nextLesson ? styles.secondaryHubBtn : styles.primaryNextBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text
                  style={
                    nextLesson
                      ? styles.secondaryHubBtnText
                      : styles.primaryNextBtnText
                  }>
                  பாடத்திட்டம் (Lesson Map)
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 28, 36, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 14,
    borderWidth: 3,
    borderColor: '#22C55E',
  },
  starBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earnedStar: {
    fontSize: 42,
    color: '#E5E7EB',
  },
  earnedStarActive: {
    color: '#F59E0B',
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#166534',
  },
  congratsDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 8,
  },
  primaryNextBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryNextBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryHubBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  secondaryHubBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
});
