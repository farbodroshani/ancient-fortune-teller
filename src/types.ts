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
  onMintNFT?: (fortune: Fortune) => Promise<void>;
}

export interface FortuneHistoryProps {
  fortunes: Fortune[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFortune: (fortune: Fortune) => void;
  theme?: Theme;
}

export interface SocialShareProps {
  fortune: Fortune;
  theme: Theme;
}

export interface EducationalContentProps {
  onClose: () => void;
}