export function speakText(text, lang = 'en-ZA') {
  if (!window.speechSynthesis) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  // Optional: set voice if matching voice found
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang === lang);
  if (match) utterance.voice = match;

  window.speechSynthesis.speak(utterance);
}
