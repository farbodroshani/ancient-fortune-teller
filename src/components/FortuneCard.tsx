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
    <div 
      className="relative w-[320px] h-[420px] mx-auto cursor-pointer transform hover:scale-105 transition-transform duration-300" 
      style={{ perspective: '1500px' }}
      onClick={onFlip}
    >
      <div className="relative w-full h-full shadow-2xl rounded-xl" style={cardStyle}>
        {/* Front of card */}
        <div style={faceStyle}>
          <div className={`w-full h-full bg-gradient-to-br from-${secondaryColor} to-${secondaryColor}/80 rounded-xl shadow-xl border-4 border-${primaryColor}/70 flex items-center justify-center p-8`}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <Scroll className={`w-28 h-28 text-${primaryColor} drop-shadow-lg`} />
              </div>
              <motion.div
                className={`text-center text-${textColor} text-xl font-bold tracking-wide drop-shadow-md`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Tap to reveal your fortune
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Back of card */}
        <div style={backFaceStyle}>
          <div 
            className={`w-full h-full bg-cover bg-center rounded-xl shadow-xl border-4 border-${primaryColor}/70 p-6 flex flex-col items-center justify-center overflow-hidden`}
            style={{ backgroundImage: `url(${cardBackground})` }}
          >
            <div className={`bg-black/75 p-6 rounded-lg backdrop-blur-md w-full h-full flex flex-col items-center justify-center border-2 ${categoryStyles.border}`}>
              <motion.div 
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="absolute top-4 right-4">
                  <div className={`text-sm uppercase font-bold tracking-widest ${categoryStyles.color} bg-black/70 px-3 py-1.5 rounded-full shadow-md`}>
                    {fortune.category}
                  </div>
                </div>
                
                <div className="w-full relative mb-4 mt-2">
                  <div className="absolute -left-1 -top-1">
                    <Star className={`w-6 h-6 fill-${primaryColor} text-${primaryColor} drop-shadow-md`} />
                  </div>
                  <div className="absolute -right-1 -top-1">
                    <Star className={`w-6 h-6 fill-${primaryColor} text-${primaryColor} drop-shadow-md`} />
                  </div>
                  <h2 className={`text-5xl font-noto-serif-sc text-center text-${primaryColor} mb-4 pt-2 font-bold drop-shadow-lg`}>
                    {fortune.chinese}
                  </h2>
                </div>
                
                <motion.p 
                  className={`text-2xl text-${textColor} mb-6 text-center font-bold drop-shadow-md`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {fortune.english}
                </motion.p>
                
                <motion.div
                  className={`w-full p-4 rounded-lg bg-gradient-to-b ${categoryStyles.bgFrom} ${categoryStyles.bgTo} border border-white/20 shadow-inner`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-lg text-white/95 text-center italic font-medium">{fortune.interpretation}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}