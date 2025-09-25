# Sentence Builder

An interactive educational React component library for teaching sentence construction through hands-on building. Features multiple implementation variants optimized for different learning contexts and age groups.

## Features

### Core Capabilities
- Interactive sentence building with drag-and-drop
- Color-coded parts of speech
- Real-time validation and feedback
- Progressive difficulty levels
- Multiple sentence patterns

### Available Variants

#### 1. **Standard** (`SentenceBuilder`)
Full-featured implementation with gamification, achievements, and audio feedback. Perfect for engaged learning sessions.

#### 2. **Basic** (`BasicSentenceBuilder`)
Streamlined version focusing on core learning mechanics. Ideal for younger children or distraction-free learning.

#### 3. **Professional** (`ProfessionalSentenceBuilder`)
Advanced implementation with analytics, portfolio tracking, and competitive features. Designed for older students and academic settings.

## Installation

```bash
npm install sentence-builder
```

## Quick Start

### Using Default Configuration

```jsx
import SentenceBuilder from 'sentence-builder';

function App() {
  return <SentenceBuilder />;
}
```

### Using Specific Variants

```jsx
import {
  BasicSentenceBuilder,
  ProfessionalSentenceBuilder
} from 'sentence-builder';

function App() {
  return (
    <>
      {/* For younger children */}
      <BasicSentenceBuilder />

      {/* For advanced students */}
      <ProfessionalSentenceBuilder />
    </>
  );
}
```

### Using Presets

```jsx
import SentenceBuilder from 'sentence-builder';
import { presets } from 'sentence-builder/presets';

function App() {
  return (
    <>
      {/* Classroom setting */}
      <SentenceBuilder config={presets.classroom} />

      {/* Home learning */}
      <SentenceBuilder config={presets.homeLearning} />

      {/* Quick 5-minute practice */}
      <SentenceBuilder config={presets.quickPractice} />

      {/* Accessibility-focused */}
      <SentenceBuilder config={presets.accessibility} />
    </>
  );
}
```

### Custom Configuration

```jsx
import SentenceBuilder from 'sentence-builder';
import { mergePreset } from 'sentence-builder/presets';

function App() {
  const customConfig = mergePreset('homeLearning', {
    features: {
      gamification: {
        badges: false,
        leaderboard: true
      }
    },
    ui: {
      theme: 'dark'
    }
  });

  return <SentenceBuilder config={customConfig} />;
}
```

## Configuration Options

### Features
- `sentenceBuilder`: Core building functionality
- `gamification`: Points, achievements, streaks
- `audio`: Sound effects and text-to-speech
- `mascot`: Interactive guide character
- `analytics`: Progress tracking and reports
- `accessibility`: Enhanced accessibility features

### Difficulty Settings
- `mode`: 'fixed', 'progressive', or 'adaptive'
- `startLevel`: 'beginner', 'intermediate', or 'advanced'
- `autoProgress`: Automatic difficulty adjustment

### UI Customization
- `theme`: Visual theme selection
- `animations`: Enable/disable animations
- `celebrations`: Success animations and effects

## Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure
```
sentence-builder/
├── src/
│   ├── components/
│   │   └── sentence-builder/
│   │       ├── sentence-builder.jsx      # Main implementation
│   │       ├── index.jsx                 # Exports
│   │       └── variants/                 # Alternative implementations
│   │           ├── basic.jsx
│   │           └── professional.jsx
│   ├── features/                        # Modular features
│   ├── presets/                         # Configuration presets
│   ├── hooks/                           # Reusable React hooks
│   ├── utils/                           # Utilities
│   └── styles/                          # Styling system
├── docs/                                # Documentation
├── examples/                            # Usage examples
└── tests/                              # Test files
```

## Adding New Features

1. Create a feature module in `/src/features`
2. Update the main component to use the feature when configured
3. Create a new preset showcasing the feature
4. Document in `/docs/EVOLUTION-GUIDE.md`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

MIT © Chude
## 🤖 CI/CD Auto-Fix

This repository uses Claude AI to automatically fix CI/CD failures.
If builds fail, Claude will automatically create a fix PR.

