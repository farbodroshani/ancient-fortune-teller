import React, { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { FortuneCard } from './components/FortuneCard';
import { SealButton } from './components/SealButton';
import { BackgroundSwitcher, backgrounds, preloadImages } from './components/BackgroundSwitcher';
import { fortunes } from './data/fortunes';
import { Volume2, VolumeX, Share2, History, Scroll, X } from 'lucide-react';
import { ThemeSelector, themes } from './components/ThemeSelector';
import { FortuneHistory } from './components/FortuneHistory';
import type { Fortune, Theme } from './types';
import { DharmaCalculator } from './components/DharmaCalculator';
import { fetchRandomFortune } from './api/fortuneApi';
import { SocialShare } from './components/SocialShare';

// Sound effects
const flipSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.5,
});

const successSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3'],
  volume: 0.4,
});

// Background ambient music
const ambientMusic = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3'],
  volume: 0.2,
  loop: true,
});

// Particle component for visual effects
const Particles = () => {
  return (
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
  );
};

// Get a random fortune
const getRandomFortune = async (category: 'all' | 'love' | 'career' | 'health' | 'luck' = 'all'): Promise<Fortune> => {
  try {
    // Attempt to fetch from API
    return await fetchRandomFortune(category);
  } catch (error) {
    console.error('Error fetching from API, falling back to local data:', error);
    
    // Fallback to local data if API fails
    let filteredFortunes = fortunes;
    if (category !== 'all') {
      filteredFortunes = fortunes.filter(f => f.category === category);
    }
    return filteredFortunes[Math.floor(Math.random() * filteredFortunes.length)];
  }
};

