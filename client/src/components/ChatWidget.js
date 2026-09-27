import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import '../App.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Inventory Assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { question: input });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-apple"
          style={{ padding: '1rem', borderRadius: '50%', width: '60px', height: '60px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}
        >
          💬
        </button>
      ) : (
        <div style={{
          width: 'calc(min(380px, 90vw))',
          height: 'calc(min(550px, 80vh))',
          backgroundColor: 'var(--apple-card-bg)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--apple-border)',
          transition: 'background-color 0.3s ease'
        }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--apple-blue)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'var(--apple-bg)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--apple-blue)' : (isDarkMode ? '#2c2c2e' : '#e9ecef'),
                color: msg.role === 'user' ? 'white' : 'var(--apple-text)',
                padding: '0.6rem 1rem',
                borderRadius: '14px',
                maxWidth: '80%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                wordBreak: 'break-word',
                fontSize: '0.95rem',
                lineHeight: '1.4'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: isDarkMode ? '#2c2c2e' : '#e9ecef',
                color: 'var(--apple-text)',
                padding: '0.6rem 1rem',
                borderRadius: '14px',
                fontStyle: 'italic',
                fontSize: '0.9rem'
              }}>
                Thinking...
              </div>
            )}
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid var(--apple-border)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--apple-card-bg)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about stock, sales..."
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--apple-border)',
                backgroundColor: 'var(--apple-bg)',
                color: 'var(--apple-text)',
                fontSize: '0.9rem'
              }}
            />
            <button onClick={handleSend} className="btn-apple" style={{ padding: '0.6rem 1.2rem' }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
