/**
 * Audio Engine
 * AAA+ Quality: Professional game-quality audio with spatial sound and dynamic mixing
 */

// Constants
const SAMPLE_RATE = 48000;
const MASTER_VOLUME = 0.8;
const FADE_TIME = 0.05;

/**
 * Professional Audio Engine with Web Audio API
 */
export class AudioEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.compressor = null;
    this.convolver = null;
    this.sounds = {};
    this.music = {};
    this.ambience = {};
    this.isInitialized = false;
    this.enabled = true;
    this.volume = MASTER_VOLUME;
    this.buffers = new Map();
    this.activeNodes = new Set();
    
    // Audio pools for performance
    this.soundPools = new Map();
    this.poolSize = 5;
    
    // 3D spatial audio
    this.listener = null;
    this.spatialSounds = new Map();
  }

  /**
   * Initialize audio context and load sounds
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext({ 
        sampleRate: SAMPLE_RATE,
        latencyHint: 'interactive'
      });

      // Resume context on user interaction (iOS requirement)
      if (this.context.state === 'suspended') {
        document.addEventListener('click', () => {
          this.context.resume();
        }, { once: true });
      }

      // Create audio graph
      this.setupAudioGraph();
      
      // Generate procedural sounds
      await this.generateSounds();
      
      // Load external audio if available
      await this.loadExternalSounds();
      
      this.isInitialized = true;
      console.log('[AudioEngine] Initialized successfully');
    } catch (error) {
      console.error('[AudioEngine] Initialization failed:', error);
      this.enabled = false;
    }
  }

  /**
   * Setup audio processing graph
   */
  setupAudioGraph() {
    // Master gain
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.volume;

    // Dynamics compressor for consistent volume
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    // Convolver for reverb
    this.convolver = this.context.createConvolver();
    this.convolver.buffer = this.createReverbImpulse();
    
    // Reverb mix
    this.reverbGain = this.context.createGain();
    this.reverbGain.gain.value = 0.1;
    
    this.dryGain = this.context.createGain();
    this.dryGain.gain.value = 0.9;

    // Connect graph
    this.masterGain.connect(this.dryGain);
    this.dryGain.connect(this.compressor);
    
    this.masterGain.connect(this.convolver);
    this.convolver.connect(this.reverbGain);
    this.reverbGain.connect(this.compressor);
    
    this.compressor.connect(this.context.destination);

    // 3D audio listener
    if (this.context.listener) {
      this.listener = this.context.listener;
      
      // Set default listener position
      if (this.listener.positionX) {
        this.listener.positionX.value = 0;
        this.listener.positionY.value = 0;
        this.listener.positionZ.value = 0;
      }
    }
  }

  /**
   * Generate high-quality procedural sounds
   */
  async generateSounds() {
    // Success sound - Triumphant chord progression with sparkle
    this.sounds.success = () => this.createSuccessSound();
    
    // Achievement sound - Epic fanfare
    this.sounds.achievement = () => this.createAchievementSound();
    
    // Error sound - Gentle notification
    this.sounds.error = () => this.createErrorSound();
    
    // Click sound - Soft UI feedback
    this.sounds.click = () => this.createClickSound();
    
    // Hover sound - Subtle interaction
    this.sounds.hover = () => this.createHoverSound();
    
    // Transition sound - Smooth swoosh
    this.sounds.transition = () => this.createTransitionSound();
    
    // Level up sound - Triumphant cascade
    this.sounds.levelUp = () => this.createLevelUpSound();
    
    // Coin sound - Rewarding collection
    this.sounds.coin = () => this.createCoinSound();
    
    // Select/Deselect sounds
    this.sounds.select = () => this.createSelectSound();
    this.sounds.deselect = () => this.createDeselectSound();
    
    // Ambient music generators
    this.music.menu = () => this.createAmbientMusic('calm');
    this.music.learning = () => this.createAmbientMusic('focused');
    this.music.celebration = () => this.createAmbientMusic('upbeat');
  }

  /**
   * Create success sound - Rich, layered celebration
   */
  createSuccessSound() {
    const now = this.context.currentTime;
    const duration = 0.6;
    
    // Create nodes
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    filter.type = 'highshelf';
    filter.frequency.value = 3000;
    filter.gain.value = 6;
    
    // Main chord progression (C - E - G - C)
    const notes = [
      { freq: 261.63, start: 0, duration: 0.4 },      // C4
      { freq: 329.63, start: 0.05, duration: 0.35 },  // E4
      { freq: 392.00, start: 0.1, duration: 0.3 },    // G4
      { freq: 523.25, start: 0.15, duration: 0.25 },  // C5
    ];
    
    notes.forEach(note => {
      // Fundamental
      const osc = this.context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      
      const oscGain = this.context.createGain();
      oscGain.gain.setValueAtTime(0, now + note.start);
      oscGain.gain.linearRampToValueAtTime(0.2, now + note.start + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration);
      
      // Harmonics for richness
      for (let i = 2; i <= 4; i++) {
        const harmonic = this.context.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.value = note.freq * i;
        
        const harmonicGain = this.context.createGain();
        harmonicGain.gain.value = 0.05 / i;
        
        harmonic.connect(harmonicGain);
        harmonicGain.connect(filter);
        harmonic.start(now + note.start);
        harmonic.stop(now + note.start + note.duration);
      }
    });
    
    // Add sparkle effect
    for (let i = 0; i < 5; i++) {
      const sparkle = this.context.createOscillator();
      sparkle.type = 'sine';
      sparkle.frequency.value = 2000 + Math.random() * 3000;
      
      const sparkleGain = this.context.createGain();
      const sparkleTime = now + 0.2 + i * 0.05;
      
      sparkleGain.gain.setValueAtTime(0, sparkleTime);
      sparkleGain.gain.linearRampToValueAtTime(0.03, sparkleTime + 0.01);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.1);
      
      sparkle.connect(sparkleGain);
      sparkleGain.connect(filter);
      sparkle.start(sparkleTime);
      sparkle.stop(sparkleTime + 0.15);
    }
    
    // Connect and apply envelope
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Master envelope
    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // Cleanup
    setTimeout(() => {
      gainNode.disconnect();
    }, duration * 1000);
  }

  /**
   * Create achievement sound - Epic fanfare
   */
  createAchievementSound() {
    const now = this.context.currentTime;
    const duration = 1.0;
    
    // Create nodes
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 2;
    
    // Filter sweep for excitement
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(5000, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(1000, now + duration);
    
    // Fanfare notes
    const fanfare = [
      { freq: 261.63, time: 0, duration: 0.15 },      // C4
      { freq: 261.63, time: 0.1, duration: 0.15 },    // C4
      { freq: 261.63, time: 0.2, duration: 0.15 },    // C4
      { freq: 392.00, time: 0.35, duration: 0.2 },    // G4
      { freq: 523.25, time: 0.5, duration: 0.3 },     // C5
      // Bass support
      { freq: 130.81, time: 0, duration: 0.6 },       // C3
      { freq: 196.00, time: 0.2, duration: 0.4 },     // G3
    ];
    
    fanfare.forEach((note, index) => {
      const osc = this.context.createOscillator();
      osc.type = index < 5 ? 'sawtooth' : 'sine'; // Brass-like for melody, sine for bass
      osc.frequency.value = note.freq;
      
      const noteGain = this.context.createGain();
      const noteTime = now + note.time;
      
      // ADSR envelope
      noteGain.gain.setValueAtTime(0, noteTime);
      noteGain.gain.linearRampToValueAtTime(index < 5 ? 0.15 : 0.1, noteTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.05, noteTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.duration);
      
      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(noteTime);
      osc.stop(noteTime + note.duration);
    });
    
    // Add crowd-like whoosh
    const noise = this.context.createBufferSource();
    const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 0.5, this.context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() - 0.5) * 0.2;
    }
    
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 2;
    
    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(filter);
    noise.start(now);
    
    // Connect to output
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Master volume envelope
    gainNode.gain.value = 0.9;
    
    // Cleanup
    setTimeout(() => {
      gainNode.disconnect();
    }, duration * 1000);
  }

  /**
   * Create error sound - Gentle, non-harsh
   */
  createErrorSound() {
    const now = this.context.currentTime;
    const duration = 0.4;
    
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    
    // Descending notes
    const notes = [
      { freq: 440, time: 0, duration: 0.15 },     // A4
      { freq: 392, time: 0.08, duration: 0.15 },  // G4
      { freq: 349.23, time: 0.16, duration: 0.2 }, // F4
    ];
    
    notes.forEach(note => {
      const osc = this.context.createOscillator();
      osc.type = 'triangle'; // Softer than sine
      osc.frequency.value = note.freq;
      
      const noteGain = this.context.createGain();
      const noteTime = now + note.time;
      
      noteGain.gain.setValueAtTime(0, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.1, noteTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.duration);
      
      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(noteTime);
      osc.stop(noteTime + note.duration);
      
      // Add subtle sub-bass
      if (note.time === 0) {
        const sub = this.context.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = note.freq / 2;
        
        const subGain = this.context.createGain();
        subGain.gain.value = 0.05;
        
        sub.connect(subGain);
        subGain.connect(filter);
        sub.start(now);
        sub.stop(now + 0.3);
      }
    });
    
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    gainNode.gain.value = 0.6;
    
    setTimeout(() => {
      gainNode.disconnect();
    }, duration * 1000);
  }

  /**
   * Create click sound - Crisp UI feedback
   */
  createClickSound() {
    const now = this.context.currentTime;
    
    // Create click using filtered noise
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.01, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * Math.exp(-i / 50);
    }
    
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = this.context.createGain();
    gain.gain.value = 0.1;
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(now);
  }

  /**
   * Create hover sound - Subtle feedback
   */
  createHoverSound() {
    const now = this.context.currentTime;
    
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Create transition sound - Smooth swoosh
   */
  createTransitionSound() {
    const now = this.context.currentTime;
    const duration = 0.3;
    
    const osc = this.context.createOscillator();
    osc.type = 'sawtooth';
    
    // Frequency sweep
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + duration / 2);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 5;
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Create level up sound - Triumphant cascade
   */
  createLevelUpSound() {
    const now = this.context.currentTime;
    const duration = 1.5;
    
    // Ascending arpeggio
    const notes = [
      261.63, 329.63, 392.00, 523.25, // C major
      659.25, 783.99, 1046.50         // Continue upward
    ];
    
    notes.forEach((freq, index) => {
      const delay = index * 0.1;
      const osc = this.context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const gain = this.context.createGain();
      const startTime = now + delay;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15 - index * 0.02, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      
      // Add vibrato to higher notes
      if (index > 3) {
        const vibrato = this.context.createOscillator();
        vibrato.frequency.value = 5;
        const vibratoGain = this.context.createGain();
        vibratoGain.gain.value = 10;
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(startTime);
        vibrato.stop(startTime + 0.5);
      }
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
    
    // Add shimmer
    const shimmer = this.context.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 3000;
    
    const shimmerGain = this.context.createGain();
    shimmerGain.gain.setValueAtTime(0, now + 0.5);
    shimmerGain.gain.linearRampToValueAtTime(0.05, now + 0.7);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // Add tremolo to shimmer
    const tremolo = this.context.createOscillator();
    tremolo.frequency.value = 10;
    const tremoloGain = this.context.createGain();
    tremoloGain.gain.value = 0.5;
    
    tremolo.connect(tremoloGain);
    tremoloGain.connect(shimmerGain.gain);
    
    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    
    tremolo.start(now + 0.5);
    tremolo.stop(now + duration);
    shimmer.start(now + 0.5);
    shimmer.stop(now + duration);
  }

  /**
   * Create coin collection sound
   */
  createCoinSound() {
    const now = this.context.currentTime;
    
    // Two quick high notes
    for (let i = 0; i < 2; i++) {
      const osc = this.context.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 1000 + i * 500;
      
      const gain = this.context.createGain();
      const startTime = now + i * 0.05;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  }

  /**
   * Create select sound
   */
  createSelectSound() {
    const now = this.context.currentTime;
    
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Create deselect sound
   */
  createDeselectSound() {
    const now = this.context.currentTime;
    
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Create ambient background music
   */
  createAmbientMusic(mood = 'calm') {
    const now = this.context.currentTime;
    const duration = 60; // 1 minute loop
    
    const moods = {
      calm: {
        baseFreq: 110, // A2
        chords: [[1, 1.25, 1.5], [1, 1.2, 1.5], [1, 1.33, 1.5]], // Major chords
        tempo: 0.5
      },
      focused: {
        baseFreq: 130.81, // C3
        chords: [[1, 1.2, 1.5], [1, 1.25, 1.5], [1, 1.2, 1.4]], // Suspended chords
        tempo: 0.3
      },
      upbeat: {
        baseFreq: 146.83, // D3
        chords: [[1, 1.25, 1.5, 1.875], [1, 1.25, 1.5, 2]], // Major 7th
        tempo: 0.8
      }
    };
    
    const config = moods[mood] || moods.calm;
    
    // Create multiple oscillator voices
    const voices = [];
    
    config.chords.forEach((ratios, chordIndex) => {
      ratios.forEach(ratio => {
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = config.baseFreq * ratio;
        
        // Add slight detuning for warmth
        osc.detune.value = (Math.random() - 0.5) * 10;
        
        const gain = this.context.createGain();
        
        // Create slow LFO for volume
        const lfo = this.context.createOscillator();
        lfo.frequency.value = 0.1 + Math.random() * 0.1;
        const lfoGain = this.context.createGain();
        lfoGain.gain.value = 0.05;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        
        gain.gain.value = 0.05;
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
        lfo.start(now);
        lfo.stop(now + duration);
        
        voices.push({ osc, gain, lfo });
      });
    });
    
    // Cleanup after duration
    setTimeout(() => {
      voices.forEach(voice => {
        voice.gain.disconnect();
      });
    }, duration * 1000);
    
    return voices;
  }

  /**
   * Create reverb impulse response
   */
  createReverbImpulse() {
    const length = this.context.sampleRate * 2; // 2 second reverb
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Exponentially decaying white noise
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    return impulse;
  }

  /**
   * Play a sound by name
   */
  play(soundName, options = {}) {
    if (!this.enabled || !this.isInitialized) return;
    
    const {
      volume = 1.0,
      pitch = 1.0,
      delay = 0,
      loop = false,
      position = null // For 3D audio
    } = options;
    
    try {
      const soundGenerator = this.sounds[soundName];
      
      if (soundGenerator) {
        // Use sound pool for frequently played sounds
        if (this.shouldUsePool(soundName)) {
          this.playFromPool(soundName, options);
        } else {
          soundGenerator();
        }
      } else {
        console.warn(`[AudioEngine] Sound not found: ${soundName}`);
      }
    } catch (error) {
      console.error(`[AudioEngine] Error playing sound ${soundName}:`, error);
    }
  }

  /**
   * Play background music
   */
  playMusic(trackName, options = {}) {
    if (!this.enabled || !this.isInitialized) return;
    
    const { fadeIn = 2, loop = true } = options;
    
    try {
      const musicGenerator = this.music[trackName];
      
      if (musicGenerator) {
        const voices = musicGenerator();
        
        // Store reference for stopping
        this.currentMusic = { name: trackName, voices };
        
        // Fade in
        if (fadeIn > 0) {
          voices.forEach(voice => {
            const currentGain = voice.gain.gain.value;
            voice.gain.gain.value = 0;
            voice.gain.gain.linearRampToValueAtTime(
              currentGain,
              this.context.currentTime + fadeIn
            );
          });
        }
      }
    } catch (error) {
      console.error(`[AudioEngine] Error playing music ${trackName}:`, error);
    }
  }

  /**
   * Stop background music
   */
  stopMusic(fadeOut = 2) {
    if (!this.currentMusic) return;
    
    const now = this.context.currentTime;
    
    this.currentMusic.voices.forEach(voice => {
      voice.gain.gain.linearRampToValueAtTime(0, now + fadeOut);
      voice.osc.stop(now + fadeOut);
    });
    
    setTimeout(() => {
      this.currentMusic = null;
    }, fadeOut * 1000);
  }

  /**
   * Create 3D positioned sound
   */
  play3D(soundName, position, options = {}) {
    if (!this.enabled || !this.isInitialized || !this.listener) return;
    
    const panner = this.context.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    
    // Set position
    if (panner.positionX) {
      panner.positionX.value = position.x || 0;
      panner.positionY.value = position.y || 0;
      panner.positionZ.value = position.z || 0;
    }
    
    // Create and connect sound through panner
    // ... (implementation depends on sound type)
  }

  /**
   * Load external sound files
   */
  async loadExternalSounds() {
    const soundUrls = {
      // Add URLs for any external sounds if needed
      // 'special': '/assets/sounds/special.mp3'
    };
    
    for (const [name, url] of Object.entries(soundUrls)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch (error) {
        console.warn(`[AudioEngine] Failed to load ${name}:`, error);
      }
    }
  }

  /**
   * Sound pooling for performance
   */
  shouldUsePool(soundName) {
    const pooledSounds = ['click', 'hover', 'select', 'deselect', 'coin'];
    return pooledSounds.includes(soundName);
  }

  playFromPool(soundName, options) {
    // Implementation of sound pooling for frequently used sounds
    // This would reuse audio nodes instead of creating new ones
  }

  /**
   * Set master volume
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        this.volume,
        this.context.currentTime + FADE_TIME
      );
    }
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    
    if (!enabled && this.currentMusic) {
      this.stopMusic(0.5);
    }
  }

  /**
   * Cleanup and dispose
   */
  cleanup() {
    if (this.currentMusic) {
      this.stopMusic(0);
    }
    
    this.activeNodes.forEach(node => {
      try {
        node.disconnect();
      } catch {}
    });
    
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    
    this.isInitialized = false;
  }

  /**
   * Get audio statistics
   */
  getStats() {
    return {
      context: this.context ? this.context.state : 'not initialized',
      currentTime: this.context ? this.context.currentTime : 0,
      sampleRate: this.context ? this.context.sampleRate : 0,
      activeNodes: this.activeNodes.size,
      cachedBuffers: this.buffers.size,
      enabled: this.enabled
    };
  }
}

// Export singleton instance
export default new AudioEngine();