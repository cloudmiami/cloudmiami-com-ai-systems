import { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = 'https://cx.cloudmiami.com/api/chat';

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [conversationId, setConversationId] = useState('');
  const [interests, setInterests] = useState(new Set());
  const [profileBuilding, setProfileBuilding] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const storedId = localStorage.getItem('cm_conv_id') || 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cm_conv_id', storedId);
    setConversationId(storedId);
    
    setMessages([
      { type: 'bot', content: "👋 Hi there! I'm the Cloud Miami AI assistant. I can help you learn about our services, understand your project needs, and explore how we can work together to grow your business. What brings you here today?", timestamp: new Date().toISOString() }
    ]);
  }, []);

  const detectInterests = useCallback((text) => {
    const lower = text.toLowerCase();
    const keywords = {
      'web': ['web', 'website', 'design', 'ui', 'ux', 'build', 'develop', 'react', 'frontend'],
      'seo': ['seo', 'search', 'ranking', 'google', 'optimization', 'content'],
      'video': ['video', 'motion', 'animation', 'visual', 'production'],
      'content': ['content', 'blog', 'article', 'copy', 'writing'],
      'automation': ['automation', 'ai', 'chatbot', 'workflow', 'integration']
    };

    const newInterests = new Set(interests);
    let changed = false;
    
    Object.entries(keywords).forEach(([cat, terms]) => {
      if (terms.some(t => lower.includes(t))) {
        newInterests.add(cat);
        changed = true;
      }
    });

    if (changed) setInterests(newInterests);
    return Array.from(newInterests);
  }, [interests]);

  const checkForLeadInfo = useCallback((text) => {
    // Check for email patterns
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const emailMatch = text.match(emailPattern);
    
    // Check for phone patterns
    const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}[-.\s]?\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    const phoneMatch = text.match(phonePattern);
    
    // Check for company patterns
    const companyKeywords = ['work for', 'my company', 'our company', 'at my business'];
    const hasCompanyRef = companyKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (emailMatch || phoneMatch || hasCompanyRef) {
      return {
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        hasCompany: hasCompanyRef
      };
    }
    
    return null;
  }, []);

  const shouldCollectLeadInfo = useCallback((text, messageCount) => {
    // Collect lead info after 2-3 exchanges
    if (messageCount >= 2 && !leadData) {
      const leadInfo = checkForLeadInfo(text);
      if (leadInfo?.email) {
        setLeadData({
          email: leadInfo.email,
          phone: leadInfo.phone || '',
          company: leadInfo.hasCompany ? 'mentioned' : '',
          interests: Array.from(interests)
        });
      }
    }
  }, [leadData, interests, checkForLeadInfo]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    
    const newMsg = { type: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);
    
    const currentInterests = detectInterests(text);
    
    // Check if we should collect lead info
    const userMessages = messages.filter(m => m.type === 'user');
    shouldCollectLeadInfo(text, userMessages.length);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_URL}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          leadEmail: leadData?.email,
          history: messages.slice(-10).map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.type === 'bot' && lastMsg.streaming) {
          return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + assistantMessage, streaming: false }];
        }
        return [...prev, { type: 'bot', content: assistantMessage, streaming: true, timestamp: new Date().toISOString() }];
      });
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.type === 'bot' && lastMsg.streaming) {
            return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk, streaming: true }];
          }
          return [...prev, { type: 'bot', content: lastMsg.content + chunk, streaming: true, timestamp: new Date().toISOString() }];
        });
      }
      
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.type === 'bot' && lastMsg.streaming) {
          return [...prev.slice(0, -1), { ...lastMsg, streaming: false }];
        }
        return prev;
      });
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: "I'm having trouble connecting right now. Please try again later or we can arrange a consultation through our team.", 
          timestamp: new Date().toISOString() 
        }]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [leadData, messages, detectInterests, checkForLeadInfo]);

  const setLeadInfo = useCallback((info) => {
    setLeadData(prev => ({ ...prev, ...info }));
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Calculate conversation progress
  const getConversationProgress = useCallback(() => {
    const messageCount = messages.filter(m => m.type === 'user').length;
    const hasInterests = interests.size > 0;
    const hasLeadData = leadData?.email;
    
    if (messageCount === 1) {
      return { stage: 'greeting', message: 'Just getting started...' };
    } else if (messageCount <= 3 && !hasInterests) {
      return { stage: 'exploring', message: 'Understanding your needs...' };
    } else if (hasInterests && !hasLeadData) {
      return { stage: 'profiling', message: 'Building your profile...' };
    } else if (hasLeadData) {
      return { stage: 'qualified', message: 'Ready for next steps!' };
    } else {
      return { stage: 'engaged', message: 'Great conversation!' };
    }
  }, [messages, interests, leadData]);

  return {
    isOpen,
    messages,
    isTyping,
    leadData,
    conversationId,
    interests,
    sendMessage,
    setLeadInfo,
    openChat,
    closeChat,
    getConversationProgress
  };
};