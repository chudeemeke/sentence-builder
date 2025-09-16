/**
 * Sentence Pattern Definitions
 * Defines the structure and rules for different sentence types
 */

const patterns = {
  simple: {
    id: 'simple',
    name: 'Simple Sentence',
    structure: ['article', 'subject', 'verb'],
    example: 'The cat sleeps.',
    hint: 'Start with The/A/An, add who/what, then what they do!',
    difficulty: 'beginner',
    points: 10
  },

  withAdjective: {
    id: 'withAdjective',
    name: 'With Describing Word',
    structure: ['article', 'adjective', 'subject', 'verb'],
    example: 'The happy dog plays.',
    hint: 'Add a word that describes the subject!',
    difficulty: 'beginner',
    points: 15
  },

  withObject: {
    id: 'withObject',
    name: 'Action + Thing',
    structure: ['article', 'subject', 'verb', 'article', 'object'],
    example: 'The girl reads a book.',
    hint: 'What is the subject doing something to?',
    difficulty: 'beginner',
    points: 20
  },

  withAdverb: {
    id: 'withAdverb',
    name: 'How It Happens',
    structure: ['article', 'subject', 'verb', 'adverb'],
    example: 'The bird sings beautifully.',
    hint: 'Add a word describing HOW the action is done!',
    difficulty: 'intermediate',
    points: 25
  },

  withPlace: {
    id: 'withPlace',
    name: 'Where It Happens',
    structure: ['article', 'subject', 'verb', 'preposition', 'article', 'place'],
    example: 'The bird sings in the tree.',
    hint: 'Add where the action happens!',
    difficulty: 'intermediate',
    points: 30
  },

  complete: {
    id: 'complete',
    name: 'Full Sentence',
    structure: ['article', 'adjective', 'subject', 'verb', 'article', 'object', 'preposition', 'article', 'place'],
    example: 'The happy girl reads a book in the garden.',
    hint: 'Use all the parts to make a complete sentence!',
    difficulty: 'intermediate',
    points: 40
  },

  compound: {
    id: 'compound',
    name: 'Two Actions',
    structure: ['article', 'subject', 'verb', 'conjunction', 'verb'],
    example: 'The student reads and writes.',
    hint: 'Connect two actions with and/or!',
    difficulty: 'advanced',
    points: 35
  },

  complex: {
    id: 'complex',
    name: 'Complex Sentence',
    structure: ['article', 'adjective', 'subject', 'verb', 'adverb', 'conjunction', 'verb', 'article', 'object'],
    example: 'The talented musician plays skillfully and creates beautiful music.',
    hint: 'Combine multiple elements for a rich sentence!',
    difficulty: 'advanced',
    points: 50
  },

  question: {
    id: 'question',
    name: 'Question',
    structure: ['question_word', 'verb', 'article', 'subject'],
    example: 'Where is the cat?',
    hint: 'Start with a question word!',
    difficulty: 'intermediate',
    points: 25,
    special: true
  }
};

/**
 * Get patterns by difficulty level
 */
export const getPatternsByDifficulty = (difficulty) => {
  return Object.values(patterns).filter(p => p.difficulty === difficulty);
};

/**
 * Get all patterns up to a difficulty level
 */
export const getProgressivePatterns = (maxDifficulty = 'beginner') => {
  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
  const maxIndex = difficultyOrder.indexOf(maxDifficulty);

  if (maxIndex === -1) return getPatternsByDifficulty('beginner');

  return Object.values(patterns).filter(p =>
    difficultyOrder.indexOf(p.difficulty) <= maxIndex
  );
};

/**
 * Validate a sentence against a pattern
 */
export const validateSentence = (words, patternId) => {
  const pattern = patterns[patternId];
  if (!pattern) return { valid: false, error: 'Invalid pattern' };

  const userStructure = words.map(w => w.type);
  const isValid = JSON.stringify(userStructure) === JSON.stringify(pattern.structure);

  return {
    valid: isValid,
    expectedStructure: pattern.structure,
    receivedStructure: userStructure,
    points: isValid ? pattern.points : 0
  };
};

/**
 * Get next suggested pattern based on completed patterns
 */
export const getNextPattern = (completedPatterns) => {
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  for (const difficulty of difficulties) {
    const availablePatterns = getPatternsByDifficulty(difficulty)
      .filter(p => !completedPatterns.includes(p.id));

    if (availablePatterns.length > 0) {
      return availablePatterns[0];
    }
  }

  return patterns.simple; // Default fallback
};

export default patterns;