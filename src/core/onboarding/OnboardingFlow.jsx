/**
 * Onboarding Flow Component
 * AAA+ Quality: Personalized, delightful onboarding experience
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import { 
  ChevronRight, ChevronLeft, Sparkles, Brain, Palette, 
  Volume2, Gamepad2, BookOpen, Users, Trophy, Zap, Star,
  Check, ArrowRight, Skip, Play, Pause
} from 'lucide-react';
import useStore from '../state/store';
import AudioEngine from '../audio/AudioEngine';
import HapticEngine from '../haptic/HapticEngine';

// Onboarding steps configuration
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    type: 'intro',
    title: 'Welcome to Sentence Builder! 🎉',
    subtitle: 'Let\'s personalize your learning journey',
    skipable: false
  },
  {
    id: 'age',
    type: 'age-selector',
    title: 'How old are you?',
    subtitle: 'This helps us choose the perfect content',
    skipable: false
  },
  {
    id: 'interests',
    type: 'interest-picker',
    title: 'What do you love?',
    subtitle: 'We\'ll create sentences about your favorite things',
    skipable: true
  },
  {
    id: 'learning-style',
    type: 'style-assessment',
    title: 'How do you learn best?',
    subtitle: 'Choose your preferred learning style',
    skipable: true
  },
  {
    id: 'features',
    type: 'feature-selection',
    title: 'Customize your experience',
    subtitle: 'Turn features on or off',
    skipable: true
  },
  {
    id: 'skill-test',
    type: 'placement-test',
    title: 'Quick skill check!',
    subtitle: 'Let\'s find your starting level',
    skipable: true
  },
  {
    id: 'complete',
    type: 'completion',
    title: 'You\'re all set! 🚀',
    subtitle: 'Let\'s start building sentences',
    skipable: false
  }
];

// Main Onboarding Component
export const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  
  const { completeOnboarding, updatePreferences } = useStore();
  const audioEngine = useRef(new AudioEngine());
  const hapticEngine = useRef(new HapticEngine());

  useEffect(() => {
    // Initialize engines
    audioEngine.current.init();
    hapticEngine.current.init();
    
    // Play welcome sound
    audioEngine.current.play('welcome');
    
    return () => {
      audioEngine.current.cleanup();
    };
  }, []);

  const handleNext = (response = null) => {
    if (response !== null) {
      setResponses(prev => ({
        ...prev,
        [ONBOARDING_STEPS[currentStep].id]: response
      }));
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      animateTransition(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  };

  const handleSkip = () => {
    if (ONBOARDING_STEPS[currentStep].skipable) {
      setShowSkipWarning(true);
    }
  };

  const confirmSkip = () => {
    setShowSkipWarning(false);
    handleNext({ skipped: true });
  };

  const animateTransition = (callback) => {
    setIsAnimating(true);
    audioEngine.current.play('transition');
    hapticEngine.current.trigger('light');
    
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 300);
  };

  const completeOnboarding = () => {
    // Generate personalized configuration
    const config = generatePersonalizedConfig(responses);
    
    // Save to store
    completeOnboarding(responses);
    updatePreferences(config.preferences);
    
    // Celebration
    audioEngine.current.play('achievement');
    hapticEngine.current.trigger('success');
    
    // Callback
    if (onComplete) {
      onComplete(config);
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation step={currentStep} />
      
      {/* Progress Bar */}
      <ProgressBar current={currentStep} total={ONBOARDING_STEPS.length} />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col items-center justify-center min-h-screen p-8"
        >
          {/* Step Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              {currentStepData.title}
            </h1>
            <p className="text-xl text-gray-600">
              {currentStepData.subtitle}
            </p>
          </motion.div>

          {/* Step Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl"
          >
            <StepContent
              step={currentStepData}
              onNext={handleNext}
              responses={responses}
              audioEngine={audioEngine.current}
              hapticEngine={hapticEngine.current}
            />
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mt-8"
          >
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-lg
                         hover:shadow-xl transition-all"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            {currentStepData.skipable && (
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg
                         hover:bg-gray-300 transition-all"
              >
                <Skip size={20} />
                Skip
              </button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Skip Warning Modal */}
      <AnimatePresence>
        {showSkipWarning && (
          <SkipWarningModal
            onConfirm={confirmSkip}
            onCancel={() => setShowSkipWarning(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Step Content Renderer
const StepContent = ({ step, onNext, responses, audioEngine, hapticEngine }) => {
  switch (step.type) {
    case 'intro':
      return <IntroStep onNext={onNext} audioEngine={audioEngine} />;
    case 'age-selector':
      return <AgeSelector onNext={onNext} hapticEngine={hapticEngine} />;
    case 'interest-picker':
      return <InterestPicker onNext={onNext} audioEngine={audioEngine} />;
    case 'style-assessment':
      return <StyleAssessment onNext={onNext} />;
    case 'feature-selection':
      return <FeatureSelection onNext={onNext} responses={responses} />;
    case 'placement-test':
      return <PlacementTest onNext={onNext} audioEngine={audioEngine} />;
    case 'completion':
      return <CompletionStep onNext={onNext} responses={responses} />;
    default:
      return null;
  }
};

// Individual Step Components

const IntroStep = ({ onNext, audioEngine }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayIntro = () => {
    setIsPlaying(true);
    audioEngine.play('intro-narration');
    
    // Auto advance after intro
    setTimeout(() => {
      onNext();
    }, 5000);
  };

  return (
    <div className="text-center">
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="text-8xl mb-8"
      >
        🎓
      </motion.div>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700">
          Get ready for an amazing journey into the world of sentences!
        </p>
        
        <p className="text-lg text-gray-700">
          I'll help you learn grammar in the most fun way possible.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPlaying ? onNext : handlePlayIntro}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                   rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl 
                   transition-all flex items-center gap-3 mx-auto"
        >
          {isPlaying ? (
            <>
              <Sparkles className="animate-pulse" />
              Let's Get Started!
            </>
          ) : (
            <>
              <Play />
              Watch Intro
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

const AgeSelector = ({ onNext, hapticEngine }) => {
  const [selectedAge, setSelectedAge] = useState(null);
  
  const ageGroups = [
    { range: '4-6', emoji: '🧸', label: 'Little Learner' },
    { range: '7-9', emoji: '🎈', label: 'Young Explorer' },
    { range: '10-12', emoji: '🚀', label: 'Growing Scholar' },
    { range: '13-15', emoji: '💫', label: 'Teen Achiever' },
    { range: '16+', emoji: '🎯', label: 'Advanced Student' },
  ];

  const handleSelect = (age) => {
    setSelectedAge(age);
    hapticEngine.trigger('medium');
    
    setTimeout(() => {
      onNext({ age: age.range, group: age.label });
    }, 500);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {ageGroups.map((age, index) => (
        <motion.button
          key={age.range}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(age)}
          className={`p-6 rounded-2xl transition-all ${
            selectedAge === age
              ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl'
              : 'bg-white shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="text-5xl mb-3">{age.emoji}</div>
          <div className="font-bold text-lg">{age.range}</div>
          <div className="text-sm opacity-80">{age.label}</div>
        </motion.button>
      ))}
    </div>
  );
};

const InterestPicker = ({ onNext, audioEngine }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const interests = [
    { id: 'animals', emoji: '🦁', label: 'Animals' },
    { id: 'space', emoji: '🚀', label: 'Space' },
    { id: 'sports', emoji: '⚽', label: 'Sports' },
    { id: 'music', emoji: '🎵', label: 'Music' },
    { id: 'art', emoji: '🎨', label: 'Art' },
    { id: 'science', emoji: '🔬', label: 'Science' },
    { id: 'nature', emoji: '🌳', label: 'Nature' },
    { id: 'technology', emoji: '💻', label: 'Technology' },
    { id: 'food', emoji: '🍕', label: 'Food' },
    { id: 'travel', emoji: '✈️', label: 'Travel' },
    { id: 'games', emoji: '🎮', label: 'Games' },
    { id: 'books', emoji: '📚', label: 'Books' },
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => {
      const isSelected = prev.includes(interest.id);
      
      if (isSelected) {
        audioEngine.play('deselect');
        return prev.filter(i => i !== interest.id);
      } else {
        audioEngine.play('select');
        return [...prev, interest.id];
      }
    });
  };

  const handleContinue = () => {
    onNext({ interests: selectedInterests });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {interests.map((interest, index) => (
          <motion.button
            key={interest.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInterest(interest)}
            className={`p-4 rounded-xl transition-all ${
              selectedInterests.includes(interest.id)
                ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-xl'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
          >
            <div className="text-3xl mb-2">{interest.emoji}</div>
            <div className="text-sm font-medium">{interest.label}</div>
            {selectedInterests.includes(interest.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedInterests.length >= 3 ? 1 : 0.5 }}
        whileHover={selectedInterests.length >= 3 ? { scale: 1.05 } : {}}
        whileTap={selectedInterests.length >= 3 ? { scale: 0.95 } : {}}
        onClick={handleContinue}
        disabled={selectedInterests.length < 3}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedInterests.length >= 3
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selectedInterests.length < 3
          ? `Select at least ${3 - selectedInterests.length} more`
          : `Continue with ${selectedInterests.length} interests`}
      </motion.button>
    </div>
  );
};

const StyleAssessment = ({ onNext }) => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  const styles = [
    {
      id: 'visual',
      icon: Palette,
      title: 'Visual Learner',
      description: 'I learn best with colors, pictures, and animations',
      features: ['Color coding', 'Visual feedback', 'Animated hints']
    },
    {
      id: 'auditory',
      icon: Volume2,
      title: 'Auditory Learner',
      description: 'I learn best by listening and hearing feedback',
      features: ['Sound effects', 'Voice guidance', 'Audio rewards']
    },
    {
      id: 'kinesthetic',
      icon: Gamepad2,
      title: 'Hands-On Learner',
      description: 'I learn best by doing and interacting',
      features: ['Drag & drop', 'Touch interaction', 'Game mechanics']
    },
    {
      id: 'reading',
      icon: BookOpen,
      title: 'Reading/Writing',
      description: 'I learn best through text and written exercises',
      features: ['Detailed explanations', 'Written feedback', 'Text-based hints']
    }
  ];

  const handleSelect = (style) => {
    setSelectedStyle(style);
    setTimeout(() => {
      onNext({ learningStyle: style.id, features: style.features });
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {styles.map((style, index) => {
        const Icon = style.icon;
        return (
          <motion.button
            key={style.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(style)}
            className={`p-6 rounded-2xl text-left transition-all ${
              selectedStyle?.id === style.id
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl'
                : 'bg-white shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedStyle?.id === style.id ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <Icon className={`w-8 h-8 ${
                  selectedStyle?.id === style.id ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{style.title}</h3>
                <p className={`mb-3 ${
                  selectedStyle?.id === style.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {style.description}
                </p>
                
                <div className="space-y-1">
                  {style.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const FeatureSelection = ({ onNext, responses }) => {
  const [features, setFeatures] = useState({
    gamification: true,
    audio: true,
    animations: true,
    mascot: true,
    collaboration: false,
    parentDashboard: false
  });

  const featureList = [
    { 
      id: 'gamification',
      icon: Trophy,
      title: 'Points & Achievements',
      description: 'Earn points, unlock badges, and track streaks'
    },
    {
      id: 'audio',
      icon: Volume2,
      title: 'Sound Effects',
      description: 'Celebratory sounds and audio feedback'
    },
    {
      id: 'animations',
      icon: Sparkles,
      title: 'Visual Effects',
      description: 'Smooth animations and particle effects'
    },
    {
      id: 'mascot',
      icon: Star,
      title: 'Learning Companion',
      description: 'A friendly guide to help you learn'
    },
    {
      id: 'collaboration',
      icon: Users,
      title: 'Learn with Friends',
      description: 'Work together on sentences'
    },
    {
      id: 'parentDashboard',
      icon: Brain,
      title: 'Parent Dashboard',
      description: 'Progress tracking for parents'
    }
  ];

  const toggleFeature = (featureId) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const handleContinue = () => {
    onNext({ features });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {featureList.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFeature(feature.id)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    features[feature.id] ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: features[feature.id] ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
      >
        Continue with Selected Features
      </motion.button>
    </div>
  );
};

const PlacementTest = ({ onNext, audioEngine }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const questions = [
    {
      type: 'order',
      prompt: 'Put these words in the correct order:',
      words: ['cat', 'The', 'sleeps'],
      correct: ['The', 'cat', 'sleeps']
    },
    {
      type: 'missing',
      prompt: 'What word is missing?',
      sentence: 'The dog ___ in the park',
      options: ['runs', 'blue', 'quickly', 'and'],
      correct: 'runs'
    },
    {
      type: 'identify',
      prompt: 'What type of word is "happy"?',
      word: 'happy',
      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
      correct: 'Adjective'
    }
  ];

  const handleAnswer = (answer) => {
    const isCorrect = checkAnswer(answer, questions[currentQuestion]);
    setAnswers([...answers, { question: currentQuestion, correct: isCorrect }]);
    
    audioEngine.play(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const score = answers.filter(a => a.correct).length + (isCorrect ? 1 : 0);
        const level = score >= 2 ? 'intermediate' : 'beginner';
        onNext({ skillLevel: level, score, total: questions.length });
      }
    }, 1500);
  };

  const checkAnswer = (answer, question) => {
    if (question.type === 'order') {
      return JSON.stringify(answer) === JSON.stringify(question.correct);
    }
    return answer === question.correct;
  };

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentQuestion ? 'bg-green-500' :
                index === currentQuestion ? 'bg-blue-500' :
                'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4">{question.prompt}</h3>
        
        {question.type === 'order' && (
          <WordOrderQuestion
            words={question.words}
            onAnswer={handleAnswer}
          />
        )}
        
        {question.type === 'missing' && (
          <MissingWordQuestion
            sentence={question.sentence}
            options={question.options}
            onAnswer={handleAnswer}
          />
        )}
        
        {question.type === 'identify' && (
          <IdentifyWordQuestion
            word={question.word}
            options={question.options}
            onAnswer={handleAnswer}
          />
        )}
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={`text-6xl ${
              answers[answers.length - 1]?.correct ? '🎉' : '🤔'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Question Components
const WordOrderQuestion = ({ words, onAnswer }) => {
  const [arrangedWords, setArrangedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState(words);

  const addWord = (word) => {
    setArrangedWords([...arrangedWords, word]);
    setRemainingWords(remainingWords.filter(w => w !== word));
  };

  const removeWord = (word) => {
    setRemainingWords([...remainingWords, word]);
    setArrangedWords(arrangedWords.filter(w => w !== word));
  };

  const handleSubmit = () => {
    onAnswer(arrangedWords);
  };

  return (
    <div className="space-y-4">
      {/* Arranged words */}
      <div className="min-h-[60px] bg-gray-100 rounded-lg p-3 flex flex-wrap gap-2">
        {arrangedWords.map((word, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => removeWord(word)}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {word}
          </motion.button>
        ))}
        {arrangedWords.length === 0 && (
          <span className="text-gray-400">Click words to arrange them here</span>
        )}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {remainingWords.map((word, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWord(word)}
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg 
                     hover:border-blue-500 transition-colors"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {arrangedWords.length === words.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold
                   hover:bg-green-600 transition-colors"
        >
          Check Answer
        </motion.button>
      )}
    </div>
  );
};

const MissingWordQuestion = ({ sentence, options, onAnswer }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium p-4 bg-gray-100 rounded-lg">
        {sentence.replace('___', '______')}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(option)}
            className="p-3 bg-white border-2 border-gray-300 rounded-lg
                     hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const IdentifyWordQuestion = ({ word, options, onAnswer }) => {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-center p-4 bg-yellow-100 rounded-lg">
        "{word}"
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(option)}
            className="p-3 bg-white border-2 border-gray-300 rounded-lg
                     hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const CompletionStep = ({ onNext, responses }) => {
  const confettiRef = useRef();
  
  useEffect(() => {
    // Trigger confetti animation
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  }, []);

  const getPersonalizedMessage = () => {
    const { age, learningStyle, skillLevel } = responses;
    
    let message = "You're all set to start your learning journey!";
    
    if (skillLevel === 'intermediate' || skillLevel === 'advanced') {
      message = "Impressive skills! We've prepared advanced challenges just for you.";
    } else if (age && age.includes('4-6')) {
      message = "Get ready for fun and games while learning!";
    }
    
    return message;
  };

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-8xl mb-6"
      >
        🎊
      </motion.div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Congratulations!
        </h2>
        
        <p className="text-xl text-gray-600">
          {getPersonalizedMessage()}
        </p>
        
        <div className="bg-blue-50 rounded-xl p-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-3">Your personalized setup:</h3>
          <ul className="space-y-2 text-sm">
            {responses.age && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Age-appropriate content ready
              </li>
            )}
            {responses.interests && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {responses.interests.length} interests loaded
              </li>
            )}
            {responses.learningStyle && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {responses.learningStyle} learning optimized
              </li>
            )}
            {responses.features && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Features customized
              </li>
            )}
          </ul>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white 
                   rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl 
                   transition-all flex items-center gap-3 mx-auto"
        >
          Start Learning!
          <ArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

// Helper Components

const ProgressBar = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
      />
    </div>
  );
};

const BackgroundAnimation = ({ step }) => {
  const colors = [
    'from-blue-50 to-purple-50',
    'from-green-50 to-blue-50',
    'from-yellow-50 to-pink-50',
    'from-purple-50 to-pink-50',
    'from-blue-50 to-green-50',
    'from-orange-50 to-red-50',
    'from-green-50 to-teal-50'
  ];
  
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
      className={`fixed inset-0 bg-gradient-to-br ${colors[step % colors.length]}`}
    >
      {/* Floating shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute opacity-10"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`
          }}
        >
          <div className="w-32 h-32 bg-white rounded-full" />
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkipWarningModal = ({ onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md"
      >
        <h3 className="text-xl font-bold mb-3">Skip this step?</h3>
        <p className="text-gray-600 mb-6">
          This step helps personalize your experience. Skipping might give you a less optimal learning journey.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Skip Anyway
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Utility function to generate personalized config
function generatePersonalizedConfig(responses) {
  const config = {
    preferences: {},
    features: {},
    content: {}
  };

  // Age-based configuration
  if (responses.age) {
    const ageRange = responses.age.age;
    if (ageRange.includes('4-6')) {
      config.preferences.fontSize = 'large';
      config.preferences.sessionDuration = 10;
      config.features.simplifiedUI = true;
    } else if (ageRange.includes('13') || ageRange.includes('16')) {
      config.preferences.fontSize = 'small';
      config.preferences.sessionDuration = 30;
      config.features.advancedPatterns = true;
    }
  }

  // Learning style configuration
  if (responses['learning-style']) {
    const style = responses['learning-style'].learningStyle;
    config.preferences.learningStyle = style;
    
    switch (style) {
      case 'visual':
        config.features.animations = true;
        config.features.colorCoding = true;
        break;
      case 'auditory':
        config.features.audio = true;
        config.features.narration = true;
        break;
      case 'kinesthetic':
        config.features.dragDrop = true;
        config.features.gamification = true;
        break;
    }
  }

  // Interest-based content
  if (responses.interests) {
    config.content.themes = responses.interests.interests;
    config.content.customWordBanks = true;
  }

  // Skill level
  if (responses['skill-test']) {
    config.preferences.startingLevel = responses['skill-test'].skillLevel;
  }

  // Feature preferences
  if (responses.features) {
    Object.assign(config.features, responses.features.features);
  }

  return config;
}

export default OnboardingFlow;