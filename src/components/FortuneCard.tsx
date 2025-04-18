import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scroll, Star, Wallet } from 'lucide-react';
import type { FortuneCardProps } from '../types';
import { backgrounds } from './BackgroundSwitcher';

export function FortuneCard({ fortune, isFlipped, onFlip, theme, onMintNFT }: FortuneCardProps) {
  // Use a random background image for the card
  const [cardBackground, setCardBackground] = useState(backgrounds[0]);
  const [isMinting, setIsMinting] = useState(false);
  
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
        return { 
          color: 'text-rose-400', 
          border: 'border-rose-500/50', 
          bgFrom: 'from-rose-900/40', 
          bgTo: 'to-rose-800/40',
          gradient: 'bg-gradient-to-r from-rose-600 to-pink-500'
        };
      case 'career':
        return { 
          color: 'text-blue-400', 
          border: 'border-blue-500/50', 
          bgFrom: 'from-blue-900/40', 
          bgTo: 'to-blue-800/40',
          gradient: 'bg-gradient-to-r from-blue-600 to-cyan-500'
        };
      case 'health':
        return { 
          color: 'text-green-400', 
          border: 'border-green-500/50', 
          bgFrom: 'from-green-900/40', 
          bgTo: 'to-green-800/40',
          gradient: 'bg-gradient-to-r from-green-600 to-emerald-500'
        };
      case 'luck':
        return { 
          color: 'text-yellow-400', 
          border: 'border-yellow-500/50', 
          bgFrom: 'from-yellow-900/40', 
          bgTo: 'to-yellow-800/40',
          gradient: 'bg-gradient-to-r from-yellow-600 to-amber-500'
        };
      default:
        return { 
          color: 'text-yellow-400', 
          border: 'border-yellow-500/50', 
          bgFrom: 'from-yellow-900/40', 
          bgTo: 'to-yellow-800/40',
          gradient: 'bg-gradient-to-r from-yellow-600 to-amber-500'
        };
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

  const handleMintNFT = async () => {
    if (!onMintNFT) return;
    
    setIsMinting(true);
    try {
      await onMintNFT(fortune);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div 
      className="relative w-[400px] h-[600px] mx-auto cursor-pointer transform hover:scale-105 transition-transform duration-300" 
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
              <div className="flex justify-center mb-8">
                <Scroll className={`w-32 h-32 text-${primaryColor} drop-shadow-lg`} />
              </div>
              <motion.div
                className={`text-center text-${textColor} text-2xl font-bold tracking-wide drop-shadow-md`}
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
            className={`w-full h-full bg-cover bg-center rounded-xl shadow-xl border-4 border-${primaryColor}/70 p-8 flex flex-col items-center justify-center overflow-hidden`}
            style={{ backgroundImage: `url(${cardBackground})` }}
          >
            <div className={`bg-black/75 p-8 rounded-lg backdrop-blur-md w-full h-full flex flex-col items-center justify-center border-2 ${categoryStyles.border}`}>
              <motion.div 
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Category Badge - More prominent */}
                <div className="absolute top-4 left-4 right-4 flex justify-center">
                  <div className={`${categoryStyles.gradient} text-white px-6 py-2 rounded-full shadow-lg font-bold tracking-wider text-lg uppercase flex items-center gap-2`}>
                    <Star className="w-5 h-5" />
                    <span>{fortune.category}</span>
                  </div>
                </div>
                
                <div className="w-full relative mb-6 mt-16">
                  <div className="absolute -left-2 -top-2">
                    <Star className={`w-8 h-8 fill-${primaryColor} text-${primaryColor} drop-shadow-md`} />
                  </div>
                  <div className="absolute -right-2 -top-2">
                    <Star className={`w-8 h-8 fill-${primaryColor} text-${primaryColor} drop-shadow-md`} />
                  </div>
                  <h2 className={`text-6xl font-noto-serif-sc text-center text-${primaryColor} mb-6 pt-2 font-bold drop-shadow-lg`}>
                    {fortune.chinese}
                  </h2>
                </div>
                
                <motion.p 
                  className={`text-3xl text-${textColor} mb-8 text-center font-bold drop-shadow-md`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {fortune.english}
                </motion.p>
                
                <motion.div
                  className={`w-full p-6 rounded-lg bg-gradient-to-b ${categoryStyles.bgFrom} ${categoryStyles.bgTo} border border-white/20 shadow-inner`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-xl text-white/95 text-center italic font-medium">{fortune.interpretation}</p>
                </motion.div>

                {onMintNFT && (
                  <motion.button
                    className="mt-6 flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-white shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMintNFT();
                    }}
                    disabled={isMinting}
                  >
                    <Wallet size={24} />
                    <span>{isMinting ? 'Minting...' : 'Mint as NFT'}</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}