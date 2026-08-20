import type {
  DailyRoutineStep,
  EmotionItem,
  EmotionScenario,
  HealthyHabitItem,
  HygieneHabit,
  LifeSkillsQuizQuestion,
  LifeSkillsTopicId,
  MannersScenario,
  SafetyTipItem,
} from '../entities/lifeSkillsEntities';

export const LIFE_SKILLS_TOPIC_CARDS: readonly {
  readonly id: LifeSkillsTopicId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly badgeTag: string;
}[] = [
  {
    id: 'hygiene',
    titleKey: 'lifeSkills.topics.hygiene.title',
    subtitleKey: 'lifeSkills.topics.hygiene.sub',
    emoji: '🪥',
    accentColor: '#0EA5E9',
    badgeTag: 'Clean & Fresh',
  },
  {
    id: 'emotions',
    titleKey: 'lifeSkills.topics.emotions.title',
    subtitleKey: 'lifeSkills.topics.emotions.sub',
    emoji: '😊',
    accentColor: '#EC4899',
    badgeTag: 'My Feelings',
  },
  {
    id: 'manners',
    titleKey: 'lifeSkills.topics.manners.title',
    subtitleKey: 'lifeSkills.topics.manners.sub',
    emoji: '🤝',
    accentColor: '#8B5CF6',
    badgeTag: 'Kind Words',
  },
  {
    id: 'routine',
    titleKey: 'lifeSkills.topics.routine.title',
    subtitleKey: 'lifeSkills.topics.routine.sub',
    emoji: '🛏️',
    accentColor: '#F59E0B',
    badgeTag: 'Daily Steps',
  },
  {
    id: 'habits',
    titleKey: 'lifeSkills.topics.habits.title',
    subtitleKey: 'lifeSkills.topics.habits.sub',
    emoji: '🍎',
    accentColor: '#10B981',
    badgeTag: 'Healthy Choices',
  },
  {
    id: 'safety',
    titleKey: 'lifeSkills.topics.safety.title',
    subtitleKey: 'lifeSkills.topics.safety.sub',
    emoji: '🛡️',
    accentColor: '#EF4444',
    badgeTag: 'Stay Safe',
  },
  {
    id: 'quiz',
    titleKey: 'lifeSkills.topics.quiz.title',
    subtitleKey: 'lifeSkills.topics.quiz.sub',
    emoji: '🎯',
    accentColor: '#059669',
    badgeTag: 'Kind Star Arena',
  },
];

export const HYGIENE_HABITS: readonly HygieneHabit[] = [
  {
    id: 'brush-teeth',
    titleKey: 'lifeSkills.hygiene.brushTeeth.title',
    descKey: 'lifeSkills.hygiene.brushTeeth.desc',
    emoji: '🪥',
    tipKey: 'lifeSkills.hygiene.brushTeeth.tip',
    sparkleColor: '#38BDF8',
  },
  {
    id: 'wash-hands',
    titleKey: 'lifeSkills.hygiene.washHands.title',
    descKey: 'lifeSkills.hygiene.washHands.desc',
    emoji: '🧼',
    tipKey: 'lifeSkills.hygiene.washHands.tip',
    sparkleColor: '#34D399',
  },
  {
    id: 'daily-bath',
    titleKey: 'lifeSkills.hygiene.dailyBath.title',
    descKey: 'lifeSkills.hygiene.dailyBath.desc',
    emoji: '🚿',
    tipKey: 'lifeSkills.hygiene.dailyBath.tip',
    sparkleColor: '#60A5FA',
  },
  {
    id: 'clean-clothes',
    titleKey: 'lifeSkills.hygiene.cleanClothes.title',
    descKey: 'lifeSkills.hygiene.cleanClothes.desc',
    emoji: '👕',
    tipKey: 'lifeSkills.hygiene.cleanClothes.tip',
    sparkleColor: '#F472B6',
  },
  {
    id: 'cover-cough',
    titleKey: 'lifeSkills.hygiene.coverCough.title',
    descKey: 'lifeSkills.hygiene.coverCough.desc',
    emoji: '🤧',
    tipKey: 'lifeSkills.hygiene.coverCough.tip',
    sparkleColor: '#FBBF24',
  },
  {
    id: 'comb-hair',
    titleKey: 'lifeSkills.hygiene.combHair.title',
    descKey: 'lifeSkills.hygiene.combHair.desc',
    emoji: '🪮',
    tipKey: 'lifeSkills.hygiene.combHair.tip',
    sparkleColor: '#A78BFA',
  },
];

