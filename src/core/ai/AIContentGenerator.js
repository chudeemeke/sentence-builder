/**
 * AI Content Generation System
 * AAA+ Quality: Advanced content generation with educational optimization
 */

import { Configuration, OpenAIApi } from 'openai';

// Constants
const AI_MODEL = 'gpt-4-turbo-preview';
const FALLBACK_MODEL = 'gpt-3.5-turbo';
const MAX_RETRIES = 3;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Educational content templates
const CONTENT_TEMPLATES = {
  sentence: {
    simple: 'Create a simple sentence with subject and verb suitable for {age} year old about {topic}',
    compound: 'Create a compound sentence using "and/but/or" about {topic} for {level} learners',
    complex: 'Create a complex sentence with dependent clause about {topic} for advanced students',
    creative: 'Create an imaginative sentence about {topic} that sparks curiosity in {age} year olds'
  },
  
  wordBank: {
    themed: 'Generate {count} {partOfSpeech} words related to {theme} suitable for {level} level',
    graded: 'List {count} {partOfSpeech} words at {gradeLevel} reading level',
    contextual: 'Provide {count} {partOfSpeech} that work well in sentences about {context}'
  },
  
  explanation: {
    grammar: 'Explain why "{sentence}" is grammatically {correct/incorrect} in simple terms for {age} year old',
    pattern: 'Describe the {patternType} sentence pattern with examples a {level} student would understand',
    mistake: 'Explain the error in "{sentence}" and how to fix it for a {age} year old learner'
  },
  
  hint: {
    progressive: [
      'Give a visual hint about what type of word comes next',
      'Provide the first letter of the correct word',
      'Give 3 word options that could work',
      'Show the complete answer with explanation'
    ]
  }
};

/**
 * Main AI Content Generator Class
 */
export class AIContentGenerator {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.organization = config.organization;
    this.cacheEnabled = config.cacheEnabled !== false;
    this.cache = new Map();
    this.requestQueue = [];
    this.processing = false;
    
    // Initialize OpenAI API
    if (this.apiKey) {
      const configuration = new Configuration({
        apiKey: this.apiKey,
        organization: this.organization
      });
      this.openai = new OpenAIApi(configuration);
    }
    
