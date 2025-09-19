// components/TypingEffect.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './styles/TypingEffect.css';

export default function TypingEffect({ text, delay = 25 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    const interval = setInterval(() => {
      if(text[index]) setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <motion.div
      className="typing-effect-box"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText}
          
    </motion.div>
  );
}
