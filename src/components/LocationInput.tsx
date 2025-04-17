import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  theme?: {
    primary: string;
    text: string;
  };
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationInput({ value, onChange, theme }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const colors = theme || {
    primary: '#eab308',
    text: '#facc15'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <MapPin 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 drop-shadow-md" 
        size={24} 
        style={{ color: colors.primary }} 
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Place of Birth (e.g., New York, USA)"
        className="w-full pl-12 pr-4 py-4 bg-black/60 border-3 rounded-lg text-white focus:outline-none text-lg font-medium shadow-inner"
        style={{ 
          borderColor: `${colors.primary}70`,
          // @ts-ignore - focus style is valid
          ["&:focus"]: { borderColor: colors.primary }
        }}
      />
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-gray-900 border rounded-lg shadow-lg max-h-[200px] overflow-y-auto"
          style={{ 
            borderColor: `${colors.primary}50`,
            maxHeight: 'calc(100vh - 200px)',
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '500px'
          }}
        >
          {isLoading ? (
            <div className="p-3 text-center text-gray-400">Loading suggestions...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.lat}-${suggestion.lon}`}
                className="p-3 hover:bg-black/40 cursor-pointer border-b"
                style={{ 
                  borderColor: `${colors.primary}20`,
                  color: colors.text
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 