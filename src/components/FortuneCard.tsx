import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scroll, Star } from 'lucide-react';
import type { FortuneCardProps } from '../types';
import { backgrounds } from './BackgroundSwitcher';

export function FortuneCard({ fortune, isFlipped, onFlip, theme }: FortuneCardProps) {
  // Use a random background image for the card
  const [cardBackground, setCardBackground] = useState(backgrounds[0]);
  
  // Update background when fortune changes
  useEffect(() => {
    // Select a random background based on fortune id for consistency
    const bgIndex = fortune.id % backgrounds.length;
    setCardBackground(backgrounds[bgIndex]);
  }, [fortune]);

  // Category icon and colors
  const getCategoryStyles = (category: 'love' | 'career' | 'health' | 'luck') => {
    switch (category) {
      case 'love':
        return { color: 'text-rose-400', border: 'border-rose-500/50', bgFrom: 'from-rose-900/40', bgTo: 'to-rose-800/40' };
      case 'career':
        return { color: 'text-blue-400', border: 'border-blue-500/50', bgFrom: 'from-blue-900/40', bgTo: 'to-blue-800/40' };
      case 'health':
        return { color: 'text-green-400', border: 'border-green-500/50', bgFrom: 'from-green-900/40', bgTo: 'to-green-800/40' };
      case 'luck':
        return { color: 'text-yellow-400', border: 'border-yellow-500/50', bgFrom: 'from-yellow-900/40', bgTo: 'to-yellow-800/40' };
      default:
        return { color: 'text-yellow-400', border: 'border-yellow-500/50', bgFrom: 'from-yellow-900/40', bgTo: 'to-yellow-800/40' };
    }
  };

  const categoryStyles = getCategoryStyles(fortune.category);
  const primaryColor = theme?.primaryColor || 'yellow-500';
  const secondaryColor = theme?.secondaryColor || 'red-800';
  const textColor = theme?.textColor || 'yellow-400';

  // Card flipping style
  const cardStyle = {
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    transformStyle: 'preserve-3d' as 'preserve-3d',
    transition: 'transform 0.7s'
  };

  // Front and back face styles
  const faceStyle = {
    backfaceVisibility: 'hidden' as 'hidden',
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%',
  };

  const backFaceStyle = {
    ...faceStyle,
    transform: 'rotateY(180deg)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto mb-8"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">{fortune.chinese}</h3>
            <p className="text-white/90 text-center mb-4">{fortune.english}</p>
            <button
              onClick={onFlip}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Tap to reveal your fortune
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}