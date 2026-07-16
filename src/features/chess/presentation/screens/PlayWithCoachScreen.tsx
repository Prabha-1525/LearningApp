import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {
  AppShell,
  AppText,
  Chip,
  MascotSpot,
  PrimaryButton,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {
  chooseCoachMove,
  comfortWrongMove,
  encourageChildTurn,
  hintForChild,
  praiseChildMove,
  suggestChildMove,
  teachConceptLine,
} from '../../application/beginnerCoachAi';
import {
  chessComfortLine,
  chessGreetLine,
  chessHintLine,
  chessPraiseLine,
} from '../../application/coachAiLines';
import {
  applyMove,
  boardToPieceMap,
  createGame,
  gameStatus,
  legalMovesFrom,
} from '../../application/chessEngine';
import {speakCoachLine, stopCoachSpeech} from '../../application/coachSpeech';
import type {Square} from '../../domain/board/squares';
import {CelebrationStars} from '../components/CelebrationStars';
import {TeachingBoard} from '../components/TeachingBoard';
import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'PlayWithCoach'>;

type Phase = 'intro' | 'childTurn' | 'coachTalk' | 'coachMoving' | 'ended';

/**
 * Play-with-coach: beginner chess game with Tamil teaching narration.
 */
export function PlayWithCoachScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace, radius} = useTheme();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );

  const gameRef = useRef(createGame());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedFrom, setSelectedFrom] = useState<Square | null>(null);
  const [highlights, setHighlights] = useState<Square[]>([]);
  const [caption, setCaption] = useState('');
  const [ply, setPly] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [hintTargets, setHintTargets] = useState<Square[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const busy = useRef(false);

  const pieces = useMemo(
    () => boardToPieceMap(gameRef.current),
    // fen invalidates board map
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fen],
  );

  const say = useCallback(async (text: string) => {
    setCaption(text);
    await speakCoachLine(text);
  }, []);

  const refresh = useCallback(() => {
    setFen(gameRef.current.fen());
  }, []);

  const endGame = useCallback(
    async (message: string) => {
      setPhase('ended');
      setCelebrate(true);
      await say(message);
      const repo = createMmkvGamificationRepository();
      const result = await grantRewards(repo, {
        childId: asChildId(activeChildId),
        source: 'module',
        moduleId: ModuleId.Chess,
        reasonCode: 'chess.play_with_coach.finish',
        stars: 3,
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
    },
    [activeChildId, dispatch, say],
  );

  const startCoachTurn = useCallback(async () => {
    setPhase('coachTalk');
    setSelectedFrom(null);
    setHintTargets([]);
    const plan = chooseCoachMove(gameRef.current, ply);
    if (!plan) {
      await endGame('ஆட்டம் முடிந்தது. நீ அருமையாக விளையாடினாய்!');
      return;
    }

    await say(plan.explainTa);
    await say(plan.observeTa);
    setHighlights([plan.move.from, plan.move.to]);
    setPhase('coachMoving');
    await new Promise<void>(resolve => setTimeout(resolve, 650));

    applyMove(gameRef.current, plan.move.from, plan.move.to);
    refresh();
    setPly(value => value + 1);

    const concept = teachConceptLine(plan.move);
    if (concept) {
      await say(concept);
    }

    const status = gameStatus(gameRef.current);
    if (status.checkmate) {
      await endGame(
        'நான் Checkmate செய்தேன். பரவாயில்லை — மீண்டும் விளையாடி கற்போம்!',
      );
      return;
    }
    if (status.draw) {
      await endGame('ஆட்டம் சமம்! நல்ல பயிற்சி.');
      return;
    }

    setHighlights([]);
    setPhase('childTurn');
    await say(encourageChildTurn());
  }, [endGame, ply, refresh, say]);

  useEffect(() => {
    let cancelled = false;
    async function intro() {
      setIsAiLoading(true);
      const greeting = await chessGreetLine(
        'வணக்கம்! நான் உன் சதுரங்க நண்பன். நாம் ஒன்றாக விளையாடி கற்போம். நீ வெள்ளை காய்கள்!',
      );
      setIsAiLoading(false);
      await say(greeting);
      if (cancelled) {
        return;
      }
      setPhase('childTurn');
      await say(encourageChildTurn());
    }
    void intro();
    return () => {
      cancelled = true;
      stopCoachSpeech();
    };
  }, [say]);

  const onSquarePress = useCallback(
    async (square: Square) => {
      if (phase !== 'childTurn' || busy.current) {
        return;
      }
      busy.current = true;
      try {
        const game = gameRef.current;
        if (game.turn() !== 'w') {
          return;
        }

        if (!selectedFrom) {
          const piece = pieces[square];
          if (!piece || piece !== piece.toUpperCase()) {
            await say('உன் வெள்ளை காயைத் தொடு.');
            return;
          }
          const targets = legalMovesFrom(game, square);
          if (targets.length === 0) {
            await say(
              'இந்த காய் இப்போது நகர முடியாது. வேறு காயை முயற்சி செய்.',
            );
            return;
          }
          setSelectedFrom(square);
          setHighlights([square, ...targets]);
          return;
        }

        if (square === selectedFrom) {
          setSelectedFrom(null);
          setHighlights([]);
          return;
        }

        const legal = legalMovesFrom(game, selectedFrom);
        if (!legal.includes(square)) {
          setSelectedFrom(null);
          setHighlights([]);
          setIsAiLoading(true);
          const comfort = await chessComfortLine(
            'illegal move',
            comfortWrongMove(),
          );
          setIsAiLoading(false);
          await say(comfort);
          const tip = hintForChild(game);
          setIsAiLoading(true);
          const aiTip = await chessHintLine(game.fen(), tip);
          setIsAiLoading(false);
          await say(aiTip);
          const suggestion = suggestChildMove(game);
          if (suggestion) {
            setHintTargets([suggestion.from, suggestion.to]);
            setHighlights([suggestion.from, suggestion.to]);
          }
          return;
        }

        const move = applyMove(game, selectedFrom, square);
        setSelectedFrom(null);
        setHighlights([]);
        setHintTargets([]);
        refresh();
        setPly(value => value + 1);

        if (!move) {
          await say(comfortWrongMove());
          return;
        }

        if (move.isCapture || move.isCheck || move.isCheckmate) {
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 1400);
        }

        await say(await chessPraiseLine(move.san, praiseChildMove(move)));
        const concept = teachConceptLine(move);
        if (concept) {
          await say(concept);
        }

        const status = gameStatus(game);
        if (status.checkmate) {
          await endGame('மிக அருமை! நீ வென்றாய்!');
          return;
        }
        if (status.draw) {
          await endGame('ஆட்டம் சமம்! நல்ல முயற்சி.');
          return;
        }

        await startCoachTurn();
      } finally {
        busy.current = false;
      }
    },
    [endGame, phase, pieces, refresh, say, selectedFrom, startCoachTurn],
  );

  const onHint = useCallback(async () => {
    if (phase !== 'childTurn') {
      return;
    }
    const tip = hintForChild(gameRef.current);
    setIsAiLoading(true);
    const aiTip = await chessHintLine(gameRef.current.fen(), tip);
    setIsAiLoading(false);
    await say(aiTip);
    const suggestion = suggestChildMove(gameRef.current);
    if (suggestion) {
      setHintTargets([suggestion.from, suggestion.to]);
      setHighlights([suggestion.from, suggestion.to]);
    }
  }, [phase, say]);

  const onNewGame = useCallback(async () => {
    stopCoachSpeech();
    gameRef.current = createGame();
    setPly(0);
    setSelectedFrom(null);
    setHighlights([]);
    setHintTargets([]);
    setCelebrate(false);
    refresh();
    setPhase('intro');
    await say('புதிய ஆட்டம்! நீ மீண்டும் வெள்ளை. மெதுவாக யோசித்து விளையாடு.');
    setPhase('childTurn');
    await say(encourageChildTurn());
  }, [refresh, say]);

  const boardHighlights = hintTargets.length > 0 ? hintTargets : highlights;

  return (
    <AppShell testID="chess-play-coach-screen">
      <TopAppBar
        title={t('chess.play.title')}
        subtitle={t('chess.play.subtitle')}
        onBack={() => navigation.navigate('Hub')}
      />
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.coachBanner,
              {
                backgroundColor: '#FFE8C2',
                borderRadius: radius.lg,
                borderColor: '#F4B400',
              },
            ]}>
            <MascotSpot
              mood={
                celebrate ? 'cheer' : phase === 'coachTalk' ? 'calm' : 'happy'
              }
              size={72}
              label={t('chess.hub.coachName')}
            />
            <View style={styles.captionCol}>
              <Chip
                label={
                  isAiLoading
                    ? t('common.loading')
                    : phase === 'childTurn'
                    ? t('chess.play.yourTurn')
                    : phase === 'ended'
                    ? t('chess.play.finished')
                    : t('chess.play.coachTurn')
                }
                tone={phase === 'childTurn' ? 'sun' : 'accent'}
              />
              <AppText variant="body" tone="ink">
                {caption || '…'}
              </AppText>
            </View>
          </View>

          <View style={styles.boardWrap}>
            <TeachingBoard
              size={304}
              pieces={pieces}
              highlights={boardHighlights}
              highlightTone={
                phase === 'coachMoving'
                  ? 'move'
                  : hintTargets.length
                  ? 'teach'
                  : selectedFrom
                  ? 'success'
                  : 'teach'
              }
              selectedFrom={selectedFrom}
              interactive={phase === 'childTurn'}
              onSquarePress={sq => {
                void onSquarePress(sq);
              }}
              testID="chess-play-board"
            />
            <CelebrationStars visible={celebrate} label={t('chess.play.yay')} />
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={t('chess.play.hint')}
              onPress={() => {
                void onHint();
              }}
              disabled={phase !== 'childTurn'}
            />
            <SecondaryButton
              label={t('chess.play.newGame')}
              onPress={() => {
                void onNewGame();
              }}
            />
            <SecondaryButton
              label={t('common.back')}
              onPress={() => navigation.navigate('Hub')}
            />
          </View>
        </ScrollView>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  content: {
    paddingBottom: space.xl,
  },
  coachBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.md,
    borderWidth: 2,
  },
  captionCol: {
    flex: 1,
    gap: space.xs,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  actions: {
    gap: space.sm,
  },
});
