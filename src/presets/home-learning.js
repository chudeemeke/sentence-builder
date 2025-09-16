/**
 * Home Learning Preset
 * Designed for parent-supervised learning at home
 */

export const homeLearningPreset = {
  name: 'Home Learning',
  description: 'Parent-friendly configuration with progress tracking and safety features',

  features: {
    // Core features
    sentenceBuilder: true,
    patternSelector: true,
    wordBanks: true,
    validation: true,

    // Enhanced features
    gamification: {
      enabled: true,
      scoring: true,
      achievements: true,
      streaks: true,
      leaderboard: false,  // No competition at home
      badges: true
    },

    audio: {
      enabled: true,
      effects: true,
      speech: true,  // Text-to-speech for reading assistance
      volume: 0.7
    },

    mascot: {
      enabled: true,
      name: 'Ollie',
      animations: true,
      hints: true,
      encouragement: true,
      bedtimeMode: true  // Calmer animations in evening
    },

    analytics: {
      enabled: true,
      trackProgress: true,
      trackMistakes: true,
      generateReports: true,
      exportData: false
    },

    parentDashboard: true,
    teacherDashboard: false,

    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      screenReader: false,
      keyboardNav: true
    }
  },

  difficulty: {
    mode: 'adaptive',  // Adjusts to child's performance
    startLevel: 'beginner',
    maxLevel: 'intermediate',
    autoProgress: true,
    progressThreshold: 3
  },

  ui: {
    theme: 'default',
    animations: true,
    celebrations: true,
    confetti: true,
    sounds: true
  },

  patterns: {
    available: 'progressive',
    startWith: ['simple'],
    unlockable: true,
    customPatterns: []
  },

  wordBanks: {
    difficulty: 'progressive',
    allowCustomWords: false,  // Parent controls
    showDefinitions: true,
    categories: ['safe']  // Filtered content
  },

  session: {
    timeLimit: 20,  // Shorter sessions
    sentenceGoal: 10,
    pauseEnabled: true,
    saveProgress: true,
    multiUser: false
  },

  feedback: {
    immediate: true,
    detailed: false,  // Simpler feedback
    hints: 'always',
    corrections: true,
    explanations: false
  },

  sharing: {
    enabled: true,
    screenshots: true,
    certificates: true,
    socialMedia: false,  // Child safety
    email: true  // To parents
  },

  safety: {
    parentalControls: true,
    contentFilter: 'strict',
    timeRestrictions: true,
    breakReminders: true,  // Every 15 minutes
    eyeStrainProtection: true
  }
};

export default homeLearningPreset;