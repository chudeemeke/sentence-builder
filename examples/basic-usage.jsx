/**
 * Basic Usage Examples
 * Simple implementations of the Sentence Builder component
 */

import React from 'react';
import SentenceBuilder from '../src/components/sentence-builder';
import { BasicSentenceBuilder, ProfessionalSentenceBuilder } from '../src/components/sentence-builder';

// Example 1: Default Usage
export const DefaultExample = () => {
  return (
    <div className="app">
      <h1>Sentence Builder - Default Configuration</h1>
      <SentenceBuilder />
    </div>
  );
};

// Example 2: Basic Variant for Young Children
export const BasicExample = () => {
  return (
    <div className="app">
      <h1>Simple Sentence Builder</h1>
      <p>Perfect for ages 5-8</p>
      <BasicSentenceBuilder />
    </div>
  );
};

// Example 3: Professional Variant for Advanced Students
export const ProfessionalExample = () => {
  return (
    <div className="app">
      <h1>Professional Sentence Builder</h1>
      <p>Advanced features for older students</p>
      <ProfessionalSentenceBuilder />
    </div>
  );
};

// Example 4: Multiple Instances
export const MultipleInstancesExample = () => {
  return (
    <div className="app">
      <h1>Compare Different Variants</h1>

      <div className="grid">
        <div className="column">
          <h2>Basic Version</h2>
          <BasicSentenceBuilder />
        </div>

        <div className="column">
          <h2>Standard Version</h2>
          <SentenceBuilder />
        </div>
      </div>
    </div>
  );
};

// Example 5: Responsive Container
export const ResponsiveExample = () => {
  return (
    <div className="responsive-container">
      <header>
        <h1>Responsive Sentence Builder</h1>
      </header>

      <main>
        <SentenceBuilder />
      </main>

      <footer>
        <p>© 2024 Educational Tools</p>
      </footer>
    </div>
  );
};

// Example 6: Dark Theme Wrapper
export const DarkThemeExample = () => {
  return (
    <div className="dark-theme-app" style={{
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1>Sentence Builder - Dark Mode</h1>
      <SentenceBuilder />
    </div>
  );
};

// Example 7: With Custom Wrapper for Styling
export const StyledExample = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#4a5568', fontSize: '2.5rem' }}>
          Learn Sentence Construction
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Build sentences step by step
        </p>
      </div>

      <SentenceBuilder />
    </div>
  );
};

// Export all examples
export default {
  DefaultExample,
  BasicExample,
  ProfessionalExample,
  MultipleInstancesExample,
  ResponsiveExample,
  DarkThemeExample,
  StyledExample
};