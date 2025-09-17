/**
 * Advanced State Management Store
 * AAA+ Quality: Complete state solution with time-travel, persistence, and optimistic updates
 */

import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// Constants
const UNDO_LIMIT = 50;
const SYNC_DEBOUNCE = 1000;
const OPTIMISTIC_TIMEOUT = 5000;

/**
 * Main Application Store
 * Combines all state slices with advanced middleware
 */
const useStore = create()(
  devtools(
    subscribeWithSelector(
      persist(
        temporal(
          immer((set, get) => ({
            // ===== USER STATE =====
            user: {
              id: null,
              profile: null,
              preferences: {
                theme: 'light',
                soundEnabled: true,
                hapticEnabled: true,
                fontSize: 'medium',
                language: 'en',
                difficulty: 'adaptive'
              },
              subscription: {
                tier: 'free',
                validUntil: null,
                features: []
              },
              onboarding: {
                completed: false,
                currentStep: 0,
                responses: {},
                skipReason: null
              }
            },

            // ===== LEARNING STATE =====
            learning: {
              currentSentence: [],
              currentPattern: 'simple',
              sessionStartTime: Date.now(),
              sessionSentences: [],
              
              // Progress tracking
              progress: {
                level: 1,
                xp: 0,
                totalSentences: 0,
                perfectStreak: 0,
                currentStreak: 0,
                accuracy: 100,
                averageTime: 0,
                masteredPatterns: [],
                unlockedContent: ['basic']
              },
              
              // Adaptive learning
              adaptive: {
                skillLevel: 1.0,
                confidence: 0.5,
                learningRate: 1.0,
                strengths: [],
                weaknesses: [],
                recommendations: []
              },
              
              // Performance metrics
              metrics: {
                wordsPerMinute: 0,
                complexityScore: 0,
                vocabularySize: 0,
                grammarAccuracy: 100,
                creativityScore: 0
              }
            },

            // ===== CONTENT STATE =====
            content: {
              wordBanks: {
                loaded: false,
                data: {},
                custom: [],
                favorites: []
              },
              
              patterns: {
                loaded: false,
                data: {},
                custom: [],
                history: []
              },
              
              aiGenerated: {
                cache: {},
                pending: [],
                credits: 100
              }
            },

            // ===== GAMIFICATION STATE =====
            gamification: {
              score: 0,
              coins: 0,
              gems: 0,
              energy: 100,
              
              achievements: {
                unlocked: [],
                progress: {},
                recent: [],
                showcased: []
              },
              
              challenges: {
                daily: null,
                active: [],
                completed: [],
                streaks: {}
              },
              
              leaderboard: {
                global: [],
                friends: [],
                school: [],
                lastUpdate: null
              },
              
              rewards: {
                pending: [],
                claimed: [],
                inventory: {}
              }
            },

            // ===== UI STATE =====
            ui: {
              activeView: 'builder',
              modals: {
                achievement: false,
                settings: false,
                help: false,
                share: false
              },
              
              animations: {
                celebrating: false,
                transitioning: false,
                particleType: null
              },
              
              feedback: {
                type: null, // success, error, info, warning
                message: '',
                duration: 3000,
                action: null
              },
              
              tour: {
                active: false,
                step: 0,
                completed: []
              }
            },

            // ===== OFFLINE STATE =====
            offline: {
              isOnline: navigator.onLine,
              pendingSync: [],
              lastSync: null,
              syncStatus: 'idle', // idle, syncing, error, success
              
              queue: {
                sentences: [],
                progress: [],
                achievements: []
              },
              
              cache: {
                size: 0,
                lastCleaned: null
              }
            },

            // ===== COLLABORATION STATE =====
            collaboration: {
              session: null,
              peers: [],
              sharedSentence: [],
              chat: [],
              
              permissions: {
                canEdit: true,
                canChat: true,
                isHost: false
              }
            },

            // ===== ACTIONS =====
            
            // User actions
            setUserProfile: (profile) => set((state) => {
              state.user.profile = profile;
            }),

            updatePreferences: (preferences) => set((state) => {
              Object.assign(state.user.preferences, preferences);
            }),

            completeOnboarding: (responses) => set((state) => {
              state.user.onboarding.completed = true;
              state.user.onboarding.responses = responses;
              
              // Generate personalized settings based on responses
              const personalized = generatePersonalizedSettings(responses);
              Object.assign(state.user.preferences, personalized);
            }),

            // Learning actions
            addWordToSentence: (word, type) => set((state) => {
              const wordObj = {
                id: `${Date.now()}-${Math.random()}`,
                word,
                type,
                timestamp: Date.now()
              };
              
              state.learning.currentSentence.push(wordObj);
              
              // Track metrics
              updateMetrics(state, 'wordAdded');
              
              // Optimistic update
              state.offline.queue.sentences.push({
                action: 'add',
                data: wordObj,
                timestamp: Date.now()
              });
            }),

            removeWordFromSentence: (id) => set((state) => {
              state.learning.currentSentence = state.learning.currentSentence.filter(
                w => w.id !== id
              );
              
              updateMetrics(state, 'wordRemoved');
            }),

            validateSentence: () => {
              const state = get();
              const { currentSentence, currentPattern } = state.learning;
              const pattern = state.content.patterns.data[currentPattern];
              
              if (!pattern) return { valid: false, errors: ['Pattern not found'] };
              
              const validation = validateSentenceStructure(currentSentence, pattern);
              
              // Update progress based on validation
              set((state) => {
                if (validation.valid) {
                  state.learning.progress.totalSentences++;
                  state.learning.progress.currentStreak++;
                  state.learning.progress.xp += pattern.points || 10;
                  
                  // Update adaptive learning
                  updateAdaptiveLearning(state, true);
                  
                  // Check achievements
                  checkAchievements(state);
                } else {
                  state.learning.progress.currentStreak = 0;
                  updateAdaptiveLearning(state, false);
                }
                
                // Update accuracy
                const total = state.learning.progress.totalSentences || 1;
                const correct = validation.valid ? 1 : 0;
                state.learning.progress.accuracy = 
                  (state.learning.progress.accuracy * (total - 1) + correct * 100) / total;
              });
              
              return validation;
            },

            clearSentence: () => set((state) => {
              state.learning.sessionSentences.push({
                sentence: state.learning.currentSentence,
                timestamp: Date.now(),
                pattern: state.learning.currentPattern
              });
              
              state.learning.currentSentence = [];
            }),

            // Gamification actions
            unlockAchievement: (achievementId, notification = true) => set((state) => {
              if (state.gamification.achievements.unlocked.includes(achievementId)) {
                return;
              }
              
              state.gamification.achievements.unlocked.push(achievementId);
              state.gamification.achievements.recent.unshift({
                id: achievementId,
                timestamp: Date.now()
              });
              
              // Limit recent achievements
              if (state.gamification.achievements.recent.length > 10) {
                state.gamification.achievements.recent.pop();
              }
              
              // Add rewards
              const achievement = ACHIEVEMENTS[achievementId];
              if (achievement) {
                state.gamification.score += achievement.points || 0;
                state.gamification.coins += achievement.coins || 0;
                state.gamification.gems += achievement.gems || 0;
              }
              
              // Show notification
              if (notification) {
                state.ui.modals.achievement = true;
                state.ui.animations.celebrating = true;
                
                setTimeout(() => {
                  get().dismissAchievement();
                }, 5000);
              }
            }),

            dismissAchievement: () => set((state) => {
              state.ui.modals.achievement = false;
              state.ui.animations.celebrating = false;
            }),

            startChallenge: (challengeId) => set((state) => {
              const challenge = {
                id: challengeId,
                startTime: Date.now(),
                progress: 0,
                completed: false
              };
              
              state.gamification.challenges.active.push(challenge);
            }),

            updateChallengeProgress: (challengeId, progress) => set((state) => {
              const challenge = state.gamification.challenges.active.find(
                c => c.id === challengeId
              );
              
              if (challenge) {
                challenge.progress = progress;
                
                if (progress >= 100) {
                  challenge.completed = true;
                  challenge.completedTime = Date.now();
                  
                  // Move to completed
                  state.gamification.challenges.completed.push(challenge);
                  state.gamification.challenges.active = 
                    state.gamification.challenges.active.filter(c => c.id !== challengeId);
                  
                  // Add rewards
                  const challengeData = CHALLENGES[challengeId];
                  if (challengeData) {
                    state.gamification.score += challengeData.points || 0;
                    state.gamification.xp += challengeData.xp || 0;
                  }
                }
              }
            }),

            // UI actions
            setActiveView: (view) => set((state) => {
              state.ui.activeView = view;
              state.ui.animations.transitioning = true;
              
              setTimeout(() => {
                get().endTransition();
              }, 300);
            }),

            endTransition: () => set((state) => {
              state.ui.animations.transitioning = false;
            }),

            showFeedback: (type, message, duration = 3000, action = null) => set((state) => {
              state.ui.feedback = { type, message, duration, action };
              
              if (duration > 0) {
                setTimeout(() => {
                  get().dismissFeedback();
                }, duration);
              }
            }),

            dismissFeedback: () => set((state) => {
              state.ui.feedback = { type: null, message: '', duration: 3000, action: null };
            }),

            celebrate: (type = 'stars') => set((state) => {
              state.ui.animations.celebrating = true;
              state.ui.animations.particleType = type;
              
              setTimeout(() => {
                get().endCelebration();
              }, 2500);
            }),

            endCelebration: () => set((state) => {
              state.ui.animations.celebrating = false;
              state.ui.animations.particleType = null;
            }),

            // Offline actions
            setOnlineStatus: (isOnline) => set((state) => {
              state.offline.isOnline = isOnline;
              
              if (isOnline) {
                // Trigger sync when coming online
                get().syncOfflineData();
              }
            }),

            syncOfflineData: async () => {
              const state = get();
              
              if (!state.offline.isOnline) {
                return { success: false, error: 'Offline' };
              }
              
              set((state) => {
                state.offline.syncStatus = 'syncing';
              });
              
              try {
                // Sync sentences
                const sentences = state.offline.queue.sentences;
                if (sentences.length > 0) {
                  await syncSentences(sentences);
                  
                  set((state) => {
                    state.offline.queue.sentences = [];
                  });
                }
                
                // Sync progress
                const progress = state.learning.progress;
                await syncProgress(progress);
                
                // Sync achievements
                const achievements = state.gamification.achievements.unlocked;
                await syncAchievements(achievements);
                
                set((state) => {
                  state.offline.syncStatus = 'success';
                  state.offline.lastSync = Date.now();
                });
                
                return { success: true };
              } catch (error) {
                set((state) => {
                  state.offline.syncStatus = 'error';
                });
                
                return { success: false, error: error.message };
              }
            },

            // Content actions
            loadContent: async () => {
              const state = get();
              
              try {
                // Load from cache first
                const cachedWordBanks = await loadFromCache('wordBanks');
                const cachedPatterns = await loadFromCache('patterns');
                
                if (cachedWordBanks && cachedPatterns) {
                  set((state) => {
                    state.content.wordBanks.data = cachedWordBanks;
                    state.content.wordBanks.loaded = true;
                    state.content.patterns.data = cachedPatterns;
                    state.content.patterns.loaded = true;
                  });
                }
                
                // Fetch updates if online
                if (state.offline.isOnline) {
                  const [wordBanks, patterns] = await Promise.all([
                    fetchWordBanks(),
                    fetchPatterns()
                  ]);
                  
                  set((state) => {
                    state.content.wordBanks.data = wordBanks;
                    state.content.patterns.data = patterns;
                  });
                  
                  // Update cache
                  await saveToCache('wordBanks', wordBanks);
                  await saveToCache('patterns', patterns);
                }
              } catch (error) {
                console.error('Failed to load content:', error);
                get().showFeedback('error', 'Failed to load content');
              }
            },

            // AI content generation
            generateAIContent: async (topic, level) => {
              const state = get();
              
              // Check cache first
              const cacheKey = `${topic}-${level}`;
              if (state.content.aiGenerated.cache[cacheKey]) {
                return state.content.aiGenerated.cache[cacheKey];
              }
              
              // Check credits
              if (state.content.aiGenerated.credits <= 0) {
                get().showFeedback('warning', 'No AI credits remaining');
                return null;
              }
              
              set((state) => {
                state.content.aiGenerated.pending.push(cacheKey);
              });
              
              try {
                const content = await generateAIContentAPI(topic, level);
                
                set((state) => {
                  state.content.aiGenerated.cache[cacheKey] = content;
                  state.content.aiGenerated.credits--;
                  state.content.aiGenerated.pending = 
                    state.content.aiGenerated.pending.filter(k => k !== cacheKey);
                });
                
                return content;
              } catch (error) {
                set((state) => {
                  state.content.aiGenerated.pending = 
                    state.content.aiGenerated.pending.filter(k => k !== cacheKey);
                });
                
                get().showFeedback('error', 'Failed to generate content');
                return null;
              }
            },

            // Collaboration actions
            joinSession: async (sessionId) => {
              try {
                const session = await joinCollaborationSession(sessionId);
                
                set((state) => {
                  state.collaboration.session = session;
                  state.collaboration.peers = session.peers;
                  state.collaboration.permissions = session.permissions;
                });
                
                return { success: true };
              } catch (error) {
                get().showFeedback('error', 'Failed to join session');
                return { success: false, error: error.message };
              }
            },

            leaveSession: () => set((state) => {
              if (state.collaboration.session) {
                disconnectFromSession(state.collaboration.session.id);
              }
              
              state.collaboration.session = null;
              state.collaboration.peers = [];
              state.collaboration.sharedSentence = [];
              state.collaboration.chat = [];
            }),

            // Utility actions
            reset: () => set((state) => {
              // Reset to initial state while preserving user preferences
              const preferences = state.user.preferences;
              
              Object.assign(state, getInitialState());
              state.user.preferences = preferences;
            })
          })),
          
          // Temporal configuration for undo/redo
          {
            limit: UNDO_LIMIT,
            partialize: (state) => ({
              learning: state.learning,
              gamification: state.gamification
            })
          }
        ),
        
        // Persist configuration
        {
          name: 'sentence-builder-store',
          storage: createJSONStorage(() => ({
            getItem: async (name) => {
              try {
                const db = await openDB();
                const tx = db.transaction('storage', 'readonly');
                const store = tx.objectStore('storage');
                const result = await store.get(name);
                return result?.value || null;
              } catch {
                return localStorage.getItem(name);
              }
            },
            setItem: async (name, value) => {
              try {
                const db = await openDB();
                const tx = db.transaction('storage', 'readwrite');
                const store = tx.objectStore('storage');
                await store.put({ key: name, value });
              } catch {
                localStorage.setItem(name, value);
              }
            },
            removeItem: async (name) => {
              try {
                const db = await openDB();
                const tx = db.transaction('storage', 'readwrite');
                const store = tx.objectStore('storage');
                await store.delete(name);
              } catch {
                localStorage.removeItem(name);
              }
            }
          })),
          partialize: (state) => ({
            user: state.user,
            learning: state.learning.progress,
            gamification: state.gamification,
            content: {
              wordBanks: {
                custom: state.content.wordBanks.custom,
                favorites: state.content.wordBanks.favorites
              },
              patterns: {
                custom: state.content.patterns.custom,
                history: state.content.patterns.history
              }
            }
          })
        }
      )
    )
  ),
  {
    name: 'sentence-builder-store'
  }
);

