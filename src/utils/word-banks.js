/**
 * Word Banks for Sentence Builder
 * Organized by part of speech with difficulty levels
 */

const wordBanks = {
  basic: {
    article: ['The', 'A', 'An'],
    subject: ['cat', 'dog', 'girl', 'boy', 'bird', 'teacher', 'rabbit', 'elephant'],
    verb: ['runs', 'jumps', 'eats', 'sleeps', 'plays', 'reads', 'sings', 'walks'],
    adjective: ['happy', 'big', 'small', 'red', 'funny', 'sleepy', 'hungry', 'quick'],
    object: ['ball', 'book', 'apple', 'game', 'song', 'story', 'food', 'toy'],
    preposition: ['in', 'on', 'under', 'with', 'near', 'behind', 'above', 'beside'],
    place: ['park', 'house', 'school', 'garden', 'tree', 'bed', 'table', 'yard']
  },

  intermediate: {
    article: ['The', 'A', 'An', 'This', 'That', 'These', 'Those'],
    subject: ['student', 'scientist', 'athlete', 'musician', 'family', 'team', 'group', 'crowd'],
    verb: ['creates', 'discovers', 'explores', 'practices', 'performs', 'studies', 'teaches', 'learns'],
    adjective: ['creative', 'curious', 'talented', 'dedicated', 'enthusiastic', 'careful', 'brave', 'patient'],
    object: ['experiment', 'project', 'instrument', 'discovery', 'achievement', 'solution', 'masterpiece', 'invention'],
    preposition: ['through', 'between', 'during', 'before', 'after', 'without', 'towards', 'against'],
    place: ['laboratory', 'stadium', 'theater', 'museum', 'library', 'workshop', 'studio', 'classroom'],
    adverb: ['quickly', 'carefully', 'happily', 'quietly', 'loudly', 'slowly', 'gracefully', 'skillfully']
  },

  advanced: {
    article: ['The', 'A', 'An', 'Every', 'Each', 'Several', 'Many', 'Few'],
    subject: ['researcher', 'entrepreneur', 'philosopher', 'architect', 'journalist', 'diplomat', 'archaeologist', 'astronaut'],
    verb: ['investigates', 'analyzes', 'contemplates', 'innovates', 'negotiates', 'synthesizes', 'demonstrates', 'collaborates'],
    adjective: ['innovative', 'analytical', 'sophisticated', 'remarkable', 'extraordinary', 'meticulous', 'visionary', 'revolutionary'],
    object: ['hypothesis', 'breakthrough', 'phenomenon', 'paradigm', 'methodology', 'framework', 'manuscript', 'algorithm'],
    preposition: ['throughout', 'alongside', 'beneath', 'concerning', 'regarding', 'despite', 'within', 'beyond'],
    place: ['conference', 'symposium', 'observatory', 'headquarters', 'institute', 'facility', 'complex', 'establishment'],
    adverb: ['methodically', 'systematically', 'thoroughly', 'precisely', 'eloquently', 'strategically', 'meticulously', 'ingeniously'],
    conjunction: ['however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'consequently', 'additionally', 'alternatively']
  }
};

/**
 * Get words for a specific part of speech and difficulty level
 */
export const getWords = (partOfSpeech, difficulty = 'basic') => {
  return wordBanks[difficulty]?.[partOfSpeech] || wordBanks.basic[partOfSpeech] || [];
};

/**
 * Get all words up to a certain difficulty level
 */
export const getProgressiveWords = (partOfSpeech, maxDifficulty = 'basic') => {
  const difficulties = ['basic', 'intermediate', 'advanced'];
  const maxIndex = difficulties.indexOf(maxDifficulty);

  if (maxIndex === -1) return getWords(partOfSpeech, 'basic');

  const words = new Set();
  for (let i = 0; i <= maxIndex; i++) {
    const levelWords = wordBanks[difficulties[i]]?.[partOfSpeech] || [];
    levelWords.forEach(word => words.add(word));
  }

  return Array.from(words);
};

/**
 * Get random word from a category
 */
export const getRandomWord = (partOfSpeech, difficulty = 'basic') => {
  const words = getWords(partOfSpeech, difficulty);
  return words[Math.floor(Math.random() * words.length)];
};

export default wordBanks;