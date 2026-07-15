import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AppShell,
  AppText,
  MascotSpot,
  PrimaryButton,
  ProgressCard,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {MiniChessBoard} from '../components/MiniChessBoard';
import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'Hub'>;

/**
 * Chess module home — lessons, practice, and coach entry points.
 */
export function ChessHubScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace} = useTheme();

  return (
    <AppShell testID="chess-hub-screen">
      <TopAppBar
        title={t('chess.hub.title')}
        subtitle={t('chess.hub.subtitle')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MascotSpot mood="happy" size={88} label={t('chess.hub.coachName')} />
          <AppText variant="body" tone="muted" style={styles.center}>
            {t('chess.hub.welcome')}
          </AppText>
        </View>

        <MiniChessBoard size={260} testID="chess-hub-board" />

        <ProgressCard
          title={t('chess.hub.progressTitle')}
          stars={0}
          detail={t('chess.hub.progressDetail')}
        />

        <PrimaryButton
          label={t('chess.hub.startLesson')}
          onPress={() =>
            navigation.navigate('Lesson', {lessonId: 'chess.board'})
          }
          testID="chess-start-lesson"
        />
        <SecondaryButton
          label={t('chess.hub.practice')}
          onPress={() => navigation.navigate('Practice')}
          testID="chess-practice"
        />
        <SecondaryButton
          label={t('chess.hub.meetCoach')}
          onPress={() => navigation.navigate('Coach')}
          testID="chess-coach"
        />
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
  },
  hero: {
    alignItems: 'center',
    gap: space.sm,
  },
  center: {
    textAlign: 'center',
  },
});
