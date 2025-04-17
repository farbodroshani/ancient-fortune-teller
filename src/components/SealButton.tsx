import React from 'react';
import { motion } from 'framer-motion';
import type { Theme } from '../types';

interface SealButtonProps {
  onClick: () => void;
  disabled?: boolean;
  theme?: Theme;
  isLoading?: boolean;
}

export function SealButton({ onClick, disabled, theme, isLoading = false }: SealButtonProps) {
  const primaryColor = theme?.primaryColor || 'yellow-400';
  const secondaryColor = theme?.secondaryColor || 'red-700';

  return (
    <div className="relative mt-8">
      <motion.div
        className={`absolute -inset-4 bg-${secondaryColor}/20 rounded-full blur-md z-0`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [0.9, 1.02, 0.9], opacity: 0.6 }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.button
        className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-${secondaryColor} to-${secondaryColor}/80 border-4 border-${primaryColor}/80 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden`}
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
      >
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-t from-${secondaryColor}/30 to-transparent`}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {isLoading ? (
            <motion.div 
              className={`w-10 h-10 border-4 border-${primaryColor}/30 border-t-${primaryColor} rounded-full`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <div className={`text-${primaryColor} font-noto-serif-sc text-4xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]`}>
              福
            </div>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}