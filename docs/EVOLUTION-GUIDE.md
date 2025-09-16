# Evolution Guide

This guide explains how to evolve the Sentence Builder component by adding new features, creating variants, or enhancing existing functionality.

## Core Philosophy

**IMPORTANT**: Following the WoW (Ways of Working) principles:
- **No version numbers in filenames** - Use descriptive names based on purpose
- **Prefer enhancement over duplication** - Extend existing code rather than creating new files
- **Configuration over proliferation** - Use presets instead of creating variant files
- **Single source of truth** - One main component, multiple configurations

## Adding New Features

### Step 1: Create Feature Module

Create a new feature in `/src/features/{feature-name}/`:

```javascript
// src/features/voice-recognition/index.js
export const useVoiceRecognition = (config) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Feature implementation
  const startListening = () => {
    // ...
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};
```

### Step 2: Update Configuration Schema

Add feature configuration options:

```javascript
// In configuration schema
features: {
  voiceRecognition: {
    enabled: boolean,
    language: string,
    continuous: boolean,
    autoStop: boolean
  }
}
```

### Step 3: Integrate in Main Component

```javascript
// In SentenceBuilder.jsx
import { useVoiceRecognition } from '../features/voice-recognition';

const SentenceBuilder = ({ config }) => {
  // Conditionally use feature
  const voice = config.features.voiceRecognition?.enabled
    ? useVoiceRecognition(config.features.voiceRecognition)
    : null;

  // Use in component
  if (voice) {
    // Render voice UI
  }
};
```

### Step 4: Create Preset Showcasing Feature

```javascript
// src/presets/voice-enabled.js
export const voiceEnabledPreset = {
  name: 'Voice-Enabled Learning',
  features: {
    voiceRecognition: {
      enabled: true,
      language: 'en-US',
      continuous: false,
      autoStop: true
    },
    // ... other features
  }
};
```

### Step 5: Document Feature

Update documentation:
- Add to README.md features list
- Document in ARCHITECTURE.md
- Add usage example

## Creating New Presets

Presets are the preferred way to create variants:

```javascript
// src/presets/exam-practice.js
export const examPracticePreset = {
  name: 'Exam Practice Mode',
  description: 'Timed practice with exam-like conditions',

  features: {
    timer: {
      enabled: true,
      duration: 30,
      warnings: [10, 5, 1]
    },
    hints: {
      enabled: false  // No hints in exam mode
    },
    scoring: {
      strict: true,
      partial: false
    }
  },

  ui: {
    distractions: false,
    minimal: true
  }
};
```

## Enhancing Existing Features

### Option 1: Extend Feature Module

```javascript
// In features/gamification/achievements.js
// ADD new achievement types, don't create new file
export const achievementTypes = {
  // Existing
  FIRST_SENTENCE: { /* ... */ },
  PERFECT_STREAK: { /* ... */ },

  // New additions
  VOCABULARY_MASTER: {
    id: 'vocab-master',
    name: 'Vocabulary Master',
    condition: (stats) => stats.uniqueWords > 100
  }
};
```

### Option 2: Add Feature Flags

```javascript
// In configuration
features: {
  gamification: {
    enabled: true,
    // New flag for enhanced feature
    advancedAchievements: true
  }
}
```

## Migration Strategy for Updates

When significantly changing functionality:

### 1. Deprecation Approach

```javascript
// In component
if (config.legacyMode) {
  console.warn('Legacy mode is deprecated and will be removed in next version');
  return <LegacyImplementation />;
}
```

### 2. Progressive Enhancement

```javascript
// Start with basic, add features progressively
const baseFeatures = getBaseFeatures(config);
const enhancedFeatures = config.advanced
  ? getEnhancedFeatures(config)
  : {};

const allFeatures = { ...baseFeatures, ...enhancedFeatures };
```

### 3. Configuration Migration

```javascript
// src/utils/config-migration.js
export const migrateConfig = (oldConfig) => {
  // Map old structure to new
  if (oldConfig.version === 1) {
    return {
      ...oldConfig,
      features: mapOldFeatures(oldConfig.features),
      version: 2
    };
  }
  return oldConfig;
};
```

## Common Evolution Patterns

### Pattern 1: Feature Composition

Instead of creating new variants, compose features:

```javascript
// Compose multiple features
const config = mergeConfigs(
  presets.basic,
  { features: { audio: audioConfig } },
  { features: { analytics: analyticsConfig } }
);
```

### Pattern 2: Conditional Features

Features that activate based on conditions:

```javascript
features: {
  adaptiveDifficulty: {
    enabled: true,
    triggers: {
      onStreak: 5,      // Increase difficulty after 5 correct
      onMistakes: 3     // Decrease after 3 mistakes
    }
  }
}
```

### Pattern 3: Plugin System

For external features:

```javascript
// src/plugins/index.js
export const registerPlugin = (name, plugin) => {
  plugins[name] = plugin;
};

// Usage
registerPlugin('customAnimation', {
  init: (config) => { /* ... */ },
  render: (props) => { /* ... */ }
});
```

## Testing New Features

### Unit Tests

```javascript
// tests/features/voice-recognition.test.js
describe('Voice Recognition Feature', () => {
  it('should initialize when enabled', () => {
    const config = { enabled: true };
    const { result } = renderHook(() =>
      useVoiceRecognition(config)
    );
    expect(result.current.isListening).toBe(false);
  });
});
```

### Integration Tests

```javascript
// tests/integration/voice-preset.test.js
it('should work with voice-enabled preset', () => {
  render(<SentenceBuilder config={voiceEnabledPreset} />);
  // Test integration
});
```

## Deployment Considerations

### Bundle Size

Monitor feature impact:

```javascript
// Check bundle size
npm run build -- --analyze
```

### Feature Flags in Production

```javascript
// Use environment variables
features: {
  experimental: process.env.ENABLE_EXPERIMENTAL === 'true'
}
```

### Gradual Rollout

```javascript
// Percentage-based rollout
features: {
  newFeature: {
    enabled: Math.random() < 0.1  // 10% of users
  }
}
```

## Checklist for New Features

- [ ] Feature module created in `/features`
- [ ] Configuration schema updated
- [ ] Main component integration
- [ ] Preset created showcasing feature
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Documentation updated
- [ ] Bundle size checked
- [ ] Accessibility verified
- [ ] Performance impact measured

## Anti-Patterns to Avoid

❌ **Don't**: Create `sentence-builder-v2.jsx`
✅ **Do**: Enhance existing component with configuration

❌ **Don't**: Duplicate entire component for small change
✅ **Do**: Add configuration flag for the change

❌ **Don't**: Create `sentence-builder-with-[feature].jsx`
✅ **Do**: Create preset with feature enabled

❌ **Don't**: Break existing presets
✅ **Do**: Maintain backward compatibility

## Future-Proofing

1. **Design for Extension**: Make features pluggable
2. **Configuration First**: Changes through config, not code
3. **Preserve Compatibility**: Don't break existing uses
4. **Document Changes**: Keep evolution history
5. **Measure Impact**: Track performance and usage