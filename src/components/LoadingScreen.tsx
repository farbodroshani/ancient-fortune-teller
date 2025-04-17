import React from 'react';
import { motion } from 'framer-motion';
import { Scroll } from 'lucide-react';
import type { Theme } from '../types';

interface LoadingScreenProps {
  theme?: Theme;
}

export function LoadingScreen({ theme }: LoadingScreenProps) {
  // Use theme colors or fallback to default
  const primaryColor = theme?.primaryColor || 'yellow-500';
  const secondaryColor = theme?.secondaryColor || 'red-800';
  const textColor = theme?.textColor || 'yellow-400';

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div 
            key={i}
            className={`absolute w-1 h-1 bg-${primaryColor}/30 rounded-full`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1, 0.5],
              y: [0, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer ring */}
        <motion.div 
          className={`w-32 h-32 border-4 border-${primaryColor} border-t-transparent rounded-full mb-8`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div 
          className={`absolute w-24 h-24 border-4 border-${secondaryColor} border-b-transparent rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <motion.div 
          className="absolute"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Scroll className={`w-12 h-12 text-${primaryColor}`} />
        </motion.div>
        
        {/* Title */}
        <motion.h2 
          className={`text-3xl text-${primaryColor} font-serif mt-8 mb-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ancient Fortune Teller
        </motion.h2>
        
        {/* Loading text */}
        <motion.div
          className="flex items-center space-x-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className={`text-${textColor} italic`}>Consulting the oracle</p>
          <div className="flex space-x-1">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className={`w-2 h-2 rounded-full bg-${primaryColor}`}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: dot * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 