export const EMOTIONS_LIST: readonly EmotionItem[] = [
  {
    id: 'happy',
    nameKey: 'lifeSkills.emotions.happy.name',
    emoji: '😀',
    color: '#F59E0B',
    descriptionKey: 'lifeSkills.emotions.happy.desc',
    comfortingTipKey: 'lifeSkills.emotions.happy.tip',
  },
  {
    id: 'sad',
    nameKey: 'lifeSkills.emotions.sad.name',
    emoji: '😢',
    color: '#3B82F6',
    descriptionKey: 'lifeSkills.emotions.sad.desc',
    comfortingTipKey: 'lifeSkills.emotions.sad.tip',
  },
  {
    id: 'angry',
    nameKey: 'lifeSkills.emotions.angry.name',
    emoji: '😡',
    color: '#EF4444',
    descriptionKey: 'lifeSkills.emotions.angry.desc',
    comfortingTipKey: 'lifeSkills.emotions.angry.tip',
  },
  {
    id: 'scared',
    nameKey: 'lifeSkills.emotions.scared.name',
    emoji: '😨',
    color: '#8B5CF6',
    descriptionKey: 'lifeSkills.emotions.scared.desc',
    comfortingTipKey: 'lifeSkills.emotions.scared.tip',
  },
  {
    id: 'tired',
    nameKey: 'lifeSkills.emotions.tired.name',
    emoji: '😴',
    color: '#64748B',
    descriptionKey: 'lifeSkills.emotions.tired.desc',
    comfortingTipKey: 'lifeSkills.emotions.tired.tip',
  },
  {
    id: 'calm',
    nameKey: 'lifeSkills.emotions.calm.name',
    emoji: '😌',
    color: '#10B981',
    descriptionKey: 'lifeSkills.emotions.calm.desc',
    comfortingTipKey: 'lifeSkills.emotions.calm.tip',
  },
];

export const EMOTION_SCENARIOS: readonly EmotionScenario[] = [
  {
    id: 'sc-1',
    storyKey: 'lifeSkills.scenarios.s1Story',
    scenarioEmoji: '🎂 🎁',
    correctEmotionId: 'happy',
    options: ['happy', 'angry', 'scared'],
    explanationKey: 'lifeSkills.scenarios.s1Expl',
  },
  {
    id: 'sc-2',
    storyKey: 'lifeSkills.scenarios.s2Story',
    scenarioEmoji: '🧸 💔',
    correctEmotionId: 'sad',
    options: ['happy', 'sad', 'calm'],
    explanationKey: 'lifeSkills.scenarios.s2Expl',
  },
  {
    id: 'sc-3',
    storyKey: 'lifeSkills.scenarios.s3Story',
    scenarioEmoji: '🏰 💥',
    correctEmotionId: 'angry',
    options: ['angry', 'tired', 'happy'],
    explanationKey: 'lifeSkills.scenarios.s3Expl',
  },
  {
    id: 'sc-4',
    storyKey: 'lifeSkills.scenarios.s4Story',
    scenarioEmoji: '⚡ 🌩️',
    correctEmotionId: 'scared',
    options: ['calm', 'scared', 'happy'],
    explanationKey: 'lifeSkills.scenarios.s4Expl',
  },
  {
    id: 'sc-5',
    storyKey: 'lifeSkills.scenarios.s5Story',
    scenarioEmoji: '🏃 ⚽ 🌅',
    correctEmotionId: 'tired',
    options: ['tired', 'angry', 'scared'],
    explanationKey: 'lifeSkills.scenarios.s5Expl',
  },
  {
    id: 'sc-6',
    storyKey: 'lifeSkills.scenarios.s6Story',
    scenarioEmoji: '📖 🛋️ ☕',
    correctEmotionId: 'calm',
    options: ['calm', 'angry', 'sad'],
    explanationKey: 'lifeSkills.scenarios.s6Expl',
  },
];

