import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Theme } from '../types';

interface MainPageProps {
  theme: Theme;
  onSelectFortune: () => void;
  onSelectDharma: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ theme, onSelectFortune, onSelectDharma }) => {
  const [showEducation, setShowEducation] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4"
         style={{ 
           background: `linear-gradient(to bottom right, ${theme.colors.secondary}90, black)`
         }}>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-md bg-black/40 border-2 sm:border-4 shadow-2xl"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-6 md:mb-8 font-bold drop-shadow-lg tracking-wide"
              style={{ color: theme.colors.primary }}>
            Ancient Fortune Teller
          </h1>
          
          <p className="mb-8 sm:mb-10 md:mb-12 text-lg sm:text-xl font-medium max-w-2xl mx-auto px-2"
             style={{ color: theme.colors.text }}>
            Choose your path to ancient wisdom
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
            {/* Fortune Cards Option */}
            <motion.button
              className="group relative p-4 sm:p-6 md:p-8 rounded-xl bg-black/60 border-2 backdrop-blur-sm hover:bg-black/80 transition-all duration-300"
              style={{ borderColor: `${theme.colors.primary}50` }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectFortune}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20">
                  <Scroll className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: theme.colors.primary }} />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-4 font-bold"
                    style={{ color: theme.colors.primary }}>
                  Fortune Cards
                </h2>
                
                <p className="text-white/80 text-center text-sm sm:text-base">
                  Reveal your destiny through ancient fortune cards. Each card holds unique wisdom and guidance for your path forward.
                </p>
              </div>
            </motion.button>
            
            {/* Dharma Calculator Option */}
            <motion.button
              className="group relative p-4 sm:p-6 md:p-8 rounded-xl bg-black/60 border-2 backdrop-blur-sm hover:bg-black/80 transition-all duration-300"
              style={{ borderColor: `${theme.colors.primary}50` }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectDharma}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-600/20 to-yellow-600/20">
                  <BookOpen className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: theme.colors.primary }} />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-4 font-bold"
                    style={{ color: theme.colors.primary }}>
                  Dharma Calculator
                </h2>
                
                <p className="text-white/80 text-center text-sm sm:text-base">
                  Calculate your Dharma number and discover your life's purpose through ancient numerology and spiritual wisdom.
                </p>
              </div>
            </motion.button>
          </div>

          {/* Educational Content Section */}
          <motion.div 
            className="mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-center items-center">
              <motion.button
                className="flex items-center justify-between p-2 sm:p-3 md:p-4 rounded-xl bg-black/60 border-2 backdrop-blur-sm hover:bg-black/80 transition-all duration-300"
                style={{ 
                  borderColor: `${theme.colors.primary}50`,
                  width: '180px',
                  maxWidth: '100%'
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEducation(!showEducation)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: theme.colors.primary }} />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold" style={{ color: theme.colors.primary }}>
                    Guide
                  </h3>
                </div>
                {showEducation ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary }} /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary }} />}
              </motion.button>
            </div>

            <AnimatePresence>
              {showEducation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-black/40 backdrop-blur-sm border-2"
                       style={{ borderColor: `${theme.colors.primary}50` }}>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Dharma Calculator Section */}
                      <div className="space-y-2">
                        <h4 className="text-base sm:text-lg font-serif font-bold" style={{ color: theme.colors.primary }}>
                          Understanding Your Dharma Number
                        </h4>
                        <p className="text-white/80 text-sm sm:text-base">
                          Your Dharma number is calculated by reducing your birth date to a single digit. This number represents your life's purpose and spiritual path.
                        </p>
                        <div className="mt-2 sm:mt-4 space-y-2">
                          <h5 className="font-medium text-white/90 text-sm sm:text-base">Calculation Method:</h5>
                          <ol className="list-decimal pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-white/80 text-sm sm:text-base">
                            <li>Write down your birth date in DD/MM/YYYY format</li>
                            <li>Add all the digits together</li>
                            <li>If the sum is a two-digit number, add those digits together</li>
                            <li>Continue until you reach a single digit (1-9)</li>
                          </ol>
                        </div>
                      </div>

                      {/* Fortune Telling Methods */}
                      <div className="space-y-2">
                        <h4 className="text-base sm:text-lg font-serif font-bold" style={{ color: theme.colors.primary }}>
                          Fortune Telling Methods
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h5 className="font-medium text-white/90 text-sm sm:text-base">Tarot Reading</h5>
                            <p className="text-white/80 text-sm sm:text-base">
                              Originating in 15th century Europe, Tarot cards evolved from playing cards to a divination tool. Each of the 78 cards carries symbolic imagery representing different aspects of life.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-white/90 text-sm sm:text-base">I Ching</h5>
                            <p className="text-white/80 text-sm sm:text-base">
                              Dating back to ancient China (circa 1000 BCE), the I Ching or "Book of Changes" is one of the oldest divination systems, using 64 hexagrams representing different states of change.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Glossary */}
                      <div className="space-y-2">
                        <h4 className="text-base sm:text-lg font-serif font-bold" style={{ color: theme.colors.primary }}>
                          Key Terms
                        </h4>
                        <dl className="space-y-2 text-white/80 text-sm sm:text-base">
                          <div>
                            <dt className="font-medium text-white/90">Dharma</dt>
                            <dd>One's duty or righteous path in life according to Hindu and Buddhist philosophy.</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-white/90">Karma</dt>
                            <dd>The spiritual principle of cause and effect where intent and actions influence the future.</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-500/30 rounded-full"
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
              duration: Math.random() * 20 + 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </div>
  );
}; 