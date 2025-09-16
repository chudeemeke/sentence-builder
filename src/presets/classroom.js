/**
 * Classroom Preset
 * Optimized for teacher-led instruction with multiple students
 */

export const classroomPreset = {
  name: 'Classroom Learning',
  description: 'Full-featured configuration for classroom use with progress tracking',

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
      leaderboard: true,
      badges: true
    },

    audio: {
      enabled: true,
      effects: true,
      speech: false,  // Can be noisy in classroom
      volume: 0.5
    },

    mascot: {
      enabled: true,
      name: 'Ollie',
      animations: true,
      hints: true,
      encouragement: true
    },

    analytics: {
      enabled: true,
      trackProgress: true,
      trackMistakes: true,
      generateReports: true,
      exportData: true
    },

    parentDashboard: false,  // Teacher dashboard instead
    teacherDashboard: true,

    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      screenReader: true,
      keyboardNav: true
    }
  },

  difficulty: {
    mode: 'progressive',  // 'fixed', 'progressive', 'adaptive'
    startLevel: 'beginner',
    maxLevel: 'advanced',
    autoProgress: true,
    progressThreshold: 5  // Correct sentences before advancing
  },

  ui: {
    theme: 'colorful',
    animations: true,
    celebrations: true,
    confetti: true,
    sounds: true
  },

  patterns: {
    available: 'all',  // 'basic', 'intermediate', 'advanced', 'all'
    startWith: ['simple', 'withAdjective'],
    unlockable: true,
    customPatterns: []
  },

  wordBanks: {
    difficulty: 'progressive',
    allowCustomWords: true,
    showDefinitions: true,
    categories: ['all']
  },

  session: {
    timeLimit: 45,  // minutes
    sentenceGoal: 15,
    pauseEnabled: true,
    saveProgress: true,
    multiUser: true  // Multiple students on same device
  },

  feedback: {
    immediate: true,
    detailed: true,
    hints: 'progressive',  // 'none', 'always', 'progressive'
    corrections: true,
    explanations: true
  },

  sharing: {
    enabled: true,
    screenshots: true,
    certificates: true,
    socialMedia: false,
    email: true
  }
};

export default classroomPreset;