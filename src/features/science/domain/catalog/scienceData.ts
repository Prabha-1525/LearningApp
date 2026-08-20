import type {ScienceTopicMeta} from '../entities/ScienceTopic';

export const SCIENCE_TOPICS: readonly ScienceTopicMeta[] = [
  {
    id: 'plants',
    icon: '🌱',
    titleKey: 'science.topics.plants.title',
    descriptionKey: 'science.topics.plants.desc',
    accentColor: '#10B981',
    bgLightColor: '#ECFDF5',
    targetScreen: 'PlantsLesson',
    starReward: 3,
  },
  {
    id: 'human-body',
    icon: '🧍',
    titleKey: 'science.topics.humanBody.title',
    descriptionKey: 'science.topics.humanBody.desc',
    accentColor: '#F43F5E',
    bgLightColor: '#FFF1F2',
    targetScreen: 'HumanBodyLesson',
    starReward: 3,
  },
  {
    id: 'animals',
    icon: '🐾',
    titleKey: 'science.topics.animals.title',
    descriptionKey: 'science.topics.animals.desc',
    accentColor: '#F59E0B',
    bgLightColor: '#FEF3C7',
    targetScreen: 'AnimalsLesson',
    starReward: 3,
  },
  {
    id: 'space',
    icon: '🚀',
    titleKey: 'science.topics.space.title',
    descriptionKey: 'science.topics.space.desc',
    accentColor: '#6366F1',
    bgLightColor: '#EEF2FF',
    targetScreen: 'SpaceLesson',
    starReward: 3,
  },
  {
    id: 'weather',
    icon: '🌦️',
    titleKey: 'science.topics.weather.title',
    descriptionKey: 'science.topics.weather.desc',
    accentColor: '#0EA5E9',
    bgLightColor: '#E0F2FE',
    targetScreen: 'WeatherLesson',
    starReward: 3,
  },
  {
    id: 'water',
    icon: '🌊',
    titleKey: 'science.topics.water.title',
    descriptionKey: 'science.topics.water.desc',
    accentColor: '#06B6D4',
    bgLightColor: '#ECFEFF',
    targetScreen: 'WaterEarthLesson',
    starReward: 3,
  },
  {
    id: 'earth',
    icon: '🌎',
    titleKey: 'science.topics.earth.title',
    descriptionKey: 'science.topics.earth.desc',
    accentColor: '#3B82F6',
    bgLightColor: '#EFF6FF',
    targetScreen: 'WaterEarthLesson',
    starReward: 3,
  },
  {
    id: 'experiments',
    icon: '🧪',
    titleKey: 'science.topics.experiments.title',
    descriptionKey: 'science.topics.experiments.desc',
    accentColor: '#8B5CF6',
    bgLightColor: '#F5F3FF',
    targetScreen: 'Experiments',
    starReward: 3,
  },
  {
    id: 'quiz',
    icon: '🎯',
    titleKey: 'science.topics.quiz.title',
    descriptionKey: 'science.topics.quiz.desc',
    accentColor: '#EC4899',
    bgLightColor: '#FDF2F8',
    targetScreen: 'ScienceQuiz',
    starReward: 3,
  },
];

// ================= PLANTS DATA =================
export type PlantStage = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly descKey: string;
};

export const PLANT_GROWTH_STAGES: readonly PlantStage[] = [
  {
    id: 'seed',
    emoji: '🌱',
    nameKey: 'science.plants.stages.seed',
    descKey: 'science.plants.stages.seedDesc',
  },
  {
    id: 'sprout',
    emoji: '🌿',
    nameKey: 'science.plants.stages.sprout',
    descKey: 'science.plants.stages.sproutDesc',
  },
  {
    id: 'plant',
    emoji: '🪴',
    nameKey: 'science.plants.stages.plant',
    descKey: 'science.plants.stages.plantDesc',
  },
  {
    id: 'flower',
    emoji: '🌸',
    nameKey: 'science.plants.stages.flower',
    descKey: 'science.plants.stages.flowerDesc',
  },
  {
    id: 'fruit',
    emoji: '🍎',
    nameKey: 'science.plants.stages.fruit',
    descKey: 'science.plants.stages.fruitDesc',
  },
];

