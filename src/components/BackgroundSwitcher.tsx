import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Theme } from '../types';

// Import all backgrounds with direct strings
export const backgrounds = [
  '/background1.jpg',
  '/background2.jpg',
  '/background3.jpg'
];

// Simplified preload function with basic preloading
export const preloadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simple timeout to simulate loading
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

interface BackgroundSwitcherProps {
  currentBg: number;
  onNext: () => void;
  onPrev: () => void;
  theme?: Theme;
}

export function BackgroundSwitcher({ currentBg, onNext, onPrev, theme }: BackgroundSwitcherProps) {
  const primaryColor = theme?.primaryColor || 'yellow-500';
  
  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2">
      <motion.button
        onClick={onPrev}
        className={`bg-black/30 backdrop-blur-sm text-${primaryColor} p-2 rounded-full hover:bg-black/50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={20} />
      </motion.button>
      
      <div className={`text-${primaryColor} bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm`}>
        {currentBg + 1}/{backgrounds.length}
      </div>
      
      <motion.button
        onClick={onNext}
        className={`bg-black/30 backdrop-blur-sm text-${primaryColor} p-2 rounded-full hover:bg-black/50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
} 