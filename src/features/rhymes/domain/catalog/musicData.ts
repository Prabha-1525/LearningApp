import type {
  GuessSoundQuestion,
  Instrument,
  MelodySong,
  MusicPatternPuzzle,
  MusicQuizQuestion,
  MusicTopicId,
  RhythmLevel,
} from '../entities/musicEntities';

export const MUSIC_INSTRUMENTS: readonly Instrument[] = [
  {
    id: 'piano',
    nameKey: 'rhymes.instruments.piano.name',
    emoji: '🎹',
    family: 'keyboard',
    familyKey: 'rhymes.families.keyboard',
    factKey: 'rhymes.instruments.piano.fact',
    soundDescriptionKey: 'rhymes.instruments.piano.soundDesc',
    baseFrequency: 261.63, // C4
    noteSequence: [261.63, 329.63, 392.0, 523.25], // C - E - G - C chord
    accentColor: '#3B82F6',
  },
  {
    id: 'guitar',
    nameKey: 'rhymes.instruments.guitar.name',
    emoji: '🎸',
    family: 'strings',
    familyKey: 'rhymes.families.strings',
    factKey: 'rhymes.instruments.guitar.fact',
    soundDescriptionKey: 'rhymes.instruments.guitar.soundDesc',
    baseFrequency: 196.0, // G3
    noteSequence: [196.0, 246.94, 293.66, 392.0], // Strum
    accentColor: '#F59E0B',
  },
  {
    id: 'drum',
    nameKey: 'rhymes.instruments.drum.name',
    emoji: '🥁',
    family: 'percussion',
    familyKey: 'rhymes.families.percussion',
    factKey: 'rhymes.instruments.drum.fact',
    soundDescriptionKey: 'rhymes.instruments.drum.soundDesc',
    baseFrequency: 120.0,
    noteSequence: [120.0, 150.0, 120.0, 180.0], // Beat hits
    accentColor: '#EF4444',
  },
  {
    id: 'violin',
    nameKey: 'rhymes.instruments.violin.name',
    emoji: '🎻',
    family: 'strings',
    familyKey: 'rhymes.families.strings',
    factKey: 'rhymes.instruments.violin.fact',
    soundDescriptionKey: 'rhymes.instruments.violin.soundDesc',
    baseFrequency: 440.0, // A4
    noteSequence: [440.0, 493.88, 554.37, 659.25], // High melody
    accentColor: '#8B5CF6',
  },
  {
    id: 'trumpet',
    nameKey: 'rhymes.instruments.trumpet.name',
    emoji: '🎺',
    family: 'brass',
    familyKey: 'rhymes.families.brass',
    factKey: 'rhymes.instruments.trumpet.fact',
    soundDescriptionKey: 'rhymes.instruments.trumpet.soundDesc',
    baseFrequency: 349.23, // F4
    noteSequence: [349.23, 440.0, 523.25, 698.46], // Fanfare
    accentColor: '#EC4899',
  },
  {
    id: 'flute',
    nameKey: 'rhymes.instruments.flute.name',
    emoji: '🪈',
    family: 'woodwind',
    familyKey: 'rhymes.families.woodwind',
    factKey: 'rhymes.instruments.flute.fact',
    soundDescriptionKey: 'rhymes.instruments.flute.soundDesc',
    baseFrequency: 587.33, // D5
    noteSequence: [587.33, 659.25, 783.99, 880.0], // Gentle breeze
    accentColor: '#10B981',
  },
];

