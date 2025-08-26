'use client';

import React, { useState, useRef } from 'react';
import { getAudioManager } from '@/utils/audioUtils';

const AudioControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rouletteVolume, setRouletteVolume] = useState(60);
  const [winnerVolume, setWinnerVolume] = useState(70);
  const audioManager = useRef(getAudioManager());

  const handleRouletteVolumeChange = (volume: number) => {
    setRouletteVolume(volume);
    audioManager.current.setVolume(volume / 100, winnerVolume / 100);
  };

  const handleWinnerVolumeChange = (volume: number) => {
    setWinnerVolume(volume);
    audioManager.current.setVolume(rouletteVolume / 100, volume / 100);
  };

  const testRouletteSound = () => {
    audioManager.current.playRouletteSpinSound();
  };

  const testWinnerSound = () => {
    audioManager.current.playWinnerSound();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-2xl hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105 text-sm border border-blue-400"
        title="Controles de Audio"
      >
        🔊
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg p-4 shadow-2xl border-2 border-blue-400 min-w-[250px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-sm">Audio</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Roulette Volume */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-xs">Ruleta</label>
            <button
              onClick={testRouletteSound}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Test
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rouletteVolume}
            onChange={(e) => handleRouletteVolumeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-center text-white text-xs mt-1">{rouletteVolume}%</div>
        </div>

        {/* Winner Volume */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-xs">Ganador</label>
            <button
              onClick={testWinnerSound}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs transition-colors font-bold"
            >
              Test
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={winnerVolume}
            onChange={(e) => handleWinnerVolumeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-center text-white text-xs mt-1">{winnerVolume}%</div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AudioControls;
