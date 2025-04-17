import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Theme } from '../types';

// Import all backgrounds with direct strings
export const backgrounds = [
  '/assets/BG/a-traditional-chinese-ink-wash-painting-_t6lvVzJbTjagVYgggPScXQ_hM2wUBuQQMWwLfMhSAhFGA.jpeg',
  '/assets/BG/a-traditional-chinese-ink-wash-painting-_aNk3-BFlTgaM-2nqPbA42Q_hM2wUBuQQMWwLfMhSAhFGA.jpeg',
  '/assets/BG/a-traditional-chinese-ink-wash-painting-_-9n67ewWT9WnB4JpbjpL3A_BzLyim24RAKwTGJ6NsLWxA.jpeg'
];

// Simplified preload function with basic preloading
export const preloadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    // Preload all background images
    const imagePromises = backgrounds.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => resolve())
      .catch(error => {
        console.error("Failed to preload images:", error);
        resolve(); // Still resolve to allow the app to continue
      });
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
        className={`bg-black/30 backdrop-blur-sm text-${primaryColor} p-1.5 sm:p-2 rounded-full hover:bg-black/50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
      </motion.button>
      
      <div className={`text-${primaryColor} bg-black/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm`}>
        {currentBg + 1}/{backgrounds.length}
      </div>
      
      <motion.button
        onClick={onNext}
        className={`bg-black/30 backdrop-blur-sm text-${primaryColor} p-1.5 sm:p-2 rounded-full hover:bg-black/50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
      </motion.button>
    </div>
  );
} 