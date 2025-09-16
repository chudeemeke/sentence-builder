import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Lightbulb, Award, BookOpen } from 'lucide-react';

const SentenceBuilder = () => {
  // Word banks for each part of speech
  const wordBanks = {
    article: ['The', 'A', 'An'],
    subject: ['cat', 'dog', 'girl', 'boy', 'bird', 'teacher', 'rabbit', 'elephant'],
    verb: ['runs', 'jumps', 'eats', 'sleeps', 'plays', 'reads', 'sings', 'walks'],
    adjective: ['happy', 'big', 'small', 'red', 'funny', 'sleepy', 'hungry', 'quick'],
    object: ['ball', 'book', 'apple', 'game', 'song', 'story', 'food', 'toy'],
    preposition: ['in', 'on', 'under', 'with', 'near', 'behind', 'above', 'beside'],
    place: ['park', 'house', 'school', 'garden', 'tree', 'bed', 'table', 'yard']
  };

  const [selectedWords, setSelectedWords] = useState([]);
  const [currentPattern, setCurrentPattern] = useState('simple');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [completedSentences, setCompletedSentences] = useState([]);

  // Sentence patterns
  const patterns = {
    simple: {
      name: 'Simple Sentence',
      structure: ['article', 'subject', 'verb'],
      example: 'The cat sleeps.',
      hint: 'Start with The/A/An, add who/what, then what they do!'
    },
    withAdjective: {
      name: 'With Describing Word',
      structure: ['article', 'adjective', 'subject', 'verb'],
      example: 'The happy dog plays.',
      hint: 'Add a word that describes the subject!'
    },
    withObject: {
      name: 'Action + Thing',
      structure: ['article', 'subject', 'verb', 'article', 'object'],
      example: 'The girl reads a book.',
      hint: 'What is the subject doing something to?'
    },
    withPlace: {
      name: 'Where It Happens',
      structure: ['article', 'subject', 'verb', 'preposition', 'article', 'place'],
      example: 'The bird sings in the tree.',
      hint: 'Add where the action happens!'
    },
    complete: {
      name: 'Full Sentence',
      structure: ['article', 'adjective', 'subject', 'verb', 'article', 'object', 'preposition', 'article', 'place'],
      example: 'The happy girl reads a book in the garden.',
      hint: 'Use all the parts to make a complete sentence!'
    }
  };

  // Part of speech colors and labels
  const partOfSpeechInfo = {
    article: { color: 'bg-purple-500', label: 'Article (The/A/An)', icon: '🔤' },
    subject: { color: 'bg-blue-500', label: 'Subject (Who/What)', icon: '👤' },
    verb: { color: 'bg-green-500', label: 'Verb (Action)', icon: '🏃' },
    adjective: { color: 'bg-yellow-500', label: 'Adjective (Describing)', icon: '✨' },
    object: { color: 'bg-orange-500', label: 'Object (Thing)', icon: '📦' },
    preposition: { color: 'bg-pink-500', label: 'Preposition (Position)', icon: '📍' },
    place: { color: 'bg-indigo-500', label: 'Place (Where)', icon: '🏠' }
  };

  const addWord = (word, type) => {
    const newWord = { word, type, id: Date.now() + Math.random() };
    setSelectedWords([...selectedWords, newWord]);
    setFeedback('');
  };

  const removeWord = (id) => {
    setSelectedWords(selectedWords.filter(w => w.id !== id));
    setFeedback('');
  };

  const clearSentence = () => {
    setSelectedWords([]);
    setFeedback('');
    setShowHint(false);
  };

  const checkSentence = () => {
    const pattern = patterns[currentPattern];
    const userStructure = selectedWords.map(w => w.type);
    
    // Check if structure matches
    const isCorrect = JSON.stringify(userStructure) === JSON.stringify(pattern.structure);
    
    if (isCorrect) {
      const sentence = selectedWords.map(w => w.word).join(' ') + '.';
      setFeedback('success');
      setScore(score + 10);
      setCompletedSentences([...completedSentences, sentence]);
      
      // Clear after success
      setTimeout(() => {
        clearSentence();
        setFeedback('');
      }, 2000);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const getSentenceDisplay = () => {
    if (selectedWords.length === 0) {
      return <span className="text-gray-400 text-2xl">Click words below to build a sentence!</span>;
    }
    
    return selectedWords.map(w => w.word).join(' ') + (selectedWords.length > 0 ? '.' : '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Sentence Builder
              </h1>
              <p className="text-gray-600 mt-2">Learn sentence structure by building your own!</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
                <Award />
                <span>{score}</span>
              </div>
              <p className="text-sm text-gray-600">Points</p>
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(patterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentPattern(key);
                  clearSentence();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPattern === key
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pattern.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Pattern Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Pattern: {patterns[currentPattern].name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {patterns[currentPattern].structure.map((part, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${partOfSpeechInfo[part].color}`}
                  >
                    {partOfSpeechInfo[part].icon} {part}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">
                <strong>Example:</strong> {patterns[currentPattern].example}
              </p>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2"
            >
              <Lightbulb size={20} />
              Hint
            </button>
          </div>
          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-yellow-800">{patterns[currentPattern].hint}</p>
            </div>
          )}
        </div>

        {/* Sentence Building Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Sentence:</h3>
          <div className={`min-h-24 bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-2 border-2 transition-all ${
            feedback === 'success' ? 'border-green-500 bg-green-50' : 
            feedback === 'error' ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}>
            {selectedWords.length === 0 ? (
              <span className="text-gray-400 text-xl">Click words below to build a sentence!</span>
            ) : (
              selectedWords.map((w, idx) => (
                <span
                  key={w.id}
                  onClick={() => removeWord(w.id)}
                  className={`px-4 py-2 rounded-lg text-white font-medium cursor-pointer hover:opacity-80 transition-all transform hover:scale-105 ${
                    partOfSpeechInfo[w.type].color
                  }`}
                  title="Click to remove"
                >
                  {w.word}
                </span>
              ))
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={checkSentence}
              disabled={selectedWords.length === 0}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
            >
              <CheckCircle size={20} />
              Check Sentence
            </button>
            <button
              onClick={clearSentence}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-medium"
            >
              <RefreshCw size={20} />
              Clear
            </button>
          </div>

          {/* Feedback Messages */}
          {feedback === 'success' && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 text-green-800">
              <CheckCircle />
              <span className="font-medium">Great job! You built a perfect sentence! +10 points!</span>
            </div>
          )}
          {feedback === 'error' && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-800">
              <XCircle />
              <span className="font-medium">Not quite right. Check the pattern guide and try again!</span>
            </div>
          )}
        </div>

        {/* Word Banks */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Word Banks - Click to Add!</h3>
          <div className="space-y-4">
            {patterns[currentPattern].structure
              .filter((value, index, self) => self.indexOf(value) === index)
              .map(partType => (
                <div key={partType} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${partOfSpeechInfo[partType].color}`}>
                      {partOfSpeechInfo[partType].icon} {partOfSpeechInfo[partType].label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wordBanks[partType].map(word => (
                      <button
                        key={word}
                        onClick={() => addWord(word, partType)}
                        className={`px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all transform hover:scale-105 ${
                          partOfSpeechInfo[partType].color
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Completed Sentences */}
        {completedSentences.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Completed Sentences:</h3>
            <div className="space-y-2">
              {completedSentences.map((sentence, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-700">{sentence}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilder;