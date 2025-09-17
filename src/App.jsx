/**
 * Main App Component - Integrated with Phase 1 Features
 * Production-ready with PWA support, state management, and onboarding
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';

// Core imports
import useStore from './core/state/store';
import AudioEngine from './core/audio/AudioEngine';
import HapticEngine from './core/haptic/HapticEngine';

// Component imports
import OnboardingFlow from './core/onboarding/OnboardingFlow';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import UpdatePrompt from './components/common/UpdatePrompt';
import OfflineIndicator from './components/common/OfflineIndicator';

// Lazy load main views for code splitting
const SentenceBuilder = lazy(() => import('./components/sentence-builder'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Settings = lazy(() => import('./components/settings/Settings'));
const Achievements = lazy(() => import('./components/achievements/Achievements'));

// Navigation icons
import { BookOpen, BarChart3, Trophy, Settings as SettingsIcon } from 'lucide-react';

// Styles
import './styles/globals.css';
import './styles/animations.css';

/**
 * Main Application Component
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  // Store hooks
  const {
    user,
    ui,
    offline,
    setOnlineStatus,
    loadContent,
    setActiveView
  } = useStore();

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * Initialize application
   */
  const initializeApp = async () => {
    try {
      // Initialize audio engine
      await AudioEngine.init();
      
      // Initialize haptic engine
      HapticEngine.init();
      
      // Check if first time user
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
        setIsLoading(false);
        return;
      }
      
      // Load content
      await loadContent();

      // Check for service worker updates
      checkServiceWorkerUpdates();

      // Setup offline detection
      setupOfflineDetection();

      // Setup PWA install prompt
      setupInstallPrompt();

      // Check for updates
      checkForUpdates();
      
      // Performance monitoring
      setupPerformanceMonitoring();
      
      setIsLoading(false);
    } catch (error) {
      console.error('App initialization failed:', error);
      setIsLoading(false);
    }
  };

  /**
   * Check for service worker updates
   */
  const checkServiceWorkerUpdates = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Listen for updates from the service worker registered in main.jsx
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }
  };

  /**
   * Setup offline detection
   */
  const setupOfflineDetection = () => {
    // Initial state
    setOnlineStatus(navigator.onLine);
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      setOnlineStatus(true);
      console.log('App is online');
    });
    
    window.addEventListener('offline', () => {
      setOnlineStatus(false);
      console.log('App is offline');
    });
  };

  /**
   * Setup PWA install prompt
   */
  const setupInstallPrompt = () => {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Update UI to show install button
      useStore.getState().ui.showInstallPrompt = true;
    });
    
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      
      // Track installation
      if (window.gtag) {
        window.gtag('event', 'app_installed');
      }
    });
  };

  /**
   * Check for app updates
   */
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  };

  /**
   * Setup performance monitoring
   */
  const setupPerformanceMonitoring = () => {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      // Monitor FCP and LCP
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
      
      paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }
  };

  /**
   * Handle service worker messages
   */
  const handleServiceWorkerMessage = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'SYNC_COMPLETE':
        console.log('Sync completed:', data);
        break;
      
      case 'CACHE_SIZE':
        console.log('Cache size:', data.size);
        break;
      
      default:
        console.log('ServiceWorker message:', event.data);
    }
  };

  /**
   * Handle onboarding completion
   */
  const handleOnboardingComplete = (config) => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    
    // Play celebration sound
    AudioEngine.play('levelUp');
    HapticEngine.trigger('success');
    
    // Initialize with personalized config
    loadContent();
  };

  /**
   * Render loading screen
   */
  if (isLoading) {
    return <LoadingScreen />;
  }

  /**
   * Render onboarding
   */
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  /**
   * Main app render
   */
  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Offline indicator */}
        {!offline.isOnline && <OfflineIndicator />}

        {/* Update prompt */}
        {updateAvailable && <UpdatePrompt />}

        {/* Main content */}
        <div className="main-content">
          <Suspense fallback={<LoadingScreen />}>
            {renderView()}
          </Suspense>
        </div>

        {/* Navigation */}
        <Navigation />
      </div>
    </ErrorBoundary>
  );

  /**
   * Render active view
   */
  function renderView() {
    switch (ui.activeView) {
      case 'builder':
        return <SentenceBuilder />;
      
      case 'dashboard':
        return <Dashboard />;
      
      case 'achievements':
        return <Achievements />;
      
      case 'settings':
        return <Settings />;
      
      default:
        return <SentenceBuilder />;
    }
  }
}

/**
 * Navigation Component
 */
function Navigation() {
  const { ui, setActiveView } = useStore();

  const navItems = [
    { id: 'builder', label: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Progress', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'achievements', label: 'Awards', icon: <Trophy className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> }
  ];
  
  return (
    <nav className="navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveView(item.id);
            HapticEngine.trigger('light');
          }}
          className={`nav-item ${ui.activeView === item.id ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default App;