import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Trophy, Star, Heart, Sparkles, Volume2, VolumeX, 
  Settings, Award, Zap, Target, Gem, Crown, Medal,
  ChevronLeft, ChevronRight, Lock, Unlock, Info,
  CheckCircle, RefreshCw, Home, BarChart3
} from 'lucide-react';

const SentenceBuilder = () => {
  // Core state
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentPattern, setCurrentPattern] = useState('simple');
  const [difficulty, setDifficulty] = useState('beginner');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  
  // Owl mascot state
  const [owlMood, setOwlMood] = useState('happy');
  const [owlMessage, setOwlMessage] = useState("Hi! I'm Ollie! Let's build sentences together! 🦉");
  const [showOwlAnimation, setShowOwlAnimation] = useState(false);
  
  // Achievement state
  const [achievements, setAchievements] = useState([]);
  const [currentBadges, setCurrentBadges] = useState([]);
  const [totalSentences, setTotalSentences] = useState(0);
  const [unlockedWords, setUnlockedWords] = useState(['basic']);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('stars');
  
  // Progress tracking
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    sentencesCompleted: 0,
    perfectStreak: 0,
    attemptsPerPattern: {},
    commonMistakes: []
  });

  // Touch handling refs
  const sentenceAreaRef = useRef(null);
  const isDragging = useRef(false);
  const draggedWord = useRef(null);

  // Audio context for sounds
  const audioContext = useRef(null);
  const audioBuffers = useRef({});

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      // Pre-create audio buffers for instant playback
      createAudioBuffers();
    }
    
    // Load saved progress
    loadProgress();
    
    // Prevent zoom on iOS
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Create synthesized audio effects
  const createAudioBuffers = () => {
    if (!audioContext.current) return;
    
    // Success sound (cheerful arpeggio)
    const successBuffer = audioContext.current.createBuffer(1, 44100 * 0.5, 44100);
    const successData = successBuffer.getChannelData(0);
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    for (let i = 0; i < successData.length; i++) {
      let sample = 0;
      notes.forEach((freq, idx) => {
        const t = i / 44100;
        if (t > idx * 0.1 && t < idx * 0.1 + 0.2) {
          sample += Math.sin(2 * Math.PI * freq * t) * Math.exp(-(t - idx * 0.1) * 5) * 0.25;
        }
      });
      successData[i] = sample;
    }
    audioBuffers.current.success = successBuffer;

    // Click sound (soft pop)
    const clickBuffer = audioContext.current.createBuffer(1, 44100 * 0.05, 44100);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() - 0.5) * Math.exp(-i / 100) * 0.3;
    }
    audioBuffers.current.click = clickBuffer;

    // Celebration sound (fanfare)
    const celebrationBuffer = audioContext.current.createBuffer(1, 44100 * 1, 44100);
    const celebrationData = celebrationBuffer.getChannelData(0);
    const fanfareNotes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
    for (let i = 0; i < celebrationData.length; i++) {
      let sample = 0;
      fanfareNotes.forEach((freq, idx) => {
        const t = i / 44100;
        const startTime = idx * 0.15;
        if (t > startTime && t < startTime + 0.3) {
          sample += Math.sin(2 * Math.PI * freq * t) * 
                    Math.exp(-(t - startTime) * 3) * 0.2;
        }
      });
      celebrationData[i] = sample;
    }
    audioBuffers.current.celebration = celebrationBuffer;

    // Wrong sound (gentle descending tone)
    const wrongBuffer = audioContext.current.createBuffer(1, 44100 * 0.3, 44100);
    const wrongData = wrongBuffer.getChannelData(0);
    for (let i = 0; i < wrongData.length; i++) {
      const t = i / 44100;
      wrongData[i] = Math.sin(2 * Math.PI * (400 - t * 200) * t) * 
                     Math.exp(-t * 5) * 0.15;
    }
    audioBuffers.current.wrong = wrongBuffer;
  };

  // Play sound effect
  const playSound = (soundName) => {
    if (!soundEnabled || !audioContext.current || !audioBuffers.current[soundName]) return;
    
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffers.current[soundName];
    source.connect(audioContext.current.destination);
    source.start();
  };

  // Enhanced word banks with progression
  const wordBanks = {
    basic: {
      article: ['The', 'A', 'An'],
      subject: ['cat', 'dog', 'bird', 'fish', 'bunny', 'duck'],
      verb: ['runs', 'jumps', 'sits', 'eats', 'sleeps', 'plays'],
      adjective: ['big', 'small', 'happy', 'funny', 'soft', 'fast'],
      object: ['ball', 'toy', 'food', 'box', 'bed', 'tree'],
      preposition: ['in', 'on', 'by', 'at', 'to', 'of'],
      place: ['home', 'park', 'yard', 'room', 'pond', 'cage']
    },
    intermediate: {
      subject: ['teacher', 'student', 'friend', 'family', 'neighbor', 'sister'],
      verb: ['reads', 'writes', 'draws', 'sings', 'dances', 'helps'],
      adjective: ['clever', 'brave', 'gentle', 'curious', 'friendly', 'quiet'],
      object: ['book', 'picture', 'letter', 'game', 'story', 'song'],
      place: ['school', 'library', 'garden', 'kitchen', 'bedroom', 'playground']
    },
    advanced: {
      subject: ['scientist', 'artist', 'explorer', 'inventor', 'musician', 'athlete'],
      verb: ['discovers', 'creates', 'explores', 'imagines', 'practices', 'achieves'],
      adjective: ['brilliant', 'creative', 'determined', 'talented', 'patient', 'skillful'],
      object: ['invention', 'masterpiece', 'solution', 'discovery', 'melody', 'victory'],
      place: ['laboratory', 'studio', 'museum', 'theater', 'stadium', 'workshop']
    }
  };

  // Difficulty-based patterns
  const patterns = {
    beginner: {
      twoWord: {
        name: '🌱 Two Words',
        structure: ['subject', 'verb'],
        example: 'Cat sleeps',
        hint: 'Who + What they do',
        points: 5
      },
      simple: {
        name: '🌿 Simple Sentence',
        structure: ['article', 'subject', 'verb'],
        example: 'The cat sleeps',
        hint: 'The/A + Who + Action',
        points: 10
      }
    },
    growing: {
      withAdjective: {
        name: '🎨 Describing Words',
        structure: ['article', 'adjective', 'subject', 'verb'],
        example: 'The happy dog plays',
        hint: 'Add a word that describes!',
        points: 15
      },
      withObject: {
        name: '🎯 Action + Thing',
        structure: ['article', 'subject', 'verb', 'article', 'object'],
        example: 'The girl reads a book',
        hint: 'What are they doing it to?',
        points: 20
      }
    },
    advanced: {
      withPlace: {
        name: '📍 Where It Happens',
        structure: ['article', 'subject', 'verb', 'preposition', 'article', 'place'],
        example: 'The bird sings in the garden',
        hint: 'Add where it happens!',
        points: 25
      },
      complete: {
        name: '⭐ Complete Sentence',
        structure: ['article', 'adjective', 'subject', 'verb', 'article', 'object', 'preposition', 'article', 'place'],
        example: 'The happy girl reads a book in the library',
        hint: 'Use all the parts!',
        points: 30
      }
    }
  };

  // Part of speech styling
  const partOfSpeechInfo = {
    article: { color: 'bg-purple-500', emoji: '🔤', label: 'The/A/An' },
    subject: { color: 'bg-blue-500', emoji: '🦸', label: 'Who/What' },
    verb: { color: 'bg-green-500', emoji: '🏃', label: 'Action' },
    adjective: { color: 'bg-yellow-500', emoji: '✨', label: 'Describing' },
    object: { color: 'bg-orange-500', emoji: '🎁', label: 'Thing' },
    preposition: { color: 'bg-pink-500', emoji: '🧭', label: 'Position' },
    place: { color: 'bg-indigo-500', emoji: '🏠', label: 'Where' }
  };

  // Achievements definitions
  const achievementDefs = {
    firstSentence: { name: 'First Steps!', icon: '👣', description: 'Built your first sentence!' },
    fiveStreak: { name: 'On Fire!', icon: '🔥', description: '5 sentences in a row!' },
    tenSentences: { name: 'Word Builder', icon: '🏗️', description: 'Built 10 sentences!' },
    allPatterns: { name: 'Pattern Master', icon: '🎯', description: 'Tried all sentence patterns!' },
    perfectScore: { name: 'Perfection!', icon: '💯', description: 'No mistakes for 10 sentences!' },
    speedBuilder: { name: 'Speed Builder', icon: '⚡', description: 'Built a sentence in under 10 seconds!' },
    explorer: { name: 'Word Explorer', icon: '🗺️', description: 'Unlocked new word sets!' }
  };

  // Owl mascot component
  const OwlMascot = () => {
    const owlEmojis = {
      happy: '🦉',
      excited: '🤩',
      thinking: '🤔',
      celebrating: '🎉',
      encouraging: '💪',
      proud: '😊',
      surprised: '😲'
    };

    const owlBubbleStyle = {
      animation: showOwlAnimation ? 'bounceIn 0.5s ease-out' : 'none'
    };

    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3">
        {owlMessage && (
          <div 
            className="bg-white rounded-2xl shadow-xl px-4 py-3 max-w-xs"
            style={owlBubbleStyle}
          >
            <p className="text-sm font-medium text-gray-700">{owlMessage}</p>
          </div>
        )}
        <div className={`text-6xl transition-all duration-300 ${
          showOwlAnimation ? 'animate-bounce' : ''
        }`}>
          {owlEmojis[owlMood] || owlEmojis.happy}
        </div>
      </div>
    );
  };

  // Celebration animations
  const CelebrationOverlay = () => {
    if (!showCelebration) return null;

    const celebrations = {
      stars: ['⭐', '✨', '💫', '🌟', '⚡'],
      hearts: ['❤️', '💕', '💖', '💝', '💗'],
      party: ['🎉', '🎊', '🎈', '🎁', '🎆'],
      nature: ['🌈', '🌸', '🦋', '🌺', '☀️'],
      space: ['🚀', '🌙', '🪐', '⭐', '☄️']
    };

    const emojis = celebrations[celebrationType] || celebrations.stars;

    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          >
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </div>
        ))}
      </div>
    );
  };

  // Add word with animation
  const addWord = useCallback((word, type) => {
    playSound('click');
    const newWord = { word, type, id: Date.now() + Math.random() };
    setSelectedWords(prev => [...prev, newWord]);
    
    // Owl encouragement
    const encouragements = [
      "Great choice! 🌟",
      "Keep going! 💪",
      "You're doing amazing! ✨",
      "Nice one! 👍",
      "Excellent! 🎯"
    ];
    setOwlMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
    setOwlMood('encouraging');
    triggerOwlAnimation();
  }, []);

  // Remove word
  const removeWord = useCallback((id) => {
    playSound('click');
    setSelectedWords(prev => prev.filter(w => w.id !== id));
  }, []);

  // Check sentence with enhanced feedback
  const checkSentence = useCallback(() => {
    const patternGroup = patterns[difficulty];
    const pattern = patternGroup[currentPattern];
    
    if (!pattern) return;
    
    const userStructure = selectedWords.map(w => w.type);
    const expectedStructure = pattern.structure;
    
    // Check if structure matches
    const isCorrect = JSON.stringify(userStructure) === JSON.stringify(expectedStructure);
    
    if (isCorrect) {
      handleSuccess(pattern);
    } else {
      handleMistake(userStructure, expectedStructure);
    }
  }, [selectedWords, currentPattern, difficulty, score, streak]);

  // Handle successful sentence
  const handleSuccess = (pattern) => {
    playSound('success');
    
    // Update scores
    const points = pattern.points;
    setScore(prev => prev + points);
    setStreak(prev => prev + 1);
    setTotalSentences(prev => prev + 1);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      sentencesCompleted: prev.sentencesCompleted + 1,
      perfectStreak: prev.perfectStreak + 1
    }));
    
    // Owl celebration
    setOwlMood('celebrating');
    setOwlMessage(`Amazing! You earned ${points} points! 🎉`);
    triggerOwlAnimation();
    
    // Trigger celebration
    const celebrationTypes = ['stars', 'hearts', 'party', 'nature', 'space'];
    setCelebrationType(celebrationTypes[Math.floor(Math.random() * celebrationTypes.length)]);
    setShowCelebration(true);
    
    // Check achievements
    checkAchievements();
    
    // Clear after delay
    setTimeout(() => {
      setSelectedWords([]);
      setShowCelebration(false);
      
      // Progress to next pattern or unlock words
      if (streak > 0 && streak % 3 === 0) {
        unlockNewWords();
      }
    }, 2000);
    
    // Extra celebration for streaks
    if (streak > 0 && streak % 5 === 0) {
      playSound('celebration');
      setOwlMessage(`Incredible! ${streak} in a row! You're a sentence master! 🏆`);
    }
    
    // Save progress
    saveProgress();
  };

  // Handle mistakes with gentle feedback
  const handleMistake = (userStructure, expectedStructure) => {
    playSound('wrong');
    
    setStreak(0);
    setSessionStats(prev => ({
      ...prev,
      perfectStreak: 0,
      commonMistakes: [...prev.commonMistakes, { user: userStructure, expected: expectedStructure }]
    }));
    
    // Gentle owl feedback
    const feedback = getSpecificFeedback(userStructure, expectedStructure);
    setOwlMood('thinking');
    setOwlMessage(feedback);
    triggerOwlAnimation();
    
    // Visual hint animation
    setTimeout(() => {
      setOwlMood('encouraging');
      setOwlMessage("Let's try again! You can do it! 💪");
    }, 2000);
  };

  // Get specific feedback based on mistake
  const getSpecificFeedback = (userStructure, expectedStructure) => {
    if (userStructure.length < expectedStructure.length) {
      return `Almost there! You need ${expectedStructure.length - userStructure.length} more word${expectedStructure.length - userStructure.length > 1 ? 's' : ''}. 🤔`;
    } else if (userStructure.length > expectedStructure.length) {
      return `Oops! That's too many words. Try removing ${userStructure.length - expectedStructure.length}. 🤔`;
    } else {
      // Wrong order
      const nextExpected = expectedStructure[userStructure.findIndex((type, idx) => type !== expectedStructure[idx])];
      if (nextExpected) {
        return `Hmm, try adding a ${partOfSpeechInfo[nextExpected].label} next! 🤔`;
      }
      return "The word order isn't quite right. Check the pattern! 🤔";
    }
  };

  // Check and award achievements
  const checkAchievements = () => {
    const newAchievements = [];
    
    if (totalSentences === 0) {
      newAchievements.push('firstSentence');
    }
    if (streak === 5) {
      newAchievements.push('fiveStreak');
    }
    if (totalSentences === 10) {
      newAchievements.push('tenSentences');
    }
    if (sessionStats.perfectStreak === 10) {
      newAchievements.push('perfectScore');
    }
    
    newAchievements.forEach(achievement => {
      if (!achievements.includes(achievement)) {
        setAchievements(prev => [...prev, achievement]);
        showAchievementNotification(achievementDefs[achievement]);
      }
    });
  };

  // Show achievement notification
  const showAchievementNotification = (achievement) => {
    playSound('celebration');
    setOwlMood('proud');
    setOwlMessage(`🏆 Achievement Unlocked: ${achievement.name}! ${achievement.icon}`);
    triggerOwlAnimation();
  };

  // Unlock new word sets
  const unlockNewWords = () => {
    if (!unlockedWords.includes('intermediate') && score >= 100) {
      setUnlockedWords(prev => [...prev, 'intermediate']);
      setOwlMessage("🎉 New words unlocked! Check them out!");
      playSound('celebration');
    } else if (!unlockedWords.includes('advanced') && score >= 300) {
      setUnlockedWords(prev => [...prev, 'advanced']);
      setOwlMessage("🌟 Advanced words unlocked! You're amazing!");
      playSound('celebration');
    }
  };

  // Trigger owl animation
  const triggerOwlAnimation = () => {
    setShowOwlAnimation(true);
    setTimeout(() => setShowOwlAnimation(false), 1000);
  };

  // Save progress to localStorage
  const saveProgress = () => {
    const progress = {
      score,
      streak,
      achievements,
      totalSentences,
      unlockedWords,
      difficulty,
      sessionStats
    };
    localStorage.setItem('sentenceBuilderProgress', JSON.stringify(progress));
  };

  // Load progress from localStorage
  const loadProgress = () => {
    const saved = localStorage.getItem('sentenceBuilderProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      setScore(progress.score || 0);
      setAchievements(progress.achievements || []);
      setTotalSentences(progress.totalSentences || 0);
      setUnlockedWords(progress.unlockedWords || ['basic']);
      setDifficulty(progress.difficulty || 'beginner');
    }
  };

  // Clear sentence
  const clearSentence = () => {
    playSound('click');
    setSelectedWords([]);
    setOwlMessage("Let's start fresh! 🌟");
    setOwlMood('happy');
  };

  // Get available words combining all unlocked sets
  const getAvailableWords = (type) => {
    let words = [];
    unlockedWords.forEach(set => {
      if (wordBanks[set] && wordBanks[set][type]) {
        words = [...words, ...wordBanks[set][type]];
      }
    });
    // Remove duplicates
    return [...new Set(words)];
  };

  // Get current patterns based on difficulty
  const getCurrentPatterns = () => {
    return patterns[difficulty] || patterns.beginner;
  };

  // Parent Dashboard Component
  const ParentDashboard = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-500" />
            Parent Dashboard
          </h2>
          <button
            onClick={() => setShowParentDashboard(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">{score}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Sentences Built</p>
              <p className="text-2xl font-bold text-green-600">{totalSentences}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-purple-600">{sessionStats.perfectStreak}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-yellow-600">{achievements.length}</p>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-bold mb-3">Achievements Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(achievementDefs).map(([key, achievement]) => (
                <div
                  key={key}
                  className={`border-2 rounded-lg p-3 ${
                    achievements.includes(key)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Session Time */}
          <div>
            <h3 className="text-lg font-bold mb-2">Session Time</h3>
            <p className="text-gray-600">
              {Math.floor((Date.now() - sessionStats.startTime) / 60000)} minutes
            </p>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Settings</h3>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Sound Effects</span>
            </label>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="beginner">🌱 Beginner (Ages 4-6)</option>
                <option value="growing">🌿 Growing (Ages 6-8)</option>
                <option value="advanced">🌳 Advanced (Ages 8+)</option>
              </select>
            </div>
          </div>

          {/* Reset Progress */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress?')) {
                localStorage.removeItem('sentenceBuilderProgress');
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 select-none">
      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
        
        .word-button {
          transition: all 0.2s ease;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .word-button:active {
          transform: scale(0.95);
        }
        
        .achievement-badge {
          animation: bounceIn 0.5s ease-out;
        }
        
        @media (hover: none) {
          .word-button:hover {
            transform: none;
          }
        }
      `}</style>

      {/* Celebration Overlay */}
      <CelebrationOverlay />
      
      {/* Owl Mascot */}
      <OwlMascot />
      
      {/* Parent Dashboard */}
      {showParentDashboard && <ParentDashboard />}

      <div className="max-w-6xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Ollie's Sentence Builder 🦉
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Level: {difficulty === 'beginner' ? '🌱 Beginner' : difficulty === 'growing' ? '🌿 Growing' : '🌳 Advanced'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Score: {score} ⭐
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Streak: {streak} 🔥
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button
                onClick={() => setShowParentDashboard(true)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Achievement Badges */}
          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {achievements.map(key => (
                <div key={key} className="achievement-badge" title={achievementDefs[key].description}>
                  <span className="text-2xl">{achievementDefs[key].icon}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pattern Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Choose Your Challenge:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(getCurrentPatterns()).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentPattern(key);
                  clearSentence();
                  playSound('click');
                }}
                className={`p-3 rounded-xl font-medium transition-all ${
                  currentPattern === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm md:text-base">{pattern.name}</div>
                <div className="text-xs opacity-75 mt-1">+{pattern.points} points</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-500" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Pattern Guide</h3>
          </div>
          
          {currentPattern && getCurrentPatterns()[currentPattern] && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {getCurrentPatterns()[currentPattern].structure.map((part, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      partOfSpeechInfo[part].color
                    }`}
                  >
                    {partOfSpeechInfo[part].emoji} {partOfSpeechInfo[part].label}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm md:text-base">
                <strong>Example:</strong> "{getCurrentPatterns()[currentPattern].example}"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                💡 {getCurrentPatterns()[currentPattern].hint}
              </p>
            </>
          )}
        </div>

        {/* Sentence Building Area */}
        <div 
          ref={sentenceAreaRef}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-4"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">Your Sentence:</h3>
          <div className={`min-h-[100px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 
                          border-3 transition-all ${
            selectedWords.length > 0 ? 'border-blue-300' : 'border-gray-200'
          }`}>
            {selectedWords.length === 0 ? (
              <div className="text-center text-gray-400 text-lg md:text-xl">
                Tap words below to build your sentence! 📝
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 items-center">
                {selectedWords.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => removeWord(w.id)}
                    className={`word-button px-4 py-2 rounded-lg text-white font-medium shadow-lg ${
                      partOfSpeechInfo[w.type].color
                    }`}
                  >
                    {w.word}
                    <span className="ml-2 opacity-70">✕</span>
                  </button>
                ))}
                <span className="text-2xl ml-1">.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={checkSentence}
              disabled={selectedWords.length === 0}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
                         text-white rounded-xl font-medium disabled:from-gray-300 disabled:to-gray-400 
                         transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Check
            </button>
            <button
              onClick={clearSentence}
              className="flex-1 md:flex-none px-6 py-3 bg-gray-500 text-white rounded-xl 
                         font-medium transition-all shadow-lg hover:bg-gray-600 
                         flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Clear
            </button>
          </div>
        </div>

        {/* Word Banks */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Word Banks {unlockedWords.includes('intermediate') && '🔓'}
          </h3>
          <div className="space-y-4">
            {currentPattern && getCurrentPatterns()[currentPattern] && 
             getCurrentPatterns()[currentPattern].structure
              .filter((value, index, self) => self.indexOf(value) === index)
              .map(partType => {
                const availableWords = getAvailableWords(partType);
                
                return (
                  <div key={partType} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        partOfSpeechInfo[partType].color
                      }`}>
                        {partOfSpeechInfo[partType].emoji} {partOfSpeechInfo[partType].label}
                      </span>
                      {unlockedWords.includes('intermediate') && wordBanks.intermediate[partType] && (
                        <span className="text-xs text-green-600 font-medium">
                          +{wordBanks.intermediate[partType].length} unlocked
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableWords.map(word => (
                        <button
                          key={word}
                          onClick={() => addWord(word, partType)}
                          className={`word-button px-4 py-2 rounded-lg text-white font-medium shadow ${
                            partOfSpeechInfo[partType].color
                          }`}
                          style={{ minWidth: '60px', minHeight: '44px' }}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentenceBuilder;