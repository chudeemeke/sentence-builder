/**
 * Accessibility Preset
 * Optimized for users with visual, motor, or cognitive accessibility needs
 */

export const accessibilityPreset = {
  name: 'Accessibility Focus',
  description: 'Enhanced accessibility features for inclusive learning',

  features: {
    // Core features
    sentenceBuilder: true,
    patternSelector: true,
    wordBanks: true,
    validation: true,

    // Carefully selected enhanced features
    gamification: {
      enabled: true,
      scoring: true,
      achievements: true,
      streaks: false,  // Can add pressure
      leaderboard: false,  // Avoid competition stress
      badges: true
    },

    audio: {
      enabled: true,
      effects: true,
      speech: true,  // Essential for screen readers
      volume: 0.8,
      announcements: true,  // Verbal feedback
      descriptions: true  // Describe visual elements
    },

    mascot: {
      enabled: true,
      name: 'Ollie',
      animations: false,  // Can be distracting
      hints: true,
      encouragement: true,
      simpleMode: true  // Clear, simple messages
    },

    analytics: {
      enabled: true,
      trackProgress: true,
      trackMistakes: true,
      generateReports: true,
      exportData: true
    },

    parentDashboard: true,
    teacherDashboard: false,

    accessibility: {
      highContrast: true,
      fontSize: 'large',  // Or 'extra-large'
      screenReader: true,
      keyboardNav: true,
      focusIndicators: 'enhanced',
      colorBlindMode: true,
      dyslexiaFont: true,
      reducedMotion: true
    }
  },

  difficulty: {
    mode: 'fixed',  // Consistent experience
    startLevel: 'beginner',
    maxLevel: 'intermediate',
    autoProgress: false,  // Manual control
    progressThreshold: null
  },

  ui: {
    theme: 'highContrast',
    animations: false,  // Reduced motion
    celebrations: true,  // But simplified
    confetti: false,  // Can be overwhelming
    sounds: true
  },

  patterns: {
    available: 'progressive',
    startWith: ['simple'],
    unlockable: true,
    customPatterns: []
  },

  wordBanks: {
    difficulty: 'basic',
    allowCustomWords: true,
    showDefinitions: true,  // Important for understanding
    categories: ['accessible']  // Clear, simple words
  },

  session: {
    timeLimit: null,  // No pressure
    sentenceGoal: null,  // Work at own pace
    pauseEnabled: true,
    saveProgress: true,
    multiUser: false
  },

  feedback: {
    immediate: true,
    detailed: true,  // Clear explanations
    hints: 'always',
    corrections: true,
    explanations: true,
    multiModal: true  // Visual + audio feedback
  },

  sharing: {
    enabled: true,
    screenshots: true,
    certificates: true,
    socialMedia: false,
    email: true
  },

  accessibility_specific: {
    // Screen reader announcements
    ariaLive: 'polite',
    ariaDescriptions: true,

    // Keyboard navigation
    tabOrder: 'logical',
    shortcuts: true,
    skipLinks: true,

    // Visual adjustments
    textSpacing: 'increased',
    lineHeight: 1.5,
    paragraphSpacing: 'double',

    // Interaction adjustments
    clickTargetSize: 'large',  // 44x44 minimum
    doubleClickTime: 'extended',
    hoverDelay: 'reduced',

    // Cognitive support
    clearInstructions: true,
    consistentLayout: true,
    errorPrevention: true,
    confirmActions: true
  }
};

export default accessibilityPreset;