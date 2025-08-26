'use client';

import React, { useState } from 'react';
import SpinWheel from '@/components/SpinWheel';
import PrizeManager from '@/components/PrizeManager';
import WinnerModal from '@/components/WinnerModal';
import { Prize } from '@/types';

export default function Home() {
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: '1', text: '$100', color: '#FF6B6B' },
    { id: '2', text: '$50', color: '#4ECDC4' },
    { id: '3', text: '$30', color: '#45B7D1' },
    { id: '4', text: '$20', color: '#96CEB4' },
    { id: '5', text: '$10', color: '#FECA57' },
    { id: '6', text: 'JACKPOT!', color: '#FF9FF3' },
    { id: '7', text: '$5', color: '#54A0FF' },
    { id: '8', text: 'Inténtalo de nuevo', color: '#5F27CD' },
  ]);

  const [winner, setWinner] = useState<Prize | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showPrizeManager, setShowPrizeManager] = useState(false);

  const handleWin = (prize: Prize) => {
    setWinner(prize);
    setShowWinnerModal(true);
  };

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
    setWinner(null);
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

      {/* Controls - Fixed at top right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setShowPrizeManager(!showPrizeManager)}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-lg shadow-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 text-sm border border-yellow-400"
        >
          {showPrizeManager ? '✕' : '⚙️'}
        </button>
      </div>

      {/* Prize Manager - Overlay */}
      {showPrizeManager && (
        <div className="absolute top-16 right-4 z-20 max-h-[calc(100vh-120px)] overflow-y-auto">
          <PrizeManager prizes={prizes} onPrizesChange={setPrizes} />
        </div>
      )}

      {/* Main Wheel Container - Takes most of the screen */}
      <div className="flex-1 flex items-center justify-center p-2">
        <SpinWheel prizes={prizes} onWin={handleWin} />
      </div>

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        isOpen={showWinnerModal}
        onClose={closeWinnerModal}
      />
    </div>
  );
}
