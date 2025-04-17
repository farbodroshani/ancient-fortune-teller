import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';

// Available themes with hex values for more reliable styling
export const themes = [
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: 'yellow-500',
    secondaryColor: 'red-800',
    textColor: 'yellow-400',
    bgOverlay: 'black/50',
    // Direct hex colors for reliable styling
    colors: {
      primary: '#eab308',
      secondary: '#991b1b',
      text: '#facc15',
      background: '#000000'
    }
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    primaryColor: 'blue-400',
    secondaryColor: 'indigo-800',
    textColor: 'blue-200',
    bgOverlay: 'blue-900/60',
    colors: {
      primary: '#60a5fa',
      secondary: '#3730a3',
      text: '#bfdbfe',
      background: '#1e3a8a'
    }
  },
  {
    id: 'mystical',
    name: 'Mystical',
    primaryColor: 'purple-500',
    secondaryColor: 'violet-800',
    textColor: 'purple-300',
    bgOverlay: 'purple-900/60',
    colors: {
      primary: '#a855f7',
      secondary: '#6b21a8',
      text: '#d8b4fe',
      background: '#581c87'
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    primaryColor: 'emerald-500',
    secondaryColor: 'green-800',
    textColor: 'emerald-300',
    bgOverlay: 'green-900/60',
    colors: {
      primary: '#10b981',
      secondary: '#166534',
      text: '#6ee7b7',
      background: '#064e3b'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primaryColor: 'orange-500',
    secondaryColor: 'amber-800',
    textColor: 'orange-300',
    bgOverlay: 'amber-900/60',
    colors: {
      primary: '#f97316',
      secondary: '#92400e',
      text: '#fdba74',
      background: '#78350f'
    }
  },
  {
    id: 'royal',
    name: 'Royal',
    primaryColor: 'rose-500',
    secondaryColor: 'pink-900',
    textColor: 'rose-300',
    bgOverlay: 'pink-950/60',
    colors: {
      primary: '#f43f5e',
      secondary: '#831843',
      text: '#fda4af',
      background: '#500724'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    primaryColor: 'cyan-400',
    secondaryColor: 'slate-800',
    textColor: 'cyan-200',
    bgOverlay: 'slate-900/70',
    colors: {
      primary: '#22d3ee',
      secondary: '#1e293b',
      text: '#a5f3fc',
      background: '#0f172a'
    }
  }
];

interface ThemeSelectorProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Find the current theme object
  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <motion.button
        className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border shadow-md flex items-center gap-2"
        style={{ 
          borderColor: activeTheme.colors.primary,
          color: activeTheme.colors.primary
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette size={18} />
        <span className="font-medium text-sm sm:text-base">Theme</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 w-48 sm:w-64 shadow-xl z-50"
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-white text-center font-medium mb-2 sm:mb-3 border-b border-white/20 pb-2 text-sm sm:text-base">
              Select Theme
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map(theme => (
                <motion.button
                  key={theme.id}
                  className="relative rounded-md overflow-hidden border hover:border-white/70"
                  style={{ 
                    borderColor: currentTheme === theme.id ? 'white' : 'rgba(255,255,255,0.3)'
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                >
                  {/* Theme preview */}
                  <div className="aspect-square flex items-center justify-center p-2"
                       style={{ backgroundColor: theme.colors.secondary }}>
                    <div className="w-full h-full rounded-full"
                         style={{ backgroundColor: theme.colors.primary }} />
                  </div>
                  <div className="p-2 text-center text-xs sm:text-sm font-medium"
                       style={{ color: theme.colors.primary }}>
                    {theme.name}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 