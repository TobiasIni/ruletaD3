'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Prize } from '@/types';
import { getAudioManager } from '@/utils/audioUtils';
import { spinRoulette, findPrizeByApiResponse } from '@/utils/api';
import WinnerModal from './WinnerModal';

interface SpinWheelProps {
  prizes: Prize[];
  onWin: (prize: Prize, isPositive?: boolean) => void;
  colors?: string[];
  logo?: string;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ prizes, onWin, colors: propColors, logo }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const audioManager = useRef(getAudioManager());

  // Use provided colors or fallback to default colors
  const colors = propColors || [
    '#CD0303', '#CD0303', '#CD0303', '#CD0303', '#CD0303',
    '#CD0303', '#2F4F4F', '#8B0000', '#006400', '#CD0303',
    '#CD0303', '#8B008B', '#FF1493', '#32CD32', '#FF8C00'
  ];

  // Calculate segment angle
  const segmentAngle = 360 / prizes.length;

  // Simulate initial loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Function to verify which segment is at the pointer after rotation
  const verifyLandingSegment = (finalRotation: number): number => {
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // CRITICAL: The pointer is at the TOP of the wheel container
    // In standard math coordinates: 270° = top, 0° = right, 90° = bottom, 180° = left
    // The wheel uses standard math coordinates for segment positioning (Math.cos/sin)
    const pointerAngle = 270; // Top position in math coordinates
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    for (let i = 0; i < prizes.length; i++) {
      // Segment center in math coordinates (0° = right, 90° = bottom, etc.)
      const segmentCenterAngle = (i * segmentAngle) + (segmentAngle / 2);
      
      // After rotating the wheel clockwise by normalizedRotation, 
      // the segment center moves to a new position
      let rotatedCenterAngle = (segmentCenterAngle + normalizedRotation) % 360;
      
      // Distance from pointer at 270° (top of the wheel)
      let distance = Math.abs(rotatedCenterAngle - pointerAngle);
      if (distance > 180) distance = 360 - distance;
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    console.log('🔍 Landing verification:', {
      finalRotation,
      normalizedRotation,
      pointerAngle,
      closestIndex,
      closestDistance,
      landingPrize: prizes[closestIndex]?.text,
      segmentCenters: prizes.map((_, i) => {
        const centerAngle = (i * segmentAngle) + (segmentAngle / 2);
        const afterRotation = (centerAngle + normalizedRotation) % 360;
        const distanceFromPointer = Math.min(Math.abs(afterRotation - pointerAngle), 360 - Math.abs(afterRotation - pointerAngle));
        return { index: i, centerAngle, afterRotation, distanceFromPointer };
      })
    });
    
    return closestIndex;
  };

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

    const segmentColor = prize.color || colors[index % colors.length];
    
    return (
      <g key={prize.id}>
        {/* Background segment with gradient */}
        <path
          d={pathData}
          fill={`url(#segmentGradient${index})`}
          stroke="#FFD700"
          strokeWidth="2"
          filter="url(#segmentShadow)"
        />
        
        {/* Inner border for depth */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="0"
        />
        
        {/* Highlight edge */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(0, 0, 0, 0.6)"
          strokeWidth="0.5"
          strokeDasharray="3,2"
          opacity="0.7"
        />

        {/* Clean text with enhanced stroke for Share Tech font */}
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="clamp(10px, 2.5vw, 16px)"
          fontWeight="bold"
          fontFamily="var(--font-share-tech), monospace"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          stroke="#000000"
          strokeWidth="1.5"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
            paintOrder: 'stroke fill',
          }}
        >
          {prize.text}
        </text>
        
        {/* Segment-specific gradient definition */}
        <defs>
          <radialGradient id={`segmentGradient${index}`} cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor={segmentColor} stopOpacity="1"/>
            <stop offset="60%" stopColor={segmentColor} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={segmentColor} stopOpacity="0.7"/>
          </radialGradient>
        </defs>
      </g>
    );
  };

  const spinWheel = async () => {
    if (isSpinning || prizes.length === 0) return;

    setIsSpinning(true);

    // Start playing the roulette spin sound immediately
    audioManager.current.playRouletteSpinSound();

    // Start the wheel spinning immediately with a random rotation
    const minRotation = 3600; // 10 full rotations minimum
    const randomExtraRotation = Math.floor(Math.random() * 10) * 360;
    const immediateRotation = rotation + minRotation + randomExtraRotation;
    setRotation(immediateRotation);

    // Start the API call in parallel (non-blocking)
    const apiCall = spinRoulette().catch(error => {
      console.error('API call failed:', error);
      return null; // Return null to indicate failure
    });

    // Wait for either the API response or a timeout (whichever comes first)
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000)); // 3 second timeout
    
    try {
      const result = await Promise.race([apiCall, timeoutPromise]);
      
      if (result && result.exito) {
        console.log('🎲 API Spin Response received:', result);
        
        // Find the exact matching prize and its index
        const { index: winningIndex, prize: winningPrize } = findPrizeByApiResponse(prizes, result.premio_ganado);
        
        console.log('🎯 API determined winner:', winningIndex, 'Prize:', winningPrize.text);
        
        // Calculate the precise rotation to land on the winning segment
        const segmentCenterAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
        const currentNormalizedRotation = ((immediateRotation % 360) + 360) % 360;
        const currentSegmentPosition = (segmentCenterAngle + currentNormalizedRotation) % 360;
        
        let additionalRotation = 270 - currentSegmentPosition;
        while (additionalRotation <= 0) {
          additionalRotation += 360;
        }
        
        // Adjust the rotation to land on the correct segment
        const finalRotation = immediateRotation + additionalRotation;
        setRotation(finalRotation);

        console.log('🎯 Final rotation calculated for API winner:', {
          winningIndex,
          segmentCenterAngle,
          currentSegmentPosition,
          additionalRotation,
          finalRotation: finalRotation % 360,
          expectedPrize: winningPrize.text
        });

        // Wait for the wheel to stop and show the result
        setTimeout(() => {
          audioManager.current.stopRouletteSpinSound();
          setIsSpinning(false);
          
          const isPositive = result.premio_ganado.positive;
          console.log('🎵 Playing sound for positive:', isPositive);
          
          if (isPositive) {
            audioManager.current.playWinnerSound();
          } else {
            audioManager.current.playLoserSound();
          }
          
          const prizeToShow: Prize = {
            id: result.premio_ganado.id.toString(),
            text: result.premio_ganado.nombre,
            color: winningPrize.color,
            probability: result.premio_ganado.probabilidad,
            positive: isPositive
          };
          
          console.log('🏆 Showing API prize:', prizeToShow);
          setWinner(prizeToShow);
          setShowModal(true);
          onWin(prizeToShow, isPositive);
        }, 4000);
        
      } else {
        // API failed or timed out - use fallback
        console.log('⚠️ API failed or timed out, using fallback');
        handleFallbackSpin(immediateRotation);
      }
    } catch (error) {
      console.error('Error in spin process:', error);
      handleFallbackSpin(immediateRotation);
    }
  };

  // Fallback function for when API fails
  const handleFallbackSpin = (currentRotation: number) => {
    // Calculate a random winning segment
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[randomIndex];
    
    // Calculate rotation to land on this random segment
    const segmentCenterAngle = (randomIndex * segmentAngle) + (segmentAngle / 2);
    const currentNormalizedRotation = ((currentRotation % 360) + 360) % 360;
    const currentSegmentPosition = (segmentCenterAngle + currentNormalizedRotation) % 360;
    
    let additionalRotation = 270 - currentSegmentPosition;
    while (additionalRotation <= 0) {
      additionalRotation += 360;
    }
    
    const finalRotation = currentRotation + additionalRotation;
    setRotation(finalRotation);

    console.log('🎲 Fallback spin - random winner:', {
      randomIndex,
      winningPrize: winningPrize.text,
      finalRotation: finalRotation % 360
    });

    setTimeout(() => {
      audioManager.current.stopRouletteSpinSound();
      setIsSpinning(false);
      
      // In fallback mode, assume it's positive and play winner sound
      audioManager.current.playWinnerSound();
      setWinner(winningPrize);
      setShowModal(true);
      onWin(winningPrize, true);
    }, 4000);
  };

  // Function to close modal with animation delay
  const closeModal = () => {
    // Add a small delay to let the button animation play
    setTimeout(() => {
      setShowModal(false);
      setWinner(null);
    }, 400); // 400ms delay to match the CSS animation duration
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl px-4">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-radial from-yellow-500/20 via-yellow-600/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main loading spinner */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-6 sm:mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 sm:border-6 md:border-8 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
          
          {/* Inner rotating ring */}
          <div className="absolute inset-3 sm:inset-4 rounded-full border-3 sm:border-4 md:border-6 border-yellow-400/40 border-t-yellow-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Casino dice icon */}
              <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 animate-bounce">🎰</div>
              
              {/* Loading text */}
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-500 font-share-tech tracking-wider px-2">
                CARGANDO RULETA
              </div>
              
              {/* Loading dots */}
              <div className="flex justify-center space-x-1 mt-2 sm:mt-3 md:mt-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading progress bar */}
        <div className="w-64 sm:w-72 md:w-80 h-1.5 sm:h-2 bg-yellow-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-yellow-600 text-sm sm:text-base md:text-lg font-share-tech mt-4 sm:mt-5 md:mt-6 animate-pulse text-center px-4">
          Preparando la experiencia de casino...
        </p>
      </div>
    </div>
  );

  // Show loading spinner while loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full w-full px-0">
      {/* Company Logo at the top - Optimized for 1080x1920 */}
      <div className="absolute -top-32 left-0 right-0 h-[35vh] flex items-center justify-center z-30">
        <img 
          src={logo || "/images/d3.jpg"} 
          alt="Logo de la empresa" 
          className="w-full h-full max-w-[35vh] max-h-[35vh] object-contain" 
        />
      </div>

      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-92 h-92 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-radial from-yellow-500/20 via-yellow-600/10 to-transparent blur-3xl opacity-60 animate-pulse"></div>
      </div>
      
      <div className={`absolute inset-0 wheel-container flex items-center justify-center z-10 ${isSpinning ? 'wheel-spinning' : ''}`}>
        {/* Enhanced wheel container with floating effect */}
        <div className="relative transform transition-all duration-300"
          style={{
            filter: `
              drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))
              drop-shadow(0 0 50px rgba(255, 215, 0, 0.15))
              ${isSpinning ? 'drop-shadow(0 0 80px rgba(255, 215, 0, 0.4))' : ''}
            `
          }}>
          {/* Ultra elegant casino pointer with advanced shadows */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 sm:-translate-y-3 z-20">
            <div className="relative">
              {/* Shadow layer */}
              <div className="absolute top-0.5 sm:top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] sm:border-l-[20px] md:border-l-[24px] border-r-[16px] sm:border-r-[20px] md:border-r-[24px] border-t-[32px] sm:border-t-[42px] md:border-t-[50px] border-l-transparent border-r-transparent border-t-black/40 blur-sm"></div>
              
              {/* Main pointer with gradient and glow */}
              <div className="relative">
                <div className="w-0 h-0 border-l-[16px] sm:border-l-[20px] md:border-l-[24px] border-r-[16px] sm:border-r-[20px] md:border-r-[24px] border-t-[32px] sm:border-t-[42px] md:border-t-[50px] border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 217, 0, 0)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6))'
                  }}></div>
                
                {/* Inner golden gradient */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] sm:border-l-[16px] md:border-l-[20px] border-r-[12px] sm:border-r-[16px] md:border-r-[20px] border-t-[28px] sm:border-t-[36px] md:border-t-[42px] border-l-transparent border-r-transparent border-t-yellow-300"></div>
                
                {/* Highlight effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] sm:border-l-[14px] md:border-l-[16px] border-r-[10px] sm:border-r-[14px] md:border-r-[16px] border-t-[24px] sm:border-t-[30px] md:border-t-[35px] border-l-transparent border-r-transparent border-t-yellow-100 opacity-60"></div>
                
                {/* Decorative gem */}
              </div>
            </div>
          </div>
          
          <svg
            ref={wheelRef}
            width="min(100vw, 98vh, 900px)"
            height="min(100vw, 98vh, 900px)"
            viewBox="0 0 400 400"
            className="max-w-full max-h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.2))',
            }}
          >
          
          {/* Advanced gradient definitions */}
          <defs>
            {/* Outer ring gradient with metallic effect */}
            <radialGradient id="outerRingGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="300%" stopColor="#B8860B" />
              <stop offset="700%" stopColor="#DAA520" />
              <stop offset="1000%" stopColor="#8B7355" />
            </radialGradient>
            
            {/* Inner ring gradient */}
            <radialGradient id="innerRingGradient" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#2F4F4F" />
              <stop offset="50%" stopColor="#1C1C1C" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            
            {/* Segment shadow filter */}
            <filter id="segmentShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
            </filter>
            
            {/* Segment inner shadow */}
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feFlood floodColor="rgba(0,0,0,0.2)"/>
              <feComposite in="SourceGraphic"/>
              <feGaussianBlur stdDeviation="2"/>
              <feOffset dx="1" dy="2"/>
              <feComposite in2="SourceGraphic" operator="over"/>
            </filter>
            
            {/* Light bulb gradient for casino lights */}
            <radialGradient id="lightBulbGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="40%" stopColor="#F8F8FF"/>
              <stop offset="80%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#D3D3D3"/>
            </radialGradient>
          </defs>
          
          {/* Outer decorative ring with golden metallic effect */}
          <circle
            cx="200"
            cy="200"
            r="195"
            fill="url(#outerRingGradient)"
            stroke="#FFD700"
            strokeWidth="4"
            opacity="0.9"
          />
          
          {/* Decorative casino lights around the wheel */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 360) / 24;
            const angleRad = (angle * Math.PI) / 180;
            const lightX = 200 + 190 * Math.cos(angleRad);
            const lightY = 200 + 190 * Math.sin(angleRad);
            
            return (
              <g key={`light-${i}`} className="casino-light">
                {/* Light bulb glow effect */}
                <circle
                  cx={lightX}
                  cy={lightY}
                  r="6"
                  fill="rgba(255, 255, 255, 0.3)"
                  opacity="0.8"
                />
                
                {/* Main light bulb */}
                <circle
                  cx={lightX}
                  cy={lightY}
                  r="4"
                  fill="url(#lightBulbGradient)"
                  stroke="#FFD700"
                  strokeWidth="0.5"
                />
                
                {/* Light highlight */}
                <circle
                  cx={lightX - 1}
                  cy={lightY - 1}
                  r="1.5"
                  fill="rgba(255, 255, 255, 0.9)"
                />
              </g>
            );
          })}
          
          {/* Inner base ring */}
          <circle
            cx="200"
            cy="200"
            r="185"
            fill="url(#innerRingGradient)"
            stroke="#333333"
            strokeWidth="1"
          />
          
          {/* Segments */}
          {prizes.map(createSegment)}
          
          {/* Enhanced center circle with metallic effect */}
          <circle
            cx="200"
            cy="200"
            r="30"
            fill="url(#centerGradient)"
            stroke="#FFD700"
            strokeWidth="3"
            filter="url(#centerShadow)"
          />
          
          {/* Inner center ring */}
          <circle
            cx="200"
            cy="200"
            r="22"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          
          {/* Center highlight */}
          <circle
            cx="196"
            cy="196"
            r="8"
            fill="rgba(255, 255, 255, 0.3)"
            opacity="0.6"
          />
          
          {/* Additional gradient definitions */}
          <defs>
            <radialGradient id="centerGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="40%" stopColor="#B8860B"/>
              <stop offset="80%" stopColor="#2F4F4F"/>
              <stop offset="100%" stopColor="#1C1C1C"/>
            </radialGradient>
            
            <filter id="centerShadow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)"/>
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(255,215,0,0.3)"/>
            </filter>
          </defs>
          </svg>

          {/* Ultra elegant center logo with advanced effects */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full z-10 flex items-center justify-center">
            {/* Multiple shadow layers for depth */}
            
            {/* Main logo container */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 border-2 sm:border-3 md:border-4 border-yellow-300 overflow-hidden"
              style={{
                boxShadow: `
                  0 0 20px rgba(212, 212, 212, 0.6),
                  0 0 40px rgba(212, 212, 212, 0.6),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                  0 8px 32px rgba(0, 0, 0, 0.3)
                `
              }}>
              
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-black/20 rounded-full"></div>
              
              {/* Logo image */}
              <img 
                src={logo || "/images/d3.jpg"} 
                alt="Logo" 
                className="w-full h-full rounded-full object-cover relative z-10" 
              />
              
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transform rotate-45 translate-x-[-20%] translate-y-[-20%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant casino spin button */}
      <div className="absolute bottom-0 left-0 right-0 w-full px-4 pb-10 z-20">
        <button
          onClick={spinWheel}
          disabled={isSpinning || prizes.length === 0}
          className={`
            w-full py-6 sm:py-8 px-4 sm:px-6 rounded-lg font-bold text-lg sm:text-xl
            transform transition-all duration-200 ease-in-out relative overflow-hidden
            ${isSpinning || prizes.length === 0 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60' 
              : 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black cursor-pointer hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500'
            }
            border-2 sm:border-3 md:border-4 border-yellow-400 backdrop-blur-sm
            ${isSpinning 
              ? 'top-3 shadow-lg' 
              : 'top-0 shadow-[0_7px_0px_#B8860B] hover:shadow-[0_7px_0px_#B8860B] active:top-3 active:shadow-lg'
            }
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
          
          <span className="flex items-center justify-center space-x-2 sm:space-x-3 relative z-10">
       
            <span className="text-2xl sm:text-3xl font-share-tech tracking-wider">
              {isSpinning ? 'Probando suerte...' : 'GIRAR'}
            </span>
          </span>
        </button>
      </div>

      {/* Winner Modal */}
      <WinnerModal 
        winner={winner}
        isOpen={showModal}
        onClose={closeModal}
        logo={logo}
      />
    </div>
  );
};

export default SpinWheel;