export type PlantPart = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly functionKey: string;
};

export const PLANT_PARTS: readonly PlantPart[] = [
  {
    id: 'roots',
    emoji: '🥕',
    nameKey: 'science.plants.parts.roots',
    functionKey: 'science.plants.parts.rootsDesc',
  },
  {
    id: 'stem',
    emoji: '🎋',
    nameKey: 'science.plants.parts.stem',
    functionKey: 'science.plants.parts.stemDesc',
  },
  {
    id: 'leaf',
    emoji: '🍃',
    nameKey: 'science.plants.parts.leaf',
    functionKey: 'science.plants.parts.leafDesc',
  },
  {
    id: 'flower',
    emoji: '🌺',
    nameKey: 'science.plants.parts.flower',
    functionKey: 'science.plants.parts.flowerDesc',
  },
  {
    id: 'fruit',
    emoji: '🍎',
    nameKey: 'science.plants.parts.fruit',
    functionKey: 'science.plants.parts.fruitDesc',
  },
  {
    id: 'seed',
    emoji: '🌰',
    nameKey: 'science.plants.parts.seed',
    functionKey: 'science.plants.parts.seedDesc',
  },
];

export type PlantNeed = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly descKey: string;
};

export const PLANT_NEEDS: readonly PlantNeed[] = [
  {
    id: 'sunlight',
    emoji: '☀️',
    nameKey: 'science.plants.needs.sun',
    descKey: 'science.plants.needs.sunDesc',
  },
  {
    id: 'water',
    emoji: '💧',
    nameKey: 'science.plants.needs.water',
    descKey: 'science.plants.needs.waterDesc',
  },
  {
    id: 'soil',
    emoji: '🪴',
    nameKey: 'science.plants.needs.soil',
    descKey: 'science.plants.needs.soilDesc',
  },
  {
    id: 'air',
    emoji: '💨',
    nameKey: 'science.plants.needs.air',
    descKey: 'science.plants.needs.airDesc',
  },
];

// ================= HUMAN BODY DATA =================
export type BodyPart = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly senseKey: string;
  readonly funFactKey: string;
  readonly color: string;
};

export const BODY_PARTS: readonly BodyPart[] = [
  {
    id: 'eyes',
    emoji: '👁️',
    nameKey: 'science.body.eyes',
    senseKey: 'science.body.eyesSense',
    funFactKey: 'science.body.eyesFact',
    color: '#3B82F6',
  },
  {
    id: 'ears',
    emoji: '👂',
    nameKey: 'science.body.ears',
    senseKey: 'science.body.earsSense',
    funFactKey: 'science.body.earsFact',
    color: '#F59E0B',
  },
  {
    id: 'nose',
    emoji: '👃',
    nameKey: 'science.body.nose',
    senseKey: 'science.body.noseSense',
    funFactKey: 'science.body.noseFact',
    color: '#10B981',
  },
  {
    id: 'mouth',
    emoji: '👄',
    nameKey: 'science.body.mouth',
    senseKey: 'science.body.mouthSense',
    funFactKey: 'science.body.mouthFact',
    color: '#EC4899',
  },
  {
    id: 'heart',
    emoji: '❤️',
    nameKey: 'science.body.heart',
    senseKey: 'science.body.heartSense',
    funFactKey: 'science.body.heartFact',
    color: '#EF4444',
  },
  {
    id: 'lungs',
    emoji: '🫁',
    nameKey: 'science.body.lungs',
    senseKey: 'science.body.lungsSense',
    funFactKey: 'science.body.lungsFact',
    color: '#8B5CF6',
  },
  {
    id: 'bones',
    emoji: '🦴',
    nameKey: 'science.body.bones',
    senseKey: 'science.body.bonesSense',
    funFactKey: 'science.body.bonesFact',
    color: '#6B7280',
  },
  {
    id: 'hands',
    emoji: '✋',
    nameKey: 'science.body.hands',
    senseKey: 'science.body.handsSense',
    funFactKey: 'science.body.handsFact',
    color: '#F97316',
  },
];

// ================= ANIMALS DATA =================
export type AnimalCategory = 'farm' | 'wild' | 'sea' | 'birds' | 'insects';