export const MUSIC_TOPIC_CARDS: readonly {
  readonly id: MusicTopicId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly badgeTag: string;
}[] = [
  {
    id: 'instruments',
    titleKey: 'rhymes.topics.instruments.title',
    subtitleKey: 'rhymes.topics.instruments.sub',
    emoji: '🎹',
    accentColor: '#3B82F6',
    badgeTag: 'Explore 6 Sounds',
  },
  {
    id: 'rhythm',
    titleKey: 'rhymes.topics.rhythm.title',
    subtitleKey: 'rhymes.topics.rhythm.sub',
    emoji: '🥁',
    accentColor: '#EF4444',
    badgeTag: 'Tap the Beat',
  },
  {
    id: 'guessSound',
    titleKey: 'rhymes.topics.guessSound.title',
    subtitleKey: 'rhymes.topics.guessSound.sub',
    emoji: '👂',
    accentColor: '#8B5CF6',
    badgeTag: 'Ear Training',
  },
  {
    id: 'patterns',
    titleKey: 'rhymes.topics.patterns.title',
    subtitleKey: 'rhymes.topics.patterns.sub',
    emoji: '🎶',
    accentColor: '#10B981',
    badgeTag: 'Pattern Match',
  },
  {
    id: 'piano',
    titleKey: 'rhymes.topics.piano.title',
    subtitleKey: 'rhymes.topics.piano.sub',
    emoji: '🎼',
    accentColor: '#F59E0B',
    badgeTag: 'Do-Re-Mi Piano',
  },
  {
    id: 'quiz',
    titleKey: 'rhymes.topics.quiz.title',
    subtitleKey: 'rhymes.topics.quiz.sub',
    emoji: '🎯',
    accentColor: '#EC4899',
    badgeTag: 'Music Arena',
  },
];

export const RHYTHM_LEVELS: readonly RhythmLevel[] = [
  {
    id: 'rhythm-1',
    levelNumber: 1,
    titleKey: 'rhymes.rhythm.l1Title',
    difficulty: 'easy',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 600},
      {id: 'b2', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 600},
      {
        id: 'b3',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Pause',
        durationMs: 600,
      },
      {id: 'b4', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 600},
    ],
    tempoBpm: 80,
    accentColor: '#EF4444',
  },
  {
    id: 'rhythm-2',
    levelNumber: 2,
    titleKey: 'rhymes.rhythm.l2Title',
    difficulty: 'easy',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '👏', label: 'Clap', durationMs: 500},
      {
        id: 'b2',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Pause',
        durationMs: 500,
      },
      {id: 'b3', type: 'hit', soundEmoji: '👏', label: 'Clap', durationMs: 500},
      {id: 'b4', type: 'hit', soundEmoji: '👏', label: 'Clap', durationMs: 500},
    ],
    tempoBpm: 90,
    accentColor: '#F59E0B',
  },
  {
    id: 'rhythm-3',
    levelNumber: 3,
    titleKey: 'rhymes.rhythm.l3Title',
    difficulty: 'medium',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 450},
      {id: 'b2', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 450},
      {id: 'b3', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 450},
      {
        id: 'b4',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Pause',
        durationMs: 450,
      },
      {id: 'b5', type: 'hit', soundEmoji: '🥁', label: 'Tap', durationMs: 450},
    ],
    tempoBpm: 100,
    accentColor: '#10B981',
  },
  {
    id: 'rhythm-4',
    levelNumber: 4,
    titleKey: 'rhymes.rhythm.l4Title',
    difficulty: 'medium',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '🔔', label: 'Ding', durationMs: 400},
      {id: 'b2', type: 'hit', soundEmoji: '🔔', label: 'Ding', durationMs: 400},
      {
        id: 'b3',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Pause',
        durationMs: 400,
      },
      {id: 'b4', type: 'hit', soundEmoji: '🔔', label: 'Ding', durationMs: 400},
      {id: 'b5', type: 'hit', soundEmoji: '🔔', label: 'Ding', durationMs: 400},
    ],
    tempoBpm: 110,
    accentColor: '#3B82F6',
  },
  {
    id: 'rhythm-5',
    levelNumber: 5,
    titleKey: 'rhymes.rhythm.l5Title',
    difficulty: 'hard',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '🥁', label: 'Boom', durationMs: 350},
      {
        id: 'b2',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Rest',
        durationMs: 350,
      },
      {id: 'b3', type: 'hit', soundEmoji: '🥁', label: 'Boom', durationMs: 350},
      {
        id: 'b4',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Rest',
        durationMs: 350,
      },
      {id: 'b5', type: 'hit', soundEmoji: '🥁', label: 'Boom', durationMs: 350},
      {id: 'b6', type: 'hit', soundEmoji: '🥁', label: 'Boom', durationMs: 350},
    ],
    tempoBpm: 120,
    accentColor: '#8B5CF6',
  },
  {
    id: 'rhythm-6',
    levelNumber: 6,
    titleKey: 'rhymes.rhythm.l6Title',
    difficulty: 'hard',
    beats: [
      {id: 'b1', type: 'hit', soundEmoji: '⭐', label: 'Beat', durationMs: 300},
      {id: 'b2', type: 'hit', soundEmoji: '⭐', label: 'Beat', durationMs: 300},
      {id: 'b3', type: 'hit', soundEmoji: '⭐', label: 'Beat', durationMs: 300},
      {
        id: 'b4',
        type: 'rest',
        soundEmoji: '⏸️',
        label: 'Rest',
        durationMs: 300,
      },
      {id: 'b5', type: 'hit', soundEmoji: '⭐', label: 'Beat', durationMs: 300},
      {id: 'b6', type: 'hit', soundEmoji: '⭐', label: 'Beat', durationMs: 300},
    ],
    tempoBpm: 130,
    accentColor: '#EC4899',
  },
];

