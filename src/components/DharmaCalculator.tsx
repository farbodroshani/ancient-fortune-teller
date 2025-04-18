import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Sparkles, MapPin, Clock, Save, Users, Loader2 } from 'lucide-react';
import type { Theme } from '../types';
import { calculateDharmaNumber, getDharmaInterpretation } from '../api/fortuneApi';
import { LocationInput } from './LocationInput';

interface DharmaCalculatorProps {
  theme?: Theme;
}

interface DharmaResult {
  number: number;
  dharma: string;
  description: string;
  qualities: string[];
  details: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
}

interface SavedReading extends DharmaResult {
  id: string;
  timestamp: number;
}

// Quality mappings for each dharma number
const dharmaQualities: Record<number, string[]> = {
  1: ['Leadership', 'Independence', 'Innovation', 'Pioneer'],
  2: ['Harmony', 'Diplomacy', 'Sensitivity', 'Cooperation'],
  3: ['Creativity', 'Expression', 'Joy', 'Optimism'],
  4: ['Stability', 'Organization', 'Dedication', 'Reliability'],
  5: ['Freedom', 'Adaptability', 'Adventure', 'Versatility'],
  6: ['Nurturing', 'Responsibility', 'Balance', 'Healing'],
  7: ['Wisdom', 'Analysis', 'Spirituality', 'Intuition'],
  8: ['Abundance', 'Power', 'Achievement', 'Manifestation'],
  9: ['Compassion', 'Humanitarian', 'Universal Love', 'Completion']
};

