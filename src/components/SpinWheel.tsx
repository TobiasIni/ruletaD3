'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Prize } from '@/types';
import { getAudioManager } from '@/utils/audioUtils';

interface SpinWheelProps {
  prizes: Prize[];
  onWin: (prize: Prize) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ prizes, onWin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const audioManager = useRef(getAudioManager());

  const colors = [
    '#CD0303', '#CD0303', '#CD0303', '#CD0303', '#CD0303',
    '#CD0303', '#2F4F4F', '#8B0000', '#006400', '#CD0303',
    '#CD0303', '#8B008B', '#FF1493', '#32CD32', '#FF8C00'
  ];

  // Calculate segment angle
  const segmentAngle = 360 / prizes.length;

  // Create wheel segments
  const createSegment = (prize: Prize, index: number) => {
    const angle = segmentAngle;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = 200 + 180 * Math.cos(startAngleRad);
    const y1 = 200 + 180 * Math.sin(startAngleRad);
    const x2 = 200 + 180 * Math.cos(endAngleRad);
    const y2 = 200 + 180 * Math.sin(endAngleRad);
    
    const pathData = [
      'M', 200, 200,
      'L', x1, y1,
      'A', 180, 180, 0, largeArcFlag, 1, x2, y2,
      'Z'
    ].join(' ');

    // Calculate text position
    const textAngle = startAngle + angle / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textRadius = 120;
    const textX = 200 + textRadius * Math.cos(textAngleRad);
    const textY = 200 + textRadius * Math.sin(textAngleRad);

    return (
      <g key={prize.id}>
        <path
          d={pathData}
          fill={prize.color || colors[index % colors.length]}
          stroke="#FFD700"
          strokeWidth="3"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="16"
          fontWeight="bold"
          fontFamily="var(--font-oswald), sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          stroke="#000000"
          strokeWidth="0.5"
        >
          {prize.text}
        </text>
      </g>
    );
  };

  const spinWheel = () => {
    if (isSpinning || prizes.length === 0) return;

    setIsSpinning(true);

    // Start playing the roulette spin sound
    audioManager.current.playRouletteSpinSound();

    // Generate random rotation (minimum 5 full rotations + random amount)
    const minRotation = 3600; // 5 full rotations
    const randomRotation = Math.random() * 360;
    const finalRotation = rotation + minRotation + randomRotation;

    // Calculate winning segment - which segment ends up at the pointer (top position)
    // Segments are drawn with 0° at right (3 o'clock), but pointer is at top (12 o'clock = 270°)
    // We need to find which segment is at 270° position after rotation
    const normalizedRotation = (finalRotation % 360);
    // Adjust for pointer position (top = 270° in standard math coordinates)
    const pointerPosition = (270 - normalizedRotation + 360) % 360;
    const winningIndex = Math.floor(pointerPosition / segmentAngle) % prizes.length;
    const winningPrize = prizes[winningIndex];

    setRotation(finalRotation);

    // Trigger animation and callback
    setTimeout(() => {
      // Stop the spinning sound when the wheel stops
      audioManager.current.stopRouletteSpinSound();
      setIsSpinning(false);
      onWin(winningPrize);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl">
      <div className="relative wheel-container flex-1 flex items-center justify-center">
        {/* Wheel */}
        <div className="relative">
          {/* Elegant casino pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="relative">
              <div className="w-0 h-0 border-l-[22px] border-r-[22px] border-t-[45px] border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-2xl"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[38px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
            </div>
          </div>
          
          <svg
            ref={wheelRef}
            width="min(90vw, 90vh, 600px)"
            height="min(90vw, 90vh, 600px)"
            viewBox="0 0 400 400"
            className="drop-shadow-2xl max-w-full max-h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
            }}
          >
          {/* Outer ring with casino styling */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="url(#outerRingGradient)"
            stroke="#FFD700"
            strokeWidth="6"
          />
          
          {/* Inner decorative ring */}

          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="outerRingGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2F4F4F" />
              <stop offset="100%" stopColor="#1C1C1C" />
            </radialGradient>
          </defs>
          
          {/* Segments */}
          {prizes.map(createSegment)}
          
          {/* Center circle */}
          <circle
            cx="200"
            cy="200"
            r="25"
            fill="#2c3e50"
            stroke="#34495e"
            strokeWidth="3"
          />
          </svg>

          {/* Elegant center circle with D3 logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 border-4 border-yellow-400 shadow-2xl z-10 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-black/20 to-transparent flex items-center justify-center">
              <img src="/images/d3.jpg" alt="D3" className="w-[100%] h-[100%] rounded-full object-cover border-2 border-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Elegant casino spin button */}
      <div className="w-full px-6 pb-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || prizes.length === 0}
          className={`
            w-full py-6 px-8 rounded-xl font-bold text-xl shadow-2xl
            transform transition-all duration-300 ease-in-out relative overflow-hidden
            ${isSpinning || prizes.length === 0 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed scale-95 opacity-60' 
              : 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black cursor-pointer hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 hover:scale-105 hover:shadow-3xl active:scale-95'
            }
            border-4 border-yellow-400 backdrop-blur-sm
          `}
          style={{
            background: isSpinning || prizes.length === 0 
              ? undefined 
              : 'linear-gradient(45deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%)',
            backgroundSize: '200% 200%',
            animation: isSpinning ? 'none' : 'gradient-shift 3s ease infinite'
          }}
        >
          {/* Shine effect */}
          {!isSpinning && prizes.length > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          )}
          
          <span className="flex items-center justify-center space-x-3 relative z-10">
            <span className={`text-3xl ${isSpinning ? 'animate-spin' : ''}`}>
              {isSpinning ? '🎰' : '🎲'}
            </span>
            <span className="text-2xl font-oswald tracking-wider">
              {isSpinning ? 'GIRANDO...' : 'GIRAR RULETA'}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;
