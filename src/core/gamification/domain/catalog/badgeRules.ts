import type {BadgeId} from '../schema/RewardDatabase';

export type BadgeEvalContext = {
  readonly completedLessonCount: number;
  readonly perfectLessonCount: number; // 3-star lessons
  readonly missingLessonsCompleted: number;
  readonly missingPerfectCount: number;
  readonly missingAllComplete: boolean;
  readonly countingLessonsCompleted: number;
  readonly countingPerfectCount: number;
  readonly chessLessonsCompleted?: number;
  readonly chessLessonsList?: readonly string[];
  readonly exploredCountryCount?: number;
  readonly learnedFlagCount?: number;
  readonly exploredContinentCount?: number;
  readonly learnedCapitalCount?: number;
  readonly exploredLandmarkCount?: number;
  readonly worldExplorerQuizCount?: number;
  readonly brainGamesPlayCount?: number;
  readonly brainGamesStars?: number;
  readonly scienceTopicsCompleted?: number;
  readonly scienceStars?: number;
  readonly timeTopicsCompleted?: number;
  readonly timeStars?: number;
  readonly clockLessonsCompleted?: number;
  readonly calendarExplored?: boolean;
  readonly moneyLessonsCompleted?: number;
  readonly moneyStars?: number;
  readonly shoppingItemsBought?: number;
  readonly coinChallengesCompleted?: number;
  readonly codingTopicsCompleted?: number;
  readonly codingStars?: number;
  readonly robotMazesSolved?: number;
  readonly debuggingPuzzlesSolved?: number;
  readonly sequencingPuzzlesSolved?: number;
  readonly instrumentsExplored?: number;
  readonly rhythmLevelsCompleted?: number;
  readonly soundGuessesCorrect?: number;
  readonly musicTopicsCompleted?: number;
  readonly musicStars?: number;
  readonly lifeSkillsTopicsCompleted?: number;
  readonly lifeSkillsStars?: number;
  readonly hygieneHabitsMastered?: number;
  readonly mannersScenariosSolved?: number;
  readonly routinesSequenced?: number;
  readonly gkLessonsCompleted?: number;
  readonly gkStars?: number;
  readonly gkCategoriesCompleted?: number;
  readonly vehicleLessonsCompleted?: number;
  readonly jobLessonsCompleted?: number;
  readonly natureLessonsCompleted?: number;
  readonly englishLessonsCompleted?: number;
  readonly englishStars?: number;
  readonly englishWordsMastered?: number;
  readonly cvcWordsMastered?: number;
  readonly sightWordsLearned?: number;
  readonly sentencesRead?: number;
  readonly storiesCompleted?: number;
  readonly readingChallengeCompleted?: boolean;
  readonly currentStreak: number;
  readonly ownedBadgeIds: ReadonlySet<string>;
};

export type BadgeRule = {
  readonly id: string;
  readonly badgeId: BadgeId;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly icon: string;
  readonly evaluate: (ctx: BadgeEvalContext) => boolean;
};

function asBadgeId(value: string): BadgeId {
  return value as BadgeId;
}

