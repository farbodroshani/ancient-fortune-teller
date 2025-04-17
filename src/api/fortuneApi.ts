import type { Fortune } from '../types';

// Enhanced Fortune type with additional features
interface EnhancedFortune extends Fortune {
  luckyElements: {
    numbers: number[];
    colors: string[];
    directions: string[];
    times: string[];
    colorMeanings: string[];
    directionMeanings: string[];
    numberMeanings: string[];
    timeMeanings: string[];
    strength: number;
  };
  zodiac: {
    sign: string;
    element: string;
    traits: string[];
    compatibility: string[];
    influence: string;
    chineseSign?: string;
    chineseElement?: string;
  };
  lunar: {
    phase: string;
    dayType: string;
    lunarDay: number;
    influence: string;
    auspiciousActivities: string[];
  };
  timing: {
    daily?: string;
    weekly?: string;
    monthly?: string;
  };
  cultural: {
    iChing: {
      hexagram: number;
      meaning: string;
      changingLines: number[];
    };
    fengShui: {
      element: string;
      direction: string;
      enhancement: string;
    };
    numerology: {
      lifePath?: number;
      personalDay?: number;
      universalDay?: number;
    };
  };
  celestial: {
    retrograde: string[];
    solarEclipse: boolean;
    lunarEclipse: boolean;
    majorTransits: string[];
  };
  personal?: {
    biorhythm: {
      physical: number;
      emotional: number;
      intellectual: number;
    };
    luckyDays: string[];
    luckyHours: string[];
    elementalAffinity: string;
  };
}

// Type for lunar phase
interface LunarPhase {
  name: string;
  influence: string;
}

// Type for lunar day
interface LunarDay {
  day: number;
  influence: string;
}

// Type for zodiac sign
interface ZodiacSign {
  name: string;
  element: string;
  traits: string[];
  compatible: string[];
}

// Type for lucky element
interface LuckyElement {
  name: string;
  meaning: string;
  element: string;
}

// Type for lucky number
interface LuckyNumber {
  number: number;
  meaning: string;
  element: string;
}

// Type for lucky time
interface LuckyTime {
  time: string;
  meaning: string;
  element: string;
}

// Type for lucky direction
interface LuckyDirection {
  name: string;
  meaning: string;
  element: string;
}

// Base URLs for the APIs
const TAROT_API = 'https://rws-cards-api.herokuapp.com/api/v1/cards/random';
const ICHING_API = 'https://iching-api.herokuapp.com/api/hexagrams/random';
const ASTROLOGY_API = 'https://horoscope-api.herokuapp.com/horoscope/today';

// Cache and rate limiting configuration
const CACHE_DURATION = 30 * 1000; // 30 seconds
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RECENT_FORTUNES_CACHE_SIZE = 20;
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds
const MAX_REQUESTS_PER_WINDOW = 60;

// Cache and rate limiting state
const apiCache = new Map<string, { data: any; timestamp: number }>();
const recentFortunes = new Set<string>();
const dharmaCache = new Map<string, number>();
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Chinese character map for generating more varied Chinese fortunes
const chineseCharacters = {
  beginnings: ['命', '福', '智', '德', '善', '道', '吉', '祥', '慧', '光', '心', '灵', '天', '地', '人'],
  middles: ['运', '泽', '慧', '行', '心', '义', '缘', '愿', '思', '望', '德', '道', '明', '静', '安'],
  endings: ['之道', '之源', '之境', '之光', '之门', '之力', '之美', '之智', '之德', '之心', '之灵', '之境', '之福', '之运', '之缘']
};

// Text formatting configuration
const MAX_FORTUNE_LENGTH = 120;
const MAX_INTERPRETATION_LENGTH = 80;
const MIN_FORTUNE_LENGTH = 30;

