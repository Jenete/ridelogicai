// components/VoiceInputEditor.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { transcribeAudio, askGptFromText } from '../services/TranscribeAndChatService';
import './styles/VoiceInputEditor.css';
import { handleUserTransportQuery } from '../services/TransportController';

export default function VoiceInputEditor({ onSend, onSendUser, history }) {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setLoading(true);
        try {
          const transcript = await transcribeAudio(audioBlob);
          setText(transcript);
        } catch (err) {
          console.error('Transcription error:', err);
          alert('Could not transcribe audio');
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      alert('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      onSendUser(text);
      const reply = await handleUserTransportQuery(text, history);
      onSend(reply);
    } catch (err) {
      console.error('GPT error:', err);
      alert('Failed to get response from assistant.');
    } finally {
      setText('');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="voice-editor-wrapper"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      

      <motion.textarea
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Speak or type your message..."
        disabled={loading}
        className="voice-input-field"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      />

      <motion.button
        className="send-btn"
        onClick={handleSend}
        disabled={loading}
        whileTap={{ scale: 0.9 }}
      >
        <i className="fa fa-paper-plane" />
      </motion.button>

      <motion.button
        className={`mic-btn ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={loading}
        whileTap={{ scale: 0.9 }}
      >
        <i className="fa fa-microphone" />
      </motion.button>

      
    </motion.div>
  );
}