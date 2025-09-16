/**
 * Color System for Parts of Speech
 * Consistent color coding across all variants
 */

export const partOfSpeechInfo = {
  article: {
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-700',
    label: 'Article (The/A/An)',
    icon: '🔤',
    description: 'Words that introduce nouns'
  },

  subject: {
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    label: 'Subject (Who/What)',
    icon: '👤',
    description: 'The person or thing doing the action'
  },

  verb: {
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
    label: 'Verb (Action)',
    icon: '🏃',
    description: 'The action or state of being'
  },

  adjective: {
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700',
    label: 'Adjective (Describing)',
    icon: '✨',
    description: 'Words that describe nouns'
  },

  object: {
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700',
    label: 'Object (Thing)',
    icon: '📦',
    description: 'The thing receiving the action'
  },

  preposition: {
    color: 'bg-pink-500',
    lightColor: 'bg-pink-100',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-700',
    label: 'Preposition (Position)',
    icon: '📍',
    description: 'Shows relationship between words'
  },

  place: {
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-100',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-700',
    label: 'Place (Where)',
    icon: '🏠',
    description: 'Location where something happens'
  },

  adverb: {
    color: 'bg-teal-500',
    lightColor: 'bg-teal-100',
    borderColor: 'border-teal-500',
    textColor: 'text-teal-700',
    label: 'Adverb (How)',
    icon: '💫',
    description: 'Describes how an action is performed'
  },

  conjunction: {
    color: 'bg-red-500',
    lightColor: 'bg-red-100',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    label: 'Conjunction (Connector)',
    icon: '🔗',
    description: 'Connects words or phrases'
  },

  question_word: {
    color: 'bg-purple-600',
    lightColor: 'bg-purple-100',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-800',
    label: 'Question Word',
    icon: '❓',
    description: 'Words that start questions'
  }
};

/**
 * Get color class for a part of speech
 */
export const getColorClass = (partOfSpeech, variant = 'default') => {
  const info = partOfSpeechInfo[partOfSpeech];
  if (!info) return 'bg-gray-500';

  switch (variant) {
    case 'light':
      return info.lightColor;
    case 'border':
      return info.borderColor;
    case 'text':
      return info.textColor;
    default:
      return info.color;
  }
};

/**
 * Theme variations for different contexts
 */
export const themes = {
  default: {
    background: 'bg-gradient-to-br from-blue-50 to-purple-50',
    card: 'bg-white',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },

  dark: {
    background: 'bg-gradient-to-br from-gray-900 to-gray-800',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-600'
  },

  highContrast: {
    background: 'bg-white',
    card: 'bg-white border-4 border-black',
    text: 'text-black',
    border: 'border-black'
  },

  colorful: {
    background: 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100',
    card: 'bg-white bg-opacity-90',
    text: 'text-gray-800',
    border: 'border-purple-300'
  }
};

/**
 * Get feedback colors based on state
 */
export const getFeedbackColor = (type) => {
  switch (type) {
    case 'success':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-800',
        icon: 'text-green-500'
      };
    case 'error':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-800',
        icon: 'text-red-500'
      };
    case 'hint':
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-500',
        text: 'text-yellow-800',
        icon: 'text-yellow-500'
      };
    case 'info':
      return {
        background: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-800',
        icon: 'text-blue-500'
      };
    default:
      return {
        background: 'bg-gray-50',
        border: 'border-gray-500',
        text: 'text-gray-800',
        icon: 'text-gray-500'
      };
  }
};

export default partOfSpeechInfo;