export const MANNERS_SCENARIOS: readonly MannersScenario[] = [
  {
    id: 'man-1',
    titleKey: 'lifeSkills.manners.m1Title',
    storyKey: 'lifeSkills.manners.m1Story',
    scenarioEmoji: '🥛 🍪',
    options: [
      {
        id: 'opt-please',
        textKey: 'lifeSkills.manners.pleaseWord',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.pleaseFeedback',
      },
      {
        id: 'opt-give',
        textKey: 'lifeSkills.manners.giveNow',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.politeHint',
      },
    ],
  },
  {
    id: 'man-2',
    titleKey: 'lifeSkills.manners.m2Title',
    storyKey: 'lifeSkills.manners.m2Story',
    scenarioEmoji: '🎁 🎈',
    options: [
      {
        id: 'opt-thanks',
        textKey: 'lifeSkills.manners.thankYouWord',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.thankYouFeedback',
      },
      {
        id: 'opt-walk',
        textKey: 'lifeSkills.manners.walkAway',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.thankYouHint',
      },
    ],
  },
  {
    id: 'man-3',
    titleKey: 'lifeSkills.manners.m3Title',
    storyKey: 'lifeSkills.manners.m3Story',
    scenarioEmoji: '🎨 💥',
    options: [
      {
        id: 'opt-sorry',
        textKey: 'lifeSkills.manners.sorryWord',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.sorryFeedback',
      },
      {
        id: 'opt-hide',
        textKey: 'lifeSkills.manners.blameOther',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.sorryHint',
      },
    ],
  },
  {
    id: 'man-4',
    titleKey: 'lifeSkills.manners.m4Title',
    storyKey: 'lifeSkills.manners.m4Story',
    scenarioEmoji: '🚪 👥',
    options: [
      {
        id: 'opt-excuse',
        textKey: 'lifeSkills.manners.excuseMeWord',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.excuseFeedback',
      },
      {
        id: 'opt-push',
        textKey: 'lifeSkills.manners.pushThrough',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.excuseHint',
      },
    ],
  },
  {
    id: 'man-5',
    titleKey: 'lifeSkills.manners.m5Title',
    storyKey: 'lifeSkills.manners.m5Story',
    scenarioEmoji: '🏎️ 🧸',
    options: [
      {
        id: 'opt-share',
        textKey: 'lifeSkills.manners.shareToys',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.shareFeedback',
      },
      {
        id: 'opt-keep',
        textKey: 'lifeSkills.manners.keepAll',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.shareHint',
      },
    ],
  },
  {
    id: 'man-6',
    titleKey: 'lifeSkills.manners.m6Title',
    storyKey: 'lifeSkills.manners.m6Story',
    scenarioEmoji: '🛝 👧👦',
    options: [
      {
        id: 'opt-turns',
        textKey: 'lifeSkills.manners.waitTurn',
        isCorrect: true,
        feedbackKey: 'lifeSkills.manners.turnFeedback',
      },
      {
        id: 'opt-cut',
        textKey: 'lifeSkills.manners.cutLine',
        isCorrect: false,
        feedbackKey: 'lifeSkills.manners.turnHint',
      },
    ],
  },
];