export const BADGE_RULES: readonly BadgeRule[] = [
  {
    id: 'first_lesson',
    badgeId: asBadgeId('badge.first_lesson'),
    titleKey: 'gamification.badges.firstLesson',
    descriptionKey: 'gamification.badges.firstLessonDesc',
    icon: '🏅',
    evaluate: ctx => ctx.completedLessonCount >= 1,
  },
  {
    id: 'math_beginner',
    badgeId: asBadgeId('badge.math_beginner'),
    titleKey: 'gamification.badges.mathBeginner',
    descriptionKey: 'gamification.badges.mathBeginnerDesc',
    icon: '🔢',
    evaluate: ctx => ctx.missingLessonsCompleted >= 5,
  },
  {
    id: 'counting_master',
    badgeId: asBadgeId('badge.counting_master'),
    titleKey: 'gamification.badges.countingMaster',
    descriptionKey: 'gamification.badges.countingMasterDesc',
    icon: '🧮',
    evaluate: ctx => ctx.countingLessonsCompleted >= 5,
  },
  {
    id: 'streak_3',
    badgeId: asBadgeId('badge.streak_3'),
    titleKey: 'gamification.badges.streak3',
    descriptionKey: 'gamification.badges.streak3Desc',
    icon: '🔥',
    evaluate: ctx => ctx.currentStreak >= 3,
  },
  {
    id: 'perfect_5',
    badgeId: asBadgeId('badge.perfect_5'),
    titleKey: 'gamification.badges.perfect5',
    descriptionKey: 'gamification.badges.perfect5Desc',
    icon: '⭐',
    evaluate: ctx => ctx.perfectLessonCount >= 5,
  },
  {
    id: 'missing_master',
    badgeId: asBadgeId('badge.missing_master'),
    titleKey: 'gamification.badges.missingMaster',
    descriptionKey: 'gamification.badges.missingMasterDesc',
    icon: '🧩',
    evaluate: ctx => ctx.missingAllComplete,
  },
  // ─── Chess Badges ─────────────────────────────────────────────────────────
  {
    id: 'chess_first_step',
    badgeId: asBadgeId('badge.chess_first_step'),
    titleKey: 'gamification.badges.chessFirstStep',
    descriptionKey: 'gamification.badges.chessFirstStepDesc',
    icon: '♟️',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 1,
  },
  {
    id: 'chess_scholar',
    badgeId: asBadgeId('badge.chess_scholar'),
    titleKey: 'gamification.badges.chessScholar',
    descriptionKey: 'gamification.badges.chessScholarDesc',
    icon: '🎓',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 6,
  },
  {
    id: 'chess_master',
    badgeId: asBadgeId('badge.chess_master'),
    titleKey: 'gamification.badges.chessMaster',
    descriptionKey: 'gamification.badges.chessMasterDesc',
    icon: '👑',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 12,
  },
  {
    id: 'pawn_hero',
    badgeId: asBadgeId('badge.pawn_hero'),
    titleKey: 'gamification.badges.pawnHero',
    descriptionKey: 'gamification.badges.pawnHeroDesc',
    icon: '⚔️',
    evaluate: ctx => (ctx.chessLessonsList ?? []).includes('pawn'),
  },
  {
    id: 'knight_rider',
    badgeId: asBadgeId('badge.knight_rider'),
    titleKey: 'gamification.badges.knightRider',
    descriptionKey: 'gamification.badges.knightRiderDesc',
    icon: '♞',
    evaluate: ctx => (ctx.chessLessonsList ?? []).includes('knight'),
  },
  {
    id: 'grandmaster',
    badgeId: asBadgeId('badge.grandmaster'),
    titleKey: 'gamification.badges.grandmaster',
    descriptionKey: 'gamification.badges.grandmasterDesc',
    icon: '🏆',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 15,
  },
  // ─── World Explorer Badges ───────────────────────────────────────────────
  {
    id: 'explorer_scout',
    badgeId: asBadgeId('badge.explorer_scout'),
    titleKey: 'worldExplorer.badges.scout',
    descriptionKey: 'worldExplorer.badges.scoutDesc',
    icon: '🧭',
    evaluate: ctx => (ctx.exploredCountryCount ?? 0) >= 1,
  },
  {
    id: 'flag_collector',
    badgeId: asBadgeId('badge.flag_collector'),
    titleKey: 'worldExplorer.badges.flagCollector',
    descriptionKey: 'worldExplorer.badges.flagCollectorDesc',
    icon: '🚩',
    evaluate: ctx => (ctx.learnedFlagCount ?? 0) >= 5,
  },
  {
    id: 'continent_hopper',
    badgeId: asBadgeId('badge.continent_hopper'),
    titleKey: 'worldExplorer.badges.continentHopper',
    descriptionKey: 'worldExplorer.badges.continentHopperDesc',
    icon: '🌐',
    evaluate: ctx => (ctx.exploredContinentCount ?? 0) >= 3,
  },
  {
    id: 'capital_expert',
    badgeId: asBadgeId('badge.capital_expert'),
    titleKey: 'worldExplorer.badges.capitalExpert',
    descriptionKey: 'worldExplorer.badges.capitalExpertDesc',
    icon: '🏛️',
    evaluate: ctx => (ctx.learnedCapitalCount ?? 0) >= 5,
  },
  {
    id: 'world_traveler',
    badgeId: asBadgeId('badge.world_traveler'),
    titleKey: 'worldExplorer.badges.worldTraveler',
    descriptionKey: 'worldExplorer.badges.worldTravelerDesc',
    icon: '✈️',
    evaluate: ctx =>
      (ctx.exploredCountryCount ?? 0) >= 10 &&
      (ctx.worldExplorerQuizCount ?? 0) >= 1,
  },
  {
    id: 'monument_master',
    badgeId: asBadgeId('badge.monument_master'),
    titleKey: 'worldExplorer.badges.monumentMaster',
    descriptionKey: 'worldExplorer.badges.monumentMasterDesc',
    icon: '🗿',
    evaluate: ctx => (ctx.exploredLandmarkCount ?? 0) >= 5,
  },
  // ─── Brain Games Badges ───────────────────────────────────────────────────
  {
    id: 'brain_spark',
    badgeId: asBadgeId('badge.brain_spark'),
    titleKey: 'brainGames.badges.brainSpark',
    descriptionKey: 'brainGames.badges.brainSparkDesc',
    icon: '💡',
    evaluate: ctx => (ctx.brainGamesPlayCount ?? 0) >= 1,
  },
  {
    id: 'puzzle_whiz',
    badgeId: asBadgeId('badge.puzzle_whiz'),
    titleKey: 'brainGames.badges.puzzleWhiz',
    descriptionKey: 'brainGames.badges.puzzleWhizDesc',
    icon: '🎯',
    evaluate: ctx => (ctx.brainGamesPlayCount ?? 0) >= 3,
  },
  {
    id: 'memory_ace',
    badgeId: asBadgeId('badge.memory_ace'),
    titleKey: 'brainGames.badges.memoryAce',
    descriptionKey: 'brainGames.badges.memoryAceDesc',
    icon: '🃏',
    evaluate: ctx => (ctx.brainGamesStars ?? 0) >= 6,
  },
  {
    id: 'pattern_pro',
    badgeId: asBadgeId('badge.pattern_pro'),
    titleKey: 'brainGames.badges.patternPro',
    descriptionKey: 'brainGames.badges.patternProDesc',
    icon: '🔮',
    evaluate: ctx => (ctx.brainGamesStars ?? 0) >= 12,
  },
  {
    id: 'brain_champion',
    badgeId: asBadgeId('badge.brain_champion'),
    titleKey: 'brainGames.badges.brainChampion',
    descriptionKey: 'brainGames.badges.brainChampionDesc',
    icon: '🏆',
    evaluate: ctx => (ctx.brainGamesStars ?? 0) >= 18,
  },
  // ─── Science Badges ───────────────────────────────────────────────────────
  {
    id: 'young_scientist',
    badgeId: asBadgeId('badge.young_scientist'),
    titleKey: 'science.badges.youngScientist',
    descriptionKey: 'science.badges.youngScientistDesc',
    icon: '🔬',
    evaluate: ctx => (ctx.scienceTopicsCompleted ?? 0) >= 1,
  },
  {
    id: 'space_cadet',
    badgeId: asBadgeId('badge.space_cadet'),
    titleKey: 'science.badges.spaceCadet',
    descriptionKey: 'science.badges.spaceCadetDesc',
    icon: '🚀',
    evaluate: ctx => (ctx.scienceStars ?? 0) >= 3,
  },
  {
    id: 'nature_explorer',
    badgeId: asBadgeId('badge.nature_explorer'),
    titleKey: 'science.badges.natureExplorer',
    descriptionKey: 'science.badges.natureExplorerDesc',
    icon: '🌿',
    evaluate: ctx => (ctx.scienceTopicsCompleted ?? 0) >= 3,
  },
  {
    id: 'body_detective',
    badgeId: asBadgeId('badge.body_detective'),
    titleKey: 'science.badges.bodyDetective',
    descriptionKey: 'science.badges.bodyDetectiveDesc',
    icon: '🫀',
    evaluate: ctx => (ctx.scienceStars ?? 0) >= 9,
  },
  {
    id: 'science_whiz',
    badgeId: asBadgeId('badge.science_whiz'),
    titleKey: 'science.badges.scienceWhiz',
    descriptionKey: 'science.badges.scienceWhizDesc',
    icon: '⚡',
    evaluate: ctx => (ctx.scienceTopicsCompleted ?? 0) >= 6,
  },
  {
    id: 'science_champion',
    badgeId: asBadgeId('badge.science_champion'),
    titleKey: 'science.badges.scienceChampion',
    descriptionKey: 'science.badges.scienceChampionDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.scienceTopicsCompleted ?? 0) >= 7 && (ctx.scienceStars ?? 0) >= 18,
  },
  // ─── Time & Calendar Badges ───────────────────────────────────────────────
  {
    id: 'time_traveler',
    badgeId: asBadgeId('badge.time_traveler'),
    titleKey: 'time.badges.timeTraveler',
    descriptionKey: 'time.badges.timeTravelerDesc',
    icon: '🕐',
    evaluate: ctx => (ctx.timeTopicsCompleted ?? 0) >= 1,
  },
  {
    id: 'clock_master',
    badgeId: asBadgeId('badge.clock_master'),
    titleKey: 'time.badges.clockMaster',
    descriptionKey: 'time.badges.clockMasterDesc',
    icon: '⏰',
    evaluate: ctx =>
      (ctx.clockLessonsCompleted ?? 0) >= 1 || (ctx.timeStars ?? 0) >= 3,
  },
  {
    id: 'calendar_wizard',
    badgeId: asBadgeId('badge.calendar_wizard'),
    titleKey: 'time.badges.calendarWizard',
    descriptionKey: 'time.badges.calendarWizardDesc',
    icon: '📅',
    evaluate: ctx =>
      ctx.calendarExplored === true || (ctx.timeTopicsCompleted ?? 0) >= 3,
  },
  {
    id: 'season_expert',
    badgeId: asBadgeId('badge.season_expert'),
    titleKey: 'time.badges.seasonExpert',
    descriptionKey: 'time.badges.seasonExpertDesc',
    icon: '🌦️',
    evaluate: ctx => (ctx.timeStars ?? 0) >= 9,
  },
  {
    id: 'time_champion',
    badgeId: asBadgeId('badge.time_champion'),
    titleKey: 'time.badges.timeChampion',
    descriptionKey: 'time.badges.timeChampionDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.timeTopicsCompleted ?? 0) >= 6 && (ctx.timeStars ?? 0) >= 15,
  },
  // ─── Money Badges ─────────────────────────────────────────────────────────
  {
    id: 'money_learner',
    badgeId: asBadgeId('badge.money_learner'),
    titleKey: 'math.money.badges.moneyLearner',
    descriptionKey: 'math.money.badges.moneyLearnerDesc',
    icon: '💰',
    evaluate: ctx =>
      (ctx.moneyLessonsCompleted ?? 0) >= 1 || (ctx.moneyStars ?? 0) >= 1,
  },
  {
    id: 'coin_collector',
    badgeId: asBadgeId('badge.coin_collector'),
    titleKey: 'math.money.badges.coinCollector',
    descriptionKey: 'math.money.badges.coinCollectorDesc',
    icon: '🪙',
    evaluate: ctx =>
      (ctx.coinChallengesCompleted ?? 0) >= 2 || (ctx.moneyStars ?? 0) >= 4,
  },
  {
    id: 'smart_shopper',
    badgeId: asBadgeId('badge.smart_shopper'),
    titleKey: 'math.money.badges.smartShopper',
    descriptionKey: 'math.money.badges.smartShopperDesc',
    icon: '🛒',
    evaluate: ctx =>
      (ctx.shoppingItemsBought ?? 0) >= 3 ||
      (ctx.moneyLessonsCompleted ?? 0) >= 3,
  },
  {
    id: 'money_master',
    badgeId: asBadgeId('badge.money_master'),
    titleKey: 'math.money.badges.moneyMaster',
    descriptionKey: 'math.money.badges.moneyMasterDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.moneyLessonsCompleted ?? 0) >= 5 && (ctx.moneyStars ?? 0) >= 12,
  },
  // ─── Logic & Coding Badges ─────────────────────────────────────────────────
  {
    id: 'little_coder',
    badgeId: asBadgeId('badge.little_coder'),
    titleKey: 'coding.badges.littleCoder',
    descriptionKey: 'coding.badges.littleCoderDesc',
    icon: '🤖',
    evaluate: ctx =>
      (ctx.robotMazesSolved ?? 0) >= 1 || (ctx.codingTopicsCompleted ?? 0) >= 1,
  },
  {
    id: 'logic_explorer',
    badgeId: asBadgeId('badge.logic_explorer'),
    titleKey: 'coding.badges.logicExplorer',
    descriptionKey: 'coding.badges.logicExplorerDesc',
    icon: '🧩',
    evaluate: ctx =>
      (ctx.sequencingPuzzlesSolved ?? 0) >= 2 ||
      (ctx.codingTopicsCompleted ?? 0) >= 2,
  },
  {
    id: 'bug_finder',
    badgeId: asBadgeId('badge.bug_finder'),
    titleKey: 'coding.badges.bugFinder',
    descriptionKey: 'coding.badges.bugFinderDesc',
    icon: '🐛',
    evaluate: ctx =>
      (ctx.debuggingPuzzlesSolved ?? 0) >= 2 || (ctx.codingStars ?? 0) >= 6,
  },
  {
    id: 'coding_thinker',
    badgeId: asBadgeId('badge.coding_thinker'),
    titleKey: 'coding.badges.codingThinker',
    descriptionKey: 'coding.badges.codingThinkerDesc',
    icon: '💻',
    evaluate: ctx =>
      (ctx.codingTopicsCompleted ?? 0) >= 4 || (ctx.codingStars ?? 0) >= 10,
  },
  {
    id: 'coding_champion',
    badgeId: asBadgeId('badge.coding_champion'),
    titleKey: 'coding.badges.codingChampion',
    descriptionKey: 'coding.badges.codingChampionDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.codingTopicsCompleted ?? 0) >= 6 && (ctx.codingStars ?? 0) >= 15,
  },
  // ─── Music Badges ─────────────────────────────────────────────────────────
  {
    id: 'music_explorer',
    badgeId: asBadgeId('badge.music_explorer'),
    titleKey: 'rhymes.badges.musicExplorer',
    descriptionKey: 'rhymes.badges.musicExplorerDesc',
    icon: '🎵',
    evaluate: ctx =>
      (ctx.instrumentsExplored ?? 0) >= 3 ||
      (ctx.musicTopicsCompleted ?? 0) >= 1,
  },
  {
    id: 'rhythm_star',
    badgeId: asBadgeId('badge.rhythm_star'),
    titleKey: 'rhymes.badges.rhythmStar',
    descriptionKey: 'rhymes.badges.rhythmStarDesc',
    icon: '🥁',
    evaluate: ctx =>
      (ctx.rhythmLevelsCompleted ?? 0) >= 2 || (ctx.musicStars ?? 0) >= 4,
  },
  {
    id: 'instrument_expert',
    badgeId: asBadgeId('badge.instrument_expert'),
    titleKey: 'rhymes.badges.instrumentExpert',
    descriptionKey: 'rhymes.badges.instrumentExpertDesc',
    icon: '🎹',
    evaluate: ctx =>
      (ctx.soundGuessesCorrect ?? 0) >= 4 ||
      (ctx.instrumentsExplored ?? 0) >= 6,
  },
  {
    id: 'music_master',
    badgeId: asBadgeId('badge.music_master'),
    titleKey: 'rhymes.badges.musicMaster',
    descriptionKey: 'rhymes.badges.musicMasterDesc',
    icon: '🎶',
    evaluate: ctx =>
      (ctx.musicTopicsCompleted ?? 0) >= 5 && (ctx.musicStars ?? 0) >= 12,
  },
  // ─── Life Skills Badges ───────────────────────────────────────────────────
  {
    id: 'kind_kid',
    badgeId: asBadgeId('badge.kind_kid'),
    titleKey: 'lifeSkills.badges.kindKid',
    descriptionKey: 'lifeSkills.badges.kindKidDesc',
    icon: '😊',
    evaluate: ctx =>
      (ctx.mannersScenariosSolved ?? 0) >= 2 ||
      (ctx.lifeSkillsTopicsCompleted ?? 0) >= 1,
  },
  {
    id: 'clean_habits',
    badgeId: asBadgeId('badge.clean_habits'),
    titleKey: 'lifeSkills.badges.cleanHabits',
    descriptionKey: 'lifeSkills.badges.cleanHabitsDesc',
    icon: '🪥',
    evaluate: ctx =>
      (ctx.hygieneHabitsMastered ?? 0) >= 4 || (ctx.lifeSkillsStars ?? 0) >= 4,
  },
  {
    id: 'caring_friend',
    badgeId: asBadgeId('badge.caring_friend'),
    titleKey: 'lifeSkills.badges.caringFriend',
    descriptionKey: 'lifeSkills.badges.caringFriendDesc',
    icon: '❤️',
    evaluate: ctx =>
      (ctx.mannersScenariosSolved ?? 0) >= 4 ||
      (ctx.lifeSkillsTopicsCompleted ?? 0) >= 3,
  },
  {
    id: 'good_helper',
    badgeId: asBadgeId('badge.good_helper'),
    titleKey: 'lifeSkills.badges.goodHelper',
    descriptionKey: 'lifeSkills.badges.goodHelperDesc',
    icon: '🤝',
    evaluate: ctx =>
      (ctx.routinesSequenced ?? 0) >= 2 || (ctx.lifeSkillsStars ?? 0) >= 8,
  },
  {
    id: 'life_skills_star',
    badgeId: asBadgeId('badge.life_skills_star'),
    titleKey: 'lifeSkills.badges.lifeSkillsStar',
    descriptionKey: 'lifeSkills.badges.lifeSkillsStarDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.lifeSkillsTopicsCompleted ?? 0) >= 5 &&
      (ctx.lifeSkillsStars ?? 0) >= 15,
  },
  // ─── General Knowledge (GK) Badges ─────────────────────────────────────────
  {
    id: 'curious_kid',
    badgeId: asBadgeId('badge.curious_kid'),
    titleKey: 'generalKnowledge.badges.curiousKid',
    descriptionKey: 'generalKnowledge.badges.curiousKidDesc',
    icon: '🌟',
    evaluate: ctx =>
      (ctx.gkLessonsCompleted ?? 0) >= 4 || (ctx.gkStars ?? 0) >= 6,
  },
  {
    id: 'vehicle_explorer',
    badgeId: asBadgeId('badge.vehicle_explorer'),
    titleKey: 'generalKnowledge.badges.vehicleExplorer',
    descriptionKey: 'generalKnowledge.badges.vehicleExplorerDesc',
    icon: '🚗',
    evaluate: ctx =>
      (ctx.vehicleLessonsCompleted ?? 0) >= 3 || (ctx.gkStars ?? 0) >= 8,
  },
  {
    id: 'job_explorer',
    badgeId: asBadgeId('badge.job_explorer'),
    titleKey: 'generalKnowledge.badges.jobExplorer',
    descriptionKey: 'generalKnowledge.badges.jobExplorerDesc',
    icon: '👩‍⚕️',
    evaluate: ctx =>
      (ctx.jobLessonsCompleted ?? 0) >= 3 || (ctx.gkStars ?? 0) >= 10,
  },
  {
    id: 'nature_explorer',
    badgeId: asBadgeId('badge.nature_explorer'),
    titleKey: 'generalKnowledge.badges.natureExplorer',
    descriptionKey: 'generalKnowledge.badges.natureExplorerDesc',
    icon: '🌳',
    evaluate: ctx =>
      (ctx.natureLessonsCompleted ?? 0) >= 3 || (ctx.gkStars ?? 0) >= 12,
  },
  {
    id: 'gk_champion',
    badgeId: asBadgeId('badge.gk_champion'),
    titleKey: 'generalKnowledge.badges.gkChampion',
    descriptionKey: 'generalKnowledge.badges.gkChampionDesc',
    icon: '🏆',
    evaluate: ctx =>
      (ctx.gkCategoriesCompleted ?? 0) >= 4 && (ctx.gkStars ?? 0) >= 18,
  },
  // ─── English Badges ───────────────────────────────────────────────────────
  {
    id: 'alphabet_starter',
    badgeId: asBadgeId('badge.alphabet_starter'),
    titleKey: 'english.badges.alphabetStarter',
    descriptionKey: 'english.badges.alphabetStarterDesc',
    icon: '🔤',
    evaluate: ctx =>
      (ctx.englishLessonsCompleted ?? 0) >= 1 || (ctx.englishStars ?? 0) >= 1,
  },
  {
    id: 'sound_explorer',
    badgeId: asBadgeId('badge.sound_explorer'),
    titleKey: 'english.badges.soundExplorer',
    descriptionKey: 'english.badges.soundExplorerDesc',
    icon: '🔊',
    evaluate: ctx => (ctx.englishStars ?? 0) >= 3,
  },
  {
    id: 'sound_detective',
    badgeId: asBadgeId('badge.sound_detective'),
    titleKey: 'english.badges.soundDetective',
    descriptionKey: 'english.badges.soundDetectiveDesc',
    icon: '👂',
    evaluate: ctx => (ctx.englishStars ?? 0) >= 6,
  },
  {
    id: 'phonics_star',
    badgeId: asBadgeId('badge.phonics_star'),
    titleKey: 'english.badges.phonicsStar',
    descriptionKey: 'english.badges.phonicsStarDesc',
    icon: '🧩',
    evaluate: ctx => (ctx.englishStars ?? 0) >= 9,
  },
  {
    id: 'blending_star',
    badgeId: asBadgeId('badge.blending_star'),
    titleKey: 'english.badges.blendingStar',
    descriptionKey: 'english.badges.blendingStarDesc',
    icon: '🔗',
    evaluate: ctx => (ctx.englishStars ?? 0) >= 12,
  },
  {
    id: 'word_builder',
    badgeId: asBadgeId('badge.word_builder'),
    titleKey: 'english.badges.wordBuilder',
    descriptionKey: 'english.badges.wordBuilderDesc',
    icon: '📝',
    evaluate: ctx =>
      (ctx.englishWordsMastered ?? 0) >= 3 ||
      (ctx.englishLessonsCompleted ?? 0) >= 5,
  },
  {
    id: 'cvc_reader',
    badgeId: asBadgeId('badge.cvc_reader'),
    titleKey: 'english.badges.cvcReader',
    descriptionKey: 'english.badges.cvcReaderDesc',
    icon: '📖',
    evaluate: ctx =>
      (ctx.cvcWordsMastered ?? 0) >= 5 || (ctx.englishStars ?? 0) >= 15,
  },
  {
    id: 'little_reader',
    badgeId: asBadgeId('badge.little_reader'),
    titleKey: 'english.badges.littleReader',
    descriptionKey: 'english.badges.littleReaderDesc',
    icon: '⭐',
    evaluate: ctx =>
      (ctx.sightWordsLearned ?? 0) >= 4 || (ctx.sentencesRead ?? 0) >= 2,
  },
  {
    id: 'story_reader',
    badgeId: asBadgeId('badge.story_reader'),
    titleKey: 'english.badges.storyReader',
    descriptionKey: 'english.badges.storyReaderDesc',
    icon: '📚',
    evaluate: ctx => (ctx.storiesCompleted ?? 0) >= 1,
  },
  {
    id: 'reading_champion',
    badgeId: asBadgeId('badge.reading_champion'),
    titleKey: 'english.badges.readingChampion',
    descriptionKey: 'english.badges.readingChampionDesc',
    icon: '🏆',
    evaluate: ctx =>
      ctx.readingChallengeCompleted === true ||
      ((ctx.englishLessonsCompleted ?? 0) >= 10 &&
        (ctx.englishStars ?? 0) >= 25),
  },
];

export function evaluateNewBadges(ctx: BadgeEvalContext): readonly BadgeRule[] {
  return BADGE_RULES.filter(
    rule => !ctx.ownedBadgeIds.has(rule.badgeId) && rule.evaluate(ctx),
  );
}
