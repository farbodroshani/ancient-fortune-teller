import React from 'react';
import { DharmaCalculator } from './DharmaCalculator';
import { Theme } from '../types';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface DharmaPageProps {
  theme: Theme;
  onBack: () => void;
}

export const DharmaPage: React.FC<DharmaPageProps> = ({ theme, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
         style={{ 
           background: `linear-gradient(to bottom right, ${theme.colors.secondary}90, black)`
         }}>
      <motion.button
        className="absolute top-4 left-4 p-2 rounded-full bg-black/80 text-white hover:bg-black/90 border"
        style={{ borderColor: `${theme.colors.primary}50` }}
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl backdrop-blur-md border-4 shadow-2xl"
           style={{ 
             background: `linear-gradient(to bottom right, ${theme.colors.secondary}90, black)`,
             borderColor: theme.colors.primary,
             boxShadow: `0 25px 50px -12px ${theme.colors.primary}20`
           }}>
        <h1 className="text-4xl font-serif text-center mb-8 font-bold drop-shadow-lg"
            style={{ color: theme.colors.primary }}>
          Dharma Calculator
        </h1>
        <DharmaCalculator theme={theme} />
      </div>
    </div>
  );
}; 