# Architecture Overview

## Design Philosophy

The Sentence Builder component library follows a **configuration-driven architecture** with composition-based feature modules. This design enables infinite variants without code duplication while maintaining a single source of truth.

### Key Principles

1. **Single Component, Multiple Configurations**: One main component that adapts based on configuration
2. **Feature Composition**: Features are modular and can be mixed and matched
3. **Preset System**: Pre-configured settings for common use cases
4. **Progressive Enhancement**: Start simple, add features as needed
5. **No Version Names**: Variants are named by purpose, not version numbers

## Component Architecture

```
┌─────────────────────────────────────────┐
│         SentenceBuilder (Main)          │
│  ┌───────────────────────────────────┐  │
│  │        Configuration Layer        │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │         Feature Modules           │  │
│  │  ┌──────┐ ┌──────┐ ┌──────────┐  │  │
│  │  │Gaming│ │Audio │ │Analytics │  │  │
│  │  └──────┘ └──────┘ └──────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │           Core Engine             │  │
│  │  (Sentence validation, patterns)  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── components/           # React components
│   └── sentence-builder/
│       ├── SentenceBuilder.jsx         # Main configurable component
│       ├── index.js                    # Exports
│       └── variants/                   # Specific implementations
│           ├── basic.jsx               # Minimal features
│           └── professional.jsx        # Advanced features
│
├── features/            # Composable feature modules
│   ├── gamification/    # Scoring, achievements, badges
│   ├── audio/           # Sound effects and synthesis
│   ├── mascot/          # Ollie the owl guide
│   └── analytics/       # Progress tracking
│
├── presets/            # Pre-configured settings
│   ├── classroom.js     # Teacher-led instruction
│   ├── home-learning.js # Parent supervision
│   ├── quick-practice.js # 5-minute sessions
│   └── accessibility.js # Enhanced accessibility
│
├── hooks/              # Reusable React hooks
│   ├── useSentenceValidation.js
│   ├── useAudioEffects.js
│   └── useProgressPersistence.js
│
├── utils/              # Shared utilities
│   ├── word-banks.js    # Vocabulary database
│   ├── sentence-patterns.js # Grammar patterns
│   └── colors.js        # Theming system
│
└── styles/             # Styling system
    └── themes/         # Visual themes
```

## Configuration Schema

```javascript
{
  // Component metadata
  name: string,
  description: string,

  // Feature toggles
  features: {
    sentenceBuilder: boolean,
    gamification: {
      enabled: boolean,
      scoring: boolean,
      achievements: boolean,
      // ...
    },
    audio: {
      enabled: boolean,
      effects: boolean,
      speech: boolean,
      // ...
    },
    // ...
  },

  // Difficulty settings
  difficulty: {
    mode: 'fixed' | 'progressive' | 'adaptive',
    startLevel: 'beginner' | 'intermediate' | 'advanced',
    // ...
  },

  // UI customization
  ui: {
    theme: string,
    animations: boolean,
    // ...
  },

  // Content configuration
  patterns: {
    available: string | array,
    startWith: array,
    // ...
  },

  // Session management
  session: {
    timeLimit: number,
    sentenceGoal: number,
    // ...
  }
}
```

## Feature Modules

### Gamification Module
```javascript
features/gamification/
├── scoring.js       # Point calculation
├── achievements.js  # Achievement system
├── streaks.js      # Streak tracking
└── badges.js       # Badge awards
```

### Audio Module
```javascript
features/audio/
├── synthesis.js    # Sound generation
├── effects.js      # Sound effects
└── speech.js       # Text-to-speech
```

## Data Flow

1. **Configuration Input**: Component receives configuration prop
2. **Feature Resolution**: Configuration determines which features load
3. **State Management**: Features manage their own state internally
4. **Event System**: Features communicate through event emitters
5. **Rendering**: Main component renders based on active features

## State Management

Each feature module manages its own state:

```javascript
// In feature module
const useGamificationState = () => {
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  // ...
  return { score, achievements, /* ... */ };
};
```

Main component aggregates feature states:

```javascript
// In main component
const SentenceBuilder = ({ config }) => {
  const gamification = config.features.gamification.enabled
    ? useGamificationState()
    : null;
  // ...
};
```

## Performance Optimization

1. **Code Splitting**: Features loaded on demand
2. **Tree Shaking**: Unused features eliminated in build
3. **Lazy Loading**: Heavy features loaded when needed
4. **Memoization**: Expensive computations cached
5. **Virtual DOM**: React's efficient rendering

## Extension Points

### Adding New Features

1. Create feature module in `/features`
2. Add feature configuration schema
3. Import in main component
4. Create preset showcasing feature

### Adding New Presets

1. Create preset file in `/presets`
2. Define complete configuration
3. Export from presets index
4. Document use case

### Adding New Variants

1. Create variant in `/variants`
2. Export from component index
3. Document differences
4. Consider if preset would be better

## Build System

- **Development**: Vite for fast HMR
- **Production**: Optimized bundles
- **Library**: UMD and ES module builds
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with React rules
- **Formatting**: Prettier

## Best Practices

1. **Feature Independence**: Features should work standalone
2. **Configuration Validation**: Validate configs at runtime
3. **Progressive Enhancement**: Core works without features
4. **Accessibility First**: All features accessible
5. **Performance Budget**: Monitor bundle size
6. **Documentation**: Keep docs in sync with code