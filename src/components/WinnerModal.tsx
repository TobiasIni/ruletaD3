'use client';

import React, { useEffect, useRef } from 'react';
import { Prize } from '@/types';
import JSConfetti from 'js-confetti';

interface WinnerModalProps {
  winner: Prize | null;
  isOpen: boolean;
  onClose: () => void;
  logo?: string;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, isOpen, onClose, logo }) => {
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
          
          try {
            confetti.addConfetti({
              confettiRadius: 10,
              confettiNumber: 50,
              confettiColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });
            console.log('✅ First winner confetti launched successfully');
            
            // Second burst for winners
            setTimeout(() => {
              try {
              /*   confetti.addConfetti({
                  emojis: ['🎉', '🎊', '💰', '🏆', '⭐'],
                  emojiSize: 30,
                  confettiNumber: 30,
                }); */
                confetti.addConfetti({
                  confettiRadius: 10,
                  confettiNumber: 50,
                  confettiColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
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
          ? 'from-green-900/20 via-transparent to-red-900/20' 
          : 'from-red-900/30 via-transparent to-gray-900/30'
      }`}></div>

            <div className={`bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 w-[90vw] sm:w-[80vw] md:w-[75vw] h-[99vh] sm:h-[95vh] md:h-[90vh] max-w-4xl max-h-[1200px] min-w-[320px] min-h-[600px] text-center shadow-2xl transform border-4 ${
        isPositive ? 'border-green-500' : 'border-red-500'
      } relative overflow-hidden`}>
        {/* Shine effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
          isPositive ? 'via-green-500/20' : 'via-red-500/20'
        } to-transparent transform rotate-45 translate-x-[-100%] animate-pulse`}></div>
        
        {/* Close button (X) - Animated button at bottom center */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="sub_cnt">
            <button 
              className="for_active hover" 
              onClick={onClose}
              title="Click On Me"
            >
              <span className="arrow"></span>
            </button>
          </div>
        </div>
        
        <div className="relative z-10">
          {/* Logo section */}
          <div className="mb-32 sm:mb-40 md:mb-48">
            <div className="flex justify-center mb-6 sm:mb-8">
              <img 
                src={logo || "/images/d3.jpg"} 
                alt="Logo" 
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain bg-transparent" 
              />
            </div>

       
            <p className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${
              isPositive ? 'text-green-300' : 'text-red-300'
            } font-share-tech font-bold`}>
              {isPositive ? '¡Felicidades!' : '¡Mejor suerte la próxima vez!'}
            </p>
          </div>

                {/* Prize display */}
                <div
            className={`inline-block px-8 sm:px-12 md:px-16 py-6 sm:py-8 md:py-10 rounded-xl text-white font-share-tech font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 shadow-2xl border-4 ${
              isPositive ? 'border-green-400' : 'border-red-400'
            } bg-gradient-to-br from-gray-800 to-black`}
            style={{ 
              backgroundColor: winner.color,
              boxShadow: `0 0 30px ${winner.color}50, inset 0 0 20px rgba(0,0,0,0.5)`
            }}
          >
            {winner.text}
          </div>
            

        
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