export type Animal = {
  readonly id: string;
  readonly category: AnimalCategory;
  readonly emoji: string;
  readonly nameKey: string;
  readonly soundKey: string;
  readonly habitatKey: string;
  readonly foodKey: string;
  readonly factKey: string;
};

export const ANIMALS_DATA: readonly Animal[] = [
  // Farm
  {
    id: 'cow',
    category: 'farm',
    emoji: '🐄',
    nameKey: 'science.animals.cow.name',
    soundKey: 'science.animals.cow.sound',
    habitatKey: 'science.animals.cow.habitat',
    foodKey: 'science.animals.cow.food',
    factKey: 'science.animals.cow.fact',
  },
  {
    id: 'sheep',
    category: 'farm',
    emoji: '🐑',
    nameKey: 'science.animals.sheep.name',
    soundKey: 'science.animals.sheep.sound',
    habitatKey: 'science.animals.sheep.habitat',
    foodKey: 'science.animals.sheep.food',
    factKey: 'science.animals.sheep.fact',
  },
  {
    id: 'horse',
    category: 'farm',
    emoji: '🐎',
    nameKey: 'science.animals.horse.name',
    soundKey: 'science.animals.horse.sound',
    habitatKey: 'science.animals.horse.habitat',
    foodKey: 'science.animals.horse.food',
    factKey: 'science.animals.horse.fact',
  },
  // Wild
  {
    id: 'lion',
    category: 'wild',
    emoji: '🦁',
    nameKey: 'science.animals.lion.name',
    soundKey: 'science.animals.lion.sound',
    habitatKey: 'science.animals.lion.habitat',
    foodKey: 'science.animals.lion.food',
    factKey: 'science.animals.lion.fact',
  },
  {
    id: 'elephant',
    category: 'wild',
    emoji: '🐘',
    nameKey: 'science.animals.elephant.name',
    soundKey: 'science.animals.elephant.sound',
    habitatKey: 'science.animals.elephant.habitat',
    foodKey: 'science.animals.elephant.food',
    factKey: 'science.animals.elephant.fact',
  },
  {
    id: 'monkey',
    category: 'wild',
    emoji: '🐒',
    nameKey: 'science.animals.monkey.name',
    soundKey: 'science.animals.monkey.sound',
    habitatKey: 'science.animals.monkey.habitat',
    foodKey: 'science.animals.monkey.food',
    factKey: 'science.animals.monkey.fact',
  },
  // Sea
  {
    id: 'dolphin',
    category: 'sea',
    emoji: '🐬',
    nameKey: 'science.animals.dolphin.name',
    soundKey: 'science.animals.dolphin.sound',
    habitatKey: 'science.animals.dolphin.habitat',
    foodKey: 'science.animals.dolphin.food',
    factKey: 'science.animals.dolphin.fact',
  },
  {
    id: 'clownfish',
    category: 'sea',
    emoji: '🐠',
    nameKey: 'science.animals.clownfish.name',
    soundKey: 'science.animals.clownfish.sound',
    habitatKey: 'science.animals.clownfish.habitat',
    foodKey: 'science.animals.clownfish.food',
    factKey: 'science.animals.clownfish.fact',
  },
  {
    id: 'octopus',
    category: 'sea',
    emoji: '🐙',
    nameKey: 'science.animals.octopus.name',
    soundKey: 'science.animals.octopus.sound',
    habitatKey: 'science.animals.octopus.habitat',
    foodKey: 'science.animals.octopus.food',
    factKey: 'science.animals.octopus.fact',
  },
  // Birds
  {
    id: 'parrot',
    category: 'birds',
    emoji: '🦜',
    nameKey: 'science.animals.parrot.name',
    soundKey: 'science.animals.parrot.sound',
    habitatKey: 'science.animals.parrot.habitat',
    foodKey: 'science.animals.parrot.food',
    factKey: 'science.animals.parrot.fact',
  },
  {
    id: 'penguin',
    category: 'birds',
    emoji: '🐧',
    nameKey: 'science.animals.penguin.name',
    soundKey: 'science.animals.penguin.sound',
    habitatKey: 'science.animals.penguin.habitat',
    foodKey: 'science.animals.penguin.food',
    factKey: 'science.animals.penguin.fact',
  },
  {
    id: 'owl',
    category: 'birds',
    emoji: '🦉',
    nameKey: 'science.animals.owl.name',
    soundKey: 'science.animals.owl.sound',
    habitatKey: 'science.animals.owl.habitat',
    foodKey: 'science.animals.owl.food',
    factKey: 'science.animals.owl.fact',
  },
  // Insects
  {
    id: 'butterfly',
    category: 'insects',
    emoji: '🦋',
    nameKey: 'science.animals.butterfly.name',
    soundKey: 'science.animals.butterfly.sound',
    habitatKey: 'science.animals.butterfly.habitat',
    foodKey: 'science.animals.butterfly.food',
    factKey: 'science.animals.butterfly.fact',
  },
  {
    id: 'bee',
    category: 'insects',
    emoji: '🐝',
    nameKey: 'science.animals.bee.name',
    soundKey: 'science.animals.bee.sound',
    habitatKey: 'science.animals.bee.habitat',
    foodKey: 'science.animals.bee.food',
    factKey: 'science.animals.bee.fact',
  },
  {
    id: 'ladybug',
    category: 'insects',
    emoji: '🐞',
    nameKey: 'science.animals.ladybug.name',
    soundKey: 'science.animals.ladybug.sound',
    habitatKey: 'science.animals.ladybug.habitat',
    foodKey: 'science.animals.ladybug.food',
    factKey: 'science.animals.ladybug.fact',
  },
];

