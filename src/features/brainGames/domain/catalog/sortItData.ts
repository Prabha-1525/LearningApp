/**
 * Sort It game data.
 * Child classifies items into 2 groups.
 */

export type SortGroup = {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
};

export type SortItem = {
  readonly id: string;
  readonly emoji: string;
  readonly label: string;
  readonly groupId: string;
};

export type SortLevel = {
  readonly id: string;
  readonly level: number;
  readonly promptKey: string;
  readonly groups: readonly [SortGroup, SortGroup];
  readonly items: readonly SortItem[];
};

export const SORT_LEVELS: readonly SortLevel[] = [
  {
    id: 'sort-1-animals-fruits',
    level: 1,
    promptKey: 'brainGames.sortIt.prompt',
    groups: [
      {id: 'animals', label: 'Animals', icon: '🐾', color: '#FDE68A'},
      {id: 'fruits', label: 'Fruits', icon: '🍓', color: '#BBF7D0'},
    ],
    items: [
      {id: 'dog', emoji: '🐶', label: 'Dog', groupId: 'animals'},
      {id: 'apple', emoji: '🍎', label: 'Apple', groupId: 'fruits'},
      {id: 'cat', emoji: '🐱', label: 'Cat', groupId: 'animals'},
      {id: 'banana', emoji: '🍌', label: 'Banana', groupId: 'fruits'},
      {id: 'bird', emoji: '🐦', label: 'Bird', groupId: 'animals'},
      {id: 'grape', emoji: '🍇', label: 'Grape', groupId: 'fruits'},
    ],
  },
  {
    id: 'sort-2-land-water',
    level: 2,
    promptKey: 'brainGames.sortIt.prompt',
    groups: [
      {id: 'land', label: 'Land', icon: '🌍', color: '#D9F99D'},
      {id: 'water', label: 'Water', icon: '🌊', color: '#BFDBFE'},
    ],
    items: [
      {id: 'fish', emoji: '🐟', label: 'Fish', groupId: 'water'},
      {id: 'lion', emoji: '🦁', label: 'Lion', groupId: 'land'},
      {id: 'dolphin', emoji: '🐬', label: 'Dolphin', groupId: 'water'},
      {id: 'elephant', emoji: '🐘', label: 'Elephant', groupId: 'land'},
      {id: 'octopus', emoji: '🐙', label: 'Octopus', groupId: 'water'},
      {id: 'horse', emoji: '🐴', label: 'Horse', groupId: 'land'},
    ],
  },
  {
    id: 'sort-3-living-nonliving',
    level: 3,
    promptKey: 'brainGames.sortIt.prompt',
    groups: [
      {id: 'living', label: 'Living', icon: '🌱', color: '#A7F3D0'},
      {id: 'nonliving', label: 'Non-Living', icon: '🪨', color: '#E2E8F0'},
    ],
    items: [
      {id: 'tree', emoji: '🌳', label: 'Tree', groupId: 'living'},
      {id: 'rock', emoji: '🪨', label: 'Rock', groupId: 'nonliving'},
      {id: 'butterfly', emoji: '🦋', label: 'Butterfly', groupId: 'living'},
      {id: 'chair', emoji: '🪑', label: 'Chair', groupId: 'nonliving'},
      {id: 'flower', emoji: '🌸', label: 'Flower', groupId: 'living'},
      {id: 'car', emoji: '🚗', label: 'Car', groupId: 'nonliving'},
    ],
  },
];