// Helper functions
function generatePersonalizedSettings(responses) {
  const settings = {};
  
  // Theme based on age
  if (responses.age <= 8) {
    settings.theme = 'colorful';
    settings.fontSize = 'large';
  } else if (responses.age <= 12) {
    settings.theme = 'modern';
    settings.fontSize = 'medium';
  } else {
    settings.theme = 'professional';
    settings.fontSize = 'small';
  }
  
  // Difficulty based on skill test
  if (responses.skillLevel === 'beginner') {
    settings.difficulty = 'fixed-easy';
  } else if (responses.skillLevel === 'intermediate') {
    settings.difficulty = 'progressive';
  } else {
    settings.difficulty = 'adaptive';
  }
  
  // Features based on learning style
  if (responses.learningStyle === 'visual') {
    settings.animations = true;
    settings.particleEffects = true;
  } else if (responses.learningStyle === 'auditory') {
    settings.soundEnabled = true;
    settings.readAloud = true;
  }
  
  return settings;
}

function validateSentenceStructure(sentence, pattern) {
  const structure = sentence.map(w => w.type);
  const expectedStructure = pattern.structure;
  
  const valid = JSON.stringify(structure) === JSON.stringify(expectedStructure);
  const errors = [];
  
  if (!valid) {
    if (structure.length < expectedStructure.length) {
      errors.push(`Missing ${expectedStructure.length - structure.length} word(s)`);
    } else if (structure.length > expectedStructure.length) {
      errors.push(`Too many words (${structure.length} vs ${expectedStructure.length})`);
    } else {
      // Find specific mismatch
      for (let i = 0; i < structure.length; i++) {
        if (structure[i] !== expectedStructure[i]) {
          errors.push(`Position ${i + 1}: Expected ${expectedStructure[i]}, got ${structure[i]}`);
          break;
        }
      }
    }
  }
  
  return { valid, errors };
}

