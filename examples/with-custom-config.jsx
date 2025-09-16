/**
 * Custom Configuration Examples
 * Shows how to use presets and custom configurations
 */

import React, { useState } from 'react';
import SentenceBuilder from '../src/components/sentence-builder';
import {
  presets,
  mergePreset,
  getPreset
} from '../src/presets';

// Example 1: Using Presets Directly
export const PresetExamples = () => {
  const [currentPreset, setCurrentPreset] = useState('homeLearning');

  return (
    <div className="preset-examples">
      <h1>Sentence Builder with Different Presets</h1>

      {/* Preset Selector */}
      <div className="preset-selector">
        <label>Choose a preset: </label>
        <select
          value={currentPreset}
          onChange={(e) => setCurrentPreset(e.target.value)}
        >
          <option value="classroom">Classroom</option>
          <option value="homeLearning">Home Learning</option>
          <option value="quickPractice">Quick Practice</option>
          <option value="accessibility">Accessibility</option>
        </select>
      </div>

      {/* Component with selected preset */}
      <SentenceBuilder config={presets[currentPreset]} />
    </div>
  );
};

// Example 2: Custom Configuration
export const CustomConfigExample = () => {
  const customConfig = {
    name: 'Custom Configuration',
    description: 'A tailored configuration for specific needs',

    features: {
      sentenceBuilder: true,
      patternSelector: true,
      wordBanks: true,
      validation: true,

      gamification: {
        enabled: true,
        scoring: true,
        achievements: false,  // Disabled
        streaks: true,
        leaderboard: false,
        badges: true
      },

      audio: {
        enabled: false,  // No audio
      },

      mascot: {
        enabled: true,
        name: 'Helper',
        animations: false,
        hints: true,
        encouragement: false
      },

      analytics: {
        enabled: true,
        trackProgress: true,
        trackMistakes: false,
        generateReports: false,
        exportData: false
      }
    },

    difficulty: {
      mode: 'fixed',
      startLevel: 'intermediate',
      maxLevel: 'intermediate',
      autoProgress: false
    },

    ui: {
      theme: 'default',
      animations: true,
      celebrations: false,
      confetti: false,
      sounds: false
    },

    patterns: {
      available: ['simple', 'withAdjective', 'withObject'],
      startWith: ['simple'],
      unlockable: false
    },

    session: {
      timeLimit: null,
      sentenceGoal: 10,
      pauseEnabled: true,
      saveProgress: true,
      multiUser: false
    }
  };

  return (
    <div>
      <h1>Custom Configuration Example</h1>
      <SentenceBuilder config={customConfig} />
    </div>
  );
};

// Example 3: Merging Preset with Overrides
export const MergedConfigExample = () => {
  // Start with home learning preset and customize
  const config = mergePreset('homeLearning', {
    features: {
      audio: {
        enabled: false  // Disable audio
      },
      gamification: {
        badges: true,
        leaderboard: true  // Add competition
      }
    },
    ui: {
      theme: 'colorful'  // Change theme
    },
    session: {
      timeLimit: 30  // Longer sessions
    }
  });

  return (
    <div>
      <h1>Modified Home Learning Preset</h1>
      <p>Home learning preset with competition features and longer sessions</p>
      <SentenceBuilder config={config} />
    </div>
  );
};

// Example 4: Dynamic Configuration Based on User Type
export const DynamicConfigExample = () => {
  const [userType, setUserType] = useState('student');

  const getConfigForUserType = (type) => {
    switch (type) {
      case 'teacher':
        return mergePreset('classroom', {
          features: {
            teacherDashboard: true,
            analytics: {
              generateReports: true,
              exportData: true
            }
          }
        });

      case 'parent':
        return mergePreset('homeLearning', {
          features: {
            parentDashboard: true,
            safety: {
              parentalControls: true,
              timeRestrictions: true
            }
          }
        });

      case 'student':
      default:
        return presets.quickPractice;
    }
  };

  return (
    <div>
      <h1>Dynamic Configuration by User Type</h1>

      <div className="user-selector">
        <button
          onClick={() => setUserType('student')}
          className={userType === 'student' ? 'active' : ''}
        >
          Student
        </button>
        <button
          onClick={() => setUserType('teacher')}
          className={userType === 'teacher' ? 'active' : ''}
        >
          Teacher
        </button>
        <button
          onClick={() => setUserType('parent')}
          className={userType === 'parent' ? 'active' : ''}
        >
          Parent
        </button>
      </div>

      <SentenceBuilder config={getConfigForUserType(userType)} />
    </div>
  );
};

// Example 5: Progressive Difficulty Configuration
export const ProgressiveDifficultyExample = () => {
  const [level, setLevel] = useState(1);

  const getLevelConfig = (currentLevel) => {
    const baseConfig = getPreset('homeLearning');

    return mergePreset(baseConfig, {
      difficulty: {
        mode: 'fixed',
        startLevel: currentLevel <= 3 ? 'beginner' :
                   currentLevel <= 6 ? 'intermediate' : 'advanced',
        maxLevel: 'advanced'
      },
      patterns: {
        available: currentLevel <= 3 ? 'basic' :
                  currentLevel <= 6 ? 'intermediate' : 'all'
      },
      features: {
        gamification: {
          achievements: currentLevel >= 3,
          leaderboard: currentLevel >= 5
        }
      }
    });
  };

  return (
    <div>
      <h1>Progressive Difficulty Example</h1>
      <div className="level-display">
        <p>Current Level: {level}</p>
        <button onClick={() => setLevel(Math.max(1, level - 1))}>
          Previous Level
        </button>
        <button onClick={() => setLevel(Math.min(10, level + 1))}>
          Next Level
        </button>
      </div>

      <SentenceBuilder config={getLevelConfig(level)} />
    </div>
  );
};

// Example 6: Environment-Based Configuration
export const EnvironmentConfigExample = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

  const config = mergePreset('classroom', {
    features: {
      // Enable debug features in development
      debug: isDevelopment,

      // Optimize for tablet
      touch: {
        enabled: isTablet,
        dragAndDrop: isTablet,
        gestures: isTablet
      }
    },

    ui: {
      // Larger UI elements for tablet
      scale: isTablet ? 1.2 : 1.0
    }
  });

  return (
    <div>
      <h1>Environment-Aware Configuration</h1>
      <p>Automatically adjusts for development mode and device type</p>
      <SentenceBuilder config={config} />
    </div>
  );
};

// Export all examples
export default {
  PresetExamples,
  CustomConfigExample,
  MergedConfigExample,
  DynamicConfigExample,
  ProgressiveDifficultyExample,
  EnvironmentConfigExample
};