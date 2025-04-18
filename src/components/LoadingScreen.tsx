import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types';

interface LoadingScreenProps {
  theme: Theme;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ theme }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
         style={{ 
           background: `linear-gradient(to bottom right, ${theme.colors.secondary}90, black)`
         }}>
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl backdrop-blur-md bg-black/40 border-4 shadow-2xl"
           style={{ 
             borderColor: theme.colors.primary,
             boxShadow: `0 25px 50px -12px ${theme.colors.primary}40`
           }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-serif mb-6 font-bold drop-shadow-lg tracking-wide"
              style={{ color: theme.colors.primary }}>
            Ancient Fortune Teller
          </h2>
          <p className="mb-8 text-xl font-medium"
             style={{ color: theme.colors.text }}>
            Summoning ancient wisdom...
          </p>
          
          <div className="relative flex justify-center items-center">
            {/* Main spinner */}
            <motion.div
              className="w-28 h-28 border-8 rounded-full"
              style={{ 
                borderColor: `${theme.colors.primary}20`,
                borderTopColor: theme.colors.primary
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner spinner */}
            <motion.div
              className="absolute w-16 h-16 border-6 rounded-full"
              style={{ 
                borderColor: `${theme.colors.text}30`,
                borderTopColor: theme.colors.text
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center dot */}
            <div className="absolute w-6 h-6 rounded-full shadow-lg"
                 style={{ 
                   backgroundColor: theme.colors.primary,
                   boxShadow: `0 4px 6px -1px ${theme.colors.primary}50`
                 }}></div>
          </div>
          
          <motion.p
            className="mt-8 text-lg italic"
            style={{ color: `${theme.colors.text}80` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ delay: 1, duration: 3, repeat: Infinity }}
          >
            The cards of fate are aligning...
          </motion.p>
        </motion.div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: `${theme.colors.primary}30` }}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.3 + 0.1]
            }}
            transition={{ 
              duration: Math.random() * 15 + 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </div>
  );
}; 