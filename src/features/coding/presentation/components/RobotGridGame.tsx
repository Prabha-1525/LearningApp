import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  COMMAND_METAS,
  ROBOT_MAZE_LEVELS,
} from '../../domain/catalog/codingData';
import type {
  CodingCommand,
  GridPosition,
  RobotMazeLevel,
} from '../../domain/entities/codingEntities';

interface RobotGridGameProps {
  readonly onLevelComplete?: (levelNumber: number, stars: number) => void;
}

export function RobotGridGame({onLevelComplete}: RobotGridGameProps) {
  const {t} = useTranslation();
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [commands, setCommands] = useState<CodingCommand[]>([]);
  const [robotPos, setRobotPos] = useState<GridPosition>(
    ROBOT_MAZE_LEVELS[0]?.startPos ?? {row: 0, col: 0},
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [feedback, setFeedback] = useState<{
    status: 'success' | 'obstacle' | 'boundary' | 'short' | null;
    msg: string;
  }>({status: null, msg: ''});

  const level: RobotMazeLevel =
    ROBOT_MAZE_LEVELS[levelIndex] ?? ROBOT_MAZE_LEVELS[0]!;

  const robotBounceAnim = useRef(new Animated.Value(1)).current;
  const starGlowAnim = useRef(new Animated.Value(1)).current;

  // Reset position when changing level
  useEffect(() => {
    setRobotPos(level.startPos);
    setCommands([]);
    setIsRunning(false);
    setActiveStepIndex(-1);
    setFeedback({status: null, msg: ''});
  }, [levelIndex, level]);

  // Gentle star pulsating glow
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(starGlowAnim, {
          toValue: 1.25,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(starGlowAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [starGlowAnim]);

  const triggerRobotBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(robotBounceAnim, {
        toValue: 1.35,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(robotBounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [robotBounceAnim]);

  const handleAddCommand = (cmd: CodingCommand) => {
    if (isRunning || commands.length >= level.maxCommands) {
      return;
    }
    setCommands(prev => [...prev, cmd]);
    setFeedback({status: null, msg: ''});
  };

  const handleAddLoopRight = () => {
    if (isRunning || commands.length + 2 > level.maxCommands) {
      return;
    }
    setCommands(prev => [...prev, 'right', 'right']);
  };

  const handleRemoveLast = () => {
    if (isRunning) {
      return;
    }
    setCommands(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isRunning) {
      return;
    }
    setCommands([]);
    setRobotPos(level.startPos);
    setActiveStepIndex(-1);
    setFeedback({status: null, msg: ''});
  };

  const handleReset = () => {
    setIsRunning(false);
    setRobotPos(level.startPos);
    setActiveStepIndex(-1);
    setFeedback({status: null, msg: ''});
  };

  const executeProgram = () => {
    if (commands.length === 0 || isRunning) {
      return;
    }

    setIsRunning(true);
    setRobotPos(level.startPos);
    setFeedback({status: null, msg: ''});

    let currentPos: GridPosition = {...level.startPos};
    let step = 0;

    const intervalId = setInterval(() => {
      if (step >= commands.length) {
        clearInterval(intervalId);
        setIsRunning(false);
        setActiveStepIndex(-1);

        // Check if reached goal
        if (
          currentPos.row === level.goalPos.row &&
          currentPos.col === level.goalPos.col
        ) {
          setFeedback({
            status: 'success',
            msg: t(
              'coding.feedback.success',
              '🎉 YAY! Robot reached the Gold Star! 🌟',
            ),
          });
          triggerRobotBounce();
          onLevelComplete?.(level.levelNumber, 3);
        } else {
          setFeedback({
            status: 'short',
            msg: t(
              'coding.feedback.short',
              '🤖 Robot needs more steps to reach the star! Try adding more arrows.',
            ),
          });
        }
        return;
      }

      const cmd = commands[step];
      setActiveStepIndex(step);

      let nextRow = currentPos.row;
      let nextCol = currentPos.col;

      if (cmd === 'up') {
        nextRow -= 1;
      } else if (cmd === 'down') {
        nextRow += 1;
      } else if (cmd === 'left') {
        nextCol -= 1;
      } else if (cmd === 'right') {
        nextCol += 1;
      }

      // Check boundary hit
      if (
        nextRow < 0 ||
        nextRow >= level.gridSize.rows ||
        nextCol < 0 ||
        nextCol >= level.gridSize.cols
      ) {
        clearInterval(intervalId);
        setIsRunning(false);
        setFeedback({
          status: 'boundary',
          msg: t(
            'coding.feedback.boundary',
            '🚧 Oops! Robot hit the boundary wall! Turn inside the grid.',
          ),
        });
        return;
      }

      // Check obstacle hit
      const isObstacle = level.obstacles.some(
        obs => obs.row === nextRow && obs.col === nextCol,
      );
      if (isObstacle) {
        clearInterval(intervalId);
        setIsRunning(false);
        setFeedback({
          status: 'obstacle',
          msg: t(
            'coding.feedback.obstacle',
            '🪨 Ouch! Robot bumped into a rock! Plan a path around it.',
          ),
        });
        return;
      }

      // Valid step
      currentPos = {row: nextRow, col: nextCol};
      setRobotPos(currentPos);
      triggerRobotBounce();

      step += 1;
    }, 600);
  };

  const isLevelCompleted = feedback.status === 'success';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Level Selector Strip */}
      <View style={styles.levelStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelStrip}>
          {ROBOT_MAZE_LEVELS.map((lvl, idx) => {
            const isSelected = idx === levelIndex;
            return (
              <Pressable
                key={lvl.id}
                accessibilityRole="button"
                onPress={() => setLevelIndex(idx)}
                style={[
                  styles.levelPill,
                  isSelected && styles.levelPillSelected,
                ]}>
                <Text
                  style={[
                    styles.levelPillText,
                    isSelected && styles.levelPillTextSelected,
                  ]}>
                  Lvl {lvl.levelNumber}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Level Info Banner */}
      <View style={styles.levelCard}>
        <View style={styles.levelCardHeader}>
          <Text style={styles.levelTitle}>
            Level {level.levelNumber}:{' '}
            {t(
              level.titleKey,
              level.difficulty === 'beginner'
                ? 'Beginner Maze'
                : level.difficulty === 'intermediate'
                ? 'Explorer Maze'
                : 'Master Maze',
            )}
          </Text>
          <View
            style={[
              styles.diffBadge,
              level.difficulty === 'beginner'
                ? styles.diffBeginner
                : level.difficulty === 'intermediate'
                ? styles.diffIntermediate
                : styles.diffAdvanced,
            ]}>
            <Text style={styles.diffBadgeText}>
              {level.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* The Visual Grid */}
        <View style={styles.gridOuterCard}>
          <View style={styles.gridBoard}>
            {Array.from({length: level.gridSize.rows}).map((_, rIdx) => (
              <View key={`row-${rIdx}`} style={styles.gridRow}>
                {Array.from({length: level.gridSize.cols}).map((__, cIdx) => {
                  const isRobot =
                    robotPos.row === rIdx && robotPos.col === cIdx;
                  const isGoal =
                    level.goalPos.row === rIdx && level.goalPos.col === cIdx;
                  const isObstacle = level.obstacles.some(
                    obs => obs.row === rIdx && obs.col === cIdx,
                  );
                  const isStart =
                    level.startPos.row === rIdx && level.startPos.col === cIdx;

                  return (
                    <View
                      key={`cell-${rIdx}-${cIdx}`}
                      style={[
                        styles.gridCell,
                        isStart && styles.gridCellStart,
                        isGoal && styles.gridCellGoal,
                        isObstacle && styles.gridCellObstacle,
                      ]}>
                      {isObstacle && (
                        <Text style={styles.obstacleIcon}>🪨</Text>
                      )}
                      {isGoal && (
                        <Animated.Text
                          style={[
                            styles.goalIcon,
                            {transform: [{scale: starGlowAnim}]},
                          ]}>
                          ⭐
                        </Animated.Text>
                      )}
                      {isRobot && (
                        <Animated.View
                          style={[
                            styles.robotWrap,
                            {transform: [{scale: robotBounceAnim}]},
                          ]}>
                          <Text style={styles.robotEmoji}>🤖</Text>
                        </Animated.View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Feedback Message */}
        {feedback.msg ? (
          <View
            style={[
              styles.feedbackBanner,
              feedback.status === 'success'
                ? styles.feedbackSuccess
                : styles.feedbackError,
            ]}>
            <Text style={styles.feedbackText}>{feedback.msg}</Text>
          </View>
        ) : null}

        {/* Program Sequence Tray */}
        <View style={styles.programTray}>
          <View style={styles.programTrayHeader}>
            <Text style={styles.programTitle}>
              📝 {t('coding.program.title', 'Your Program Code')} (
              {commands.length}/{level.maxCommands})
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleClear}
              disabled={isRunning || commands.length === 0}
              style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>🧹 Clear</Text>
            </Pressable>
          </View>

          {/* Sequence List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.queueScroll}>
            {commands.length === 0 ? (
              <Text style={styles.emptyQueueText}>
                Tap the arrows below to create robot steps! ⬇️
              </Text>
            ) : (
              commands.map((cmd, idx) => {
                const meta = COMMAND_METAS.find(c => c.id === cmd);
                const isExecuting = activeStepIndex === idx;

                return (
                  <View
                    key={`cmd-${idx}`}
                    style={[
                      styles.commandPill,
                      {borderColor: meta?.color ?? '#6366F1'},
                      isExecuting && styles.commandPillExecuting,
                    ]}>
                    <Text style={styles.commandStepNum}>{idx + 1}</Text>
                    <Text style={styles.commandIcon}>{meta?.icon ?? '➡️'}</Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Command Input Palette */}
        <View style={styles.paletteSection}>
          <Text style={styles.paletteLabel}>
            🧭 {t('coding.palette.label', 'Tap to add instructions:')}
          </Text>
          <View style={styles.paletteGrid}>
            {COMMAND_METAS.slice(0, 4).map(meta => (
              <Pressable
                key={meta.id}
                accessibilityRole="button"
                disabled={isRunning || commands.length >= level.maxCommands}
                onPress={() => handleAddCommand(meta.id)}
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

          {/* Special Loop Shortcut for advanced levels */}
          {level.loopAllowed && (
            <Pressable
              accessibilityRole="button"
              disabled={isRunning || commands.length + 2 > level.maxCommands}
              onPress={handleAddLoopRight}
              style={styles.loopShortcutBtn}>
              <Text style={styles.loopShortcutIcon}>🔁 2x ➡️</Text>
              <Text style={styles.loopShortcutText}>Repeat 2x Right</Text>
            </Pressable>
          )}
        </View>

        {/* Execution & Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            disabled={isRunning || commands.length === 0}
            onPress={handleRemoveLast}
            style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>⌫ Delete Last</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleReset}
            style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>⏹️ Reset</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isRunning || commands.length === 0}
            onPress={executeProgram}
            style={[
              styles.runBtn,
              (isRunning || commands.length === 0) && styles.runBtnDisabled,
            ]}>
            <Text style={styles.runBtnText}>
              {isRunning ? '🤖 Running...' : '▶️ Run Code!'}
            </Text>
          </Pressable>
        </View>

        {/* Level Advance button on success */}
        {isLevelCompleted && levelIndex + 1 < ROBOT_MAZE_LEVELS.length && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setLevelIndex(i => i + 1)}
            style={styles.nextLevelBtn}>
            <Text style={styles.nextLevelBtnText}>
              🌟 Next Level {levelIndex + 2} ❯
            </Text>
          </Pressable>
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
  levelStripWrap: {
    marginVertical: 4,
  },
  levelStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  levelPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  levelPillSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  levelPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  levelPillTextSelected: {
    color: '#FFFFFF',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  levelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffBeginner: {
    backgroundColor: '#DCFCE7',
  },
  diffIntermediate: {
    backgroundColor: '#FEF3C7',
  },
  diffAdvanced: {
    backgroundColor: '#FEE2E2',
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E293B',
  },
  gridOuterCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  gridBoard: {
    gap: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 6,
  },
  gridCell: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellStart: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  gridCellGoal: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  gridCellObstacle: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  obstacleIcon: {
    fontSize: 26,
  },
  goalIcon: {
    fontSize: 28,
  },
  robotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotEmoji: {
    fontSize: 30,
  },
  feedbackBanner: {
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  feedbackError: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  programTray: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  programTrayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  queueScroll: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    alignItems: 'center',
  },
  emptyQueueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  commandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    gap: 4,
  },
  commandPillExecuting: {
    backgroundColor: '#FEF08A',
    borderColor: '#EAB308',
    transform: [{scale: 1.12}],
  },
  commandStepNum: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
  },
  commandIcon: {
    fontSize: 18,
  },
  paletteSection: {
    gap: 8,
  },
  paletteLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  paletteGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  paletteBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    gap: 2,
  },
  paletteBtnPressed: {
    transform: [{scale: 0.95}],
  },
  paletteBtnIcon: {
    fontSize: 22,
  },
  paletteBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  loopShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF4FF',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E879F9',
    gap: 6,
  },
  loopShortcutIcon: {
    fontSize: 14,
    fontWeight: '800',
  },
  loopShortcutText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A21CAF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  runBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  runBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  runBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  nextLevelBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  nextLevelBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
