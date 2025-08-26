'use client';

import React, { useEffect, useRef } from 'react';
import { Prize } from '@/types';
import JSConfetti from 'js-confetti';

interface WinnerModalProps {
  winner: Prize | null;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, isOpen, onClose }) => {
  const jsConfetti = useRef<JSConfetti | null>(null);

  useEffect(() => {
    // Initialize JSConfetti only on client side
    if (typeof window !== 'undefined') {
      jsConfetti.current = new JSConfetti();
    }
  }, []);

  useEffect(() => {
    if (isOpen && winner && jsConfetti.current) {
      // First confetti burst
      jsConfetti.current.addConfetti({
        confettiRadius: 10,
        confettiNumber: 200,
        confettiColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
      
      // Second delayed burst for extra celebration
      setTimeout(() => {
        if (jsConfetti.current) {
          jsConfetti.current.addConfetti({
            emojis: ['🎉', '🎊', '💰', '🏆', '⭐'],
            emojiSize: 30,
            confettiNumber: 30,
          });
        }
      }, 500);
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-transparent to-red-900/20"></div>

      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform border-4 border-yellow-500 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent transform rotate-45 translate-x-[-100%] animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <p className="text-xl text-yellow-300 font-serif">Has ganado el premio:</p>
          </div>

          <div
            className="inline-block px-8 py-6 rounded-xl text-white font-bold text-3xl mb-8 shadow-2xl border-4 border-yellow-400 bg-gradient-to-br from-gray-800 to-black"
            style={{ 
              backgroundColor: winner.color,
              boxShadow: `0 0 30px ${winner.color}50, inset 0 0 20px rgba(0,0,0,0.5)`
            }}
          >
            {winner.text}
          </div>

          <div className="space-y-4">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-500 hover:to-green-600 transition-all font-bold text-lg border-2 border-green-400 transform hover:scale-105 shadow-xl"
            >
              ¡EXCELENTE!
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-4 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-lg border-2 border-yellow-400 transform hover:scale-105 shadow-xl"
            >
              GIRAR DE NUEVO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