export const GUESS_SOUND_QUESTIONS: readonly GuessSoundQuestion[] = [
  {
    id: 'gs-1',
    targetInstrumentId: 'drum',
    options: ['drum', 'piano', 'flute'],
    promptKey: 'rhymes.guess.q1Prompt',
    explanationKey: 'rhymes.guess.drumExpl',
  },
  {
    id: 'gs-2',
    targetInstrumentId: 'piano',
    options: ['violin', 'piano', 'guitar'],
    promptKey: 'rhymes.guess.q2Prompt',
    explanationKey: 'rhymes.guess.pianoExpl',
  },
  {
    id: 'gs-3',
    targetInstrumentId: 'guitar',
    options: ['trumpet', 'flute', 'guitar'],
    promptKey: 'rhymes.guess.q3Prompt',
    explanationKey: 'rhymes.guess.guitarExpl',
  },
  {
    id: 'gs-4',
    targetInstrumentId: 'trumpet',
    options: ['trumpet', 'drum', 'violin'],
    promptKey: 'rhymes.guess.q4Prompt',
    explanationKey: 'rhymes.guess.trumpetExpl',
  },
  {
    id: 'gs-5',
    targetInstrumentId: 'flute',
    options: ['flute', 'guitar', 'piano'],
    promptKey: 'rhymes.guess.q5Prompt',
    explanationKey: 'rhymes.guess.fluteExpl',
  },
  {
    id: 'gs-6',
    targetInstrumentId: 'violin',
    options: ['drum', 'violin', 'trumpet'],
    promptKey: 'rhymes.guess.q6Prompt',
    explanationKey: 'rhymes.guess.violinExpl',
  },
];

