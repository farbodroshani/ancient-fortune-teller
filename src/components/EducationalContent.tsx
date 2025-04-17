import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';

interface EducationalContentProps {
  onClose: () => void;
}

export const EducationalContent: React.FC<EducationalContentProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Fortune Telling Methods</h2>

          {/* Tarot Reading */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Tarot Reading</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tarot cards originated in 15th century Europe as playing cards, evolving into a divination tool in the 18th century. Each card in the 78-card deck carries symbolic imagery representing different aspects of life, from daily challenges to spiritual growth.
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Symbols to know:</strong> The Fool (new beginnings), The Tower (sudden change), The Star (hope)
            </div>
          </section>

          {/* I Ching */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">I Ching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dating back to ancient China (circa 1000 BCE), the I Ching or "Book of Changes" is one of the oldest divination systems. It uses 64 hexagrams, each composed of six lines, representing different states of change and transformation in the universe.
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Cultural significance:</strong> Deeply rooted in Taoist philosophy, emphasizing the balance of yin and yang
            </div>
          </section>

          {/* Astrology */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Astrology</h3>
            <p className="text-gray-600 dark:text-gray-300">
              With origins in ancient Babylon and Egypt, astrology interprets the influence of celestial bodies on human affairs. The zodiac, a belt of constellations through which the sun, moon, and planets move, forms the basis of Western astrology.
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Key elements:</strong> Sun signs, moon signs, rising signs, and planetary aspects
            </div>
          </section>

          {/* Numerology */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Numerology</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dating back to ancient Greece and Egypt, numerology assigns meaning to numbers and their influence on human life. Each number (1-9) carries specific vibrations and characteristics that can reveal personality traits and life paths.
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Common calculations:</strong> Life path number, destiny number, soul urge number
            </div>
          </section>

          {/* Interpretation Guide */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Interpreting Your Fortune</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Consider the context of your current life situation</li>
              <li>Look for patterns and recurring themes</li>
              <li>Pay attention to your initial emotional response</li>
              <li>Remember that fortunes are guides, not absolute predictions</li>
              <li>Use the insights as tools for self-reflection</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}; 