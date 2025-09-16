/**
 * Preset Configurations for Sentence Builder
 *
 * Presets provide ready-made configurations for different use cases.
 * Each preset is a complete configuration object that can be passed
 * to the SentenceBuilder component.
 */

import classroomPreset from './classroom.js';
import homeLearningPreset from './home-learning.js';
import quickPracticePreset from './quick-practice.js';
import accessibilityPreset from './accessibility.js';

// Export individual presets
export {
  classroomPreset,
  homeLearningPreset,
  quickPracticePreset,
  accessibilityPreset
};

// Export as a collection for easy selection
export const presets = {
  classroom: classroomPreset,
  homeLearning: homeLearningPreset,
  quickPractice: quickPracticePreset,
  accessibility: accessibilityPreset
};

/**
 * Get a preset by name
 * @param {string} name - The preset name
 * @returns {Object} The preset configuration
 */
export const getPreset = (name) => {
  return presets[name] || presets.homeLearning;
};

/**
 * Merge a preset with custom overrides
 * @param {string|Object} preset - Preset name or object
 * @param {Object} overrides - Custom configuration overrides
 * @returns {Object} Merged configuration
 */
export const mergePreset = (preset, overrides = {}) => {
  const basePreset = typeof preset === 'string' ? getPreset(preset) : preset;

  // Deep merge function
  const deepMerge = (target, source) => {
    const output = { ...target };

    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });

    return output;
  };

  return deepMerge(basePreset, overrides);
};

/**
 * Validate a configuration object
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateConfig = (config) => {
  const errors = [];

  // Required top-level properties
  const required = ['name', 'features', 'difficulty', 'ui'];
  required.forEach(prop => {
    if (!config[prop]) {
      errors.push(`Missing required property: ${prop}`);
    }
  });

  // Validate features
  if (config.features) {
    if (!config.features.sentenceBuilder) {
      errors.push('sentenceBuilder feature must be enabled');
    }
  }

  // Validate difficulty
  if (config.difficulty) {
    const validModes = ['fixed', 'progressive', 'adaptive'];
    if (!validModes.includes(config.difficulty.mode)) {
      errors.push(`Invalid difficulty mode: ${config.difficulty.mode}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Default export is the presets collection
export default presets;