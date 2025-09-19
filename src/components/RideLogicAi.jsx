// components/RideLogicAi.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './styles/RideLogicAi.css';
import VoiceInputEditor from './VoiceInputEditor';
import UserLocationPopup from './UserLocationPopup';
import WeatherToast from './WeatherToast'
// import { speakText } from '../services/TTSService';
// import TypingEffect from './TypingEffect';

export default function RideLogicAi() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '👋 Hi there! Need help getting around?' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoiceSendUser = (userInput) => {
    if (!userInput?.trim()) return;
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setLoading(true);
  };

  const handleVoiceSend = (res) => {
   const aiReply = res?.response;
    
    if (!aiReply?.trim()) return;
    setError(null);
    //speakText(aiReply);
    setMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
    setLoading(false);
  };

  const onLocation = (locationName)=>{
    setMessages(prev => [...prev, { role: 'user', content: `My current location ${JSON.stringify(locationName)}` }]);
  }

  return (
    <motion.div
      className="ride-ai-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>RideLogic chat bot</h2>
      <div className="ride-ai-chat">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`ride-ai-msg ${msg.role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* {msg.role === 'ai' && i === messages.length - 1 ? (
  <TypingEffect text={msg.content} />
) : (
  msg.content
)} */}
{msg.content}
            
          </motion.div>
        ))}
        {loading && (
          <motion.div
            className="ride-ai-msg ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
          >
            ⏳ Thinking...
          </motion.div>
        )}
        {error && (
          <motion.div
            className="ride-ai-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            ❌ {error}
          </motion.div>
        )}
      </div>
      <VoiceInputEditor onSend={handleVoiceSend} onSendUser={handleVoiceSendUser} history={messages}/>
      {/* <UserLocationPopup onLocation={onLocation}/> */}
      <WeatherToast/>
    </motion.div>
  );
}
