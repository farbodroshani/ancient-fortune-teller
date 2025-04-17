import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Share2, Copy } from 'lucide-react';

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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    alert('Fortune copied to clipboard!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {socialButtons.map((button) => (
          <motion.a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-lg text-white flex flex-col items-center justify-center gap-2 ${button.color}`}
          >
            <button.icon className="w-6 h-6" />
            <span className="text-sm">{button.name}</span>
          </motion.a>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white flex flex-col items-center justify-center gap-2"
        >
          <Copy className="w-6 h-6" />
          <span className="text-sm">Copy</span>
        </motion.button>
      </div>
    </div>
  );
} 