'use client';

import React, { useState, useEffect, useRef } from 'react';
import SpinWheel from '@/components/SpinWheel';
import PrizeManager from '@/components/PrizeManager';
import AudioControls from '@/components/AudioControls';
import { Prize, WheelConfiguration } from '@/types';
import { getWheelConfiguration } from '@/utils/api';
import { getAudioManager } from '@/utils/audioUtils';

export default function Home() {
  // Default prizes for fallback
  const defaultPrizes: Prize[] = [
    { id: '1', text: '$100', color: '#FF6B6B' },
    { id: '2', text: '$50', color: '#4ECDC4' },
    { id: '3', text: '$30', color: '#45B7D1' },
    { id: '4', text: '$20', color: '#96CEB4' },
    { id: '5', text: '$10', color: '#FECA57' },
    { id: '6', text: 'JACKPOT!', color: '#FF9FF3' },
    { id: '7', text: '$5', color: '#54A0FF' },
    { id: '8', text: 'Inténtalo de nuevo', color: '#5F27CD' },
  ];

  const [prizes, setPrizes] = useState<Prize[]>(defaultPrizes);
  const [wheelConfig, setWheelConfig] = useState<WheelConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrizeManager, setShowPrizeManager] = useState(false);
  const audioManager = useRef(getAudioManager());
  const [backgroundMusicStarted, setBackgroundMusicStarted] = useState(false);

  // Fetch wheel configuration from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const config = await getWheelConfiguration();
        setWheelConfig(config);
        setPrizes(config.prizes);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch wheel configuration:', err);
        setError('Failed to load wheel configuration. Using default settings.');
        // Keep default prizes if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Start background music when component mounts
  useEffect(() => {
    const startBackgroundMusic = async () => {
      try {
        await audioManager.current.startBackgroundMusic();
        setBackgroundMusicStarted(true);
        console.log('🎵 Background music started automatically');
      } catch (error) {
        console.log('🔇 Background music blocked, trying alternative methods');
        
        // Try force start method
        setTimeout(() => {
          audioManager.current.forceStartBackgroundMusic();
          setBackgroundMusicStarted(true);
        }, 500);
        
        // Try again after a longer delay
        setTimeout(async () => {
          try {
            await audioManager.current.startBackgroundMusic();
            setBackgroundMusicStarted(true);
            console.log('🎵 Background music started after delay');
          } catch (retryError) {
            console.log('🔇 Background music still blocked, waiting for user interaction');
          }
        }, 2000);
      }
    };

    // Start immediately when component mounts
    startBackgroundMusic();
    
    // Also try after a short delay to handle timing issues
    setTimeout(startBackgroundMusic, 1000);
  }, []); // Empty dependency array to run only once

  // Start background music on first user interaction (for browsers that block autoplay)
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!backgroundMusicStarted) {
        try {
          await audioManager.current.startBackgroundMusic();
          setBackgroundMusicStarted(true);
          console.log('🎵 Background music started on user interaction');
        } catch (error) {
          console.error('Failed to start background music:', error);
        }
      }
    };

    // Add event listeners for user interactions
    const events = ['click', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [backgroundMusicStarted]);

  const handleWin = (prize: Prize, isPositive?: boolean) => {
    // This function is now handled by SpinWheel's internal modal
    console.log('Prize won:', prize, 'isPositive:', isPositive);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col overflow-hidden relative">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-red-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,215,0,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(220,20,60,0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="text-white text-xl font-bold">PREPARANDO LA RULETA...</div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Wheel Container - Takes most of the screen */}
      <div className="flex-1 flex items-center justify-center p-0">
        <SpinWheel 
          prizes={prizes} 
          onWin={handleWin} 
          colors={wheelConfig?.colors}
          logo={wheelConfig?.logo}
        />
      </div>

      {/* Temporary debug button for background music */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={() => {
            console.log('🎵 Manual start attempt');
            audioManager.current.forceStartBackgroundMusic();
            setBackgroundMusicStarted(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          🎵
        </button>
      </div>

    </div>
  );
}
