import {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {getChildAvatar, type ChildAvatarId} from '@assets';
import {AppSafeAreaView, AvatarGrid} from '@components';
import {upsertChild} from '@core/store';
import {CHESS_LESSONS} from '@features/chess/domain/curriculum/lessons';
import {getChessLessonProgress} from '@features/chess/data';
import {
  getMissingProgress,
  getOverallMathAdventureProgress,
} from '@features/math/data';
import {
  readLocalLearnerProfile,
  writeLocalLearnerProfile,
} from '@infrastructure/storage/LocalLearnerProfileStore';
import {
  BottomSheet,
  FavoriteGameCard,
  SubjectProgressRow,
  space,
} from '@shared/ui';

import type {MainStackParamList, MainTabParamList} from '@navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<MainStackParamList>
>;

function getEncouragementMessage(
  count: number,
  name: string,
  t: (key: string, options?: Record<string, unknown>) => string,
): {title: string; subtitle: string; icon: string; iconBgColor: string} {
  if (count === 0) {
    return {
      title: t('profile.encouragement.zeroTitle', {
        defaultValue: '0 Lessons Done',
      }),
      subtitle: t('profile.encouragement.zeroSub', {
        name,
        defaultValue: `Start your first lesson today, ${name}! You can do it!`,
      }),
      icon: '🚀',
      iconBgColor: '#3B82F6',
    };
  }
  if (count < 10) {
    return {
      title: t('profile.encouragement.under10Title', {
        count,
        defaultValue: `${count} ${count === 1 ? 'Lesson' : 'Lessons'} Done!`,
      }),
      subtitle: t('profile.encouragement.under10Sub', {
        name,
        defaultValue: `Great start, ${name}! Keep going, complete more lessons to level up!`,
      }),
      icon: '⭐',
      iconBgColor: '#F59E0B',
    };
  }
  if (count < 20) {
    return {
      title: t('profile.encouragement.under20Title', {
        count,
        defaultValue: `${count} Lessons Done!`,
      }),
      subtitle: t('profile.encouragement.under20Sub', {
        name,
        defaultValue: `Well done, ${name}! You're making awesome progress!`,
      }),
      icon: '✓',
      iconBgColor: '#38C172',
    };
  }
  if (count < 50) {
    return {
      title: t('profile.encouragement.under50Title', {
        count,
        defaultValue: `${count} Lessons Done!`,
      }),
      subtitle: t('profile.encouragement.under50Sub', {
        name,
        defaultValue: `Fantastic job, ${name}! Keep up the great work!`,
      }),
      icon: '🏆',
      iconBgColor: '#8B5CF6',
    };
  }
  return {
    title: t('profile.encouragement.masterTitle', {
      count,
      defaultValue: `${count} Lessons Done!`,
    }),
    subtitle: t('profile.encouragement.masterSub', {
      name,
      defaultValue: `Superstar Champion, ${name}! You have accomplished so much!`,
    }),
    icon: '👑',
    iconBgColor: '#EC4899',
  };
}

export function ProfileScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );
  const gamification = useAppSelector(state => state.gamification);

  // Dynamic user identity from onboarding
  const childName =
    activeChild?.displayName ??
    t('home.defaultChildName', {defaultValue: 'Learner'});
  const avatarKey = activeChild?.avatarKey ?? 'lion';
  const avatar = useMemo(() => getChildAvatar(avatarKey), [avatarKey]);

  // Dynamic gamification stats
  const stars = gamification.snapshot?.wallet?.stars ?? 0;
  const level = gamification.snapshot?.xp?.level ?? 1;

  // Dynamic user lesson progress calculation
  const mathLessonsDone = getMissingProgress().completedLessonIndexes.length;
  const chessLessonsDone = getChessLessonProgress().completed.length;
  const totalLessonsDone = mathLessonsDone + chessLessonsDone;

  const mathProgress = getOverallMathAdventureProgress();
  const chessProgress =
    CHESS_LESSONS.length > 0
      ? Math.round((chessLessonsDone / CHESS_LESSONS.length) * 100)
      : 0;
  const englishProgress = 0;

  const onPlayChess = () => {
    navigation.navigate('ModuleHost', {moduleId: 'chess'});
  };

  const onSelectAvatar = (newAvatarId: ChildAvatarId) => {
    if (activeChild) {
      const updatedChild = {...activeChild, avatarKey: newAvatarId};
      dispatch(upsertChild(updatedChild));
    }
    const local = readLocalLearnerProfile();
    writeLocalLearnerProfile({...local, avatar: newAvatarId});
    setShowAvatarPicker(false);
  };

  const encouragement = getEncouragementMessage(totalLessonsDone, childName, t);

  return (
    <AppSafeAreaView
      testID="profile-screen"
      backgroundImage={null}
      backgroundColor="#F4F8FC"
      padded={false}
      edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top App Header */}
        <View style={styles.header}>
          <View style={styles.identityHeader}>
            <View style={styles.appIconCircle}>
              {avatar.image ? (
                <Image source={avatar.image} style={styles.appIconImage} />
              ) : (
                <Text style={styles.appIconEmoji}>{avatar.emoji}</Text>
              )}
            </View>
            <Text style={styles.headerTitle}>
              {t('profile.title', {defaultValue: 'My Profile'})}
            </Text>
          </View>

          <View style={styles.starsPill}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.starsValue}>{stars}</Text>
          </View>
        </View>

        {/* Profile Card / Avatar Section with Change Avatar Feature */}
        <View style={styles.profileSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('profile.changeAvatar', {
              defaultValue: 'Change avatar',
            })}
            onPress={() => setShowAvatarPicker(true)}
            style={({pressed}) => [
              styles.avatarWrapper,
              pressed && {opacity: 0.9, transform: [{scale: 0.98}]},
            ]}>
            {avatar.image ? (
              <Image source={avatar.image} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {t('profile.level', {level, defaultValue: `Level ${level}`})}
              </Text>
            </View>
          </Pressable>

          <Text style={styles.childName}>{childName}</Text>
          <Text style={styles.tagline}>
            {t('profile.tagline', {defaultValue: 'Future Champion!'})}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('profile.changeAvatar', {
              defaultValue: 'Change Avatar',
            })}
            onPress={() => setShowAvatarPicker(true)}
            style={({pressed}) => [
              styles.changeAvatarBtn,
              pressed && styles.changeAvatarBtnPressed,
            ]}>
            <Text style={styles.changeAvatarText}>
              {t('profile.changeAvatar', {defaultValue: 'Change Avatar ✏️'})}
            </Text>
          </Pressable>
        </View>

        {/* Dynamic Lessons Done Tiered Banner */}
        <View style={styles.bannerCard}>
          <View
            style={[
              styles.checkIconBadge,
              {backgroundColor: encouragement.iconBgColor},
            ]}>
            <Text style={styles.checkMark}>{encouragement.icon}</Text>
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>{encouragement.title}</Text>
            <Text style={styles.bannerSubtitle}>{encouragement.subtitle}</Text>
          </View>
        </View>

        {/* My Progress Section (Dynamic based on user progress) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('profile.myProgress', {defaultValue: 'My Progress'})}
          </Text>
          <View style={styles.progressCard}>
            <SubjectProgressRow
              subjectName={t('subjects.math', {defaultValue: 'Math'})}
              percentage={mathProgress}
              color="#3B82F6"
              testID="profile-progress-math"
            />
            <SubjectProgressRow
              subjectName={t('subjects.english', {defaultValue: 'English'})}
              percentage={englishProgress}
              color="#F59E0B"
              testID="profile-progress-english"
            />
            <SubjectProgressRow
              subjectName={t('subjects.chess', {defaultValue: 'Chess'})}
              percentage={chessProgress}
              color="#22C55E"
              testID="profile-progress-chess"
            />
          </View>
        </View>

        {/* Favorite Game Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('profile.favoriteGame', {defaultValue: 'Favorite Game'})}
          </Text>
          <FavoriteGameCard
            title={t('chess.title', {defaultValue: 'Chess Mastery'})}
            description={t('chess.tagline', {
              defaultValue: 'Master the board with logic!',
            })}
            buttonLabel={t('common.playNow', {defaultValue: 'Play Now'})}
            onPress={onPlayChess}
            testID="profile-favorite-chess"
          />
        </View>
      </ScrollView>

      {/* Change Avatar Bottom Sheet Picker */}
      <BottomSheet
        visible={showAvatarPicker}
        title={t('profile.chooseAvatar', {defaultValue: 'Choose Your Avatar'})}
        onClose={() => setShowAvatarPicker(false)}>
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          showsVerticalScrollIndicator={false}>
          <AvatarGrid selectedId={avatarKey} onSelect={onSelectAvatar} />
        </ScrollView>
      </BottomSheet>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: space.sm,
    paddingBottom: space.xxxl,
    gap: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
  },
  appIconImage: {
    width: 44,
    height: 44,
  },
  appIconEmoji: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: -0.3,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFBD3D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#B47B00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  starIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  starsValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  avatarFallback: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#E2F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 54,
  },
  editAvatarBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editIcon: {
    fontSize: 14,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#38C172',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#166534',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  childName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A2A4A',
    marginTop: 10,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B6B74',
    marginTop: 2,
  },
  changeAvatarBtn: {
    marginTop: 10,
    backgroundColor: '#E8F2FD',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BCE0FD',
  },
  changeAvatarBtnPressed: {
    opacity: 0.8,
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E60D4',
  },
  bannerCard: {
    backgroundColor: '#EBF4FE',
    borderWidth: 1.5,
    borderColor: '#BCE0FD',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#38C172',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bannerTextCol: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E60D4',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B6B74',
  },
  sectionContainer: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E8F2FA',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sheetScroll: {
    maxHeight: 380,
  },
  sheetScrollContent: {
    paddingVertical: 12,
  },
});