// ================= SPACE & SUN/MOON DATA =================
export type CelestialBody = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly typeKey: string;
  readonly factKey: string;
  readonly color: string;
};

export const CELESTIAL_BODIES: readonly CelestialBody[] = [
  {
    id: 'sun',
    emoji: '☀️',
    nameKey: 'science.space.sun.name',
    typeKey: 'science.space.sun.type',
    factKey: 'science.space.sun.fact',
    color: '#F59E0B',
  },
  {
    id: 'moon',
    emoji: '🌙',
    nameKey: 'science.space.moon.name',
    typeKey: 'science.space.moon.type',
    factKey: 'science.space.moon.fact',
    color: '#E2E8F0',
  },
  {
    id: 'earth',
    emoji: '🌎',
    nameKey: 'science.space.earth.name',
    typeKey: 'science.space.earth.type',
    factKey: 'science.space.earth.fact',
    color: '#3B82F6',
  },
  {
    id: 'mercury',
    emoji: '🪐',
    nameKey: 'science.space.mercury.name',
    typeKey: 'science.space.mercury.type',
    factKey: 'science.space.mercury.fact',
    color: '#9CA3AF',
  },
  {
    id: 'mars',
    emoji: '🔴',
    nameKey: 'science.space.mars.name',
    typeKey: 'science.space.mars.type',
    factKey: 'science.space.mars.fact',
    color: '#EF4444',
  },
  {
    id: 'jupiter',
    emoji: '🪐',
    nameKey: 'science.space.jupiter.name',
    typeKey: 'science.space.jupiter.type',
    factKey: 'science.space.jupiter.fact',
    color: '#F97316',
  },
  {
    id: 'saturn',
    emoji: '🪐',
    nameKey: 'science.space.saturn.name',
    typeKey: 'science.space.saturn.type',
    factKey: 'science.space.saturn.fact',
    color: '#FBBF24',
  },
  {
    id: 'stars',
    emoji: '⭐',
    nameKey: 'science.space.stars.name',
    typeKey: 'science.space.stars.type',
    factKey: 'science.space.stars.fact',
    color: '#FCD34D',
  },
];

// ================= WEATHER DATA =================
export type WeatherType = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly descKey: string;
  readonly clothesKey: string;
  readonly activityKey: string;
  readonly bgGradient: string;
};

