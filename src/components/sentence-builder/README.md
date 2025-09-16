# Sentence Builder Component

An interactive educational React component for teaching children sentence construction through hands-on building.

## Component Variants

This component provides two implementations optimized for different use cases:

### Main Implementation (sentence-builder.jsx)

The primary version includes comprehensive features for engaged learning:

**Features:**
- **Gamification System**: Points, streaks, achievements, and badges
- **Owl Mascot (Ollie)**: Interactive guide providing encouragement and hints
- **Audio Feedback**: Synthesized sound effects for actions and celebrations
- **Progressive Difficulty**: Adapts to child's skill level
- **Parent Dashboard**: Track progress and learning patterns
- **Touch Support**: Optimized for tablet interactions
- **Unlockable Content**: New words and patterns unlock with progress
- **Visual Celebrations**: Animated rewards for achievements

**Best For:**
- Ages 8-12
- Extended learning sessions
- Classroom or home use with progress tracking
- Children comfortable with game-like interfaces

### Basic Variant (variants/basic.jsx)

A streamlined version focusing on core learning mechanics:

**Features:**
- **Core Sentence Patterns**: Simple, adjective, object, and place patterns
- **Color-Coded Parts of Speech**: Visual learning through consistent colors
- **Immediate Feedback**: Clear success/error indicators
- **Basic Scoring**: Simple point system
- **Hint System**: Contextual help for each pattern
- **Clean Interface**: Minimal distractions

**Best For:**
- Ages 5-8
- Introduction to sentence structure
- Quick learning sessions
- Children who need fewer distractions

## Implementation Differences

| Feature | Main Version | Basic Variant |
|---------|--------------|---------------|
| Gamification | Full system with badges | Simple scoring |
| Audio | Synthesized effects | None |
| Mascot | Interactive Ollie | None |
| Difficulty Levels | Progressive | Fixed |
| Parent Dashboard | Yes | No |
| Touch/Drag | Full support | Click only |
| Animations | Extensive | Minimal |
| Code Size | ~900 lines | ~300 lines |
| Dependencies | More complex | Minimal |

## Choosing the Right Variant

**Use the Main Implementation when:**
- Building a comprehensive educational app
- You need progress tracking and reporting
- Target audience enjoys gamified learning
- Tablets or touchscreens are primary devices

**Use the Basic Variant when:**
- Simplicity is prioritized
- Building a lightweight educational tool
- Working with younger children
- Minimal dependencies are required

## Technical Notes

Both variants:
- Are self-contained React functional components
- Require no props for basic operation
- Use React hooks for state management
- Style with Tailwind CSS utilities
- Export as default modules

The main implementation additionally:
- Uses Web Audio API
- Implements localStorage for persistence
- Handles touch events
- Manages complex state machines