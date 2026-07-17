import {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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
import {
  AppText,
  Chip,
  MascotSpot,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {markLessonComplete} from '@features/chess/data/lessonProgress';
import {
  getLesson,
  nextLessonId,
} from '@features/chess/domain/curriculum/lessons';
import {
  isChessLessonId,
  type ChessLessonId,
} from '@features/chess/domain/curriculum/types';
import {TeachingBoard} from '@features/chess/presentation/components/TeachingBoard';
import {useLessonPlayer} from '@features/chess/presentation/hooks/useLessonPlayer';
import type {ChessStackParamList} from '@navigation/chessTypes';

type Props = NativeStackScreenProps<ChessStackParamList, 'Lesson'>;

function resolveLessonId(raw: string): ChessLessonId {
  const stripped = raw.replace(/^chess\./, '');
  if (isChessLessonId(stripped)) {
    return stripped;
  }
  return 'board';
}

/**
 * Step-by-step Tamil voice lesson player with demos and guided practice.
 */
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
  const [finishing, setFinishing] = useState(false);

  const title = player.preferTamil ? lesson.titleTa : lesson.titleEn;
  const progress =
    lesson.steps.length <= 1 ? 1 : player.stepIndex / (lesson.steps.length - 1);

  const finishLesson = useCallback(async () => {
    setFinishing(true);
    markLessonComplete(lessonId);
    const repo = createMmkvGamificationRepository();
    const result = await grantRewards(repo, {
      childId: asChildId(activeChildId),
      source: 'lesson',
      moduleId: ModuleId.Chess,
      reasonCode: `chess.lesson.${lessonId}.complete`,
      stars: 2,
      xp: 15,
    });
    if (result.ok) {
      dispatch(
        applyGrantResult({
          snapshot: result.value.snapshot,
          celebrations: result.value.celebrations,
        }),
      );
    }
    setFinishing(false);

    const next = nextLessonId(lessonId);
    if (next) {
      navigation.replace('Lesson', {lessonId: next});
    } else {
      navigation.navigate('Hub');
    }
  }, [activeChildId, dispatch, lessonId, navigation]);

  const onContinue = useCallback(() => {
    if (player.isLast) {
      void finishLesson();
      return;
    }
    player.goNext();
  }, [finishLesson, player]);

  const interactive = player.phase === 'practicing';
  const highlights =
    player.feedbackTone === 'error'
      ? player.step?.highlights
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
      : player.step?.highlightTone;

  return (
    <AppSafeAreaView testID="chess-lesson-screen">
      <TopAppBar
        title={title}
        subtitle={t('chess.lesson.step', {
          current: player.stepIndex + 1,
          total: player.stepCount,
        })}
        onBack={() => navigation.navigate('Hub')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <ProgressBar progress={progress} />

        <View style={styles.coachRow}>
          <MascotSpot
            mood={
              player.feedbackTone === 'success'
                ? 'cheer'
                : player.feedbackTone === 'error'
                ? 'calm'
                : 'happy'
            }
            size={72}
            label={t('chess.hub.coachName')}
          />
          <View style={styles.captionBox}>
            <Chip label={t('chess.lesson.listening')} />
            <AppText variant="body" tone="ink" style={styles.caption}>
              {player.caption || '…'}
            </AppText>
          </View>
        </View>

        <TeachingBoard
          size={300}
          pieces={player.pieces}
          highlights={highlights}
          highlightTone={tone}
          selectedFrom={player.selectedFrom}
          interactive={interactive}
          onSquarePress={sq => {
            void player.onSquarePress(sq);
          }}
          testID="chess-teaching-board"
        />

        {player.phase === 'practicing' ? (
          <AppText variant="caption" tone="muted" style={styles.center}>
            {t('chess.lesson.practiceHint')}
          </AppText>
        ) : null}

        {player.phase === 'demo' ? (
          <AppText variant="caption" tone="muted" style={styles.center}>
            {t('chess.lesson.watchDemo')}
          </AppText>
        ) : null}

        {player.phase === 'readyNext' ? (
          <PrimaryButton
            label={player.isLast ? t('chess.lesson.finish') : t('common.next')}
            onPress={onContinue}
            loading={finishing}
            testID="chess-lesson-next"
          />
        ) : null}

        {player.phase === 'practicing' && player.step?.demo ? (
          <SecondaryButton
            label={t('chess.lesson.showAgain')}
            onPress={() => {
              void player.replayDemo();
            }}
          />
        ) : null}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  captionBox: {
    flex: 1,
    gap: space.xs,
  },
  caption: {
    flexShrink: 1,
  },
  center: {
    textAlign: 'center',
  },
});
