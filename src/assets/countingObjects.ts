import type {ImageSourcePropType} from 'react-native';

export type CountingObjectId = string;

export type CountingObjectDef = {
  readonly id: CountingObjectId;
  readonly category: 'fruits' | 'vegetables' | 'animals';
  readonly labelEn: string;
  readonly labelPluralEn: string;
  readonly image: ImageSourcePropType;
};

function fruit(
  id: string,
  labelEn: string,
  labelPluralEn: string,
  image: ImageSourcePropType,
): CountingObjectDef {
  return {id, category: 'fruits', labelEn, labelPluralEn, image};
}

function veg(
  id: string,
  labelEn: string,
  labelPluralEn: string,
  image: ImageSourcePropType,
): CountingObjectDef {
  return {id, category: 'vegetables', labelEn, labelPluralEn, image};
}

function animal(
  id: string,
  labelEn: string,
  labelPluralEn: string,
  image: ImageSourcePropType,
): CountingObjectDef {
  return {id, category: 'animals', labelEn, labelPluralEn, image};
}

/** Small counting icons — fruits, vegetables, animals. */
export const COUNTING_OBJECTS: readonly CountingObjectDef[] = [
  fruit(
    'apple',
    'apple',
    'apples',
    require('./images/png/math/counting/fruits/apple.png'),
  ),
  fruit(
    'banana',
    'banana',
    'bananas',
    require('./images/png/math/counting/fruits/banana.png'),
  ),
  fruit(
    'blueberries',
    'blueberry',
    'blueberries',
    require('./images/png/math/counting/fruits/blueberries.png'),
  ),
  fruit(
    'cherries',
    'cherry',
    'cherries',
    require('./images/png/math/counting/fruits/cherries.png'),
  ),
  fruit(
    'dragon_fruit',
    'dragon fruit',
    'dragon fruits',
    require('./images/png/math/counting/fruits/dragon_fruit.png'),
  ),
  fruit(
    'grapes',
    'grape',
    'grapes',
    require('./images/png/math/counting/fruits/grapes.png'),
  ),
  fruit(
    'guava',
    'guava',
    'guavas',
    require('./images/png/math/counting/fruits/guava.png'),
  ),
  fruit(
    'orange',
    'orange',
    'oranges',
    require('./images/png/math/counting/fruits/orange.png'),
  ),
  fruit(
    'papaya',
    'papaya',
    'papayas',
    require('./images/png/math/counting/fruits/papaya.png'),
  ),
  fruit(
    'pineapple',
    'pineapple',
    'pineapples',
    require('./images/png/math/counting/fruits/pineapple.png'),
  ),
  fruit(
    'pomegranate',
    'pomegranate',
    'pomegranates',
    require('./images/png/math/counting/fruits/pomegranate.png'),
  ),
  fruit(
    'strawberry',
    'strawberry',
    'strawberries',
    require('./images/png/math/counting/fruits/strawberry_pair.png'),
  ),
  fruit(
    'watermelon',
    'watermelon',
    'watermelons',
    require('./images/png/math/counting/fruits/watermelon.png'),
  ),

  veg(
    'bell_pepper',
    'bell pepper',
    'bell peppers',
    require('./images/png/math/counting/vegetables/bell_pepper.png'),
  ),
  veg(
    'bitter_melon',
    'bitter melon',
    'bitter melons',
    require('./images/png/math/counting/vegetables/bitter_melon.png'),
  ),
  veg(
    'broccoli',
    'broccoli',
    'broccoli',
    require('./images/png/math/counting/vegetables/broccoli.png'),
  ),
  veg(
    'cabbage',
    'cabbage',
    'cabbages',
    require('./images/png/math/counting/vegetables/cabbage.png'),
  ),
  veg(
    'carrot',
    'carrot',
    'carrots',
    require('./images/png/math/counting/vegetables/carrot.png'),
  ),
  veg(
    'cauliflower',
    'cauliflower',
    'cauliflowers',
    require('./images/png/math/counting/vegetables/cauliflower.png'),
  ),
  veg(
    'chili',
    'chili',
    'chilies',
    require('./images/png/math/counting/vegetables/chili.png'),
  ),
  veg(
    'corn',
    'corn',
    'corn',
    require('./images/png/math/counting/vegetables/corn.png'),
  ),
  veg(
    'cucumber',
    'cucumber',
    'cucumbers',
    require('./images/png/math/counting/vegetables/cucumber.png'),
  ),
  veg(
    'eggplant',
    'eggplant',
    'eggplants',
    require('./images/png/math/counting/vegetables/eggplant.png'),
  ),
  veg(
    'ginger',
    'ginger',
    'ginger roots',
    require('./images/png/math/counting/vegetables/ginger.png'),
  ),
  veg(
    'okra',
    'okra',
    'okra',
    require('./images/png/math/counting/vegetables/okra.png'),
  ),
  veg(
    'onion',
    'onion',
    'onions',
    require('./images/png/math/counting/vegetables/onion.png'),
  ),
  veg(
    'pea_pod',
    'pea pod',
    'pea pods',
    require('./images/png/math/counting/vegetables/pea_pods.png'),
  ),
  veg(
    'potato',
    'potato',
    'potatoes',
    require('./images/png/math/counting/vegetables/potatoes.png'),
  ),
  veg(
    'pumpkin',
    'pumpkin',
    'pumpkins',
    require('./images/png/math/counting/vegetables/pumpkin.png'),
  ),
  veg(
    'radish',
    'radish',
    'radishes',
    require('./images/png/math/counting/vegetables/radish.png'),
  ),
  veg(
    'sweet_potato',
    'sweet potato',
    'sweet potatoes',
    require('./images/png/math/counting/vegetables/sweet_potato.png'),
  ),
  veg(
    'tomato',
    'tomato',
    'tomatoes',
    require('./images/png/math/counting/vegetables/tomato.png'),
  ),

  animal(
    'bear',
    'bear',
    'bears',
    require('./images/png/math/counting/animals/bear.png'),
  ),
  animal(
    'cat',
    'cat',
    'cats',
    require('./images/png/math/counting/animals/cat.png'),
  ),
  animal(
    'cow',
    'cow',
    'cows',
    require('./images/png/math/counting/animals/cow.png'),
  ),
  animal(
    'crocodile',
    'crocodile',
    'crocodiles',
    require('./images/png/math/counting/animals/crocodile.png'),
  ),
  animal(
    'deer',
    'deer',
    'deer',
    require('./images/png/math/counting/animals/deer.png'),
  ),
  animal(
    'dog',
    'dog',
    'dogs',
    require('./images/png/math/counting/animals/dog.png'),
  ),
  animal(
    'duck',
    'duck',
    'ducks',
    require('./images/png/math/counting/animals/duck.png'),
  ),
  animal(
    'elephant',
    'elephant',
    'elephants',
    require('./images/png/math/counting/animals/elephant.png'),
  ),
  animal(
    'fox',
    'fox',
    'foxes',
    require('./images/png/math/counting/animals/fox.png'),
  ),
  animal(
    'frog',
    'frog',
    'frogs',
    require('./images/png/math/counting/animals/frog.png'),
  ),
  animal(
    'giraffe',
    'giraffe',
    'giraffes',
    require('./images/png/math/counting/animals/giraffe.png'),
  ),
  animal(
    'gorilla',
    'gorilla',
    'gorillas',
    require('./images/png/math/counting/animals/gorilla.png'),
  ),
  animal(
    'kangaroo',
    'kangaroo',
    'kangaroos',
    require('./images/png/math/counting/animals/kangaroo.png'),
  ),
  animal(
    'leopard',
    'leopard',
    'leopards',
    require('./images/png/math/counting/animals/leopard.png'),
  ),
  animal(
    'lion',
    'lion',
    'lions',
    require('./images/png/math/counting/animals/lion.png'),
  ),
  animal(
    'monkey',
    'monkey',
    'monkeys',
    require('./images/png/math/counting/animals/monkey.png'),
  ),
  animal(
    'owl',
    'owl',
    'owls',
    require('./images/png/math/counting/animals/owl.png'),
  ),
  animal(
    'panda',
    'panda',
    'pandas',
    require('./images/png/math/counting/animals/panda.png'),
  ),
  animal(
    'rabbit',
    'rabbit',
    'rabbits',
    require('./images/png/math/counting/animals/rabbit.png'),
  ),
  animal(
    'rhino',
    'rhino',
    'rhinos',
    require('./images/png/math/counting/animals/rhino.png'),
  ),
  animal(
    'snake',
    'snake',
    'snakes',
    require('./images/png/math/counting/animals/snake.png'),
  ),
  animal(
    'tiger',
    'tiger',
    'tigers',
    require('./images/png/math/counting/animals/tiger.png'),
  ),
  animal(
    'turtle',
    'turtle',
    'turtles',
    require('./images/png/math/counting/animals/turtle.png'),
  ),
  animal(
    'zebra',
    'zebra',
    'zebras',
    require('./images/png/math/counting/animals/zebra.png'),
  ),
];

export function countingObjectsByCategory(
  category: CountingObjectDef['category'],
): readonly CountingObjectDef[] {
  return COUNTING_OBJECTS.filter(o => o.category === category);
}
