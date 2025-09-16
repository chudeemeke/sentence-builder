import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Trophy, Zap, Target, Award, TrendingUp, BarChart3, Globe,
  BookOpen, Brain, Sparkles, Timer, Users, Shield, Crown,
  ChevronLeft, ChevronRight, Settings, Moon, Sun, Home,
  PenTool, MessageSquare, FileText, Send, Share2, Copy,
  Lock, Unlock, CheckCircle, XCircle, RefreshCw, Info,
  Volume2, VolumeX, Layers, GitBranch, Database, Cloud
} from 'lucide-react';

const ProfessionalSentenceBuilder = () => {
  // Core State
  const [darkMode, setDarkMode] = useState(true);
  const [currentLevel, setCurrentLevel] = useState('variety');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [sentenceType, setSentenceType] = useState('simple');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Advanced State
  const [userLevel, setUserLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [writingStyle, setWritingStyle] = useState('academic');
  const [analysisMode, setAnalysisMode] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  
  // UI State
  const [activeView, setActiveView] = useState('builder');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [draggedComponent, setDraggedComponent] = useState(null);
  
  // Refs
  const audioContext = useRef(null);
  const builderAreaRef = useRef(null);
  const analyticsRef = useRef({
    sessionStart: Date.now(),
    sentencesBuilt: 0,
    wordsUsed: 0,
    mistakePatterns: [],
    strongAreas: [],
    timeSpent: 0
  });

  // Initialize
  useEffect(() => {
    // Set dark mode by default for teens
    document.body.style.backgroundColor = darkMode ? '#000' : '#f9fafb';
    
    // Initialize audio
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Load saved progress
    loadUserData();
    
    // Generate daily challenge
    generateDailyChallenge();
    
    // Prevent iOS bounce
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventBounce, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventBounce);
      if (audioContext.current) audioContext.current.close();
    };
  }, []);

  // Prevent iOS bounce scrolling
  const preventBounce = (e) => {
    if (e.touches.length > 1) e.preventDefault();
  };

  // Haptic feedback - more subtle for regular interactions
  const triggerHaptic = (style = 'light') => {
    if (!hapticEnabled) return;
    if (window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: [5],      // Very subtle for regular touches
        medium: [10],    // Moderate for important actions  
        heavy: [20],     // Noticeable for major actions
        success: [10, 10, 20], // Pleasant success pattern
        error: [30, 10, 30]    // Gentle error pattern
      };
      window.navigator.vibrate(patterns[style] || patterns.light);
    }
  };

  // Advanced Grammar Components
  const grammarComponents = {
    variety: {
      simple: {
        subjects: ['The researcher', 'Our team', 'The data', 'Scientists', 'The study'],
        verbs: ['discovered', 'analyzed', 'demonstrated', 'revealed', 'confirmed'],
        objects: ['significant patterns', 'new insights', 'critical evidence', 'important findings'],
        icon: '🔬'
      },
      compound: {
        conjunctions: ['and', 'but', 'or', 'nor', 'for', 'yet', 'so'],
        clauses: ['the results were conclusive', 'we need more data', 'the hypothesis was correct'],
        icon: '🔗'
      },
      complex: {
        subordinators: ['although', 'because', 'since', 'while', 'if', 'when', 'unless'],
        dependentClauses: ['the experiment succeeded', 'variables were controlled', 'time permitted'],
        icon: '🧬'
      },
      compoundComplex: {
        combinations: ['multiple clauses with varied conjunctions'],
        icon: '🏛️'
      }
    },
    style: {
      parallelism: {
        structures: ['not only...but also', 'either...or', 'neither...nor', 'both...and'],
        examples: ['reading, writing, and analyzing', 'to think, to create, to innovate'],
        icon: '⚖️'
      },
      rhetorical: {
        types: ['Questions that engage?', 'Statements that challenge!', 'Ideas that transform.'],
        purposes: ['emphasis', 'engagement', 'persuasion'],
        icon: '🎭'
      },
      figurative: {
        metaphors: ['Time is money', 'Life is a journey', 'Knowledge is power'],
        similes: ['brave as a lion', 'quick as lightning', 'sharp as a tack'],
        personification: ['The wind whispered', 'Opportunity knocked', 'Fear gripped'],
        icon: '🎨'
      },
      tone: {
        formal: ['Moreover', 'Furthermore', 'Nevertheless', 'Consequently'],
        informal: ['Plus', 'Also', 'But', 'So'],
        academic: ['Thus', 'Hence', 'Therefore', 'Accordingly'],
        icon: '🎪'
      }
    },
    academic: {
      thesis: {
        starters: ['This essay argues that', 'The evidence suggests', 'Research demonstrates'],
        claims: ['social media impacts', 'climate change requires', 'education should'],
        support: ['because', 'as evidenced by', 'according to'],
        icon: '📜'
      },
      topic: {
        transitions: ['First', 'Additionally', 'In contrast', 'Finally'],
        development: ['For example', 'Specifically', 'In particular', 'To illustrate'],
        icon: '🏹'
      },
      evidence: {
        integration: ['According to', 'As stated by', 'Research shows', 'Studies indicate'],
        citations: ['(Author, Year)', '[1]', '(Source)', '"Quote"'],
        icon: '📊'
      },
      counterArgument: {
        acknowledgment: ['While some argue', 'Critics suggest', 'It could be said'],
        refutation: ['However', 'Nevertheless', 'On the contrary', 'Yet'],
        icon: '⚔️'
      }
    }
  };

  // Challenge Types for Teens
  const challenges = {
    daily: [
      { 
        id: 'twitter_master',
        name: 'Twitter Master',
        icon: '🐦',
        task: 'Express a complex idea in exactly 280 characters',
        xp: 50
      },
      {
        id: 'headline_hero',
        name: 'Headline Hero',
        icon: '📰',
        task: 'Write 5 attention-grabbing news headlines',
        xp: 75
      },
      {
        id: 'story_opener',
        name: 'Story Opener',
        icon: '📖',
        task: 'Create 3 compelling first sentences for different genres',
        xp: 100
      },
      {
        id: 'debate_champion',
        name: 'Debate Champion',
        icon: '🗿',
        task: 'Construct a persuasive argument with claim, evidence, and reasoning',
        xp: 125
      },
      {
        id: 'email_pro',
        name: 'Email Professional',
        icon: '📧',
        task: 'Write a formal email requesting an internship',
        xp: 150
      }
    ],
    competitive: [
      {
        id: 'speed_writer',
        name: 'Speed Writer',
        icon: '⚡',
        description: 'Build complex sentences in under 30 seconds',
        mode: 'timed'
      },
      {
        id: 'style_master',
        name: 'Style Transformer',
        icon: '🔮',
        description: 'Transform sentences through 5 different styles',
        mode: 'variation'
      },
      {
        id: 'grammar_gladiator',
        name: 'Grammar Gladiator',
        icon: '🏛️',
        description: '1v1 sentence battles with other writers',
        mode: 'pvp'
      }
    ]
  };

  // Achievement System
  const achievementTiers = {
    novice: [
      { id: 'first_sentence', name: 'First Words', icon: '📝', condition: 'Build first sentence' },
      { id: 'variety_explorer', name: 'Variety Explorer', icon: '🗺️', condition: 'Try all sentence types' },
      { id: 'streak_starter', name: 'Momentum', icon: '🌊', condition: '5 sentence streak' }
    ],
    apprentice: [
      { id: 'wordsmith', name: 'Apprentice Wordsmith', icon: '⚒️', condition: 'Build 50 sentences' },
      { id: 'style_shifter', name: 'Style Shifter', icon: '🎭', condition: 'Master 3 writing styles' },
      { id: 'challenge_accepted', name: 'Challenge Accepted', icon: '🎯', condition: 'Complete 10 challenges' }
    ],
    journeyman: [
      { id: 'grammar_guardian', name: 'Grammar Guardian', icon: '🛡️', condition: '95% accuracy over 100 sentences' },
      { id: 'speed_demon', name: 'Speed Demon', icon: '🌪️', condition: 'Complete speed challenge under 20 seconds' },
      { id: 'versatile', name: 'Versatile Writer', icon: '🦾', condition: 'Master all grammar types' }
    ],
    master: [
      { id: 'prose_architect', name: 'Prose Architect', icon: '🏗️', condition: 'Build 500 sentences' },
      { id: 'competition_champion', name: 'Competition Champion', icon: '🏆', condition: 'Win 10 competitions' },
      { id: 'perfect_month', name: 'Dedication', icon: '💎', condition: '30 day streak' }
    ],
    legend: [
      { id: 'syntax_samurai', name: 'Syntax Samurai', icon: '⚔️', condition: '1000 perfect sentences' },
      { id: 'rhetoric_ruler', name: 'Rhetoric Ruler', icon: '👑', condition: 'Master all styles and techniques' },
      { id: 'literary_legend', name: 'Literary Legend', icon: '🌟', condition: 'Complete all achievements' }
    ]
  };

  // Color Theme (NO PURPLE)
  const theme = {
    light: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      border: 'border-gray-200',
      primary: 'bg-teal-600',
      secondary: 'bg-coral-500',
      accent: 'bg-amber-500'
    },
    dark: {
      bg: 'bg-black',
      card: 'bg-gray-900',
      text: 'text-gray-100',
      subtext: 'text-gray-400',
      border: 'border-gray-800',
      primary: 'bg-teal-500',
      secondary: 'bg-red-500',
      accent: 'bg-yellow-500'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Play sound effect - only celebratory sounds, no clicking
  const playSound = useCallback((type) => {
    if (!soundEnabled || !audioContext.current) return;
    
    // Skip click sounds entirely for a cleaner experience
    if (type === 'click') return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    const sounds = {
      success: { 
        // Warm, pleasant success tone (major third interval)
        freq: 523.25, // C5
        secondFreq: 659.25, // E5
        duration: 0.25, 
        volume: 0.12 
      },
      error: { 
        // Gentle error tone (minor second)
        freq: 349.23, // F4
        duration: 0.15, 
        volume: 0.08 
      },
      achievement: { 
        // Triumphant achievement (perfect fifth)
        freq: 523.25, // C5
        secondFreq: 783.99, // G5
        duration: 0.4, 
        volume: 0.15 
      }
    };
    
    const sound = sounds[type];
    if (!sound) return;
    
    // Create main tone
    oscillator.type = 'sine';
    oscillator.frequency.value = sound.freq;
    
    // Add harmonic for success and achievement sounds
    if (sound.secondFreq) {
      const oscillator2 = audioContext.current.createOscillator();
      const gainNode2 = audioContext.current.createGain();
      
      oscillator2.type = 'sine';
      oscillator2.frequency.value = sound.secondFreq;
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.current.destination);
      
      // Fade in and out for pleasant sound
      gainNode2.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode2.gain.linearRampToValueAtTime(sound.volume * 0.6, audioContext.current.currentTime + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + sound.duration);
      
      oscillator2.start();
      oscillator2.stop(audioContext.current.currentTime + sound.duration);
    }
    
    // Smooth envelope for main tone
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(sound.volume, audioContext.current.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + sound.duration);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + sound.duration);
  }, [soundEnabled]);

  // Generate Daily Challenge
  const generateDailyChallenge = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('dailyChallenge');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setDailyChallenge(parsed.challenge);
        return;
      }
    }
    
    const challenge = challenges.daily[Math.floor(Math.random() * challenges.daily.length)];
    setDailyChallenge(challenge);
    localStorage.setItem('dailyChallenge', JSON.stringify({ date: today, challenge }));
  };

  // Load User Data
  const loadUserData = () => {
    const saved = localStorage.getItem('sentenceBuilderProData');
    if (saved) {
      const data = JSON.parse(saved);
      setScore(data.score || 0);
      setUserLevel(data.level || 1);
      setXp(data.xp || 0);
      setAchievements(data.achievements || []);
      setPortfolio(data.portfolio || []);
      setDarkMode(data.darkMode !== undefined ? data.darkMode : true);
    }
  };

  // Save User Data
  const saveUserData = useCallback(() => {
    const data = {
      score,
      level: userLevel,
      xp,
      achievements,
      portfolio,
      darkMode,
      lastSaved: Date.now()
    };
    localStorage.setItem('sentenceBuilderProData', JSON.stringify(data));
  }, [score, userLevel, xp, achievements, portfolio, darkMode]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(saveUserData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [saveUserData]);

  // AI Analysis Engine
  const analyzeSentence = useCallback((sentence) => {
    // Simulated AI analysis (in production, this would call an API)
    const words = sentence.split(' ').filter(w => w.length > 0);
    const avgWordLength = words.reduce((acc, w) => acc + w.length, 0) / words.length;
    
    const analysis = {
      readability: Math.min(100, Math.round(100 - (avgWordLength - 4) * 10)),
      complexity: words.length > 15 ? 'Complex' : words.length > 8 ? 'Moderate' : 'Simple',
      clarity: Math.round(Math.random() * 30 + 70),
      impact: words.some(w => ['powerful', 'critical', 'essential'].includes(w.toLowerCase())) ? 'Strong' : 'Moderate',
      wordCount: words.length,
      characterCount: sentence.length,
      suggestions: [],
      alternatives: []
    };
    
    // Generate suggestions
    if (words.length < 5) {
      analysis.suggestions.push('Consider adding more detail');
    }
    if (!sentence.includes(',') && words.length > 10) {
      analysis.suggestions.push('Consider breaking this into shorter clauses');
    }
    if (avgWordLength > 6) {
      analysis.suggestions.push('Try using simpler vocabulary for clarity');
    }
    
    // Generate alternatives
    analysis.alternatives = [
      `Rephrase: ${sentence.replace(/The|A|An/g, 'This')}`,
      `Active: ${sentence.replace(/was|were/g, 'is')}`,
      `Formal: Furthermore, ${sentence.toLowerCase()}`
    ];
    
    return analysis;
  }, []);

  // Component Builders
  const ComponentSelector = ({ type, items, onSelect }) => (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.subtext}`}>
        {type}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelect(item);
              triggerHaptic('light');  // Only haptic, no sound
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all transform active:scale-95
                       ${currentTheme.card} ${currentTheme.border} border hover:border-teal-500
                       min-h-[44px] min-w-[60px]`}
          >
            <span className={currentTheme.text}>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Sentence Builder Area
  const SentenceBuilderArea = () => {
    const [localSentence, setLocalSentence] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
      if (localSentence.length < 10) return;
      
      setIsAnalyzing(true);
      triggerHaptic('medium');  // Just haptic, no sound during analysis
      
      setTimeout(() => {
        const result = analyzeSentence(localSentence);
        setAnalysis(result);
        setIsAnalyzing(false);
        playSound('success');  // Success sound when analysis completes
      }, 1000);
    };

    const handleAddToPortfolio = () => {
      if (localSentence.length < 10) return;
      
      const entry = {
        id: Date.now(),
        sentence: localSentence,
        analysis: analysis || analyzeSentence(localSentence),
        date: new Date().toISOString(),
        type: sentenceType,
        style: writingStyle
      };
      
      setPortfolio(prev => [...prev, entry]);
      playSound('achievement');
      triggerHaptic('success');
      
      // Check achievements
      checkAchievements('portfolio_add');
      
      // Clear
      setLocalSentence('');
      setAnalysis(null);
    };

    return (
      <div className={`rounded-xl p-6 ${currentTheme.card} shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}>
            <PenTool size={20} className="text-teal-500" />
            Sentence Workshop
          </h2>
          <div className="flex gap-2">
            <select
              value={sentenceType}
              onChange={(e) => setSentenceType(e.target.value)}
              className={`px-3 py-1.5 rounded-lg ${currentTheme.card} ${currentTheme.border} 
                         border ${currentTheme.text} text-sm`}
            >
              <option value="simple">Simple</option>
              <option value="compound">Compound</option>
              <option value="complex">Complex</option>
              <option value="compound-complex">Compound-Complex</option>
            </select>
            <select
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              className={`px-3 py-1.5 rounded-lg ${currentTheme.card} ${currentTheme.border} 
                         border ${currentTheme.text} text-sm`}
            >
              <option value="academic">Academic</option>
              <option value="creative">Creative</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>

        <textarea
          value={localSentence}
          onChange={(e) => setLocalSentence(e.target.value)}
          placeholder="Build your sentence here..."
          className={`w-full h-32 p-4 rounded-lg ${currentTheme.card} ${currentTheme.border} 
                     border-2 ${currentTheme.text} resize-none focus:border-teal-500 
                     focus:outline-none transition-colors text-lg`}
          style={{ fontSize: '16px' }} // Prevent iOS zoom
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={localSentence.length < 10 || isAnalyzing}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all
                       ${localSentence.length >= 10 
                         ? 'bg-teal-500 text-white hover:bg-teal-600' 
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                       flex items-center justify-center gap-2`}
          >
            <Brain size={18} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          <button
            onClick={handleAddToPortfolio}
            disabled={localSentence.length < 10}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all
                       ${localSentence.length >= 10
                         ? 'bg-amber-500 text-white hover:bg-amber-600'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                       flex items-center justify-center gap-2`}
          >
            <Award size={18} />
            Save to Portfolio
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className={`font-bold ${currentTheme.text} mb-3`}>
              Analysis Results 🔬
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className={`text-sm ${currentTheme.subtext}`}>Readability</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all duration-500"
                      style={{ width: `${analysis.readability}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${currentTheme.text}`}>
                    {analysis.readability}%
                  </span>
                </div>
              </div>
              <div>
                <span className={`text-sm ${currentTheme.subtext}`}>Complexity</span>
                <p className={`font-medium ${currentTheme.text}`}>{analysis.complexity}</p>
              </div>
              <div>
                <span className={`text-sm ${currentTheme.subtext}`}>Clarity</span>
                <p className={`font-medium ${currentTheme.text}`}>{analysis.clarity}%</p>
              </div>
              <div>
                <span className={`text-sm ${currentTheme.subtext}`}>Impact</span>
                <p className={`font-medium ${currentTheme.text}`}>{analysis.impact}</p>
              </div>
            </div>

            {analysis.suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className={`text-sm font-bold ${currentTheme.subtext} mb-2`}>
                  Suggestions 💡
                </h4>
                {analysis.suggestions.map((suggestion, idx) => (
                  <p key={idx} className={`text-sm ${currentTheme.text} mb-1`}>
                    • {suggestion}
                  </p>
                ))}
              </div>
            )}

            {analysis.alternatives.length > 0 && (
              <div>
                <h4 className={`text-sm font-bold ${currentTheme.subtext} mb-2`}>
                  Alternative Versions 🔄
                </h4>
                {analysis.alternatives.map((alt, idx) => (
                  <p key={idx} className={`text-sm ${currentTheme.text} mb-1 italic`}>
                    {alt}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Challenge Center
  const ChallengeCenter = () => (
    <div className={`rounded-xl p-6 ${currentTheme.card} shadow-xl`}>
      <h2 className={`text-xl font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
        <Target size={20} className="text-amber-500" />
        Challenge Center
      </h2>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className={`p-4 rounded-lg mb-4 bg-gradient-to-r from-teal-500/10 to-amber-500/10 
                        border ${currentTheme.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{dailyChallenge.icon}</span>
                <h3 className={`font-bold ${currentTheme.text}`}>
                  Daily: {dailyChallenge.name}
                </h3>
              </div>
              <p className={`text-sm ${currentTheme.subtext} mb-3`}>
                {dailyChallenge.task}
              </p>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${currentTheme.text}`}>
                  Reward: {dailyChallenge.xp} XP
                </span>
                <button
                  onClick={() => setSelectedChallenge(dailyChallenge)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium 
                           hover:bg-teal-600 transition-colors"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competitive Challenges */}
      <div className="space-y-3">
        <h3 className={`font-bold ${currentTheme.text} text-sm uppercase tracking-wider`}>
          Competitive Modes
        </h3>
        {challenges.competitive.map(challenge => (
          <div 
            key={challenge.id}
            className={`p-3 rounded-lg ${currentTheme.card} border ${currentTheme.border}
                       hover:border-teal-500 transition-colors cursor-pointer`}
            onClick={() => setSelectedChallenge(challenge)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{challenge.icon}</span>
                <div>
                  <h4 className={`font-medium ${currentTheme.text}`}>
                    {challenge.name}
                  </h4>
                  <p className={`text-xs ${currentTheme.subtext}`}>
                    {challenge.description}
                  </p>
                </div>
              </div>
              <ChevronRight className={currentTheme.subtext} size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Portfolio View
  const PortfolioView = () => (
    <div className={`rounded-xl p-6 ${currentTheme.card} shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${currentTheme.text} flex items-center gap-2`}>
          <BookOpen size={20} className="text-amber-500" />
          Your Portfolio
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                         ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${currentTheme.text}`}>
          {portfolio.length} entries
        </span>
      </div>

      {portfolio.length === 0 ? (
        <div className={`text-center py-12 ${currentTheme.subtext}`}>
          <p className="mb-2">Your portfolio is empty</p>
          <p className="text-sm">Save your best sentences to build your collection!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {portfolio.slice().reverse().map((entry, idx) => (
            <div 
              key={entry.id}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} 
                         border ${currentTheme.border}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs ${currentTheme.subtext}`}>
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full 
                                   ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} 
                                   ${currentTheme.text}`}>
                    {entry.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full 
                                   ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} 
                                   ${currentTheme.text}`}>
                    {entry.style}
                  </span>
                </div>
              </div>
              <p className={`${currentTheme.text} text-sm italic mb-2`}>
                "{entry.sentence}"
              </p>
              {entry.analysis && (
                <div className="flex gap-4 text-xs">
                  <span className={currentTheme.subtext}>
                    Readability: {entry.analysis.readability}%
                  </span>
                  <span className={currentTheme.subtext}>
                    {entry.analysis.complexity}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {portfolio.length > 0 && (
        <button
          onClick={() => exportPortfolio()}
          className="mt-4 w-full py-3 bg-gradient-to-r from-teal-500 to-amber-500 
                   text-white rounded-lg font-medium hover:opacity-90 transition-opacity
                   flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Export Portfolio
        </button>
      )}
    </div>
  );

  // Achievement View
  const AchievementView = () => (
    <div className={`rounded-xl p-6 ${currentTheme.card} shadow-xl`}>
      <h2 className={`text-xl font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
        <Trophy size={20} className="text-yellow-500" />
        Achievements & Progress
      </h2>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium ${currentTheme.text}`}>
            Level {userLevel}
          </span>
          <span className={`text-sm ${currentTheme.subtext}`}>
            {xp} / {userLevel * 1000} XP
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(xp / (userLevel * 1000)) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievement Tiers */}
      {Object.entries(achievementTiers).map(([tier, items]) => (
        <div key={tier} className="mb-6">
          <h3 className={`font-bold ${currentTheme.text} mb-3 capitalize`}>
            {tier} Tier
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {items.map(achievement => {
              const isUnlocked = achievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg text-center transition-all
                            ${isUnlocked 
                              ? 'bg-gradient-to-br from-teal-500/20 to-amber-500/20 border-2 border-amber-500' 
                              : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'} opacity-50`}`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className={`text-xs font-medium ${currentTheme.text}`}>
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // Check Achievements
  const checkAchievements = (action) => {
    // Logic to check and award achievements based on action
    // This would be expanded in production
  };

  // Export Portfolio
  const exportPortfolio = () => {
    const data = portfolio.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      sentence: entry.sentence,
      type: entry.type,
      style: entry.style,
      readability: entry.analysis?.readability
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_${Date.now()}.json`;
    a.click();
    
    playSound('achievement');  // Achievement sound for successful export
    triggerHaptic('success');
  };

  // Navigation Bar
  const NavigationBar = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} border-t 
                    ${currentTheme.border} px-4 py-2 z-50`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center">
          {[
            { id: 'builder', icon: PenTool, label: 'Build' },
            { id: 'challenge', icon: Target, label: 'Challenge' },
            { id: 'portfolio', icon: BookOpen, label: 'Portfolio' },
            { id: 'achievements', icon: Trophy, label: 'Progress' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                triggerHaptic('light');  // Only subtle haptic, no sound
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                         ${activeView === item.id 
                           ? 'text-teal-500' 
                           : currentTheme.subtext}`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div className={`rounded-xl p-6 ${currentTheme.card} shadow-xl`}>
      <h2 className={`text-xl font-bold ${currentTheme.text} mb-4`}>
        Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={currentTheme.text}>Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors
                       ${darkMode ? 'bg-teal-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 ${darkMode ? 'right-1' : 'left-1'} 
                            w-6 h-6 bg-white rounded-full transition-all`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={currentTheme.text}>Celebration Sounds</span>
            <p className={`text-xs ${currentTheme.subtext} mt-1`}>Play sounds for achievements and success</p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors
                       ${soundEnabled ? 'bg-teal-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 ${soundEnabled ? 'right-1' : 'left-1'} 
                            w-6 h-6 bg-white rounded-full transition-all`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={currentTheme.text}>Haptic Feedback</span>
            <p className={`text-xs ${currentTheme.subtext} mt-1`}>Gentle vibrations for touch interactions</p>
          </div>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors
                       ${hapticEnabled ? 'bg-teal-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 ${hapticEnabled ? 'right-1' : 'left-1'} 
                            w-6 h-6 bg-white rounded-full transition-all`} />
          </button>
        </div>

        <div className={`pt-4 border-t ${currentTheme.border}`}>
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-medium
                     hover:bg-red-600 transition-colors"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} pb-20`}>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        input, textarea {
          -webkit-user-select: text;
          user-select: text;
        }
        
        /* Prevent iOS bounce */
        body {
          position: fixed;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Header */}
      <div className={`${currentTheme.card} shadow-xl mb-4`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${currentTheme.text} flex items-center gap-2`}>
                <span className="text-3xl">🏛️</span>
                Sentence Builder Pro
              </h1>
              <div className="flex gap-3 mt-2">
                <span className={`text-xs ${currentTheme.subtext} flex items-center gap-1`}>
                  <Zap size={14} className="text-amber-500" />
                  Level {userLevel}
                </span>
                <span className={`text-xs ${currentTheme.subtext} flex items-center gap-1`}>
                  <Trophy size={14} className="text-teal-500" />
                  {score} pts
                </span>
                <span className={`text-xs ${currentTheme.subtext} flex items-center gap-1`}>
                  🔥 {streak} streak
                </span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${currentTheme.card} ${currentTheme.border} border`}
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : 
                          <Moon size={20} className="text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-4">
          {activeView === 'builder' && <SentenceBuilderArea />}
          {activeView === 'challenge' && <ChallengeCenter />}
          {activeView === 'portfolio' && <PortfolioView />}
          {activeView === 'achievements' && <AchievementView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <NavigationBar />
    </div>
  );
};

export default ProfessionalSentenceBuilder;