export const WEATHER_TYPES: readonly WeatherType[] = [
  {
    id: 'sunny',
    emoji: '☀️',
    nameKey: 'science.weather.sunny.name',
    descKey: 'science.weather.sunny.desc',
    clothesKey: 'science.weather.sunny.clothes',
    activityKey: 'science.weather.sunny.activity',
    bgGradient: '#FEF3C7',
  },
  {
    id: 'rainy',
    emoji: '🌧️',
    nameKey: 'science.weather.rainy.name',
    descKey: 'science.weather.rainy.desc',
    clothesKey: 'science.weather.rainy.clothes',
    activityKey: 'science.weather.rainy.activity',
    bgGradient: '#E0F2FE',
  },
  {
    id: 'cloudy',
    emoji: '☁️',
    nameKey: 'science.weather.cloudy.name',
    descKey: 'science.weather.cloudy.desc',
    clothesKey: 'science.weather.cloudy.clothes',
    activityKey: 'science.weather.cloudy.activity',
    bgGradient: '#F1F5F9',
  },
  {
    id: 'windy',
    emoji: '🌪️',
    nameKey: 'science.weather.windy.name',
    descKey: 'science.weather.windy.desc',
    clothesKey: 'science.weather.windy.clothes',
    activityKey: 'science.weather.windy.activity',
    bgGradient: '#E0E7FF',
  },
  {
    id: 'snowy',
    emoji: '❄️',
    nameKey: 'science.weather.snowy.name',
    descKey: 'science.weather.snowy.desc',
    clothesKey: 'science.weather.snowy.clothes',
    activityKey: 'science.weather.snowy.activity',
    bgGradient: '#EFF6FF',
  },
];

// ================= EXPERIMENTS DATA =================
export type FloatItem = {
  readonly id: string;
  readonly emoji: string;
  readonly nameKey: string;
  readonly doesFloat: boolean;
  readonly explanationKey: string;
};

export const FLOAT_EXPERIMENT_ITEMS: readonly FloatItem[] = [
  {
    id: 'leaf',
    emoji: '🍃',
    nameKey: 'science.experiments.float.leaf',
    doesFloat: true,
    explanationKey: 'science.experiments.float.leafExp',
  },
  {
    id: 'rock',
    emoji: '🪨',
    nameKey: 'science.experiments.float.rock',
    doesFloat: false,
    explanationKey: 'science.experiments.float.rockExp',
  },
  {
    id: 'boat',
    emoji: '⛵',
    nameKey: 'science.experiments.float.boat',
    doesFloat: true,
    explanationKey: 'science.experiments.float.boatExp',
  },
  {
    id: 'coin',
    emoji: '🪙',
    nameKey: 'science.experiments.float.coin',
    doesFloat: false,
    explanationKey: 'science.experiments.float.coinExp',
  },
  {
    id: 'apple',
    emoji: '🍎',
    nameKey: 'science.experiments.float.apple',
    doesFloat: true,
    explanationKey: 'science.experiments.float.appleExp',
  },
  {
    id: 'key',
    emoji: '🔑',
    nameKey: 'science.experiments.float.key',
    doesFloat: false,
    explanationKey: 'science.experiments.float.keyExp',
  },
];

export type ColorMix = {
  readonly color1: string;
  readonly color2: string;
  readonly color1Hex: string;
  readonly color2Hex: string;
  readonly resultNameKey: string;
  readonly resultHex: string;
  readonly emoji: string;
};

export const COLOR_MIXES: readonly ColorMix[] = [
  {
    color1: 'Red 🔴',
    color2: 'Blue 🔵',
    color1Hex: '#EF4444',
    color2Hex: '#3B82F6',
    resultNameKey: 'science.experiments.color.purple',
    resultHex: '#8B5CF6',
    emoji: '🟣',
  },
  {
    color1: 'Red 🔴',
    color2: 'Yellow 🟡',
    color1Hex: '#EF4444',
    color2Hex: '#FBBF24',
    resultNameKey: 'science.experiments.color.orange',
    resultHex: '#F97316',
    emoji: '🟠',
  },
  {
    color1: 'Blue 🔵',
    color2: 'Yellow 🟡',
    color1Hex: '#3B82F6',
    color2Hex: '#FBBF24',
    resultNameKey: 'science.experiments.color.green',
    resultHex: '#10B981',
    emoji: '🟢',
  },
];

// ================= QUIZ QUESTIONS =================
export type ScienceQuizQuestion = {
  readonly id: string;
  readonly questionKey: string;
  readonly options: readonly {
    readonly id: string;
    readonly emoji: string;
    readonly textKey: string;
    readonly isCorrect: boolean;
  }[];
  readonly explanationKey: string;
};