export const MORNING_ROUTINE_STEPS: readonly DailyRoutineStep[] = [
  {
    id: 'step-1',
    titleKey: 'lifeSkills.routine.wakeUp',
    emoji: '🌅 🛏️',
    orderIndex: 1,
    timeHint: '7:00 AM',
  },
  {
    id: 'step-2',
    titleKey: 'lifeSkills.routine.brushTeeth',
    emoji: '🪥 ✨',
    orderIndex: 2,
    timeHint: '7:15 AM',
  },
  {
    id: 'step-3',
    titleKey: 'lifeSkills.routine.takeBath',
    emoji: '🚿 🧼',
    orderIndex: 3,
    timeHint: '7:30 AM',
  },
  {
    id: 'step-4',
    titleKey: 'lifeSkills.routine.getDressed',
    emoji: '👕 👟',
    orderIndex: 4,
    timeHint: '7:45 AM',
  },
  {
    id: 'step-5',
    titleKey: 'lifeSkills.routine.eatBreakfast',
    emoji: '🥣 🥛',
    orderIndex: 5,
    timeHint: '8:00 AM',
  },
  {
    id: 'step-6',
    titleKey: 'lifeSkills.routine.goToSchool',
    emoji: '🎒 🏫',
    orderIndex: 6,
    timeHint: '8:30 AM',
  },
];

export const HEALTHY_HABITS_LIST: readonly HealthyHabitItem[] = [
  {
    id: 'hh-1',
    category: 'food',
    titleKey: 'lifeSkills.habits.fruitsVeggies.title',
    descKey: 'lifeSkills.habits.fruitsVeggies.desc',
    emoji: '🍎 🥦',
    color: '#EF4444',
  },
  {
    id: 'hh-2',
    category: 'water',
    titleKey: 'lifeSkills.habits.drinkWater.title',
    descKey: 'lifeSkills.habits.drinkWater.desc',
    emoji: '💧 🥤',
    color: '#0EA5E9',
  },
  {
    id: 'hh-3',
    category: 'sleep',
    titleKey: 'lifeSkills.habits.goodSleep.title',
    descKey: 'lifeSkills.habits.goodSleep.desc',
    emoji: '🌙 😴',
    color: '#8B5CF6',
  },
  {
    id: 'hh-4',
    category: 'exercise',
    titleKey: 'lifeSkills.habits.activePlay.title',
    descKey: 'lifeSkills.habits.activePlay.desc',
    emoji: '🏃 ⚽',
    color: '#10B981',
  },
  {
    id: 'hh-5',
    category: 'food',
    titleKey: 'lifeSkills.habits.healthyBreakfast.title',
    descKey: 'lifeSkills.habits.healthyBreakfast.desc',
    emoji: '🥣 🍌',
    color: '#F59E0B',
  },
  {
    id: 'hh-6',
    category: 'exercise',
    titleKey: 'lifeSkills.habits.outdoorSun.title',
    descKey: 'lifeSkills.habits.outdoorSun.desc',
    emoji: '☀️ 🌳',
    color: '#EC4899',
  },
];

export const SAFETY_TIPS_LIST: readonly SafetyTipItem[] = [
  {
    id: 'st-1',
    titleKey: 'lifeSkills.safety.crossRoad.title',
    ruleKey: 'lifeSkills.safety.crossRoad.rule',
    safeChoiceKey: 'lifeSkills.safety.crossRoad.choice',
    emoji: '🚦 🚸',
    color: '#EF4444',
  },
  {
    id: 'st-2',
    titleKey: 'lifeSkills.safety.bikeHelmet.title',
    ruleKey: 'lifeSkills.safety.bikeHelmet.rule',
    safeChoiceKey: 'lifeSkills.safety.bikeHelmet.choice',
    emoji: '🚲 ⛑️',
    color: '#3B82F6',
  },
  {
    id: 'st-3',
    titleKey: 'lifeSkills.safety.stayClose.title',
    ruleKey: 'lifeSkills.safety.stayClose.rule',
    safeChoiceKey: 'lifeSkills.safety.stayClose.choice',
    emoji: '👨‍👩‍👧 🛒',
    color: '#8B5CF6',
  },
  {
    id: 'st-4',
    titleKey: 'lifeSkills.safety.hotStove.title',
    ruleKey: 'lifeSkills.safety.hotStove.rule',
    safeChoiceKey: 'lifeSkills.safety.hotStove.choice',
    emoji: '🍳 🔥',
    color: '#F59E0B',
  },
  {
    id: 'st-5',
    titleKey: 'lifeSkills.safety.waterSafety.title',
    ruleKey: 'lifeSkills.safety.waterSafety.rule',
    safeChoiceKey: 'lifeSkills.safety.waterSafety.choice',
    emoji: '🏊 🦺',
    color: '#0EA5E9',
  },
  {
    id: 'st-6',
    titleKey: 'lifeSkills.safety.sharpObjects.title',
    ruleKey: 'lifeSkills.safety.sharpObjects.rule',
    safeChoiceKey: 'lifeSkills.safety.sharpObjects.choice',
    emoji: '✂️ 👨‍🏫',
    color: '#10B981',
  },
];

