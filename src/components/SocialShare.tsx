import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Share2 } from 'lucide-react';

interface SocialShareProps {
  fortune: {
    chinese: string;
    english: string;
    interpretation: string;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      text: string;
    };
  };
}

export function SocialShare({ fortune, theme }: SocialShareProps) {
  const shareText = `My fortune: "${fortune.chinese}" - ${fortune.english} - ${fortune.interpretation}`;
  const shareUrl = window.location.href;

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    instagram: `https://www.instagram.com/`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
  };

  const socialButtons = [
    { name: 'Twitter', icon: Twitter, url: socialLinks.twitter, color: '#1DA1F2' },
    { name: 'Facebook', icon: Facebook, url: socialLinks.facebook, color: '#4267B2' },
    { name: 'Instagram', icon: Instagram, url: socialLinks.instagram, color: '#E1306C' },
    { name: 'LinkedIn', icon: Linkedin, url: socialLinks.linkedin, color: '#0077B5' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {socialButtons.map(({ name, icon: Icon, url, color }) => (
        <motion.a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white shadow-lg"
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon size={20} />
          <span>{name}</span>
        </motion.a>
      ))}
      
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-black shadow-lg"
        style={{ backgroundColor: theme.colors.primary }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigator.clipboard.writeText(shareText);
          alert('Fortune copied to clipboard!');
        }}
      >
        <Share2 size={20} />
        <span>Copy</span>
      </motion.button>
    </div>
  );
} 