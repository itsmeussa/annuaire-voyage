export interface GeoGame {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: 'quiz' | 'puzzle' | 'memory' | 'exploration';
  difficulty: 'easy' | 'medium' | 'hard';
  playTime: string;
  featured: boolean;
}

export const geoGames: GeoGame[] = [
  // Quiz Games
  {
    id: 'capital-quiz',
    slug: 'capital-quiz',
    title: 'Capital Cities Quiz',
    description: 'Test your knowledge of world capitals! Can you name the capital of every country? Challenge yourself with this comprehensive geography quiz.',
    shortDescription: 'Guess the capital cities of countries around the world.',
    icon: '🏛️',
    category: 'quiz',
    difficulty: 'medium',
    playTime: '5-10 min',
    featured: true,
  },
  {
    id: 'flag-quiz',
    slug: 'flag-quiz',
    title: 'Flag Challenge',
    description: 'How well do you know world flags? Identify flags from every continent in this colorful geography challenge.',
    shortDescription: 'Identify flags from countries around the world.',
    icon: '🏳️',
    category: 'quiz',
    difficulty: 'medium',
    playTime: '5-10 min',
    featured: true,
  },
  {
    id: 'country-shapes',
    slug: 'country-shapes',
    title: 'Country Shapes',
    description: 'Can you recognize countries by their outline? Test your geographic knowledge with this silhouette challenge.',
    shortDescription: 'Identify countries by their shape alone.',
    icon: '🗺️',
    category: 'quiz',
    difficulty: 'hard',
    playTime: '5-10 min',
    featured: true,
  },
  {
    id: 'landmark-quiz',
    slug: 'landmark-quiz',
    title: 'Famous Landmarks',
    description: 'From the Eiffel Tower to the Great Wall, test your knowledge of the world\'s most iconic landmarks.',
    shortDescription: 'Name famous landmarks from around the world.',
    icon: '🗽',
    category: 'quiz',
    difficulty: 'easy',
    playTime: '5-10 min',
    featured: true,
  },
  
  // Puzzle Games
  {
    id: 'map-puzzle',
    slug: 'map-puzzle',
    title: 'World Map Puzzle',
    description: 'Put the world back together! Drag and drop countries to complete the world map in this engaging puzzle game.',
    shortDescription: 'Piece together the world map.',
    icon: '🧩',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '10-15 min',
    featured: true,
  },
  {
    id: 'continent-puzzle',
    slug: 'continent-puzzle',
    title: 'Continent Builder',
    description: 'Assemble continents piece by piece. Perfect for learning the geography of each region.',
    shortDescription: 'Build continents from their countries.',
    icon: '🌍',
    category: 'puzzle',
    difficulty: 'easy',
    playTime: '5-10 min',
    featured: false,
  },
  
  // Memory Games
  {
    id: 'flag-memory',
    slug: 'flag-memory',
    title: 'Flag Memory Match',
    description: 'Match pairs of flags in this memory challenge. Improve your flag recognition while training your memory!',
    shortDescription: 'Match pairs of country flags.',
    icon: '🎴',
    category: 'memory',
    difficulty: 'easy',
    playTime: '5-10 min',
    featured: true,
  },
  {
    id: 'capital-memory',
    slug: 'capital-memory',
    title: 'Capital Pairs',
    description: 'Match countries with their capitals in this memory-based learning game.',
    shortDescription: 'Match countries to their capitals.',
    icon: '🃏',
    category: 'memory',
    difficulty: 'medium',
    playTime: '5-10 min',
    featured: false,
  },
  
  // Exploration Games
  {
    id: 'globe-explorer',
    slug: 'globe-explorer',
    title: 'Globe Explorer',
    description: 'Spin the globe and discover random countries! Learn fun facts about each nation you land on.',
    shortDescription: 'Explore the world randomly.',
    icon: '🌐',
    category: 'exploration',
    difficulty: 'easy',
    playTime: '5+ min',
    featured: false,
  },
  {
    id: 'distance-challenge',
    slug: 'distance-challenge',
    title: 'Distance Challenge',
    description: 'Guess the distance between two cities! How well do you understand global geography?',
    shortDescription: 'Estimate distances between cities.',
    icon: '📏',
    category: 'exploration',
    difficulty: 'hard',
    playTime: '5-10 min',
    featured: false,
  },
  {
    id: 'population-game',
    slug: 'population-game',
    title: 'Population Showdown',
    description: 'Which country has more people? Test your knowledge of world populations in this comparison game.',
    shortDescription: 'Compare country populations.',
    icon: '👥',
    category: 'quiz',
    difficulty: 'medium',
    playTime: '5-10 min',
    featured: false,
  },
  {
    id: 'timezone-challenge',
    slug: 'timezone-challenge',
    title: 'Timezone Master',
    description: 'What time is it around the world? Learn about timezones in this educational challenge.',
    shortDescription: 'Master world timezones.',
    icon: '🕐',
    category: 'quiz',
    difficulty: 'hard',
    playTime: '5-10 min',
    featured: false,
  },
];

export const getFeaturedGames = (limit: number = 6): GeoGame[] => {
  return geoGames.filter(g => g.featured).slice(0, limit);
};

export const getGameBySlug = (slug: string): GeoGame | undefined => {
  return geoGames.find(g => g.slug === slug);
};

export const getGamesByCategory = (category: GeoGame['category']): GeoGame[] => {
  return geoGames.filter(g => g.category === category);
};

export const getAllGames = (): GeoGame[] => {
  return geoGames;
};
