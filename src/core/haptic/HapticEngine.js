/**
 * Haptic Feedback Engine
 * AAA+ Quality: Advanced haptic patterns for iOS and Android devices
 */

/**
 * Professional Haptic Engine with advanced patterns
 */
export class HapticEngine {
  constructor() {
    this.enabled = true;
    this.intensity = 1.0;
    this.platform = this.detectPlatform();
    this.supportsHaptics = this.checkHapticSupport();
    this.patterns = this.definePatterns();
    this.queue = [];
    this.isPlaying = false;
  }

  /**
   * Initialize haptic engine
   */
  init() {
    if (!this.supportsHaptics) {
      console.log('[HapticEngine] Haptic feedback not supported on this device');
      return false;
    }

    // Request permission on iOS 13+
    if (this.platform === 'ios' && window.DeviceMotionEvent?.requestPermission) {
      window.DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            console.log('[HapticEngine] iOS haptic permission granted');
          }
        })
        .catch(error => {
          console.warn('[HapticEngine] iOS permission request failed:', error);
        });
    }

    console.log('[HapticEngine] Initialized for', this.platform);
    return true;
  }

  /**
   * Detect platform
   */
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    
    // Windows Phone
    if (/windows phone/i.test(userAgent)) {
      return 'windows';
    }
    
    return 'web';
  }

  /**
   * Check haptic support
   */
  checkHapticSupport() {
    // Vibration API support
    if ('vibrate' in navigator) {
      return true;
    }
    
    // iOS Haptic Feedback API
    if (window.webkit?.messageHandlers?.haptic) {
      return true;
    }
    
    // Taptic Engine for iOS
    if (this.platform === 'ios' && 'TapticEngine' in window) {
      return true;
    }
    
    return false;
  }

  /**
   * Define haptic patterns
   */
  definePatterns() {
    return {
      // Light feedback
      light: {
        ios: { type: 'impact', style: 'light' },
        android: [10],
        web: [10],
        description: 'Subtle tap for hover and selection'
      },
      
      // Medium feedback
      medium: {
        ios: { type: 'impact', style: 'medium' },
        android: [20],
        web: [20],
        description: 'Standard tap for buttons'
      },
      
      // Heavy feedback
      heavy: {
        ios: { type: 'impact', style: 'heavy' },
        android: [30],
        web: [30],
        description: 'Strong feedback for important actions'
      },
      
      // Success pattern
      success: {
        ios: { type: 'notification', style: 'success' },
        android: [10, 30, 10, 30, 50],
        web: [10, 30, 10, 30, 50],
        description: 'Celebration pattern for achievements'
      },
      
      // Error pattern
      error: {
        ios: { type: 'notification', style: 'error' },
        android: [50, 100, 50],
        web: [50, 100, 50],
        description: 'Alert pattern for mistakes'
      },
      
      // Warning pattern
      warning: {
        ios: { type: 'notification', style: 'warning' },
        android: [30, 50, 30],
        web: [30, 50, 30],
        description: 'Attention pattern for warnings'
      },
      
      // Selection change
      selection: {
        ios: { type: 'selection' },
        android: [5, 5],
        web: [5, 5],
        description: 'Quick tick for selection changes'
      },
      
      // Drag start
      dragStart: {
        ios: { type: 'impact', style: 'medium' },
        android: [15, 10, 15],
        web: [15, 10, 15],
        description: 'Pickup feedback for drag operations'
      },
      
      // Drag end
      dragEnd: {
        ios: { type: 'impact', style: 'light' },
        android: [10, 5, 20],
        web: [10, 5, 20],
        description: 'Drop feedback for drag operations'
      },
      
      // Level up
      levelUp: {
        ios: { type: 'custom', pattern: [10, 20, 30, 40, 50] },
        android: [20, 40, 20, 40, 20, 40, 100],
        web: [20, 40, 20, 40, 20, 40, 100],
        description: 'Epic celebration for level progression'
      },
      
      // Coin collect
      coin: {
        ios: { type: 'custom', pattern: [5, 10, 5] },
        android: [5, 10, 5],
        web: [5, 10, 5],
        description: 'Quick double tap for rewards'
      },
      
      // Heartbeat
      heartbeat: {
        ios: { type: 'custom', pattern: [50, 100, 50, 500] },
        android: [50, 100, 50, 500],
        web: [50, 100, 50, 500],
        description: 'Rhythmic pattern for anticipation'
      },
      
      // Typing feedback
      typing: {
        ios: { type: 'impact', style: 'rigid' },
        android: [3],
        web: [3],
        description: 'Minimal feedback for typing'
      },
      
      // Swipe
      swipe: {
        ios: { type: 'selection' },
        android: [5, 5, 5],
        web: [5, 5, 5],
        description: 'Triple tick for swipe gestures'
      },
      
      // Long press
      longPress: {
        ios: { type: 'impact', style: 'heavy' },
        android: [10, 10, 30],
        web: [10, 10, 30],
        description: 'Building feedback for long press'
      },
      
      // Unlock
      unlock: {
        ios: { type: 'custom', pattern: [10, 10, 10, 50] },
        android: [10, 10, 10, 50],
        web: [10, 10, 10, 50],
        description: 'Achievement unlock pattern'
      },
      
      // Countdown
      countdown: {
        ios: { type: 'custom', pattern: [20, 180, 20, 180, 20, 180, 100] },
        android: [20, 180, 20, 180, 20, 180, 100],
        web: [20, 180, 20, 180, 20, 180, 100],
        description: 'Timer countdown pattern'
      },
      
      // Custom patterns for sentences
      sentenceStart: {
        ios: { type: 'impact', style: 'light' },
        android: [5, 5],
        web: [5, 5],
        description: 'Beginning a new sentence'
      },
      
      wordAdd: {
        ios: { type: 'selection' },
        android: [8],
        web: [8],
        description: 'Adding word to sentence'
      },
      
      wordRemove: {
        ios: { type: 'impact', style: 'rigid' },
        android: [5, 5],
        web: [5, 5],
        description: 'Removing word from sentence'
      },
      
      sentenceComplete: {
        ios: { type: 'notification', style: 'success' },
        android: [10, 20, 10, 20, 50],
        web: [10, 20, 10, 20, 50],
        description: 'Sentence validated successfully'
      }
    };
  }

  /**
   * Trigger haptic feedback
   */
  trigger(patternName, options = {}) {
    if (!this.enabled || !this.supportsHaptics) return;
    
    const pattern = this.patterns[patternName];
    if (!pattern) {
      console.warn(`[HapticEngine] Pattern not found: ${patternName}`);
      return;
    }
    
    const {
      intensity = this.intensity,
      delay = 0,
      override = false
    } = options;
    
    // Add to queue or play immediately
    if (delay > 0) {
      setTimeout(() => {
        this.executePattern(pattern, intensity);
      }, delay);
    } else if (override || !this.isPlaying) {
      this.executePattern(pattern, intensity);
    } else {
      this.queue.push({ pattern, intensity });
    }
  }

  /**
   * Execute haptic pattern
   */
  executePattern(pattern, intensity) {
    this.isPlaying = true;
    
    try {
      switch (this.platform) {
        case 'ios':
          this.executeiOSPattern(pattern.ios, intensity);
          break;
        
        case 'android':
          this.executeAndroidPattern(pattern.android, intensity);
          break;
        
        default:
          this.executeWebPattern(pattern.web, intensity);
      }
    } catch (error) {
      console.error('[HapticEngine] Execution error:', error);
    }
    
    // Process queue after pattern completes
    const duration = this.getPatternDuration(pattern);
    setTimeout(() => {
      this.isPlaying = false;
      this.processQueue();
    }, duration);
  }

  /**
   * Execute iOS pattern
   */
  executeiOSPattern(pattern, intensity) {
    // Try native iOS APIs first
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage({
        type: pattern.type,
        style: pattern.style,
        intensity
      });
    } 
    // Fallback to Taptic Engine
    else if (window.TapticEngine) {
      switch (pattern.type) {
        case 'impact':
          window.TapticEngine.impact({ style: pattern.style });
          break;
        case 'notification':
          window.TapticEngine.notification({ type: pattern.style });
          break;
        case 'selection':
          window.TapticEngine.selection();
          break;
        case 'custom':
          this.executeWebPattern(pattern.pattern, intensity);
          break;
      }
    }
    // Final fallback to vibration API
    else if (navigator.vibrate) {
      const vibrationPattern = pattern.pattern || this.iosToVibration(pattern);
      navigator.vibrate(vibrationPattern.map(v => v * intensity));
    }
  }

  /**
   * Execute Android pattern
   */
  executeAndroidPattern(pattern, intensity) {
    if (navigator.vibrate) {
      const adjustedPattern = pattern.map(duration => 
        Math.round(duration * intensity)
      );
      navigator.vibrate(adjustedPattern);
    }
    // Try Android-specific APIs if available
    else if (window.Android?.vibrate) {
      window.Android.vibrate(pattern, intensity);
    }
  }

  /**
   * Execute web pattern
   */
  executeWebPattern(pattern, intensity) {
    if (navigator.vibrate) {
      const adjustedPattern = pattern.map(duration => 
        Math.round(duration * intensity)
      );
      navigator.vibrate(adjustedPattern);
    }
  }

  /**
   * Convert iOS pattern to vibration pattern
   */
  iosToVibration(iosPattern) {
    const conversions = {
      'impact-light': [10],
      'impact-medium': [20],
      'impact-heavy': [30],
      'impact-rigid': [15],
      'impact-soft': [25],
      'notification-success': [10, 30, 10, 30, 50],
      'notification-error': [50, 100, 50],
      'notification-warning': [30, 50, 30],
      'selection': [5, 5]
    };
    
    const key = `${iosPattern.type}-${iosPattern.style}`;
    return conversions[key] || [20];
  }

  /**
   * Get pattern duration
   */
  getPatternDuration(pattern) {
    const platformPattern = pattern[this.platform] || pattern.web;
    
    if (Array.isArray(platformPattern)) {
      return platformPattern.reduce((a, b) => a + b, 0);
    }
    
    if (platformPattern.pattern) {
      return platformPattern.pattern.reduce((a, b) => a + b, 0);
    }
    
    // Default durations for iOS patterns
    const iosDefaults = {
      impact: 30,
      notification: 200,
      selection: 20
    };
    
    return iosDefaults[platformPattern.type] || 50;
  }

  /**
   * Process haptic queue
   */
  processQueue() {
    if (this.queue.length > 0 && !this.isPlaying) {
      const next = this.queue.shift();
      this.executePattern(next.pattern, next.intensity);
    }
  }

  /**
   * Create custom pattern
   */
  createCustomPattern(vibrationArray) {
    return {
      ios: { type: 'custom', pattern: vibrationArray },
      android: vibrationArray,
      web: vibrationArray,
      description: 'Custom user pattern'
    };
  }

  /**
   * Compose complex patterns
   */
  compose(...patternNames) {
    const composed = [];
    
    for (const name of patternNames) {
      const pattern = this.patterns[name];
      if (pattern) {
        const platformPattern = pattern[this.platform] || pattern.web;
        if (Array.isArray(platformPattern)) {
          composed.push(...platformPattern, 50); // Add pause between patterns
        }
      }
    }
    
    return this.createCustomPattern(composed);
  }

  /**
   * Rhythm pattern generator
   */
  generateRhythm(beats, tempo = 120) {
    const beatDuration = 60000 / tempo; // ms per beat
    const pattern = [];
    
    for (const beat of beats) {
      if (beat === 1) {
        pattern.push(30); // Vibrate for strong beat
      } else if (beat === 0.5) {
        pattern.push(15); // Vibrate for weak beat
      } else {
        pattern.push(0); // Pause
      }
      pattern.push(beatDuration - 30); // Pause until next beat
    }
    
    return this.createCustomPattern(pattern);
  }

  /**
   * Morse code pattern
   */
  morseCode(text) {
    const morse = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
      'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
      'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
      'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
      'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
      'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
      '9': '----.', ' ': '/'
    };
    
    const dotDuration = 50;
    const dashDuration = 150;
    const intraCharGap = 50;
    const charGap = 150;
    const wordGap = 350;
    
    const pattern = [];
    
    for (const char of text.toUpperCase()) {
      const code = morse[char];
      if (code) {
        for (const symbol of code) {
          if (symbol === '.') {
            pattern.push(dotDuration, intraCharGap);
          } else if (symbol === '-') {
            pattern.push(dashDuration, intraCharGap);
          } else if (symbol === '/') {
            pattern.push(0, wordGap);
          }
        }
        pattern.push(0, charGap);
      }
    }
    
    return this.createCustomPattern(pattern);
  }

  /**
   * Set intensity
   */
  setIntensity(intensity) {
    this.intensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Enable/disable haptics
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    
    if (!enabled) {
      this.queue = [];
      navigator.vibrate && navigator.vibrate(0); // Stop any ongoing vibration
    }
  }

  /**
   * Test haptic support
   */
  test() {
    const testPatterns = ['light', 'medium', 'heavy', 'success'];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index >= testPatterns.length) {
        clearInterval(interval);
        return;
      }
      
      console.log(`[HapticEngine] Testing: ${testPatterns[index]}`);
      this.trigger(testPatterns[index]);
      index++;
    }, 1000);
  }

  /**
   * Get haptic statistics
   */
  getStats() {
    return {
      platform: this.platform,
      supported: this.supportsHaptics,
      enabled: this.enabled,
      intensity: this.intensity,
      queueLength: this.queue.length,
      isPlaying: this.isPlaying,
      availablePatterns: Object.keys(this.patterns)
    };
  }
}

// Export singleton instance
export default new HapticEngine();