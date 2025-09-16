/**
 * Quick Practice Preset
 * Optimized for 5-10 minute practice sessions
 */

export const quickPracticePreset = {
  name: 'Quick Practice',
  description: 'Streamlined configuration for short practice sessions',

  features: {
    // Core features only
    sentenceBuilder: true,
    patternSelector: true,
    wordBanks: true,
    validation: true,

    // Minimal enhanced features
    gamification: {
      enabled: true,
      scoring: true,
      achievements: false,  // Too distracting for quick sessions
      streaks: true,
      leaderboard: false,
      badges: false
    },

    audio: {
      enabled: true,
      effects: true,
      speech: false,
      volume: 0.3  // Quieter for focus
    },

    mascot: {
      enabled: false,  // Minimize distractions
      name: null,
      animations: false,
      hints: false,
      encouragement: false
    },

    analytics: {
      enabled: false,  // Not needed for quick practice
      trackProgress: false,
      trackMistakes: false,
      generateReports: false,
      exportData: false
    },

    parentDashboard: false,
    teacherDashboard: false,

    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      screenReader: false,
      keyboardNav: true
    }
  },

  difficulty: {
    mode: 'fixed',  // Stay at one level
    startLevel: 'beginner',
    maxLevel: 'beginner',
    autoProgress: false,
    progressThreshold: null
  },

  ui: {
    theme: 'default',
    animations: false,  // Faster interactions
    celebrations: false,  // Quick feedback only
    confetti: false,
    sounds: true
  },

  patterns: {
    available: 'basic',
    startWith: ['simple', 'withAdjective', 'withObject'],
    unlockable: false,
    customPatterns: []
  },

  wordBanks: {
    difficulty: 'basic',
    allowCustomWords: false,
    showDefinitions: false,  // Save time
    categories: ['basic']
  },

  session: {
    timeLimit: 5,  // 5 minutes
    sentenceGoal: 5,
    pauseEnabled: false,
    saveProgress: false,  // No need for quick sessions
    multiUser: false
  },

  feedback: {
    immediate: true,
    detailed: false,  // Quick feedback only
    hints: 'none',
    corrections: true,
    explanations: false
  },

  sharing: {
    enabled: false,  // Not for quick practice
    screenshots: false,
    certificates: false,
    socialMedia: false,
    email: false
  }
};

export default quickPracticePreset;