export const LIFE_SKILLS_QUIZ_QUESTIONS: readonly LifeSkillsQuizQuestion[] = [
  {
    id: 'lsq-1',
    questionKey: 'lifeSkills.quiz.q1',
    promptEmoji: '🪥 ✨',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q1Opt1',
        icon: '🪥',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q1Opt2',
        icon: '🍭',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q1Opt3',
        icon: '😴',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q1Expl',
  },
  {
    id: 'lsq-2',
    questionKey: 'lifeSkills.quiz.q2',
    promptEmoji: '🧼 💧',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q2Opt1',
        icon: '🧼',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q2Opt2',
        icon: '👕',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q2Opt3',
        icon: '🏃',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q2Expl',
  },
  {
    id: 'lsq-3',
    questionKey: 'lifeSkills.quiz.q3',
    promptEmoji: '🙏 🎁',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q3Opt1',
        icon: '💖',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q3Opt2',
        icon: '🙈',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q3Opt3',
        icon: '😠',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q3Expl',
  },
  {
    id: 'lsq-4',
    questionKey: 'lifeSkills.quiz.q4',
    promptEmoji: '🧸 🤝',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q4Opt1',
        icon: '🤝',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q4Opt2',
        icon: '🔒',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q4Opt3',
        icon: '🏃',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q4Expl',
  },
  {
    id: 'lsq-5',
    questionKey: 'lifeSkills.quiz.q5',
    promptEmoji: '😢 💔',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q5Opt1',
        icon: '🤗',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q5Opt2',
        icon: '😆',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q5Opt3',
        icon: '🏃',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q5Expl',
  },
  {
    id: 'lsq-6',
    questionKey: 'lifeSkills.quiz.q6',
    promptEmoji: '🤧 💨',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q6Opt1',
        icon: '💪',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q6Opt2',
        icon: '💨',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q6Opt3',
        icon: '🙈',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q6Expl',
  },
  {
    id: 'lsq-7',
    questionKey: 'lifeSkills.quiz.q7',
    promptEmoji: '🚦 🚸',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q7Opt1',
        icon: '🤝 🚦',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q7Opt2',
        icon: '🏃 💨',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q7Opt3',
        icon: '🙈',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q7Expl',
  },
  {
    id: 'lsq-8',
    questionKey: 'lifeSkills.quiz.q8',
    promptEmoji: '🍎 🥦',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q8Opt1',
        icon: '💪 🌟',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q8Opt2',
        icon: '😴',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q8Opt3',
        icon: '👎',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q8Expl',
  },
  {
    id: 'lsq-9',
    questionKey: 'lifeSkills.quiz.q9',
    promptEmoji: '🛏️ 🌅',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q9Opt1',
        icon: '🪥 ✨',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q9Opt2',
        icon: '🎒 🏫',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q9Opt3',
        icon: '😴',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q9Expl',
  },
  {
    id: 'lsq-10',
    questionKey: 'lifeSkills.quiz.q10',
    promptEmoji: '🚲 ⛑️',
    options: [
      {
        id: 'opt-1',
        textKey: 'lifeSkills.quiz.q10Opt1',
        icon: '⛑️',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'lifeSkills.quiz.q10Opt2',
        icon: '🧢',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'lifeSkills.quiz.q10Opt3',
        icon: '🚫',
        isCorrect: false,
      },
    ],
    explanationKey: 'lifeSkills.quiz.q10Expl',
  },
];
