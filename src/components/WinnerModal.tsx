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
    console.log('🔥 WinnerModal useEffect triggered:', { 
      isOpen, 
      winner: winner?.text, 
      positive: winner?.positive 
    });
    
    if (isOpen && winner) {
      console.log('🎯 Modal is open and winner exists');
      
      // Only show confetti if the prize is positive (winning)
      const isWinning = winner.positive === true;
      console.log('🏆 Is this a winning prize?', isWinning);
      
      if (isWinning) {
        console.log('🎉 This is a WIN! Launching confetti...');
        
        // Create a new JSConfetti instance each time to ensure it works
        const confetti = new JSConfetti();
        console.log('🎊 New JSConfetti instance created for winner');
        
        // Set a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          console.log('🚀 Launching WINNER confetti NOW!');
          
          try {
            confetti.addConfetti({
              confettiRadius: 10,
              confettiNumber: 150,
              confettiColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });
            console.log('✅ First winner confetti launched successfully');
            
            // Second burst for winners
            setTimeout(() => {
              try {
                confetti.addConfetti({
                  emojis: ['🎉', '🎊', '💰', '🏆', '⭐'],
                  emojiSize: 30,
                  confettiNumber: 30,
                });
                console.log('✅ Second winner confetti launched successfully');
              } catch (error) {
                console.error('❌ Error in second winner confetti:', error);
              }
            }, 500);
            
          } catch (error) {
            console.error('❌ Error in first winner confetti:', error);
          }
        }, 100);
        
        return () => {
          clearTimeout(timer);
        };
      } else {
        console.log('💔 This is a LOSS - no confetti for you!');
      }
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const isPositive = winner.positive !== false; // Default to positive if undefined

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Elegant background pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isPositive 
          ? 'from-yellow-900/20 via-transparent to-red-900/20' 
          : 'from-red-900/30 via-transparent to-gray-900/30'
      }`}></div>

      <div className={`bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform border-4 ${
        isPositive ? 'border-yellow-500' : 'border-red-500'
      } relative overflow-hidden`}>
        {/* Shine effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
          isPositive ? 'via-yellow-500/20' : 'via-red-500/20'
        } to-transparent transform rotate-45 translate-x-[-100%] animate-pulse`}></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <p className={`text-xl ${
              isPositive ? 'text-yellow-300' : 'text-red-300'
            } font-serif`}>
              {isPositive ? '¡Felicidades! Ganaste:' : '¡Mejor suerte la próxima vez!'}
            </p>
           
          </div>

          <div
            className={`inline-block px-8 py-6 rounded-xl text-white font-bold text-3xl mb-8 shadow-2xl border-4 ${
              isPositive ? 'border-yellow-400' : 'border-red-400'
            } bg-gradient-to-br from-gray-800 to-black`}
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
              className={`w-full ${
                isPositive 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400 hover:from-green-500 hover:to-green-600' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-400 hover:from-gray-500 hover:to-gray-600'
              } py-4 px-6 rounded-xl transition-all font-bold text-lg border-2 transform hover:scale-105 shadow-xl`}
            >
              {isPositive ? '¡EXCELENTE!' : 'ENTENDIDO'}
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className={`w-full ${
                isPositive 
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black border-yellow-400 hover:from-yellow-500 hover:to-yellow-600' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-400 hover:from-blue-500 hover:to-blue-600'
              } py-4 px-6 rounded-xl transition-all font-bold text-lg border-2 transform hover:scale-105 shadow-xl`}
            >
              {isPositive ? 'GIRAR DE NUEVO' : 'INTENTAR DE NUEVO'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