// Loading screen component
const LoadingScreen = ({ theme }: { theme: Theme }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
         style={{ 
           background: `linear-gradient(to bottom right, #9b2c2c, #7f1d1d, black)`
         }}>
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-black/50 rounded-3xl backdrop-blur-sm" />
          <div className="relative p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-white">
              Cosmic Fortune
            </h1>
            <p className="text-lg sm:text-xl text-center mb-8 text-white/90">
              Discover your destiny through ancient wisdom
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
          </div>
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

function App() {
  // Get initial fortune from localStorage or a random fortune
  const [fortune, setFortune] = useState<Fortune>(() => {
    const saved = localStorage.getItem('lastFortune');
    return saved ? JSON.parse(saved) : fortunes[Math.floor(Math.random() * fortunes.length)];
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentBg, setCurrentBg] = useState(() => {
    const saved = localStorage.getItem('currentBg');
    return saved ? parseInt(saved) : 0;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'love' | 'career' | 'health' | 'luck'>('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('selectedTheme');
    return saved || 'classic';
  });
  const [fortuneHistory, setFortuneHistory] = useState<Fortune[]>(() => {
    const saved = localStorage.getItem('fortuneHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showDharmaCalculator, setShowDharmaCalculator] = useState(false);
  const [isGeneratingFortune, setIsGeneratingFortune] = useState(false);

  // Load background images
  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadImages();
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        // Simulate a minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };
    
    loadAssets();
    
    // Load initial fortune if needed
    const loadInitialFortune = async () => {
      if (!fortune) {
        try {
          const initialFortune = await getRandomFortune();
          setFortune(initialFortune);
        } catch (error) {
          console.error("Failed to load initial fortune:", error);
        }
      }
    };
    
    loadInitialFortune();
  }, []);

  useEffect(() => {
    if (fortune) {
      localStorage.setItem('lastFortune', JSON.stringify(fortune));
    }
    localStorage.setItem('currentBg', currentBg.toString());
    localStorage.setItem('selectedTheme', currentTheme);
  }, [fortune, currentBg, currentTheme]);

  // Handle audio
  useEffect(() => {
    if (!isMuted) {
      ambientMusic.play();
    } else {
      ambientMusic.pause();
    }

    return () => {
      ambientMusic.pause();
    };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const generateFortune = useCallback(async () => {
    if (isGeneratingFortune) return;
    
    setIsGeneratingFortune(true);
    try {
      // Create a new date-based seed to ensure we get a different fortune each time
      const seed = Date.now().toString();
      const newFortune = await getRandomFortune(selectedCategory);
      
      // If we got the same fortune, try again with a different approach
      if (newFortune.id === fortune.id) {
        // Force a different category to get a different result
        const categories: Array<'love' | 'career' | 'health' | 'luck'> = ['love', 'career', 'health', 'luck'];
        const differentCategory = categories.find(c => c !== selectedCategory) || 'love';
        const retryFortune = await getRandomFortune(differentCategory);
        setFortune(retryFortune);
      } else {
        setFortune(newFortune);
      }
      
      setIsFlipped(true);
      flipSound.play();
      
      // Add to history (avoid duplicates)
      if (!fortuneHistory.some(f => f.id === newFortune.id)) {
        const updatedHistory = [newFortune, ...fortuneHistory].slice(0, 30); // Keep last 30
        setFortuneHistory(updatedHistory);
        localStorage.setItem('fortuneHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Failed to generate fortune:', error);
    } finally {
      setIsGeneratingFortune(false);
    }
  }, [isGeneratingFortune, selectedCategory, fortune.id, fortuneHistory, flipSound]);

  const handleFlip = useCallback(() => {
    // Toggle the flip state
    setIsFlipped(!isFlipped);
    // Play appropriate sound
    if (!isFlipped) {
      flipSound.play();
    } else {
      successSound.play();
    }
  }, [isFlipped, flipSound, successSound]);

  const nextBackground = () => {
    setCurrentBg((prev) => (prev + 1) % backgrounds.length);
  };

  const prevBackground = () => {
    setCurrentBg((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
  };

  const toggleCategoryFilter = () => {
    setShowCategoryFilter(!showCategoryFilter);
    // Close other overlays when opening category filter
    if (!showCategoryFilter) {
      setShowHistory(false);
      setShowShareModal(false);
    }
  };

  const shareFortune = () => {
    setShowShareModal(true);
    // Close other overlays when opening share modal
    setShowHistory(false);
    setShowCategoryFilter(false);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    // Close other overlays when opening history
    if (!showHistory) {
      setShowCategoryFilter(false);
      setShowShareModal(false);
    }
  };

  const selectFromHistory = (selectedFortune: Fortune) => {
    setFortune(selectedFortune);
    setIsFlipped(true);
    setShowHistory(false);
  };

  if (isLoading) {
    return <LoadingScreen theme={themes.find(t => t.id === currentTheme) || themes[0]} />;
  }

  // Get current theme styles
  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];
  
  const categoryColors = {
    all: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    love: 'bg-gradient-to-r from-rose-600 to-pink-500',
    career: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    health: 'bg-gradient-to-r from-green-600 to-emerald-500',
    luck: 'bg-gradient-to-r from-yellow-600 to-amber-500'
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)` }}
    >
      <Particles />
      
      <div className={`min-h-screen backdrop-blur-sm flex flex-col items-center justify-center p-4 relative`}
           style={{ backgroundColor: `rgba(${activeTheme.id === 'classic' ? '0, 0, 0' : '30, 20, 60'}, 0.75)` }}
      >
        {/* Main content container */}
        <div className="w-full max-w-5xl mx-auto p-6 rounded-lg backdrop-blur-sm border-2 shadow-lg"
             style={{ 
               backgroundColor: `${activeTheme.colors.secondary}80`,
               borderColor: activeTheme.colors.primary
             }}>
          {/* Top toolbar */}
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCategoryFilter}
                >
                  {showCategoryFilter ? 'Hide Categories' : 'Select Category'}
                </motion.button>
                
                <div className="text-white bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm border"
                     style={{ borderColor: `${activeTheme.colors.primary}50` }}>
                  {selectedCategory === 'all' ? 'All Fortunes' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Fortunes`}
                </div>
              </div>

              {/* Audio and tools controls */}
              <div className="flex items-center space-x-2">
                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  onClick={toggleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </motion.button>
                
                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  onClick={shareFortune}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={20} />
                </motion.button>
                
                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  onClick={toggleHistory}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <History size={20} />
                </motion.button>
              </div>
            </div>

            {/* Category filter - Moved here, inside the relative container */}
            <AnimatePresence>
              {showCategoryFilter && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-2 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-black/90 backdrop-blur-lg rounded-lg p-4 border shadow-xl mx-auto max-w-lg"
                       style={{ borderColor: `${activeTheme.colors.primary}50` }}>
                    <div className="text-center font-medium mb-3 pb-2 border-b"
                         style={{ color: activeTheme.colors.primary, borderColor: `${activeTheme.colors.primary}30` }}>
                      Select Fortune Category
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {(['all', 'love', 'career', 'health', 'luck'] as const).map(category => (
                        <motion.button
                          key={category}
                          className={`${categoryColors[category as keyof typeof categoryColors]} px-4 py-2 rounded-lg text-sm text-white font-semibold shadow-md transition-all duration-200 flex-grow sm:flex-grow-0 min-w-[80px] text-center`}
                          style={{
                            border: `2px solid ${selectedCategory === category ? activeTheme.colors.primary : 'transparent'}`,
                            boxShadow: selectedCategory === category ? `0 0 10px ${activeTheme.colors.primary}50` : 'none'
                          }}
                          whileHover={{ scale: 1.05, y: -2, filter: 'brightness(1.2)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryFilter(false);
                          }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Fortune Card */}
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl font-serif text-center drop-shadow-lg font-bold"
                style={{ color: activeTheme.colors.primary }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Ancient Fortune Teller
              </motion.h1>
              
              <div className="flex items-center justify-center">
                <FortuneCard 
                  fortune={fortune} 
                  isFlipped={isFlipped} 
                  onFlip={handleFlip}
                  theme={activeTheme}
                />
              </div>
              
              <div className="flex justify-center mt-8">
                <SealButton 
                  onClick={generateFortune} 
                  disabled={isGeneratingFortune}
                  theme={activeTheme}
                  isLoading={isGeneratingFortune}
                />
              </div>
              
              <motion.p 
                className="text-center max-w-md mx-auto p-3 rounded-md bg-black/80 border font-bold text-lg shadow-lg"
                style={{ 
                  color: activeTheme.colors.primary,
                  borderColor: `${activeTheme.colors.primary}50`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {isFlipped ? "Click the fortune card to flip it back" : "Click the seal to reveal your fortune"}
              </motion.p>

              {/* Theme selector and background switcher */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <ThemeSelector currentTheme={currentTheme} onSelectTheme={handleThemeChange} />
                <BackgroundSwitcher
                  currentBg={currentBg}
                  onNext={nextBackground}
                  onPrev={prevBackground}
                  theme={activeTheme}
                />
              </div>
            </div>

            {/* Right column - Dharma Calculator */}
            <div className="flex flex-col justify-start pt-16">
              <div className="w-full max-w-md mx-auto rounded-xl backdrop-blur-md border-4 shadow-2xl"
                   style={{ 
                     background: `linear-gradient(to bottom right, ${activeTheme.colors.secondary}90, black)`,
                     borderColor: activeTheme.colors.primary,
                     boxShadow: `0 25px 50px -12px ${activeTheme.colors.primary}20`
                   }}>
                <DharmaCalculator theme={activeTheme} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FortuneHistory 
        fortunes={fortuneHistory} 
        isOpen={showHistory} 
        onClose={toggleHistory} 
        onSelectFortune={selectFromHistory} 
        theme={activeTheme}
      />
      
      {/* Share modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div 
              className="bg-black/90 border rounded-lg p-6 max-w-md w-11/12 shadow-2xl"
              style={{ borderColor: `${activeTheme.colors.primary}50` }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif" style={{ color: activeTheme.colors.primary }}>
                  Share Your Fortune
                </h3>
                <motion.button
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(false)}
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <div className="bg-black/80 rounded-lg p-4 mb-4 border border-white/10">
                <p className="text-xl font-serif text-center mb-2"
                   style={{ color: activeTheme.colors.primary }}>
                  {fortune.chinese}
                </p>
                <p className="text-white text-center">{fortune.english}</p>
                <p className="text-white/90 text-center italic text-sm mt-2">{fortune.interpretation}</p>
              </div>
              
              <SocialShare fortune={fortune} theme={activeTheme} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;