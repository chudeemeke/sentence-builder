/**
 * Sentence Builder Component Exports
 *
 * This component helps children learn sentence construction through interactive building.
 * Multiple implementations are available based on the target audience and feature requirements.
 */

// Main implementation with full features including gamification, achievements, and audio
export { default as SentenceBuilder } from './sentence-builder.jsx';

// Simplified implementation for younger children or basic educational needs
export { default as BasicSentenceBuilder } from './variants/basic.jsx';

// Professional implementation with advanced analytics and competitive features
export { default as ProfessionalSentenceBuilder } from './variants/professional.jsx';

// Extended implementation with comprehensive features for advanced learning
export { default as ExtendedSentenceBuilder } from './variants/extended.jsx';

// Default export is the main implementation
export { default } from './sentence-builder.jsx';

/**
 * Usage Examples:
 *
 * // Import the main version (recommended for most use cases)
 * import SentenceBuilder from './components/sentence-builder';
 *
 * // Import specific implementations
 * import { SentenceBuilder, BasicSentenceBuilder, ProfessionalSentenceBuilder } from './components/sentence-builder';
 *
 * // Use in your app
 * <SentenceBuilder />              // Full-featured version with gamification
 * <BasicSentenceBuilder />         // Simplified version for younger kids
 * <ProfessionalSentenceBuilder />  // Advanced version with analytics
 */