function updateMetrics(state, action) {
  // Update real-time metrics
  const now = Date.now();
  const sessionDuration = (now - state.learning.sessionStartTime) / 1000 / 60; // minutes
  const wordCount = state.learning.sessionSentences.reduce(
    (acc, s) => acc + s.sentence.length, 0
  );
  
  if (sessionDuration > 0) {
    state.learning.metrics.wordsPerMinute = Math.round(wordCount / sessionDuration);
  }
  
  // Update vocabulary size
  const uniqueWords = new Set();
  state.learning.sessionSentences.forEach(s => {
    s.sentence.forEach(w => uniqueWords.add(w.word.toLowerCase()));
  });
  state.learning.metrics.vocabularySize = uniqueWords.size;
}

function updateAdaptiveLearning(state, success) {
  const adaptive = state.learning.adaptive;
  
  // Update confidence using Bayesian inference
  const prior = adaptive.confidence;
  const likelihood = success ? 0.8 : 0.2;
  const evidence = prior * likelihood + (1 - prior) * (1 - likelihood);
  adaptive.confidence = (prior * likelihood) / evidence;
  
  // Adjust skill level
  if (success) {
    adaptive.skillLevel = Math.min(10, adaptive.skillLevel * 1.05);
  } else {
    adaptive.skillLevel = Math.max(1, adaptive.skillLevel * 0.95);
  }
  
  // Update learning rate
  adaptive.learningRate = 1 + (adaptive.confidence - 0.5);
}

