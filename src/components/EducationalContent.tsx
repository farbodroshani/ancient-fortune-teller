import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationalContentProps {
  onClose: () => void;
}

export const EducationalContent: React.FC<EducationalContentProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]"
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
          <h2 className="text-3xl font-bold text-center mb-8">Ancient Wisdom Guide</h2>

          {/* Dharma Calculator Section */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('dharma')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              <h3 className="text-xl font-semibold">Dharma Calculator</h3>
              {activeSection === 'dharma' ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {activeSection === 'dharma' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold">Understanding Your Dharma Number</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your Dharma number is calculated by reducing your birth date to a single digit. This number represents your life's purpose and spiritual path.
                    </p>
                    <div className="space-y-2">
                      <h5 className="font-medium">Calculation Method:</h5>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Write down your birth date in DD/MM/YYYY format</li>
                        <li>Add all the digits together</li>
                        <li>If the sum is a two-digit number, add those digits together</li>
                        <li>Continue until you reach a single digit (1-9)</li>
                      </ol>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Dharma Number Meanings:</h5>
                      <ul className="space-y-2">
                        <li><strong>1:</strong> Leadership and independence</li>
                        <li><strong>2:</strong> Cooperation and diplomacy</li>
                        <li><strong>3:</strong> Creativity and expression</li>
                        <li><strong>4:</strong> Stability and foundation</li>
                        <li><strong>5:</strong> Freedom and change</li>
                        <li><strong>6:</strong> Responsibility and nurturing</li>
                        <li><strong>7:</strong> Wisdom and spirituality</li>
                        <li><strong>8:</strong> Power and abundance</li>
                        <li><strong>9:</strong> Humanitarian service</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Fortune Telling Methods Section */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('methods')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-rose-600 to-pink-500 text-white"
            >
              <h3 className="text-xl font-semibold">Fortune Telling Methods</h3>
              {activeSection === 'methods' ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {activeSection === 'methods' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {/* Tarot Reading */}
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Tarot Reading</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Originating in 15th century Europe, Tarot cards evolved from playing cards to a divination tool in the 18th century. Each of the 78 cards carries symbolic imagery representing different aspects of life.
                      </p>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <strong>Historical Context:</strong> The Tarot's symbolism draws from various mystical traditions, including Kabbalah, alchemy, and astrology.
                      </div>
                    </div>

                    {/* I Ching */}
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">I Ching</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Dating back to ancient China (circa 1000 BCE), the I Ching or "Book of Changes" is one of the oldest divination systems. It uses 64 hexagrams representing different states of change.
                      </p>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <strong>Cultural Significance:</strong> Deeply rooted in Taoist philosophy, emphasizing the balance of yin and yang.
                      </div>
                    </div>

                    {/* Astrology */}
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Astrology</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        With origins in ancient Babylon and Egypt, astrology interprets the influence of celestial bodies on human affairs through the zodiac system.
                      </p>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <strong>Historical Development:</strong> Evolved from early Babylonian star charts to the complex system we know today.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Glossary Section */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('glossary')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
            >
              <h3 className="text-xl font-semibold">Glossary of Terms</h3>
              {activeSection === 'glossary' ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {activeSection === 'glossary' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <dl className="space-y-4">
                      <div>
                        <dt className="font-semibold">Dharma</dt>
                        <dd className="text-gray-600 dark:text-gray-300">One's duty or righteous path in life according to Hindu and Buddhist philosophy.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Karma</dt>
                        <dd className="text-gray-600 dark:text-gray-300">The spiritual principle of cause and effect where intent and actions influence the future.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Yin and Yang</dt>
                        <dd className="text-gray-600 dark:text-gray-300">The concept of dualism in ancient Chinese philosophy, representing opposite but complementary forces.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Hexagram</dt>
                        <dd className="text-gray-600 dark:text-gray-300">A six-line figure used in I Ching divination, composed of broken and unbroken lines.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Zodiac</dt>
                        <dd className="text-gray-600 dark:text-gray-300">A belt of the heavens divided into twelve equal parts, each named after a constellation.</dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Learning Path Section */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('learning')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white"
            >
              <h3 className="text-xl font-semibold">Learning Path</h3>
              {activeSection === 'learning' ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {activeSection === 'learning' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Beginner's Guide to Fortune Telling</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Start with understanding basic concepts and terminology</li>
                        <li>Learn about different fortune-telling methods</li>
                        <li>Practice calculating your Dharma number</li>
                        <li>Explore the historical context of divination</li>
                        <li>Begin interpreting simple fortunes</li>
                        <li>Develop your intuition and understanding</li>
                      </ol>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Tips for Beginners:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Keep an open mind but maintain healthy skepticism</li>
                        <li>Start with one method and master it before moving to others</li>
                        <li>Document your experiences and interpretations</li>
                        <li>Join communities to learn from others</li>
                        <li>Practice regularly to develop your skills</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}; 