export const MUSIC_PATTERN_PUZZLES: readonly MusicPatternPuzzle[] = [
  {
    id: 'pat-1',
    titleKey: 'rhymes.patterns.p1Title',
    sequence: ['🥁', '🎹', '🥁', '❓'],
    targetIndex: 3,
    options: [
      {
        id: 'piano',
        emoji: '🎹',
        nameKey: 'rhymes.instruments.piano.name',
        isCorrect: true,
      },
      {
        id: 'flute',
        emoji: '🪈',
        nameKey: 'rhymes.instruments.flute.name',
        isCorrect: false,
      },
      {
        id: 'drum',
        emoji: '🥁',
        nameKey: 'rhymes.instruments.drum.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p1Expl',
  },
  {
    id: 'pat-2',
    titleKey: 'rhymes.patterns.p2Title',
    sequence: ['🎸', '🎸', '🎻', '🎸', '🎸', '❓'],
    targetIndex: 5,
    options: [
      {
        id: 'violin',
        emoji: '🎻',
        nameKey: 'rhymes.instruments.violin.name',
        isCorrect: true,
      },
      {
        id: 'guitar',
        emoji: '🎸',
        nameKey: 'rhymes.instruments.guitar.name',
        isCorrect: false,
      },
      {
        id: 'trumpet',
        emoji: '🎺',
        nameKey: 'rhymes.instruments.trumpet.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p2Expl',
  },
  {
    id: 'pat-3',
    titleKey: 'rhymes.patterns.p3Title',
    sequence: ['🎺', '🪈', '🎺', '🪈', '❓'],
    targetIndex: 4,
    options: [
      {
        id: 'trumpet',
        emoji: '🎺',
        nameKey: 'rhymes.instruments.trumpet.name',
        isCorrect: true,
      },
      {
        id: 'drum',
        emoji: '🥁',
        nameKey: 'rhymes.instruments.drum.name',
        isCorrect: false,
      },
      {
        id: 'piano',
        emoji: '🎹',
        nameKey: 'rhymes.instruments.piano.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p3Expl',
  },
  {
    id: 'pat-4',
    titleKey: 'rhymes.patterns.p4Title',
    sequence: ['🥁', '🥁', '🥁', '🎹', '🥁', '🥁', '🥁', '❓'],
    targetIndex: 7,
    options: [
      {
        id: 'piano',
        emoji: '🎹',
        nameKey: 'rhymes.instruments.piano.name',
        isCorrect: true,
      },
      {
        id: 'flute',
        emoji: '🪈',
        nameKey: 'rhymes.instruments.flute.name',
        isCorrect: false,
      },
      {
        id: 'guitar',
        emoji: '🎸',
        nameKey: 'rhymes.instruments.guitar.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p4Expl',
  },
  {
    id: 'pat-5',
    titleKey: 'rhymes.patterns.p5Title',
    sequence: ['🪈', '🎻', '🎹', '🪈', '🎻', '❓'],
    targetIndex: 5,
    options: [
      {
        id: 'piano',
        emoji: '🎹',
        nameKey: 'rhymes.instruments.piano.name',
        isCorrect: true,
      },
      {
        id: 'drum',
        emoji: '🥁',
        nameKey: 'rhymes.instruments.drum.name',
        isCorrect: false,
      },
      {
        id: 'trumpet',
        emoji: '🎺',
        nameKey: 'rhymes.instruments.trumpet.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p5Expl',
  },
  {
    id: 'pat-6',
    titleKey: 'rhymes.patterns.p6Title',
    sequence: ['🔔', '👏', '🔔', '👏', '🔔', '❓'],
    targetIndex: 5,
    options: [
      {
        id: 'clap',
        emoji: '👏',
        nameKey: 'rhymes.rhythm.clapName',
        isCorrect: true,
      },
      {
        id: 'bell',
        emoji: '🔔',
        nameKey: 'rhymes.rhythm.bellName',
        isCorrect: false,
      },
      {
        id: 'drum',
        emoji: '🥁',
        nameKey: 'rhymes.instruments.drum.name',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.patterns.p6Expl',
  },
];

export const MELODY_SONGS: readonly MelodySong[] = [
  {
    id: 'song-twinkle',
    titleKey: 'rhymes.songs.twinkle',
    emoji: '⭐',
    notes: [
      {note: 'C4', durationMs: 400},
      {note: 'C4', durationMs: 400},
      {note: 'G4', durationMs: 400},
      {note: 'G4', durationMs: 400},
      {note: 'A4', durationMs: 400},
      {note: 'A4', durationMs: 400},
      {note: 'G4', durationMs: 800},
    ],
  },
  {
    id: 'song-mary',
    titleKey: 'rhymes.songs.maryLamb',
    emoji: '🐑',
    notes: [
      {note: 'E4', durationMs: 400},
      {note: 'D4', durationMs: 400},
      {note: 'C4', durationMs: 400},
      {note: 'D4', durationMs: 400},
      {note: 'E4', durationMs: 400},
      {note: 'E4', durationMs: 400},
      {note: 'E4', durationMs: 800},
    ],
  },
  {
    id: 'song-brother',
    titleKey: 'rhymes.songs.brotherJohn',
    emoji: '🔔',
    notes: [
      {note: 'C4', durationMs: 400},
      {note: 'D4', durationMs: 400},
      {note: 'E4', durationMs: 400},
      {note: 'C4', durationMs: 400},
      {note: 'C4', durationMs: 400},
      {note: 'D4', durationMs: 400},
      {note: 'E4', durationMs: 400},
      {note: 'C4', durationMs: 400},
    ],
  },
  {
    id: 'song-boat',
    titleKey: 'rhymes.songs.rowBoat',
    emoji: '🚣',
    notes: [
      {note: 'C4', durationMs: 500},
      {note: 'C4', durationMs: 500},
      {note: 'C4', durationMs: 400},
      {note: 'D4', durationMs: 300},
      {note: 'E4', durationMs: 600},
    ],
  },
];

export const MUSIC_QUIZ_QUESTIONS: readonly MusicQuizQuestion[] = [
  {
    id: 'mq-1',
    questionKey: 'rhymes.quiz.q1',
    promptEmoji: '🎹',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.instruments.piano.name',
        icon: '🎹',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.instruments.guitar.name',
        icon: '🎸',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.instruments.drum.name',
        icon: '🥁',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q1Expl',
  },
  {
    id: 'mq-2',
    questionKey: 'rhymes.quiz.q2',
    promptEmoji: '🥁 💥',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.families.percussion',
        icon: '🥁',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.families.woodwind',
        icon: '🪈',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.families.brass',
        icon: '🎺',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q2Expl',
  },
  {
    id: 'mq-3',
    questionKey: 'rhymes.quiz.q3',
    promptEmoji: '🎸 🎻',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.stringsFamily',
        icon: '🎻 🎸',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.keyboardFamily',
        icon: '🎹',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.quiz.drumsFamily',
        icon: '🥁',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q3Expl',
  },
  {
    id: 'mq-4',
    questionKey: 'rhymes.quiz.q4',
    promptEmoji: '🪈 💨',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.blowAir',
        icon: '💨',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.hitWithStick',
        icon: '🥢',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.quiz.pressKeys',
        icon: '⌨️',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q4Expl',
  },
  {
    id: 'mq-5',
    questionKey: 'rhymes.quiz.q5',
    promptEmoji: '🎼 1 2 3 4',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.rhythmBeat',
        icon: '🥁 🎵',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.drawingColor',
        icon: '🎨',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.quiz.sleepingTime',
        icon: '😴',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q5Expl',
  },
  {
    id: 'mq-6',
    questionKey: 'rhymes.quiz.q6',
    promptEmoji: '🎺 🟡',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.instruments.trumpet.name',
        icon: '🎺',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.instruments.piano.name',
        icon: '🎹',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.instruments.violin.name',
        icon: '🎻',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q6Expl',
  },
  {
    id: 'mq-7',
    questionKey: 'rhymes.quiz.q7',
    promptEmoji: '🎹 Do Re Mi',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.musicalNotes',
        icon: '🎶',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.fruitsNames',
        icon: '🍎 🍌',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.quiz.shapesNames',
        icon: '🔺 🔲',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q7Expl',
  },
  {
    id: 'mq-8',
    questionKey: 'rhymes.quiz.q8',
    promptEmoji: '🎻 🪄',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.bowStick',
        icon: '🪄',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.hammer',
        icon: '🔨',
        isCorrect: false,
      },
      {id: 'opt-3', textKey: 'rhymes.quiz.spoon', icon: '🥄', isCorrect: false},
    ],
    explanationKey: 'rhymes.quiz.q8Expl',
  },
  {
    id: 'mq-9',
    questionKey: 'rhymes.quiz.q9',
    promptEmoji: '🥁 🎹 🥁 ❓',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.instruments.piano.name',
        icon: '🎹',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.instruments.drum.name',
        icon: '🥁',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.instruments.trumpet.name',
        icon: '🎺',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q9Expl',
  },
  {
    id: 'mq-10',
    questionKey: 'rhymes.quiz.q10',
    promptEmoji: '🎵 🌟',
    options: [
      {
        id: 'opt-1',
        textKey: 'rhymes.quiz.bringsJoy',
        icon: '😊 💃',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        textKey: 'rhymes.quiz.makesSad',
        icon: '😢',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        textKey: 'rhymes.quiz.noSound',
        icon: '🔇',
        isCorrect: false,
      },
    ],
    explanationKey: 'rhymes.quiz.q10Expl',
  },
];