export function DharmaCalculator({ theme }: DharmaCalculatorProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<DharmaResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>(() => {
    const saved = localStorage.getItem('dharmaReadings');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedReadings, setShowSavedReadings] = useState(false);
  const [selectedReadings, setSelectedReadings] = useState<SavedReading[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<{
    name: string;
    number: number;
    compatibleWith: string[];
  }[]>([]);

  // Default colors to use if theme is not provided
  const colors = theme?.colors || {
    primary: '#eab308',
    secondary: '#991b1b',
    text: '#facc15',
    background: '#000000'
  };

  const resetCalculator = () => {
    setName('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setShowResult(false);
    setResult(null);
  };

  const formatTime = (time: string) => {
    // Ensure time is in 24-hour format
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setBirthTime(formatTime(time));
  };

  const calculateDharma = async () => {
    if (!name || !birthDate || !birthPlace || !birthTime) return;
    
    setIsLoading(true);
    try {
      // Format the time before calculation
      const formattedTime = formatTime(birthTime);
      
      // Calculate dharma number using API
      const dharmaNumber = await calculateDharmaNumber(name, birthDate, birthPlace, formattedTime);
      const description = await getDharmaInterpretation(dharmaNumber);
      
      // Set the result with animation
      setResult({
        number: dharmaNumber,
        dharma: `Dharma Path ${dharmaNumber}`,
        description,
        qualities: dharmaQualities[dharmaNumber] || [],
        details: {
          name,
          birthDate,
          birthTime: formattedTime,
          birthPlace
        }
      });
      
      setShowResult(true);
    } catch (error) {
      console.error('Error calculating Dharma:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const saveReading = () => {
    if (!result) return;
    
    const newReading: SavedReading = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    const updatedReadings = [...savedReadings, newReading];
    setSavedReadings(updatedReadings);
    localStorage.setItem('dharmaReadings', JSON.stringify(updatedReadings));
  };

  const deleteReading = (id: string) => {
    const updatedReadings = savedReadings.filter(reading => reading.id !== id);
    setSavedReadings(updatedReadings);
    localStorage.setItem('dharmaReadings', JSON.stringify(updatedReadings));
  };

  const toggleReadingSelection = (reading: SavedReading) => {
    setSelectedReadings(prev => {
      const isSelected = prev.some(r => r.id === reading.id);
      if (isSelected) {
        return prev.filter(r => r.id !== reading.id);
      } else {
        return [...prev, reading];
      }
    });
  };

  const compareReadings = () => {
    if (selectedReadings.length < 2) return;
    
    const compatibilityResults = selectedReadings.map(reading => {
      const compatibility = reading.description
        .split('\n')
        .filter(line => line.startsWith('With Dharma'))
        .map(line => {
          const [_, num, desc] = line.match(/With Dharma (\d+): (.+)/) || [];
          return { num: parseInt(num), desc };
        });
      
      return {
        reading,
        compatibility
      };
    });
    
    // Create a comparison result
    const comparison = compatibilityResults.map(result => {
      const compatibleWith = result.compatibility
        .filter(comp => selectedReadings.some(r => r.number === comp.num))
        .map(comp => comp.desc);
      
      return {
        name: result.reading.details.name,
        number: result.reading.number,
        compatibleWith
      };
    });
    
    setComparisonResults(comparison);
    setShowComparison(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 rounded-xl backdrop-blur-sm border-4 shadow-2xl"
         style={{ 
           borderColor: colors.primary,
           boxShadow: `0 25px 50px -12px ${colors.primary}30`
         }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-4xl font-space-grotesk mb-4 text-center font-bold drop-shadow-lg tracking-wide"
            style={{ color: colors.primary }}>
          <span className="inline-block">
            <Sparkles className="inline-block mr-2 mb-1" size={24} style={{ color: colors.primary }} />
          </span>
          Discover Your Dharma
          <span className="inline-block">
            <Sparkles className="inline-block ml-2 mb-1" size={24} style={{ color: colors.primary }} />
          </span>
        </h2>
        
        <p className="text-center text-base sm:text-lg font-medium mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed"
           style={{ color: colors.text }}>
          Enter your details to reveal your true spiritual path and purpose
        </p>
      </motion.div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="relative">
          <User 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 drop-shadow-md" 
            size={20} 
            style={{ color: colors.primary }} 
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-black/60 border-3 rounded-lg text-white focus:outline-none text-base sm:text-lg font-medium shadow-inner"
            style={{ 
              borderColor: `${colors.primary}70`,
              // @ts-ignore - focus style is valid
              ["&:focus"]: { borderColor: colors.primary }
            }}
          />
        </div>

        <div className="relative">
          <Calendar 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 drop-shadow-md" 
            size={20} 
            style={{ color: colors.primary }} 
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-black/60 border-3 rounded-lg text-white focus:outline-none text-base sm:text-lg font-medium shadow-inner appearance-none"
            style={{ 
              borderColor: `${colors.primary}70`,
              // @ts-ignore - focus style is valid
              ["&:focus"]: { borderColor: colors.primary },
              // Custom styling for date input
              ["&::-webkit-calendar-picker-indicator"]: {
                filter: "invert(1)",
                opacity: 0.7,
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: `${colors.primary}20`
              },
              ["&::-webkit-datetime-edit"]: {
                padding: "0.5rem",
                color: "white"
              },
              ["&::-webkit-datetime-edit-fields-wrapper"]: {
                padding: "0.5rem"
              },
              ["&::-webkit-datetime-edit-text"]: {
                color: `${colors.primary}70`,
                padding: "0 0.3rem"
              }
            }}
          />
        </div>

        <div className="relative">
          <Clock 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 drop-shadow-md" 
            size={20} 
            style={{ color: colors.primary }} 
          />
          <input
            type="time"
            value={birthTime}
            onChange={handleTimeChange}
            placeholder="Time of Birth (24-hour format)"
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-black/60 border-3 rounded-lg text-white focus:outline-none text-base sm:text-lg font-medium shadow-inner appearance-none"
            style={{ 
              borderColor: `${colors.primary}70`,
              // @ts-ignore - focus style is valid
              ["&:focus"]: { borderColor: colors.primary },
              // Custom styling for time input
              ["&::-webkit-calendar-picker-indicator"]: {
                filter: "invert(1)",
                opacity: 0.7,
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: `${colors.primary}20`
              },
              ["&::-webkit-datetime-edit"]: {
                padding: "0.5rem",
                color: "white"
              },
              ["&::-webkit-datetime-edit-fields-wrapper"]: {
                padding: "0.5rem"
              },
              ["&::-webkit-datetime-edit-text"]: {
                color: `${colors.primary}70`,
                padding: "0 0.3rem"
              }
            }}
          />
        </div>

        <LocationInput
          value={birthPlace}
          onChange={setBirthPlace}
          theme={colors}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            className="w-full py-5 sm:py-6 mt-4 sm:mt-6 text-black rounded-lg font-bold text-xl sm:text-2xl shadow-lg tracking-wide transform transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}90, ${colors.primary}80)`,
              boxShadow: `0 10px 15px -3px ${colors.primary}30`
            }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: `0 0 30px ${colors.primary}60`,
              filter: 'brightness(1.1)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateDharma}
            disabled={!name || !birthDate || !birthPlace || !birthTime || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                Calculating...
              </>
            ) : (
              <>
                <span className="relative z-10">Calculate Your Dharma Path</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </>
            )}
          </motion.button>

          {showResult && (
            <motion.button
              className="w-full py-4 sm:py-5 mt-4 sm:mt-6 text-black rounded-lg font-bold text-lg sm:text-xl shadow-lg tracking-wide transform transition-all duration-300"
              style={{ 
                background: `linear-gradient(to right, ${colors.secondary}, ${colors.secondary}90, ${colors.secondary}80)`,
                boxShadow: `0 10px 15px -3px ${colors.secondary}30`
              }}
              whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${colors.secondary}60` }}
              whileTap={{ scale: 0.98 }}
              onClick={resetCalculator}
            >
              Start Over
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 30, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -30, height: 0 }}
            transition={{ 
              duration: 0.7,
              height: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }
            }}
            className="mt-8 space-y-6 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-px my-6"
                   style={{ background: `linear-gradient(to right, transparent, ${colors.text}40, transparent)` }}></div>
              
              <div className="flex items-center justify-center gap-4 text-4xl font-serif text-center">
                <Sparkles size={32} style={{ color: colors.primary }} />
                <span className="font-bold drop-shadow-lg" style={{ color: colors.primary }}>{result.dharma}</span>
                <Sparkles size={32} style={{ color: colors.primary }} />
              </div>
              
              <p className="text-center text-xl font-medium border-t border-b py-5 my-6 leading-relaxed"
                 style={{ 
                   color: colors.text,
                   borderColor: `${colors.primary}40` 
                 }}>
                {result.description}
              </p>

              <div className="space-y-4">
                <h3 className="font-bold text-2xl text-center" style={{ color: colors.primary }}>Key Qualities:</h3>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {result.qualities.map((quality, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-5 py-3 rounded-full text-white text-lg font-bold border-2 shadow-lg"
                      style={{ 
                        backgroundColor: `${colors.primary}40`,
                        borderColor: `${colors.primary}60`
                      }}
                    >
                      {quality}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 p-5 rounded-lg border"
              style={{ 
                backgroundColor: `${colors.primary}10`,
                borderColor: `${colors.primary}30`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-center text-lg italic font-medium"
                 style={{ color: `${colors.text}90` }}>
                "Your Dharma is your true purpose, the path you were meant to walk in this lifetime."
              </p>
            </motion.div>

            <div className="flex justify-center gap-4 mt-6">
              <motion.button
                className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg flex items-center gap-2"
                style={{ 
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}90)`,
                  color: 'black'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveReading}
              >
                <Save size={20} />
                Save Reading
              </motion.button>

              <motion.button
                className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg flex items-center gap-2"
                style={{ 
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}90)`,
                  color: 'black'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSavedReadings(true)}
              >
                <Users size={20} />
                Compare Readings
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSavedReadings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSavedReadings(false)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 w-11/12 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
                  Saved Dharma Readings
                </h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowSavedReadings(false)}
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto flex-1 space-y-4">
                {savedReadings.map(reading => (
                  <div
                    key={reading.id}
                    className="bg-black/40 border rounded-lg p-4"
                    style={{ borderColor: `${colors.primary}50` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold" style={{ color: colors.primary }}>
                          {reading.details.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Dharma {reading.number} • {new Date(reading.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-gray-400 hover:text-white"
                          onClick={() => toggleReadingSelection(reading)}
                        >
                          {selectedReadings.some(r => r.id === reading.id) ? '✓' : '○'}
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => deleteReading(reading.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedReadings.length >= 2 && (
                <div className="mt-4 flex justify-center">
                  <motion.button
                    className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}90)`,
                      color: 'black'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={compareReadings}
                  >
                    Compare Selected Readings
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 w-11/12 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
                  Dharma Compatibility Analysis
                </h2>
                <button
                  className="text-gray-400 hover:text-white p-4 text-2xl"
                  onClick={() => setShowComparison(false)}
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto flex-1 space-y-4 mb-16">
                {comparisonResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-black/40 border rounded-lg p-4"
                    style={{ borderColor: `${colors.primary}50` }}
                  >
                    <h3 className="font-bold mb-2" style={{ color: colors.primary }}>
                      {result.name} (Dharma {result.number})
                    </h3>
                    {result.compatibleWith.length > 0 ? (
                      <ul className="space-y-2">
                        {result.compatibleWith.map((compatibility, i) => (
                          <li key={i} className="text-gray-300">
                            {compatibility}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">
                        No direct compatibility information available.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 flex justify-center">
                <motion.button
                  className="w-full max-w-[300px] py-4 px-6 rounded-lg font-bold text-lg shadow-lg"
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}90)`,
                    color: 'black',
                    boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowComparison(false)}
                >
                  Close Comparison
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 