    // Fallback to local generation if no API key
    this.useLocalGeneration = !this.apiKey;
  }

  /**
   * Generate contextual sentences based on user profile
   */
  async generateSentences(params) {
    const {
      topic,
      pattern = 'simple',
      count = 5,
      age = 10,
      level = 'intermediate',
      interests = [],
      avoid = []
    } = params;

    // Check cache first
    const cacheKey = this.getCacheKey('sentences', params);
    if (this.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const sentences = this.useLocalGeneration
        ? await this.generateLocalSentences(params)
        : await this.generateAISentences(params);
      
      // Validate and filter sentences
      const validated = sentences
        .filter(s => this.validateSentence(s, pattern))
        .filter(s => !this.containsInappropriateContent(s, age))
        .filter(s => !avoid.some(word => s.toLowerCase().includes(word.toLowerCase())));
      
      // Cache results
      if (this.cacheEnabled) {
        this.saveToCache(cacheKey, validated);
      }
      
      return validated;
    } catch (error) {
      console.error('Failed to generate sentences:', error);
      return this.getFallbackSentences(pattern, count);
    }
  }

  /**
   * Generate with OpenAI API
   */
  async generateAISentences(params) {
    const { topic, pattern, count, age, level, interests } = params;
    
    const prompt = this.buildPrompt({
      template: CONTENT_TEMPLATES.sentence[pattern] || CONTENT_TEMPLATES.sentence.simple,
      variables: { topic, age, level },
      context: `User interests: ${interests.join(', ')}. Generate ${count} different sentences.`,
      constraints: [
        'Use age-appropriate vocabulary',
        'Ensure grammatical correctness',
        'Make sentences engaging and educational',
        'Vary sentence structures',
        'Include positive themes'
      ]
    });

    const response = await this.callOpenAI(prompt, {
      temperature: 0.7,
      max_tokens: 500,
      n: 1
    });

    return this.parseSentencesFromResponse(response);
  }

  /**
   * Local generation without API
   */
  async generateLocalSentences(params) {
    const { topic, pattern, count, age, level } = params;
    
    // Sophisticated local generation using templates and rules
    const sentences = [];
    const templates = this.getSentenceTemplates(pattern, level);
    const vocabulary = this.getVocabulary(topic, age, level);
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const sentence = this.fillTemplate(template, vocabulary);
      sentences.push(this.capitalizeSentence(sentence));
    }
    
    return sentences;
  }

  /**
   * Generate custom word banks
   */
  async generateWordBank(params) {
    const {
      theme,
      partOfSpeech,
      count = 20,
      level = 'intermediate',
      gradeLevel = 5,
      context = null
    } = params;

    const cacheKey = this.getCacheKey('wordbank', params);
    if (this.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const words = this.useLocalGeneration
        ? await this.generateLocalWordBank(params)
        : await this.generateAIWordBank(params);
      
      // Sort by difficulty
      const sorted = this.sortWordsByDifficulty(words, level);
      
      // Add metadata
      const enriched = sorted.map(word => ({
        word,
        difficulty: this.calculateWordDifficulty(word),
        syllables: this.countSyllables(word),
        phonetic: this.getPhonetic(word),
        definition: this.getSimpleDefinition(word, gradeLevel)
      }));
      
      if (this.cacheEnabled) {
        this.saveToCache(cacheKey, enriched);
      }
      
      return enriched;
    } catch (error) {
      console.error('Failed to generate word bank:', error);
      return this.getFallbackWordBank(partOfSpeech, count);
    }
  }

  /**
   * Generate AI word bank
   */
  async generateAIWordBank(params) {
    const { theme, partOfSpeech, count, level, context } = params;
    
    const prompt = this.buildPrompt({
      template: CONTENT_TEMPLATES.wordBank.themed,
      variables: { count, partOfSpeech, theme, level },
      context: context || `Generate diverse vocabulary suitable for sentence building`,
      constraints: [
        'Include common and interesting words',
        'Ensure age-appropriate content',
        'Vary word lengths and complexity',
        'Avoid obscure or archaic terms'
      ]
    });

    const response = await this.callOpenAI(prompt, {
      temperature: 0.6,
      max_tokens: 300
    });

    return this.parseWordsFromResponse(response);
  }

  /**
   * Generate explanations for grammar concepts
   */
  async generateExplanation(params) {
    const {
      type = 'grammar',
      sentence = '',
      error = '',
      pattern = '',
      age = 10,
      level = 'intermediate'
    } = params;

    try {
      if (this.useLocalGeneration) {
        return this.generateLocalExplanation(params);
      }

      const template = CONTENT_TEMPLATES.explanation[type];
      const prompt = this.buildPrompt({
        template,
        variables: { sentence, error, pattern, age, level },
        constraints: [
          'Use simple, clear language',
          'Provide concrete examples',
          'Be encouraging and positive',
          'Keep explanation brief'
        ]
      });

      const response = await this.callOpenAI(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return this.parseExplanationFromResponse(response);
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      return this.getFallbackExplanation(type, params);
    }
  }

  /**
   * Generate progressive hints
   */
  async generateHint(params) {
    const {
      sentence,
      missingWord,
      hintLevel = 0,
      age = 10
    } = params;

    const hintTemplates = CONTENT_TEMPLATES.hint.progressive;
    
    if (hintLevel >= hintTemplates.length) {
      return { type: 'answer', content: missingWord };
    }

    try {
      const hint = this.useLocalGeneration
        ? this.generateLocalHint(params, hintLevel)
        : await this.generateAIHint(params, hintLevel);
      
      return {
        type: ['visual', 'letter', 'choices', 'answer'][hintLevel],
        content: hint,
        nextLevel: hintLevel + 1
      };
    } catch (error) {
      return this.getFallbackHint(missingWord, hintLevel);
    }
  }

  /**
   * Adaptive content generation based on performance
   */
  async generateAdaptiveContent(params) {
    const {
      performance,
      currentLevel,
      strengths = [],
      weaknesses = [],
      recentMistakes = [],
      targetSkills = []
    } = params;

    // Analyze performance data
    const analysis = this.analyzePerformance(performance);
    
    // Determine next content difficulty
    const nextDifficulty = this.calculateNextDifficulty(
      currentLevel,
      analysis.accuracy,
      analysis.speed
    );
    
    // Generate targeted practice
    const content = {
      sentences: [],
      focusAreas: [],
      recommendations: []
    };

    // Generate sentences targeting weak areas
    for (const weakness of weaknesses.slice(0, 3)) {
      const sentences = await this.generateSentences({
        pattern: weakness.pattern,
        topic: weakness.topic || 'general',
        level: nextDifficulty,
        count: 3
      });
      content.sentences.push(...sentences);
      content.focusAreas.push(weakness);
    }

    // Add recommendations
    content.recommendations = this.generateRecommendations(
      analysis,
      strengths,
      weaknesses
    );

    return content;
  }

  /**
   * Curriculum-aligned content generation
   */
  async generateCurriculumContent(params) {
    const {
      standard = 'common-core',
      gradeLevel = 3,
      unit = '',
      skill = '',
      count = 10
    } = params;

    // Map curriculum standards to content requirements
    const requirements = this.getCurriculumRequirements(standard, gradeLevel, skill);
    
    // Generate aligned content
    const content = {
      sentences: [],
      vocabulary: [],
      patterns: [],
      assessments: []
    };

    // Generate sentences meeting standards
    content.sentences = await this.generateSentences({
      pattern: requirements.sentenceTypes,
      level: requirements.level,
      count,
      topic: requirements.themes
    });

    // Generate vocabulary
    content.vocabulary = await this.generateWordBank({
      theme: requirements.themes,
      partOfSpeech: requirements.focus,
      gradeLevel,
      count: 30
    });

    // Generate pattern examples
    content.patterns = requirements.patterns.map(pattern => ({
      type: pattern,
      example: this.getPatternExample(pattern, gradeLevel),
      explanation: this.getPatternExplanation(pattern, gradeLevel)
    }));

    return content;
  }

  /**
   * Story-based content generation
   */
  async generateStoryContent(params) {
    const {
      theme = 'adventure',
      characters = [],
      setting = '',
      sentenceCount = 10,
      complexity = 'simple'
    } = params;

    // Build story context
    const storyContext = {
      characters: characters.length > 0 ? characters : this.generateCharacters(theme),
      setting: setting || this.generateSetting(theme),
      plot: this.generatePlotPoints(theme, 3)
    };

    // Generate story sentences
    const sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      const sentenceContext = {
        ...storyContext,
        plotPoint: storyContext.plot[Math.floor(i / (sentenceCount / 3))],
        previousSentence: sentences[i - 1] || null
      };
      
      const sentence = await this.generateStorySentence(sentenceContext, complexity);
      sentences.push(sentence);
    }

    return {
      story: sentences,
      context: storyContext,
      vocabulary: this.extractVocabulary(sentences),
      continuationPrompts: this.generateContinuationPrompts(sentences[sentences.length - 1])
    };
  }

  // ===== HELPER METHODS =====

  /**
   * Build AI prompt from template
   */
  buildPrompt({ template, variables, context, constraints }) {
    let prompt = template;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(`{${key}}`, value);
    }
    
    // Add context
    if (context) {
      prompt += `\n\nContext: ${context}`;
    }
    
    // Add constraints
    if (constraints && constraints.length > 0) {
      prompt += `\n\nRequirements:\n${constraints.map(c => `- ${c}`).join('\n')}`;
    }
    
    return prompt;
  }

  /**
   * Call OpenAI API with retry logic
   */
  async callOpenAI(prompt, options = {}) {
    const {
      model = AI_MODEL,
      temperature = 0.7,
      max_tokens = 500,
      n = 1
    } = options;

    let lastError;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.openai.createChatCompletion({
          model: attempt === 0 ? model : FALLBACK_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator specializing in language learning for children.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens,
          n
        });

        return response.data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        
        // Rate limit handling
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 5;
          await this.sleep(retryAfter * 1000);
        } else {
          await this.sleep(1000 * (attempt + 1)); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Parse sentences from AI response
   */
  parseSentencesFromResponse(response) {
    const sentences = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned && !cleaned.startsWith('#') && !cleaned.startsWith('*')) {
        // Remove numbering if present
        const sentence = cleaned.replace(/^\d+[\.\)]\s*/, '');
        if (sentence.length > 0) {
          sentences.push(sentence);
        }
      }
    }
    
    return sentences;
  }

  /**
   * Parse words from AI response
   */
  parseWordsFromResponse(response) {
    const words = [];
    const content = response.replace(/['"`,\.]/g, '');
    
    // Try different parsing strategies
    const strategies = [
      () => content.split('\n'),
      () => content.split(','),
      () => content.split(' ')
    ];
    
    for (const strategy of strategies) {
      const parsed = strategy()
        .map(w => w.trim())
        .filter(w => w && w.length > 0 && !w.includes(' '));
      
      if (parsed.length > 0) {
        words.push(...parsed);
        break;
      }
    }
    
    return [...new Set(words)]; // Remove duplicates
  }

  /**
   * Validate sentence structure
   */
  validateSentence(sentence, pattern) {
    // Basic validation
    if (!sentence || sentence.length < 3) return false;
    if (!sentence[0].match(/[A-Z]/)) return false;
    if (!sentence.match(/[.!?]$/)) return false;
    
    // Pattern-specific validation
    switch (pattern) {
      case 'simple':
        return sentence.split(' ').length >= 3 && sentence.split(' ').length <= 8;
      
      case 'compound':
        return sentence.match(/\b(and|but|or|so|yet)\b/i) !== null;
      
      case 'complex':
        return sentence.match(/\b(because|although|when|if|since|while)\b/i) !== null;
      
      default:
        return true;
    }
  }

  /**
   * Check for inappropriate content
   */
  containsInappropriateContent(text, age) {
    const inappropriate = [
      // Add age-inappropriate terms
      'violence', 'death', 'kill', 'hate', 'stupid'
    ];
    
    const lowerText = text.toLowerCase();
    
    // Check for inappropriate words
    for (const word of inappropriate) {
      if (lowerText.includes(word)) {
        return true;
      }
    }
    
    // Age-specific checks
    if (age < 8) {
      const tooComplex = ['politics', 'economy', 'philosophy'];
      for (const word of tooComplex) {
        if (lowerText.includes(word)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Calculate word difficulty
   */
  calculateWordDifficulty(word) {
    const factors = {
      length: word.length,
      syllables: this.countSyllables(word),
      commonality: this.getWordFrequency(word),
      phonetics: this.getPhoneticComplexity(word)
    };
    
    // Weighted calculation
    const difficulty = 
      (factors.length * 0.2) +
      (factors.syllables * 0.3) +
      ((100 - factors.commonality) * 0.3) +
      (factors.phonetics * 0.2);
    
    return Math.min(10, Math.max(1, Math.round(difficulty / 10)));
  }

  /**
   * Count syllables in a word
   */
  countSyllables(word) {
    word = word.toLowerCase();
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = /[aeiou]/.test(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Adjust for silent e
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  }

  /**
   * Get word frequency score
   */
  getWordFrequency(word) {
    // Simplified frequency scoring based on common word lists
    const veryCommon = ['the', 'a', 'an', 'and', 'is', 'it', 'in', 'to', 'of'];
    const common = ['cat', 'dog', 'run', 'jump', 'happy', 'big', 'small'];
    
    if (veryCommon.includes(word.toLowerCase())) return 100;
    if (common.includes(word.toLowerCase())) return 80;
    
    // Length-based approximation
    if (word.length <= 4) return 60;
    if (word.length <= 6) return 40;
    return 20;
  }

  /**
   * Get phonetic complexity
   */
  getPhoneticComplexity(word) {
    const complexPatterns = /ch|sh|th|ph|gh|ck|qu|x|z/gi;
    const matches = word.match(complexPatterns);
    return matches ? matches.length * 2 : 0;
  }

  /**
   * Sort words by difficulty
   */
  sortWordsByDifficulty(words, targetLevel) {
    const levelMap = {
      beginner: [1, 3],
      intermediate: [3, 6],
      advanced: [6, 10]
    };
    
    const [min, max] = levelMap[targetLevel] || [1, 10];
    
    return words
      .map(word => ({
        word,
        difficulty: this.calculateWordDifficulty(word)
      }))
      .filter(item => item.difficulty >= min && item.difficulty <= max)
      .sort((a, b) => a.difficulty - b.difficulty)
      .map(item => item.word);
  }

  /**
   * Cache management
   */
  getCacheKey(type, params) {
    return `${type}_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  saveToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Fallback content
   */
  getFallbackSentences(pattern, count) {
    const fallbacks = {
      simple: [
        'The cat sits on the mat.',
        'A bird sings in the tree.',
        'The sun shines brightly.',
        'Children play in the park.',
        'The dog runs quickly.'
      ],
      compound: [
        'The cat sleeps and the dog plays.',
        'I like apples but prefer oranges.',
        'We can walk or take the bus.',
        'The sun shines and birds sing.',
        'She reads books but he watches TV.'
      ],
      complex: [
        'When the sun rises, birds start singing.',
        'Because it was raining, we stayed inside.',
        'Although he was tired, he finished his homework.',
        'If you practice daily, you will improve.',
        'Since the door was open, the cat walked in.'
      ]
    };
    
    return fallbacks[pattern] || fallbacks.simple;
  }

  getFallbackWordBank(partOfSpeech, count) {
    const banks = {
      noun: ['cat', 'dog', 'tree', 'house', 'book', 'car', 'friend', 'school'],
      verb: ['run', 'jump', 'eat', 'sleep', 'play', 'read', 'write', 'sing'],
      adjective: ['big', 'small', 'happy', 'sad', 'fast', 'slow', 'hot', 'cold'],
      adverb: ['quickly', 'slowly', 'carefully', 'happily', 'quietly', 'loudly']
    };
    
    const words = banks[partOfSpeech] || banks.noun;
    return words.slice(0, count).map(word => ({
      word,
      difficulty: this.calculateWordDifficulty(word),
      syllables: this.countSyllables(word)
    }));
  }

  /**
   * Utility functions
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  capitalizeSentence(sentence) {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
}

// Export singleton instance
export default new AIContentGenerator();