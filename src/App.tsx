import React, { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { FortuneCard } from './components/FortuneCard';
import { SealButton } from './components/SealButton';
import { BackgroundSwitcher, backgrounds, preloadImages } from './components/BackgroundSwitcher';
import { fortunes } from './data/fortunes';
import { Volume2, VolumeX, Share2, History, X, BookOpen } from 'lucide-react';
import { ThemeSelector, themes } from './components/ThemeSelector';
import { FortuneHistory } from './components/FortuneHistory';
import type { Fortune, Theme } from './types';
import { fetchRandomFortune } from './api/fortuneApi';
import { SocialShare } from './components/SocialShare';
import { EducationalContent } from './components/EducationalContent';
import { Web3Service } from './services/web3Service';
import { DharmaPage } from './components/DharmaPage';
import { MainPage } from './components/MainPage';
import { LoadingScreen } from './components/LoadingScreen';

// Theme music - handle missing file gracefully
let themeMusic: Howl | null = null;
try {
  themeMusic = new Howl({
    src: ['/assets/audio/theme.mp3'],
    volume: 0.3,
    loop: true,
    autoplay: false,
    onload: () => {
      console.log('Theme music loaded successfully');
    },
    onloaderror: (id, error) => {
      console.error('Error loading theme music:', error);
    },
    onplayerror: (id, error) => {
      console.error('Error playing theme music:', error);
    },
    onplay: () => {
      console.log('Theme music started playing');
    },
    onpause: () => {
      console.log('Theme music paused');
    }
  });
} catch (error) {
  console.error('Failed to initialize theme music:', error);
}

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

function App() {
  const [fortune, setFortune] = useState<Fortune>(() => {
    const saved = localStorage.getItem('lastFortune');
    return saved ? JSON.parse(saved) : fortunes[0];
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'love' | 'career' | 'health' | 'luck'>('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [showHistory, setShowHistory] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<Fortune[]>([]);
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isGeneratingFortune, setIsGeneratingFortune] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'fortune' | 'dharma'>('main');
  const [showEducationalContent, setShowEducationalContent] = useState(false);

  // Reset fortune card state when entering fortune page
  useEffect(() => {
    if (currentPage === 'fortune') {
      setIsFlipped(false);
    }
  }, [currentPage]);

  // Initialize Web3Service with error handling
  useEffect(() => {
    try {
      const service = new Web3Service('0x123...'); // Replace with your contract address
      setWeb3Service(service);
    } catch (error) {
      console.error('Failed to initialize Web3Service:', error);
    }
  }, []);

  const handleMintNFT = async (fortune: Fortune) => {
    if (!web3Service) return;
    
    try {
      if (!walletAddress) {
        const address = await web3Service.connectWallet();
        setWalletAddress(address);
      }
      
      const txHash = await web3Service.mintFortuneNFT(fortune, walletAddress!);
      alert(`NFT minted successfully! Transaction: ${txHash}`);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    }
  };

  // Load background images and initialize app
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
  }, []);

  useEffect(() => {
    if (fortune) {
      localStorage.setItem('lastFortune', JSON.stringify(fortune));
    }
    localStorage.setItem('currentBg', currentBg.toString());
    localStorage.setItem('selectedTheme', currentTheme.id);
  }, [fortune, currentBg, currentTheme]);

  // Handle audio
  useEffect(() => {
    const handleAudio = async () => {
      try {
        if (!isMuted) {
          // Check if the audio is already playing
          if (!themeMusic?.playing()) {
            // Add a small delay to ensure the audio context is ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
              themeMusic?.play();
              console.log('Theme music started playing');
            } catch (error) {
              console.error('Error playing theme music:', error);
            }
          }
        } else {
          themeMusic?.pause();
          console.log('Theme music paused');
        }
      } catch (error) {
        console.error('Error handling audio:', error);
      }
    };

    handleAudio();

    return () => {
      themeMusic?.pause();
    };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const generateFortune = useCallback(async () => {
    if (isGeneratingFortune) return;
    
    setIsGeneratingFortune(true);
    try {
      const newFortune = await getRandomFortune(selectedCategory);
      
      if (newFortune.id === fortune.id) {
        const categories: Array<'love' | 'career' | 'health' | 'luck'> = ['love', 'career', 'health', 'luck'];
        const differentCategory = categories.find(c => c !== selectedCategory) || 'love';
        const retryFortune = await getRandomFortune(differentCategory);
        setFortune(retryFortune);
      } else {
        setFortune(newFortune);
      }
      
      setIsFlipped(true);
      
      // Add to history (avoid duplicates)
      if (!fortuneHistory.some(f => f.id === newFortune.id)) {
        const updatedHistory = [newFortune, ...fortuneHistory].slice(0, 30);
        setFortuneHistory(updatedHistory);
        localStorage.setItem('fortuneHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Failed to generate fortune:', error);
    } finally {
      setIsGeneratingFortune(false);
    }
  }, [isGeneratingFortune, selectedCategory, fortune.id, fortuneHistory]);

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

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
    setCurrentTheme(themes.find(t => t.id === themeId) || themes[0]);
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
    return <LoadingScreen theme={currentTheme} />;
  }

  if (currentPage === 'main') {
    return (
      <MainPage 
        theme={currentTheme}
        onSelectFortune={() => setCurrentPage('fortune')}
        onSelectDharma={() => setCurrentPage('dharma')}
        onThemeChange={handleThemeChange}
      />
    );
  }

  if (currentPage === 'dharma') {
    return <DharmaPage theme={currentTheme} onBack={() => setCurrentPage('main')} />;
  }

  // Get current theme styles
  const activeTheme = currentTheme;
  
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
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgrounds[currentBg]})`,
        backgroundColor: activeTheme.colors.background
      }}
    >
      <Particles />
      
      <div className={`min-h-screen backdrop-blur-sm flex flex-col items-center justify-center p-4 relative`}
           style={{ 
             backgroundColor: `rgba(${activeTheme.id === 'classic' ? '0, 0, 0' : '30, 20, 60'}, 0.5)`
           }}>
        {/* Main content container */}
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-lg backdrop-blur-sm border-2 shadow-lg"
             style={{ 
               backgroundColor: `${activeTheme.colors.secondary}80`,
               borderColor: activeTheme.colors.primary
             }}>
          {/* Top toolbar */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('main')}
                >
                  Back to Main
                </motion.button>
                
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

                <motion.button
                  className="text-white bg-black/80 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 border"
                  style={{ borderColor: `${activeTheme.colors.primary}50` }}
                  onClick={() => setShowEducationalContent(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BookOpen size={20} />
                </motion.button>
              </div>
            </div>

            {/* Category filter */}
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
          <div className="flex flex-col items-center justify-center space-y-8">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-serif text-center drop-shadow-lg font-bold"
              style={{ color: activeTheme.colors.primary }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ancient Fortune Teller
            </motion.h1>
            
            <div className="w-full max-w-2xl">
              <FortuneCard 
                fortune={fortune} 
                isFlipped={isFlipped} 
                onFlip={handleFlip} 
                theme={activeTheme}
                onMintNFT={handleMintNFT}
              />
            </div>
            
            <div className="flex justify-center mt-4">
              <SealButton 
                onClick={generateFortune} 
                disabled={isGeneratingFortune}
                theme={activeTheme}
                isLoading={isGeneratingFortune}
              />
            </div>
            
            <motion.p 
              className="text-center max-w-md mx-auto p-3 rounded-md bg-black/80 border font-bold text-base sm:text-lg shadow-lg"
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
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <ThemeSelector currentTheme={currentTheme.id} onSelectTheme={handleThemeChange} />
              <BackgroundSwitcher
                currentBg={currentBg}
                onNext={nextBackground}
                onPrev={prevBackground}
                theme={activeTheme}
              />
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

        {/* Educational Content Modal */}
        <AnimatePresence>
          {showEducationalContent && (
            <EducationalContent onClose={() => setShowEducationalContent(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;