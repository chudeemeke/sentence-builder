# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based educational application for teaching sentence construction to children. The project provides a single component with two implementation variants:

### File Structure
```
/src
  /components
    /sentence-builder
      sentence-builder.jsx    # Main implementation with full features
      index.jsx              # Component exports
      /variants
        basic.jsx           # Simplified version for younger children
        professional.jsx    # Advanced version with analytics
  /features              # Modular feature implementations
  /presets              # Pre-configured settings for common use cases
  /hooks                # Reusable React hooks
  /utils                # Shared utilities (word banks, patterns, colors)
  /styles               # Theming and styling system
/config                 # Build configuration
/docs                   # Architecture and evolution guides
/examples              # Usage examples
/tests                 # Test suites
```

### Component Variants

1. **Main Implementation** (`sentence-builder.jsx`) - Full-featured version with gamification, achievements, and advanced features
2. **Basic Variant** (`variants/basic.jsx`) - Simplified version for younger kids with essential patterns only
3. **Professional Variant** (`variants/professional.jsx`) - Advanced version with analytics, portfolio tracking, and competitive features

## Architecture

### Component Structure

Both components are self-contained React functional components using hooks:
- State management via `useState`
- Side effects via `useEffect` and `useRef`
- No external state management library
- Components are exported as default exports

### Key Features

**Core Functionality:**
- Sentence pattern templates (simple, with adjectives, with objects, with places, complete)
- Word banks organized by parts of speech (article, subject, verb, adjective, object, preposition, place)
- Real-time sentence validation against patterns
- Visual feedback system with color-coded parts of speech

**Enhanced Version Additional Features:**
- Gamification with scoring, streaks, and achievements
- Owl mascot (Ollie) for guidance
- Parent dashboard for progress tracking
- Audio synthesis for sound effects
- Touch/drag support for mobile devices
- Progressive difficulty levels
- Unlockable content system

### Styling Approach

- Tailwind CSS utility classes for styling
- No external CSS files
- Color-coded system for parts of speech
- Responsive design with mobile-first approach
- Gradient backgrounds and shadow effects for modern UI

## Commands

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run build:lib   # Build as library
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code
```

## Development Notes

### Running the Application

These are standalone React components that need to be integrated into a React application with:
- React 16.8+ (for hooks support)
- Tailwind CSS configured
- Lucide React icons library

### Key Considerations

1. **No Package.json** - This is a component library, not a standalone application
2. **Audio Context** - Enhanced version uses Web Audio API for sound synthesis
3. **Local Storage** - Enhanced version uses localStorage for progress persistence
4. **Touch Events** - Enhanced version includes touch/drag support for tablet use

### Component Integration

To use these components in a React app:

```jsx
// Import default (main implementation)
import SentenceBuilder from './components/sentence-builder';

// Or import specific variants
import { SentenceBuilder, BasicSentenceBuilder } from './components/sentence-builder';

// Use in your app
<SentenceBuilder />        // Full-featured version
<BasicSentenceBuilder />   // Simplified version
```

### State Management

Both components manage their own state internally with no props required. State includes:
- Selected words array
- Current sentence pattern
- Score and achievements
- UI state (hints, feedback, modals)

### Future Modifications

When modifying:
1. Maintain the self-contained nature of components
2. Keep color coding consistent across parts of speech
3. Ensure mobile responsiveness is preserved
4. Test audio features in different browsers
5. Consider accessibility when adding features