export type ContinentInfo = {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly featuredCountryCodes: readonly string[];
  readonly color: string;
};

export const CONTINENTS: readonly ContinentInfo[] = [
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    description:
      'The largest continent with diverse cultures, high mountains, and beautiful nations!',
    featuredCountryCodes: ['IN', 'JP', 'CN', 'KR', 'TH', 'SA'],
    color: '#FF9F1C',
  },
  {
    id: 'europe',
    name: 'Europe',
    icon: '🌍',
    description:
      'Home to historic castles, famous art, and amazing landmarks like Eiffel Tower!',
    featuredCountryCodes: ['FR', 'IT', 'DE', 'GB', 'ES', 'GR'],
    color: '#4DB7E8',
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    description:
      'Land of majestic wildlife, vast safaris, and ancient Pyramids of Giza!',
    featuredCountryCodes: ['EG', 'ZA', 'KE', 'NG', 'MA', 'TZ'],
    color: '#3D9A5F',
  },
  {
    id: 'north-america',
    name: 'North America',
    icon: '🌎',
    description:
      'Vast continent with high skyscrapers, deep canyons, and beautiful lakes!',
    featuredCountryCodes: ['US', 'CA', 'MX', 'JM', 'CR', 'CU'],
    color: '#E4578C',
  },
  {
    id: 'south-america',
    name: 'South America',
    icon: '🌎',
    description:
      'Famous for the dense Amazon rainforest and colorful carnivals!',
    featuredCountryCodes: ['BR', 'AR', 'PE', 'CL', 'CO', 'EC'],
    color: '#8B5CF6',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🌏',
    description:
      'Beautiful islands with kangaroos, coral reefs, and blue ocean waters!',
    featuredCountryCodes: ['AU', 'NZ', 'FJ', 'PG'],
    color: '#0F8B8D',
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    icon: '🧊',
    description:
      'The coldest continent, covered in ice and home to cute penguins!',
    featuredCountryCodes: [],
    color: '#64748B',
  },
];