function checkAchievements(state) {
  const { progress } = state.learning;
  const { achievements } = state.gamification;
  
  // Check streak achievements
  if (progress.currentStreak === 5 && !achievements.unlocked.includes('streak_5')) {
    state.gamification.achievements.unlocked.push('streak_5');
  }
  
  if (progress.currentStreak === 10 && !achievements.unlocked.includes('streak_10')) {
    state.gamification.achievements.unlocked.push('streak_10');
  }
  
  // Check sentence count achievements
  if (progress.totalSentences === 10 && !achievements.unlocked.includes('first_10')) {
    state.gamification.achievements.unlocked.push('first_10');
  }
  
  if (progress.totalSentences === 100 && !achievements.unlocked.includes('century')) {
    state.gamification.achievements.unlocked.push('century');
  }
  
  // Check accuracy achievements
  if (progress.accuracy >= 95 && progress.totalSentences >= 20 && 
      !achievements.unlocked.includes('accuracy_master')) {
    state.gamification.achievements.unlocked.push('accuracy_master');
  }
}

// API functions (mocked for now)
async function syncSentences(sentences) {
  // Mock API call
  return new Promise(resolve => setTimeout(resolve, 1000));
}

async function syncProgress(progress) {
  // Mock API call
  return new Promise(resolve => setTimeout(resolve, 500));
}