export const SCIENCE_QUIZ_QUESTIONS: readonly ScienceQuizQuestion[] = [
  {
    id: 'sq-1',
    questionKey: 'science.quiz.q1',
    options: [
      {id: 'o1', emoji: '☀️', textKey: 'science.quiz.q1.opt1', isCorrect: true},
      {
        id: 'o2',
        emoji: '🧸',
        textKey: 'science.quiz.q1.opt2',
        isCorrect: false,
      },
      {
        id: 'o3',
        emoji: '🚗',
        textKey: 'science.quiz.q1.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q1.exp',
  },
  {
    id: 'sq-2',
    questionKey: 'science.quiz.q2',
    options: [
      {id: 'o1', emoji: '👁️', textKey: 'science.quiz.q2.opt1', isCorrect: true},
      {
        id: 'o2',
        emoji: '👂',
        textKey: 'science.quiz.q2.opt2',
        isCorrect: false,
      },
      {
        id: 'o3',
        emoji: '👃',
        textKey: 'science.quiz.q2.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q2.exp',
  },
  {
    id: 'sq-3',
    questionKey: 'science.quiz.q3',
    options: [
      {
        id: 'o1',
        emoji: '🌙',
        textKey: 'science.quiz.q3.opt1',
        isCorrect: false,
      },
      {id: 'o2', emoji: '☀️', textKey: 'science.quiz.q3.opt2', isCorrect: true},
      {
        id: 'o3',
        emoji: '⭐',
        textKey: 'science.quiz.q3.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q3.exp',
  },
  {
    id: 'sq-4',
    questionKey: 'science.quiz.q4',
    options: [
      {id: 'o1', emoji: '🐬', textKey: 'science.quiz.q4.opt1', isCorrect: true},
      {
        id: 'o2',
        emoji: '🦁',
        textKey: 'science.quiz.q4.opt2',
        isCorrect: false,
      },
      {
        id: 'o3',
        emoji: '🐄',
        textKey: 'science.quiz.q4.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q4.exp',
  },
  {
    id: 'sq-5',
    questionKey: 'science.quiz.q5',
    options: [
      {
        id: 'o1',
        emoji: '🧥',
        textKey: 'science.quiz.q5.opt1',
        isCorrect: false,
      },
      {
        id: 'o2',
        emoji: '🕶️',
        textKey: 'science.quiz.q5.opt2',
        isCorrect: false,
      },
      {id: 'o3', emoji: '☂️', textKey: 'science.quiz.q5.opt3', isCorrect: true},
    ],
    explanationKey: 'science.quiz.q5.exp',
  },
  {
    id: 'sq-6',
    questionKey: 'science.quiz.q6',
    options: [
      {
        id: 'o1',
        emoji: '🪨',
        textKey: 'science.quiz.q6.opt1',
        isCorrect: false,
      },
      {id: 'o2', emoji: '🍃', textKey: 'science.quiz.q6.opt2', isCorrect: true},
      {
        id: 'o3',
        emoji: '🪙',
        textKey: 'science.quiz.q6.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q6.exp',
  },
  {
    id: 'sq-7',
    questionKey: 'science.quiz.q7',
    options: [
      {id: 'o1', emoji: '❤️', textKey: 'science.quiz.q7.opt1', isCorrect: true},
      {
        id: 'o2',
        emoji: '🫁',
        textKey: 'science.quiz.q7.opt2',
        isCorrect: false,
      },
      {
        id: 'o3',
        emoji: '🦴',
        textKey: 'science.quiz.q7.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q7.exp',
  },
  {
    id: 'sq-8',
    questionKey: 'science.quiz.q8',
    options: [
      {id: 'o1', emoji: '🟣', textKey: 'science.quiz.q8.opt1', isCorrect: true},
      {
        id: 'o2',
        emoji: '🟢',
        textKey: 'science.quiz.q8.opt2',
        isCorrect: false,
      },
      {
        id: 'o3',
        emoji: '🟠',
        textKey: 'science.quiz.q8.opt3',
        isCorrect: false,
      },
    ],
    explanationKey: 'science.quiz.q8.exp',
  },
];