// Elements configuration
const elements = {
  colors: ['red', 'gold', 'green', 'blue', 'purple', 'white', 'black', 'silver'],
  directions: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'],
  timeSlots: ['dawn', 'morning', 'noon', 'afternoon', 'dusk', 'evening', 'night', 'midnight'],
  zodiacSigns: [
    { name: 'Aries', element: 'fire', traits: ['courageous', 'determined', 'confident', 'enthusiastic'], compatible: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'] },
    { name: 'Taurus', element: 'earth', traits: ['reliable', 'patient', 'practical', 'devoted'], compatible: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'] },
    { name: 'Gemini', element: 'air', traits: ['gentle', 'affectionate', 'curious', 'adaptable'], compatible: ['Libra', 'Aquarius', 'Aries', 'Leo'] },
    { name: 'Cancer', element: 'water', traits: ['tenacious', 'imaginative', 'loyal', 'empathetic'], compatible: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'] },
    { name: 'Leo', element: 'fire', traits: ['creative', 'passionate', 'generous', 'warm-hearted'], compatible: ['Aries', 'Sagittarius', 'Gemini', 'Libra'] },
    { name: 'Virgo', element: 'earth', traits: ['loyal', 'analytical', 'kind', 'hardworking'], compatible: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'] },
    { name: 'Libra', element: 'air', traits: ['cooperative', 'diplomatic', 'gracious', 'fair-minded'], compatible: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'] },
    { name: 'Scorpio', element: 'water', traits: ['resourceful', 'brave', 'passionate', 'stubborn'], compatible: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'] },
    { name: 'Sagittarius', element: 'fire', traits: ['generous', 'idealistic', 'great sense of humor'], compatible: ['Aries', 'Leo', 'Libra', 'Aquarius'] },
    { name: 'Capricorn', element: 'earth', traits: ['responsible', 'disciplined', 'self-controlled', 'good managers'], compatible: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'] },
    { name: 'Aquarius', element: 'air', traits: ['progressive', 'original', 'independent', 'humanitarian'], compatible: ['Gemini', 'Libra', 'Aries', 'Sagittarius'] },
    { name: 'Pisces', element: 'water', traits: ['compassionate', 'artistic', 'intuitive', 'gentle'], compatible: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'] }
  ],
  zodiacElements: ['fire', 'earth', 'air', 'water'],
  lunarPhases: [
    { name: 'new moon', influence: 'beginnings, fresh starts, planting seeds' },
    { name: 'waxing crescent', influence: 'growth, building momentum, taking action' },
    { name: 'first quarter', influence: 'challenges, decisions, overcoming obstacles' },
    { name: 'waxing gibbous', influence: 'refinement, preparation, fine-tuning' },
    { name: 'full moon', influence: 'completion, manifestation, celebration' },
    { name: 'waning gibbous', influence: 'gratitude, sharing, teaching' },
    { name: 'last quarter', influence: 'release, forgiveness, letting go' },
    { name: 'waning crescent', influence: 'rest, reflection, preparation' }
  ] as LunarPhase[],
  lunarDays: [
    { day: 1, influence: 'New beginnings and fresh starts' },
    { day: 2, influence: 'Partnerships and relationships' },
    { day: 3, influence: 'Creativity and self-expression' },
    { day: 4, influence: 'Stability and foundation' },
    { day: 5, influence: 'Change and freedom' },
    { day: 6, influence: 'Harmony and balance' },
    { day: 7, influence: 'Spirituality and wisdom' },
    { day: 8, influence: 'Abundance and power' },
    { day: 9, influence: 'Completion and humanitarianism' },
    { day: 10, influence: 'Leadership and independence' },
    { day: 11, influence: 'Inspiration and vision' },
    { day: 12, influence: 'Sacrifice and service' },
    { day: 13, influence: 'Transformation and rebirth' },
    { day: 14, influence: 'Manifestation and success' },
    { day: 15, influence: 'Fullness and celebration' }
  ],
  dayTypes: ['auspicious', 'challenging', 'balanced', 'transformative', 'reflective'],
  iChingHexagrams: Array.from({ length: 64 }, (_, i) => ({
    number: i + 1,
    name: `Hexagram ${i + 1}`,
    meaning: `Interpretation of hexagram ${i + 1}`
  })),
  chineseElements: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
  chineseZodiac: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
  fengShuiEnhancements: [
    'Place a water feature in this direction',
    'Add metal elements to enhance energy',
    'Incorporate wood elements for growth',
    'Use earth tones for stability',
    'Add fire elements for transformation'
  ],
  retrogradePlanets: ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'],
  majorTransits: [
    'Sun conjunct Moon',
    'Jupiter trine Saturn',
    'Venus square Mars',
    'Mercury sextile Venus'
  ],
  luckyElements: {
    colors: [
      { name: 'red', meaning: 'passion, energy, courage', element: 'fire' },
      { name: 'gold', meaning: 'wealth, success, wisdom', element: 'metal' },
      { name: 'green', meaning: 'growth, harmony, healing', element: 'wood' },
      { name: 'blue', meaning: 'peace, communication, trust', element: 'water' },
      { name: 'purple', meaning: 'spirituality, creativity, luxury', element: 'fire' },
      { name: 'white', meaning: 'purity, clarity, new beginnings', element: 'metal' },
      { name: 'black', meaning: 'mystery, power, protection', element: 'water' },
      { name: 'silver', meaning: 'intuition, reflection, balance', element: 'metal' }
    ],
    directions: [
      { name: 'north', meaning: 'career, life path, wisdom', element: 'water' },
      { name: 'south', meaning: 'fame, reputation, recognition', element: 'fire' },
      { name: 'east', meaning: 'family, health, new beginnings', element: 'wood' },
      { name: 'west', meaning: 'creativity, children, completion', element: 'metal' },
      { name: 'northeast', meaning: 'knowledge, self-cultivation', element: 'earth' },
      { name: 'northwest', meaning: 'helpful people, travel', element: 'metal' },
      { name: 'southeast', meaning: 'wealth, abundance', element: 'wood' },
      { name: 'southwest', meaning: 'love, relationships, marriage', element: 'earth' }
    ],
    numbers: [
      { number: 1, meaning: 'independence, leadership, new beginnings', element: 'water' },
      { number: 2, meaning: 'partnership, balance, harmony', element: 'earth' },
      { number: 3, meaning: 'creativity, expression, growth', element: 'wood' },
      { number: 4, meaning: 'stability, foundation, order', element: 'wood' },
      { number: 5, meaning: 'change, freedom, adventure', element: 'earth' },
      { number: 6, meaning: 'responsibility, service, harmony', element: 'metal' },
      { number: 7, meaning: 'spirituality, wisdom, analysis', element: 'metal' },
      { number: 8, meaning: 'abundance, power, success', element: 'earth' },
      { number: 9, meaning: 'completion, humanitarianism, wisdom', element: 'fire' }
    ],
    times: [
      { time: 'dawn', meaning: 'new beginnings, fresh starts', element: 'wood' },
      { time: 'morning', meaning: 'growth, action, progress', element: 'fire' },
      { time: 'noon', meaning: 'peak energy, achievement', element: 'fire' },
      { time: 'afternoon', meaning: 'stability, maintenance', element: 'earth' },
      { time: 'dusk', meaning: 'transition, reflection', element: 'metal' },
      { time: 'evening', meaning: 'relationships, harmony', element: 'water' },
      { time: 'night', meaning: 'rest, intuition, dreams', element: 'water' },
      { time: 'midnight', meaning: 'transformation, mystery', element: 'water' }
    ]
  }
};

// Rate limiting check
function checkRateLimit(apiName: string): boolean {
  const now = Date.now();
  const requestState = requestCounts.get(apiName) || { count: 0, timestamp: now };
  
  if (now - requestState.timestamp > RATE_LIMIT_WINDOW) {
    requestState.count = 1;
    requestState.timestamp = now;
  } else if (requestState.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  } else {
    requestState.count++;
  }
  
  requestCounts.set(apiName, requestState);
  return true;
}

// Enhanced fetch with timeout, retries, caching, and rate limiting
async function enhancedFetch(url: string, options: RequestInit = {}, apiName: string): Promise<Response> {
  if (!checkRateLimit(apiName)) {
    throw new Error(`Rate limit exceeded for ${apiName}`);
  }

  const cacheKey = `${url}-${JSON.stringify(options || {})}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return new Response(JSON.stringify(cached.data), { status: 200 });
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
        return new Response(JSON.stringify(data), { status: 200 });
      }
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    } catch (error) {
      console.error(`${apiName} API error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
      if (attempt === MAX_RETRIES) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error(`Failed to fetch from ${apiName} after ${MAX_RETRIES + 1} attempts`);
}

// Generate zodiac information with enhanced details
function generateZodiacInfo(): EnhancedFortune['zodiac'] {
  const sign = elements.zodiacSigns[Math.floor(Math.random() * elements.zodiacSigns.length)];
  const compatibleSigns = sign.compatible
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return {
    sign: sign.name,
    element: sign.element,
    traits: sign.traits,
    compatibility: compatibleSigns,
    influence: `The ${sign.name} energy brings ${sign.traits.join(', ')} to your endeavors. Compatible with ${compatibleSigns.join(', ')}.`
  };
}

// Generate lunar information with enhanced details
function generateLunarInfo(): EnhancedFortune['lunar'] {
  const phase = elements.lunarPhases[Math.floor(Math.random() * elements.lunarPhases.length)];
  const dayType = elements.dayTypes[Math.floor(Math.random() * elements.dayTypes.length)];
  const lunarDay = elements.lunarDays[Math.floor(Math.random() * elements.lunarDays.length)];
  
  return {
    phase: phase.name,
    dayType,
    lunarDay: lunarDay.day,
    influence: `${phase.influence}. Today is lunar day ${lunarDay.day}, bringing ${lunarDay.influence}. The ${dayType} energy enhances these influences.`,
    auspiciousActivities: generateAuspiciousActivities(phase.name, lunarDay.day, dayType)
  };
}

// Generate auspicious activities based on lunar phase and day
function generateAuspiciousActivities(phase: string, lunarDay: number, dayType: string): string[] {
  const activities = [];
  
  // Phase-based activities
  if (phase.includes('new')) {
    activities.push('Starting new projects', 'Setting intentions', 'Planting seeds (literal or metaphorical)');
  } else if (phase.includes('full')) {
    activities.push('Celebrating achievements', 'Completing projects', 'Expressing gratitude');
  } else if (phase.includes('waning')) {
    activities.push('Letting go of what no longer serves', 'Clearing space', 'Reflecting on lessons learned');
  } else {
    activities.push('Building momentum', 'Taking action', 'Making progress');
  }
  
  // Day-based activities
  if (lunarDay % 2 === 0) {
    activities.push('Working with others', 'Building relationships', 'Creating harmony');
  } else {
    activities.push('Focusing on personal growth', 'Developing skills', 'Strengthening independence');
  }
  
  // Day type activities
  if (dayType === 'auspicious') {
    activities.push('Making important decisions', 'Starting new ventures', 'Taking calculated risks');
  } else if (dayType === 'challenging') {
    activities.push('Facing obstacles head-on', 'Developing resilience', 'Learning important lessons');
  }
  
  return activities;
}

// Generate timing advice
function generateTimingAdvice(): EnhancedFortune['timing'] {
  return {
    daily: `Best hours: ${elements.timeSlots[Math.floor(Math.random() * elements.timeSlots.length)]}`,
    weekly: `Focus on your goals during the ${elements.dayTypes[Math.floor(Math.random() * elements.dayTypes.length)]} phase`,
    monthly: `The ${elements.lunarPhases[Math.floor(Math.random() * elements.lunarPhases.length)]} will bring opportunities`
  };
}

// Select lucky elements with enhanced meanings
function selectLuckyElements(text: string, category: string): EnhancedFortune['luckyElements'] {
  const timestamp = Date.now();
  const seed = text.length + timestamp;
  
  const selectedColors = [
    elements.luckyElements.colors[seed % elements.luckyElements.colors.length],
    elements.luckyElements.colors[(seed + 4) % elements.luckyElements.colors.length]
  ];
  
  const selectedDirections = [
    elements.luckyElements.directions[seed % elements.luckyElements.directions.length],
    elements.luckyElements.directions[(seed + 4) % elements.luckyElements.directions.length]
  ];
  
  const selectedNumbers = generateLuckyNumbers(text).map(num => 
    elements.luckyElements.numbers.find(n => n.number === num) || 
    { number: num, meaning: 'Universal energy', element: 'earth' }
  );
  
  const selectedTimes = [
    elements.luckyElements.times[seed % elements.luckyElements.times.length],
    elements.luckyElements.times[(seed + 4) % elements.luckyElements.times.length]
  ];
  
  return {
    colors: selectedColors.map(c => c.name),
    colorMeanings: selectedColors.map(c => c.meaning),
    directions: selectedDirections.map(d => d.name),
    directionMeanings: selectedDirections.map(d => d.meaning),
    numbers: selectedNumbers.map(n => n.number),
    numberMeanings: selectedNumbers.map(n => n.meaning),
    times: selectedTimes.map(t => t.time),
    timeMeanings: selectedTimes.map(t => t.meaning),
    strength: calculateFortuneStrength(text, category)
  };
}

// Generate lucky numbers based on input and current time
function generateLuckyNumbers(input: string): number[] {
  const timestamp = Date.now();
  const seed = input.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + timestamp;
  const numbers = new Set<number>();
  
  while (numbers.size < 4) {
    const num = Math.floor((Math.sin(numbers.size + seed) + 1) * 49) + 1;
    numbers.add(num);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

// Calculate fortune strength with enhanced factors
function calculateFortuneStrength(text: string, category: string): number {
  const timestamp = Date.now();
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const month = new Date().getMonth();
  
  // Text-based factors
  const textFactors = {
    length: Math.min(text.length / MAX_FORTUNE_LENGTH * 30, 30),
    positivity: calculateTextPositivity(text) * 20,
    uniqueness: calculateTextUniqueness(text) * 15,
    clarity: calculateTextClarity(text) * 15
  };
  
  // Time-based factors
  const timeFactors = {
    hour: Math.sin(hour / 24 * Math.PI) * 10 + 10,
    day: Math.sin(day / 7 * Math.PI) * 5 + 5,
    month: Math.sin(month / 12 * Math.PI) * 5 + 5,
    lunar: calculateLunarInfluence() * 10
  };
  
  // Category-specific factors
  const categoryFactors = {
    relevance: calculateCategoryRelevance(text, category) * 15,
    timing: calculateCategoryTiming(category, hour) * 10
  };
  
  // Element harmony factors
  const harmonyFactors = {
    zodiac: calculateZodiacHarmony() * 10,
    elements: calculateElementHarmony() * 10,
    directions: calculateDirectionHarmony() * 10
  };
  
  // Calculate base strength from all factors
  const baseStrength = 
    Object.values(textFactors).reduce((sum, factor) => sum + factor, 0) +
    Object.values(timeFactors).reduce((sum, factor) => sum + factor, 0) +
    Object.values(categoryFactors).reduce((sum, factor) => sum + factor, 0) +
    Object.values(harmonyFactors).reduce((sum, factor) => sum + factor, 0);
  
  // Apply random variation (up to ±10%)
  const variation = (Math.random() * 20) - 10;
  const finalStrength = Math.min(Math.max(Math.round(baseStrength + variation), 1), 100);
  
  return finalStrength;
}

// Helper function to calculate text positivity
function calculateTextPositivity(text: string): number {
  const positiveWords = ['success', 'happy', 'joy', 'love', 'peace', 'harmony', 'growth', 'abundance', 'wisdom', 'blessing'];
  const negativeWords = ['difficult', 'challenge', 'obstacle', 'fear', 'worry', 'doubt', 'struggle', 'pain', 'loss', 'failure'];
  
  const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;
  
  return Math.max(0, Math.min(1, (positiveCount - negativeCount) / 5));
}

// Helper function to calculate text uniqueness
function calculateTextUniqueness(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  return Math.min(1, uniqueWords.size / words.length);
}

// Helper function to calculate text clarity
function calculateTextClarity(text: string): number {
  const sentenceLength = text.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length);
  const avgLength = sentenceLength.reduce((sum, len) => sum + len, 0) / sentenceLength.length;
  
  // Optimal sentence length is between 10-20 words
  if (avgLength >= 10 && avgLength <= 20) return 1;
  if (avgLength < 5 || avgLength > 30) return 0.3;
  return 0.7;
}

// Helper function to calculate lunar influence with proper typing
function calculateLunarInfluence(): number {
  const phase = elements.lunarPhases[Math.floor(Math.random() * elements.lunarPhases.length)];
  const dayType = elements.dayTypes[Math.floor(Math.random() * elements.dayTypes.length)];
  
  const phaseStrength: Record<string, number> = {
    'new moon': 0.8,
    'waxing crescent': 0.9,
    'first quarter': 1.0,
    'waxing gibbous': 1.0,
    'full moon': 1.0,
    'waning gibbous': 0.9,
    'last quarter': 0.8,
    'waning crescent': 0.7
  };
  
  const dayTypeStrength: Record<string, number> = {
    'auspicious': 1.0,
    'challenging': 0.7,
    'balanced': 0.9,
    'transformative': 0.8,
    'reflective': 0.8
  };
  
  return (phaseStrength[phase.name] + dayTypeStrength[dayType]) / 2;
}

// Helper function to calculate category relevance
function calculateCategoryRelevance(text: string, category: string): number {
  const categoryKeywords = {
    love: ['love', 'heart', 'relationship', 'connection', 'romance', 'partner'],
    career: ['work', 'career', 'success', 'business', 'job', 'professional'],
    health: ['health', 'wellness', 'body', 'mind', 'healing', 'vitality'],
    luck: ['luck', 'fortune', 'destiny', 'fate', 'opportunity', 'chance']
  };
  
  const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
  const matches = keywords.filter(word => text.toLowerCase().includes(word)).length;
  return Math.min(1, matches / keywords.length);
}

// Helper function to calculate category timing
function calculateCategoryTiming(category: string, hour: number): number {
  const categoryHours = {
    love: [18, 19, 20, 21], // Evening hours
    career: [9, 10, 11, 12, 13, 14, 15], // Business hours
    health: [6, 7, 8, 16, 17], // Morning and late afternoon
    luck: [0, 12, 23] // Midnight, noon, and late night
  };
  
  const optimalHours = categoryHours[category as keyof typeof categoryHours] || [];
  if (optimalHours.includes(hour)) return 1;
  if (optimalHours.some(h => Math.abs(h - hour) <= 2)) return 0.8;
  return 0.5;
}

// Helper function to calculate zodiac harmony
function calculateZodiacHarmony(): number {
  const sign = elements.zodiacSigns[Math.floor(Math.random() * elements.zodiacSigns.length)];
  const compatibleSigns = sign.compatible;
  const currentSign = elements.zodiacSigns[Math.floor(Math.random() * elements.zodiacSigns.length)];
  
  return compatibleSigns.includes(currentSign.name) ? 1 : 0.7;
}

// Helper function to calculate element harmony
function calculateElementHarmony(): number {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const elementRelations = {
    wood: ['fire', 'water'],
    fire: ['earth', 'wood'],
    earth: ['metal', 'fire'],
    metal: ['water', 'earth'],
    water: ['wood', 'metal']
  };
  
  const currentElement = elements[Math.floor(Math.random() * elements.length)];
  const compatibleElements = elementRelations[currentElement as keyof typeof elementRelations];
  const selectedElement = elements[Math.floor(Math.random() * elements.length)];
  
  return compatibleElements.includes(selectedElement) ? 1 : 0.7;
}

// Helper function to calculate direction harmony
function calculateDirectionHarmony(): number {
  const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];
  const directionRelations = {
    north: ['east', 'west'],
    south: ['east', 'west'],
    east: ['north', 'south'],
    west: ['north', 'south'],
    northeast: ['southeast', 'northwest'],
    northwest: ['northeast', 'southwest'],
    southeast: ['northeast', 'southwest'],
    southwest: ['northwest', 'southeast']
  };
  
  const currentDirection = directions[Math.floor(Math.random() * directions.length)];
  const compatibleDirections = directionRelations[currentDirection as keyof typeof directionRelations];
  const selectedDirection = directions[Math.floor(Math.random() * directions.length)];
  
  return compatibleDirections.includes(selectedDirection) ? 1 : 0.7;
}

// Generate pseudo-Chinese text based on input with more variety
function generateChineseText(input: string): string {
  const seedValue = input.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const timestamp = Date.now();
  
  // Use different mathematical operations for more variety
  const beginning = chineseCharacters.beginnings[Math.floor((seedValue + timestamp) % chineseCharacters.beginnings.length)];
  const middle = chineseCharacters.middles[Math.floor((seedValue * Math.PI + timestamp) % chineseCharacters.middles.length)];
  const ending = chineseCharacters.endings[Math.floor((seedValue * Math.E + timestamp) % chineseCharacters.endings.length)];
  
  return `${beginning}${middle}${ending}`;
}

// Helper function to format and trim text to fit the fortune card
function formatFortuneText(text: string): string {
  // Remove extra spaces and normalize
  let formatted = text.trim().replace(/\s+/g, ' ');
  
  // If text is too short, don't truncate
  if (formatted.length < MIN_FORTUNE_LENGTH) {
    return formatted;
  }
  
  // If text is too long, truncate at the last complete word
  if (formatted.length > MAX_FORTUNE_LENGTH) {
    formatted = formatted.substring(0, MAX_FORTUNE_LENGTH);
    const lastSpace = formatted.lastIndexOf(' ');
    if (lastSpace > MIN_FORTUNE_LENGTH) {
      formatted = formatted.substring(0, lastSpace);
    }
    formatted += '...';
  }
  
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Helper function to format interpretation text
function formatInterpretation(text: string): string {
  let formatted = text.trim().replace(/\s+/g, ' ');
  
  if (formatted.length > MAX_INTERPRETATION_LENGTH) {
    formatted = formatted.substring(0, MAX_INTERPRETATION_LENGTH);
    const lastSpace = formatted.lastIndexOf(' ');
    if (lastSpace > 0) {
      formatted = formatted.substring(0, lastSpace);
    }
    formatted += '...';
  }
  
  return formatted;
}

// Generate dynamic interpretations with seasonal variations
function generateInterpretation(text: string, category: string): string {
  const season = getSeason();
  const timeOfDay = getTimeOfDay();
  
  const phrases = {
    love: [
      "speaks to the depths of your heart's desires",
      "reveals the path of true connection",
      "illuminates your journey in matters of the heart",
      "shows the way to deeper relationships",
      "guides you towards meaningful bonds",
      `like the ${season} season, brings renewal to your heart`,
      `in this ${timeOfDay} moment, opens your heart to possibilities`
    ],
    career: [
      "points to professional growth ahead",
      "indicates success through dedication",
      "reveals opportunities for advancement",
      "suggests recognition of your talents",
      "shows the path to career fulfillment",
      `The ${season} season inspires you to excel in your career.`,
      `The ${timeOfDay} light guides your professional growth.`
    ],
    health: [
      "guides you towards greater wellness",
      "indicates a time of healing and renewal",
      "suggests balance is key to vitality",
      "reveals the path to wholeness",
      "points to positive health changes",
      `The ${season} season encourages you to prioritize wellness.`,
      `The ${timeOfDay} light reminds you to take care of your health.`
    ],
    luck: [
      "foretells of fortunate circumstances",
      "suggests a turn of good fortune",
      "indicates lucky opportunities ahead",
      "reveals favorable timing",
      "points to unexpected blessings",
      `The ${season} season brings unexpected opportunities.`,
      `The ${timeOfDay} light illuminates your path to success.`
    ],
    all: [
      "carries wisdom for your journey",
      "reveals important insights",
      "suggests meaningful changes ahead",
      "indicates a time of growth",
      "shows the way forward",
      `The ${season} season reveals important insights.`,
      `The ${timeOfDay} light guides your journey.`
    ]
  };
  
  const categoryPhrases = phrases[category as keyof typeof phrases] || phrases.all;
  const phrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)];
  
  const prefix = text.split(' ').slice(0, 5).join(' ');
  return `"${prefix}..." ${phrase}. Contemplate these words deeply.`;
}

// Helper function to get current season
function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

// Helper function to get time of day
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Function to fetch a random fortune from multiple APIs
export async function fetchRandomFortune(category: string = 'all'): Promise<EnhancedFortune> {
  const apis = [
    fetchFromTarot,
    fetchFromIChing,
    fetchFromAstrology
  ];
  
  // Try all APIs in parallel and collect successful results
  const apiPromises = apis.map(api => api(category).catch(error => {
    console.error(`API fetch failed:`, error);
    return null;
  }));
  
  const results = await Promise.all(apiPromises);
  const validResults = results.filter((result): result is EnhancedFortune => 
    result !== null && !recentFortunes.has(result.english)
  );
  
  if (validResults.length > 0) {
    // Pick a random fortune from successful results
    const fortune = validResults[Math.floor(Math.random() * validResults.length)];
    
    // Add to recent fortunes cache and remove oldest if needed
    recentFortunes.add(fortune.english);
    if (recentFortunes.size > RECENT_FORTUNES_CACHE_SIZE) {
      const firstItem = recentFortunes.values().next().value;
      if (firstItem) {
        recentFortunes.delete(firstItem);
      }
    }
    
    // Enhance the fortune with additional elements
    const enhancedFortune: EnhancedFortune = {
      ...fortune,
      id: fortune.id || Date.now(),
      english: fortune.english,
      chinese: fortune.chinese || generateChineseText(fortune.english),
      luckyElements: selectLuckyElements(fortune.english, category),
      zodiac: generateZodiacInfo(),
      lunar: generateLunarInfo(),
      timing: generateTimingAdvice(),
      cultural: {
        iChing: generateIChingReading(),
        fengShui: generateFengShuiAdvice(),
        numerology: {
          universalDay: Math.floor(Math.random() * 9) + 1
        }
      },
      celestial: calculateCelestialInfluences(),
      category: fortune.category || category,
      interpretation: fortune.interpretation || generateInterpretation(fortune.english, category)
    };
    
    return enhancedFortune;
  }
  
  // If all APIs fail or return duplicates, use enhanced fallback with more variety
  return generateEnhancedFallbackFortune(category);
}

// Fetch from Tarot API
async function fetchFromTarot(category: string): Promise<EnhancedFortune | null> {
  try {
    const response = await enhancedFetch(TAROT_API, {}, 'Tarot');
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const card = data.cards[0];
    const uniqueId = Date.now() % 10000 + Math.floor(Math.random() * 1000);
    
    const fortuneText = `${card.name} - ${card.meaning_up}`;
    const formattedText = formatFortuneText(fortuneText);
    
    const baseFortune: Fortune = {
      id: uniqueId,
      chinese: generateChineseText(fortuneText + Date.now().toString()),
      english: formattedText,
      interpretation: formatInterpretation(generateInterpretation(fortuneText, category)),
      category: category as 'love' | 'career' | 'health' | 'luck'
    };
    
    return enhanceFortuneWithElements(baseFortune, formattedText, category);
  } catch (error) {
    console.error('Error fetching from Tarot API:', error);
    return null;
  }
}

// Fetch from I Ching API
async function fetchFromIChing(category: string): Promise<EnhancedFortune | null> {
  try {
    const response = await enhancedFetch(ICHING_API, {}, 'IChing');
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const uniqueId = Date.now() % 10000 + Math.floor(Math.random() * 1000);
    
    const fortuneText = `${data.name} - ${data.meaning}`;
    const formattedText = formatFortuneText(fortuneText);
    
    const baseFortune: Fortune = {
      id: uniqueId,
      chinese: generateChineseText(fortuneText + Date.now().toString()),
      english: formattedText,
      interpretation: formatInterpretation(generateInterpretation(fortuneText, category)),
      category: category as 'love' | 'career' | 'health' | 'luck'
    };
    
    return enhanceFortuneWithElements(baseFortune, formattedText, category);
  } catch (error) {
    console.error('Error fetching from I Ching API:', error);
    return null;
  }
}

// Fetch from Astrology API
async function fetchFromAstrology(category: string): Promise<EnhancedFortune | null> {
  try {
    const response = await enhancedFetch(ASTROLOGY_API, {}, 'Astrology');
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const uniqueId = Date.now() % 10000 + Math.floor(Math.random() * 1000);
    
    const fortuneText = `${data.horoscope}`;
    const formattedText = formatFortuneText(fortuneText);
    
    const baseFortune: Fortune = {
      id: uniqueId,
      chinese: generateChineseText(fortuneText + Date.now().toString()),
      english: formattedText,
      interpretation: formatInterpretation(generateInterpretation(fortuneText, category)),
      category: category as 'love' | 'career' | 'health' | 'luck'
    };
    
    return enhanceFortuneWithElements(baseFortune, formattedText, category);
  } catch (error) {
    console.error('Error fetching from Astrology API:', error);
    return null;
  }
}

// Calculate celestial influences
function calculateCelestialInfluences(): EnhancedFortune['celestial'] {
  const retrograde = elements.retrogradePlanets
    .filter(() => Math.random() > 0.7);
  
  const majorTransits = elements.majorTransits
    .filter(() => Math.random() > 0.8);
  
  return {
    retrograde,
    solarEclipse: Math.random() > 0.9,
    lunarEclipse: Math.random() > 0.9,
    majorTransits
  };
}

// Calculate biorhythm with proper type handling
function calculateBiorhythm(birthDate?: string): {
  physical: number;
  emotional: number;
  intellectual: number;
} {
  if (!birthDate) {
    return {
      physical: Math.sin(Date.now() / (23 * 24 * 60 * 60 * 1000) * Math.PI) * 100,
      emotional: Math.sin(Date.now() / (28 * 24 * 60 * 60 * 1000) * Math.PI) * 100,
      intellectual: Math.sin(Date.now() / (33 * 24 * 60 * 60 * 1000) * Math.PI) * 100
    };
  }
  
  const birthTimestamp = new Date(birthDate).getTime();
  const days = Math.floor((Date.now() - birthTimestamp) / (24 * 60 * 60 * 1000));
  
  return {
    physical: Math.sin((2 * Math.PI * days) / 23) * 100,
    emotional: Math.sin((2 * Math.PI * days) / 28) * 100,
    intellectual: Math.sin((2 * Math.PI * days) / 33) * 100
  };
}

// Enhanced fortune generation
function enhanceFortuneWithElements(
  fortune: Fortune,
  text: string,
  category: string,
  birthDate?: string
): EnhancedFortune {
  const timestamp = Date.now();
  const chineseZodiacIndex = Math.floor(timestamp / (24 * 60 * 60 * 1000)) % 12;
  
  return {
    ...fortune,
    luckyElements: selectLuckyElements(text, category),
    zodiac: {
      ...generateZodiacInfo(),
      chineseSign: elements.chineseZodiac[chineseZodiacIndex],
      chineseElement: elements.chineseElements[Math.floor(chineseZodiacIndex / 2) % 5]
    },
    lunar: generateLunarInfo(),
    timing: generateTimingAdvice(),
    cultural: {
      iChing: generateIChingReading(),
      fengShui: generateFengShuiAdvice(),
      numerology: {
        universalDay: Math.floor(Math.random() * 9) + 1
      }
    },
    celestial: calculateCelestialInfluences(),
    personal: birthDate ? {
      biorhythm: calculateBiorhythm(birthDate),
      luckyDays: selectRandomElements(elements.timeSlots, 3),
      luckyHours: selectRandomElements(elements.timeSlots, 3),
      elementalAffinity: elements.chineseElements[Math.floor(Math.random() * elements.chineseElements.length)]
    } : undefined
  };
}

// Helper function to select random elements
function selectRandomElements<T>(array: T[], count: number): T[] {
  return array
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// Enhanced fallback fortune generation with mystical elements
function generateEnhancedFallbackFortune(category: string): EnhancedFortune {
  const timestamp = Date.now();
  const season = getSeason();
  const timeOfDay = getTimeOfDay();
  const chineseZodiacIndex = Math.floor(timestamp / (24 * 60 * 60 * 1000)) % 12;
  
  const fallbackFortunes = {
    love: [
      "The Moon in your seventh house reveals a romantic encounter soon.",
      "Venus aligns with your heart chakra, bringing love your way.",
      "Your soulmate's energy draws closer as Mercury goes direct.",
      "The stars foretell a passionate connection in your near future.",
      "Your love aura shines bright, attracting meaningful relationships.",
      "The Tarot reveals the Lovers card in your romantic future.",
      "Your heart line in palmistry shows deep emotional fulfillment.",
      "The I Ching hexagram for love appears in your reading.",
      "Your birth chart shows Venus entering your relationship house.",
      "The crystal ball reveals a soul connection approaching.",
      "Your tea leaves form a heart, signaling romantic news.",
      "The runes speak of a destined meeting in your love life.",
      "Your aura's pink hue intensifies, indicating love's approach.",
      "The pendulum swings toward a new romantic chapter.",
      "Your numerology chart shows a 2 in your love path."
    ],
    career: [
      "Saturn's influence brings career advancement opportunities.",
      "The Tower card in your career spread signals positive change.",
      "Your life path number aligns with professional success.",
      "The stars indicate a promotion or new job offer coming.",
      "Mercury retrograde ends, bringing clarity to career decisions.",
      "Your palm's fate line shows a career breakthrough.",
      "The I Ching reveals growth in your professional life.",
      "Your birth chart shows Jupiter blessing your career house.",
      "The crystal ball shows success in your chosen field.",
      "Your tea leaves form a ladder, indicating career progress.",
      "The runes speak of financial abundance through work.",
      "Your aura's gold hue intensifies, signaling career growth.",
      "The pendulum swings toward professional achievement.",
      "Your numerology chart shows an 8 in your career path.",
      "The stars align for business success and recognition."
    ],
    health: [
      "The Moon's healing energy flows through your body.",
      "The High Priestess card indicates improved well-being.",
      "Your life force energy strengthens with the new moon.",
      "The stars show a period of physical and mental renewal.",
      "Mercury's influence brings clarity to health decisions.",
      "Your palm's health line shows improved vitality.",
      "The I Ching reveals balance in your physical being.",
      "Your birth chart shows healing planetary aspects.",
      "The crystal ball shows improved energy and wellness.",
      "Your tea leaves form a circle, indicating wholeness.",
      "The runes speak of natural healing and recovery.",
      "Your aura's green hue intensifies, signaling health.",
      "The pendulum swings toward physical well-being.",
      "Your numerology chart shows a 6 in your health path.",
      "The stars align for holistic healing and balance."
    ],
    luck: [
      "Jupiter's blessings bring unexpected good fortune.",
      "The Wheel of Fortune card turns in your favor.",
      "Your lucky number aligns with today's cosmic energy.",
      "The stars indicate a streak of good luck coming.",
      "Mercury's influence brings fortunate opportunities.",
      "Your palm's luck line shows a positive turn.",
      "The I Ching reveals auspicious timing for you.",
      "Your birth chart shows lucky planetary aspects.",
      "The crystal ball shows serendipitous events.",
      "Your tea leaves form a star, indicating luck.",
      "The runes speak of favorable circumstances.",
      "Your aura's purple hue intensifies, signaling luck.",
      "The pendulum swings toward fortunate outcomes.",
      "Your numerology chart shows a 7 in your luck path.",
      "The stars align for unexpected blessings."
    ],
    all: [
      "The cosmos whispers secrets of your destiny.",
      "Ancient wisdom reveals your true path forward.",
      "The universe aligns to guide your journey.",
      "Mystical forces shape your future path.",
      "The stars chart your course through life.",
      "Divine timing brings perfect opportunities.",
      "The cards reveal your hidden potential.",
      "Your spiritual guides show the way.",
      "The runes speak of your destiny.",
      "Your aura reveals your true purpose.",
      "The pendulum swings toward your fate.",
      "The crystal ball shows your path.",
      "Your numerology chart points the way.",
      "The I Ching reveals your journey.",
      "The stars map your destiny."
    ]
  };
  
  const categoryFortunes = fallbackFortunes[category as keyof typeof fallbackFortunes] || fallbackFortunes.all;
  const fortune = categoryFortunes[Math.floor(Math.random() * categoryFortunes.length)];
  const formattedText = formatFortuneText(fortune);
  
  return {
    id: timestamp % 10000 + Math.floor(Math.random() * 1000),
    chinese: generateChineseText(fortune + timestamp + Math.random().toString()),
    english: formattedText,
    interpretation: formatInterpretation(generateInterpretation(fortune, category)),
    category: (category === 'all' ? 'luck' : category) as 'love' | 'career' | 'health' | 'luck',
    luckyElements: selectLuckyElements(formattedText, category),
    zodiac: {
      ...generateZodiacInfo(),
      chineseSign: elements.chineseZodiac[chineseZodiacIndex],
      chineseElement: elements.chineseElements[Math.floor(chineseZodiacIndex / 2) % 5]
    },
    lunar: generateLunarInfo(),
    timing: generateTimingAdvice(),
    cultural: {
      iChing: generateIChingReading(),
      fengShui: generateFengShuiAdvice(),
      numerology: {
        universalDay: Math.floor(Math.random() * 9) + 1
      }
    },
    celestial: calculateCelestialInfluences()
  };
}

// Generate I Ching reading
function generateIChingReading(): EnhancedFortune['cultural']['iChing'] {
  const hexagram = Math.floor(Math.random() * 64) + 1;
  const changingLines = Array.from(
    { length: Math.floor(Math.random() * 6) + 1 },
    () => Math.floor(Math.random() * 6) + 1
  ).sort((a, b) => a - b);
  
  return {
    hexagram,
    meaning: elements.iChingHexagrams[hexagram - 1].name,
    changingLines
  };
}

// Generate Feng Shui advice
function generateFengShuiAdvice(): EnhancedFortune['cultural']['fengShui'] {
  const element = elements.chineseElements[Math.floor(Math.random() * elements.chineseElements.length)];
  const direction = elements.directions[Math.floor(Math.random() * elements.directions.length)];
  const enhancement = elements.fengShuiEnhancements[Math.floor(Math.random() * elements.fengShuiEnhancements.length)];
  
  return {
    element,
    direction,
    enhancement
  };
}

// Calculate Dharma number based on name, birth date, place, and time
export function calculateDharmaNumber(name: string, birthDate: string, birthPlace: string, birthTime: string): number {
  const timestamp = Date.now();
  const seed = name.length + birthDate.length + birthPlace.length + birthTime.length + timestamp;
  
  // Calculate name number
  const nameNumber = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9 || 9;
  
  // Calculate birth date number
  const dateNumber = birthDate.split('-').reduce((sum, num) => sum + parseInt(num), 0) % 9 || 9;
  
  // Calculate place number
  const placeNumber = birthPlace.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9 || 9;
  
  // Calculate time number
  const timeNumber = birthTime.split(':').reduce((sum, num) => sum + parseInt(num), 0) % 9 || 9;
  
  // Calculate final dharma number
  const dharmaNumber = (nameNumber + dateNumber + placeNumber + timeNumber) % 9 || 9;
  
  return dharmaNumber;
}

// Get interpretation for a dharma number
export function getDharmaInterpretation(number: number): string {
  const interpretations = {
    1: "You are a natural leader with strong independence and pioneering spirit. Your path involves taking initiative and creating new opportunities.",
    2: "You are a peacemaker with a gift for diplomacy and cooperation. Your path involves bringing harmony and balance to relationships.",
    3: "You are creative and expressive with a joyful spirit. Your path involves sharing your artistic talents and spreading optimism.",
    4: "You are practical and organized with a strong work ethic. Your path involves building stable foundations and maintaining order.",
    5: "You are adventurous and adaptable with a love for freedom. Your path involves embracing change and exploring new experiences.",
    6: "You are nurturing and responsible with a healing touch. Your path involves caring for others and creating harmony in your environment.",
    7: "You are analytical and spiritual with deep intuition. Your path involves seeking wisdom and understanding life's mysteries.",
    8: "You are ambitious and powerful with a talent for manifestation. Your path involves achieving success and creating abundance.",
    9: "You are compassionate and humanitarian with universal love. Your path involves serving humanity and completing cycles."
  };
  
  return interpretations[number as keyof typeof interpretations] || "Your path is unique and unfolding.";
}

// Export the enhanced type
export type { EnhancedFortune }; 