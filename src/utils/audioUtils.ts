// Audio utility functions for the roulette app

export class AudioManager {
  private rouletteSpinAudio: HTMLAudioElement | null = null;
  private winnerAudio: HTMLAudioElement | null = null;
  private loserAudio: HTMLAudioElement | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isInitialized = false;

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

      // Set initial volume to 100% for all sounds
      this.rouletteSpinAudio.volume = 1.0;
      this.winnerAudio.volume = 1.0;
      this.loserAudio.volume = 1.0;
      this.backgroundMusic.volume = 1.0;

      // Preload the audio files
      this.rouletteSpinAudio.preload = 'auto';
      this.winnerAudio.preload = 'auto';
      this.loserAudio.preload = 'auto';
      this.backgroundMusic.preload = 'auto';

      // Set background music to loop
      this.backgroundMusic.loop = true;

      // Add event listeners for debugging
      this.backgroundMusic.addEventListener('loadstart', () => console.log('🎵 Background music load started'));
      this.backgroundMusic.addEventListener('canplay', () => console.log('🎵 Background music can play'));
      this.backgroundMusic.addEventListener('playing', () => console.log('🎵 Background music is playing'));
      this.backgroundMusic.addEventListener('error', (e) => console.error('🎵 Background music error:', e));

      // Add event listeners for loser sound debugging
      this.loserAudio.addEventListener('loadstart', () => console.log('🎵 Loser sound load started'));
      this.loserAudio.addEventListener('canplay', () => console.log('🎵 Loser sound can play'));
      this.loserAudio.addEventListener('playing', () => console.log('🎵 Loser sound is playing'));
      this.loserAudio.addEventListener('error', (e) => console.error('🎵 Loser sound error:', e));

      this.isInitialized = true;
      console.log('🎵 Audio manager initialized');
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
      this.loserAudio.currentTime = 0; // Reset to beginning
      console.log('🎵 Playing loser sound...');
      await this.loserAudio.play();
      console.log('✅ Loser sound played successfully');
    } catch (error) {
      console.error('❌ Error playing loser sound:', error);
    }
  }

  public async startBackgroundMusic() {
    if (!this.isInitialized || !this.backgroundMusic) {
      console.log('🔇 Audio not initialized or background music not available');
      return;
    }

    try {
      // Ensure the audio is ready
      if (this.backgroundMusic.readyState < 2) {
        console.log('🔇 Background music not ready, waiting...');
        await new Promise((resolve) => {
          this.backgroundMusic!.addEventListener('canplay', resolve, { once: true });
        });
      }

    

      // Reset to beginning and play
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.volume = 1.0; // Ensure volume is at 100%
      this.backgroundMusic.loop = true; // Ensure loop is enabled
      
      const playPromise = this.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Background music started successfully');
      }
    } catch (error) {
      console.error('Error playing background music:', error);
      throw error; // Re-throw to allow retry logic
    }
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      console.log('🔇 Background music stopped');
    }
  }

  public pauseBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      console.log('⏸️ Background music paused');
    }
  }

  public resumeBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(error => {
        console.error('Error resuming background music:', error);
      });
      console.log('▶️ Background music resumed');
    }
  }

  public lowerBackgroundMusicVolume() {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.0; // Bajar a 10% del volumen
      console.log('🔉 Background music volume lowered to 10%');
    }
  }

  public restoreBackgroundMusicVolume() {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 1.0; // Restaurar a 100% del volumen
      console.log('🔊 Background music volume restored to 100%');
    }
  }

  public forceStartBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    try {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.volume = 1.0;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.play().catch(error => {
        console.log('🔇 Force start failed:', error);
      });
    } catch (error) {
      console.error('Error in force start:', error);
    }
  }

  public isBackgroundMusicPlaying(): boolean {
    return this.backgroundMusic ? !this.backgroundMusic.paused : false;
  }

  public setVolume(rouletteVolume: number, winnerVolume: number, loserVolume?: number, backgroundVolume?: number) {
    // All volumes are set to 100% by default, this method is kept for compatibility
    if (this.rouletteSpinAudio) {
      this.rouletteSpinAudio.volume = 1.0;
    }
    if (this.winnerAudio) {
      this.winnerAudio.volume = 1.0;
    }
    if (this.loserAudio) {
      this.loserAudio.volume = 1.0;
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 1.0;
    }
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
