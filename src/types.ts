export interface Fortune {
  id: number;
  category: 'love' | 'career' | 'health' | 'luck';
  chinese: string;
  english: string;
  interpretation: string;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  bgOverlay: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export interface FortuneCardProps {
  fortune: Fortune;
  isFlipped: boolean;
  onFlip: () => void;
  theme?: Theme;
}