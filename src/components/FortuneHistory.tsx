import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import type { Fortune, Theme } from '../types';

interface FortuneHistoryProps {
  fortunes: Fortune[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFortune: (fortune: Fortune) => void;
  theme?: Theme;
}

export function FortuneHistory({ fortunes, isOpen, onClose, onSelectFortune, theme }: FortuneHistoryProps) {
  if (!isOpen) return null;

  // Use theme colors or fallback to defaults
  const colors = theme?.colors || {
    primary: '#eab308',
    secondary: '#991b1b',
    text: '#facc15',
    background: '#000000'
  };

  // Group fortunes by category
  const fortunesByCategory: Record<string, Fortune[]> = {};
  fortunes.forEach(fortune => {
    if (!fortunesByCategory[fortune.category]) {
      fortunesByCategory[fortune.category] = [];
    }
    fortunesByCategory[fortune.category].push(fortune);
  });

  const categoryColors = {
    love: { text: '#f87171', border: 'rgba(248,113,113,0.3)' },
    career: { text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
    health: { text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
    luck: { text: '#facc15', border: 'rgba(250,204,21,0.3)' }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-lg p-5 w-11/12 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
            <h2 className="text-xl font-serif flex items-center" style={{ color: colors.primary }}>
              <Clock className="mr-2" size={18} />
              Fortune History
            </h2>
            <motion.button
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X size={20} />
            </motion.button>
          </div>

          {fortunes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg"
                 style={{ color: `${colors.text}99` }}>
              <Clock size={32} className="mx-auto mb-3 opacity-50" />
              <p>No fortunes in your history yet.</p>
              <p className="text-sm mt-1 opacity-70">Your past fortunes will appear here.</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 pr-2 space-y-4 custom-scrollbar">
              {Object.entries(fortunesByCategory).map(([category, categoryFortunes]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm uppercase font-bold px-2 py-1 bg-gray-800/50 rounded-md inline-block"
                      style={{ 
                        color: categoryColors[category as keyof typeof categoryColors]?.text || '#a3a3a3'
                      }}>
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryFortunes.map(fortune => (
                      <motion.div
                        key={fortune.id}
                        className="bg-black/40 border rounded-lg p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
                        style={{ 
                          borderColor: categoryColors[fortune.category]?.border || 'rgba(75,85,99,0.7)'
                        }}
                        whileHover={{ x: 3, backgroundColor: 'rgba(31, 41, 55, 0.6)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectFortune(fortune)}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold" style={{ color: colors.primary }}>{fortune.chinese}</p>
                          <div className="flex items-center">
                            <span className="text-xs mr-2" style={{ color: categoryColors[fortune.category]?.text }}>
                              {fortune.category}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded">
                              #{fortune.id}
                            </span>
                          </div>
                        </div>
                        <p className="text-white text-sm mt-1">{fortune.english}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 