async function syncAchievements(achievements) {
  // Mock API call
  return new Promise(resolve => setTimeout(resolve, 500));
}

async function loadFromCache(key) {
  try {
    const cached = localStorage.getItem(`cache_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

async function saveToCache(key, value) {
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(value));
  } catch {
    // Storage full, clear old cache
    Object.keys(localStorage)
      .filter(k => k.startsWith('cache_'))
      .forEach(k => localStorage.removeItem(k));
  }
}

async function fetchWordBanks() {
  // Mock API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        basic: {
          article: ['The', 'A', 'An'],
          subject: ['cat', 'dog', 'bird'],
          verb: ['runs', 'jumps', 'sits'],
          // ... more
        }
      });
    }, 1000);
  });
}

async function fetchPatterns() {
  // Mock API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        simple: {
          structure: ['article', 'subject', 'verb'],
          example: 'The cat sleeps',
          points: 10
        },
        // ... more
      });
    }, 1000);
  });
}

async function generateAIContentAPI(topic, level) {
  // Mock AI generation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        sentences: [
          `The ${topic} is interesting`,
          `A ${topic} can be fun`,
        ],
        words: {
          subject: [topic],
          verb: ['explores', 'discovers'],
          adjective: ['amazing', 'wonderful']
        }
      });
    }, 2000);
  });
}

async function joinCollaborationSession(sessionId) {
  // Mock collaboration
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: sessionId,
        peers: [],
        permissions: {
          canEdit: true,
          canChat: true,
          isHost: false
        }
      });
    }, 1000);
  });
}

function disconnectFromSession(sessionId) {
  // Mock disconnect
  console.log('Disconnected from session:', sessionId);
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sentence-builder-store', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('storage')) {
        db.createObjectStore('storage', { keyPath: 'key' });
      }
    };
  });
}

function getInitialState() {
  // Return initial state structure
  // This would be the same as the initial state defined in the store
  return {
    user: { /* ... */ },
    learning: { /* ... */ },
    // ... etc
  };
}

// Achievement definitions
const ACHIEVEMENTS = {
  streak_5: { name: 'On Fire!', points: 50, coins: 10 },
  streak_10: { name: 'Unstoppable!', points: 100, coins: 25 },
  first_10: { name: 'Getting Started', points: 25, coins: 5 },
  century: { name: 'Century Club', points: 500, coins: 100, gems: 5 },
  accuracy_master: { name: 'Precision Expert', points: 200, coins: 50 },
};

// Challenge definitions
const CHALLENGES = {
  daily_easy: { name: 'Daily Easy', points: 25, xp: 50 },
  daily_medium: { name: 'Daily Medium', points: 50, xp: 100 },
  daily_hard: { name: 'Daily Hard', points: 100, xp: 200 },
};

// Export store and hooks
export default useStore;
export const useUser = () => useStore(state => state.user);
export const useLearning = () => useStore(state => state.learning);
export const useGamification = () => useStore(state => state.gamification);
export const useUI = () => useStore(state => state.ui);
export const useOffline = () => useStore(state => state.offline);
export const useCollaboration = () => useStore(state => state.collaboration);
export const useContent = () => useStore(state => state.content);

// Temporal hooks for undo/redo
export const useTemporalStore = () => useStore.temporal;

// Selectors for common queries
export const selectCurrentSentence = (state) => state.learning.currentSentence;
export const selectUserProgress = (state) => state.learning.progress;
export const selectAchievements = (state) => state.gamification.achievements;
export const selectIsOnline = (state) => state.offline.isOnline;
export const selectCurrentTheme = (state) => state.user.preferences.theme;