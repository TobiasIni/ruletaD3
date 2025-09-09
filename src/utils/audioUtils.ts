// Audio utility functions for the roulette app

export class AudioManager {
  private rouletteSpinAudio: HTMLAudioElement | null = null;
  private winnerAudio: HTMLAudioElement | null = null;
  private loserAudio: HTMLAudioElement | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isInitialized = false;
  private backgroundMusicEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private async initializeAudio() {
    try {
      // Create audio elements with the MP3 files
      this.rouletteSpinAudio = new Audio('/sounds/ruidoRuleta.mp3');
      this.winnerAudio = new Audio('/sounds/sonidoGanador.mp3');
      this.loserAudio = new Audio('/sounds/sonidoPerder.mp3');
      this.backgroundMusic = new Audio('/sounds/musicaFondo.mp3');

      // Set initial volume
      this.rouletteSpinAudio.volume = 0.6;
      this.winnerAudio.volume = 0.7;
      this.loserAudio.volume = 0.7;
      this.backgroundMusic.volume = 0.3; // Lower volume for background music

      // Preload the audio files
      this.rouletteSpinAudio.preload = 'auto';
      this.winnerAudio.preload = 'auto';
      this.loserAudio.preload = 'auto';
      this.backgroundMusic.preload = 'auto';

      // Configure background music for looping
      this.backgroundMusic.loop = true;

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  public async playRouletteSpinSound() {
    if (!this.isInitialized || !this.rouletteSpinAudio) return;

    try {
      // Reset audio to beginning
      this.rouletteSpinAudio.currentTime = 0;
      await this.rouletteSpinAudio.play();
    } catch (error) {
      console.error('Error playing roulette spin sound:', error);
    }
  }

  public stopRouletteSpinSound() {
    if (this.rouletteSpinAudio) {
      this.rouletteSpinAudio.pause();
      this.rouletteSpinAudio.currentTime = 0;
    }
  }

  public async playWinnerSound() {
    if (!this.isInitialized || !this.winnerAudio) return;

    try {
      this.winnerAudio.currentTime = 0;
      await this.winnerAudio.play();
    } catch (error) {
      console.error('Error playing winner sound:', error);
    }
  }

  public async playLoserSound() {
    console.log('🎵 Attempting to play loser sound...');
    console.log('🎵 Initialized:', this.isInitialized);
    console.log('🎵 Loser audio exists:', !!this.loserAudio);
    
    if (!this.isInitialized || !this.loserAudio) {
      console.error('❌ Cannot play loser sound - not initialized or audio missing');
      return;
    }

    try {
      this.loserAudio.currentTime = 0;
      console.log('🎵 Playing loser sound...');
      await this.loserAudio.play();
      console.log('✅ Loser sound played successfully');
    } catch (error) {
      console.error('❌ Error playing loser sound:', error);
    }
  }

  // Background music controls
  public async startBackgroundMusic() {
    if (!this.backgroundMusic || !this.backgroundMusicEnabled) return;

    try {
      this.backgroundMusic.currentTime = 0;
      console.log('🎵 Starting background music...');
      await this.backgroundMusic.play();
      console.log('✅ Background music started successfully');
    } catch (error) {
      console.error('❌ Error starting background music:', error);
      // Auto-play might be blocked, we'll try again on first user interaction
    }
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      console.log('⏹️ Background music stopped');
    }
  }

  public toggleBackgroundMusic() {
    if (!this.backgroundMusic) return;

    if (this.backgroundMusic.paused) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  public setBackgroundMusicEnabled(enabled: boolean) {
    this.backgroundMusicEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }

  public setVolume(rouletteVolume: number, winnerVolume: number, loserVolume?: number, backgroundVolume?: number) {
    if (this.rouletteSpinAudio) {
      this.rouletteSpinAudio.volume = Math.max(0, Math.min(1, rouletteVolume));
    }
    if (this.winnerAudio) {
      this.winnerAudio.volume = Math.max(0, Math.min(1, winnerVolume));
    }
    if (this.loserAudio && loserVolume !== undefined) {
      this.loserAudio.volume = Math.max(0, Math.min(1, loserVolume));
    }
    if (this.backgroundMusic && backgroundVolume !== undefined) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, backgroundVolume));
    }
  }

  public getBackgroundMusicStatus() {
    return {
      isPlaying: this.backgroundMusic ? !this.backgroundMusic.paused : false,
      isEnabled: this.backgroundMusicEnabled,
      volume: this.backgroundMusic?.volume || 0
    };
  }
}

// Singleton instance
let audioManager: AudioManager | null = null;

export const getAudioManager = (): AudioManager => {
  if (!audioManager) {
    audioManager = new AudioManager();
  }
  return audioManager;
};
