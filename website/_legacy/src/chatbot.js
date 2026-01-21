/**
 * Cloud Miami Chatbot Widget
 * Floating chat bubble that connects to n8n webhook for AI-powered responses
 * and captures lead information (Name, Email, Website)
 * Secured with JWT authentication
 */

class CloudMiamiChatbot {
  constructor(config = {}) {
    this.webhookUrl = config.webhookUrl || 'https://nn.cloudmiami.org/webhook/chatbot';
    this.jwtSecret = config.jwtSecret || 'cM2026!wH@k$ecur3T0ken#AI-ch@tb0t';
    this.leadData = null;
    this.conversationId = this.generateId();
    this.isOpen = false;
    this.messages = [];
    this.interests = new Set(); // Track detected interests

    this.init();
  }

  generateId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Base64URL encoding (JWT-compatible)
  base64UrlEncode(str) {
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Generate JWT token for webhook authentication
  async generateJWT() {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: 'cloudmiami-chatbot',
      sub: this.conversationId,
      iat: now,
      exp: now + 300, // 5 minutes expiration
      origin: window.location.origin
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Create HMAC-SHA256 signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.jwtSecret);
    const messageData = encoder.encode(signatureInput);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
    const encodedSignature = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  // Get headers with JWT authentication
  async getAuthHeaders() {
    const token = await this.generateJWT();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  createWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'cloudmiami-chatbot';
    container.innerHTML = `
      <!-- Chat Bubble Button -->
      <button class="chatbot-bubble" aria-label="Open chat">
        <svg class="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <!-- Chat Window -->
      <div class="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-header-avatar">
            <img src="/assets/logo.png" alt="Cloud Miami">
          </div>
          <div class="chatbot-header-info">
            <h4>Cloud Miami AI</h4>
            <p>Usually replies instantly</p>
          </div>
        </div>

        <div class="chatbot-messages" id="chatbot-messages"></div>

        <!-- Lead Capture Form -->
        <div class="chatbot-form" id="chatbot-form">
          <h5>Let's get acquainted first!</h5>
          <input type="text" id="lead-firstname" placeholder="First Name" required>
          <input type="text" id="lead-lastname" placeholder="Last Name" required>
          <input type="email" id="lead-email" placeholder="Email Address" required>
          <input type="url" id="lead-website" placeholder="Your Website (optional)">
          <button type="button" id="lead-submit">Start Chatting</button>
        </div>

        <!-- Chat Input -->
        <div class="chatbot-input-container hidden" id="chatbot-input-container">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type your message...">
          <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Store references
    this.bubble = container.querySelector('.chatbot-bubble');
    this.window = container.querySelector('.chatbot-window');
    this.messagesContainer = container.querySelector('#chatbot-messages');
    this.form = container.querySelector('#chatbot-form');
    this.inputContainer = container.querySelector('#chatbot-input-container');
    this.input = container.querySelector('#chatbot-input');
    this.sendBtn = container.querySelector('#chatbot-send');
    this.leadSubmitBtn = container.querySelector('#lead-submit');
  }

  attachEventListeners() {
    // Toggle chat window
    this.bubble.addEventListener('click', () => this.toggle());

    // Lead form submission
    this.leadSubmitBtn.addEventListener('click', () => this.submitLeadForm());

    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Allow Enter on lead form inputs
    this.form.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.submitLeadForm();
      });
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.window.classList.toggle('open', this.isOpen);
    this.bubble.classList.toggle('open', this.isOpen);

    // When closing chat, update lead with collected interests
    if (!this.isOpen && this.leadData && this.interests.size > 0) {
      this.updateLeadWithInterests();
    }
  }

  addWelcomeMessage() {
    this.addMessage('bot', `👋 Hi there! I'm the Cloud Miami AI assistant. I can help you learn about our AI-native design and motion services.`);
  }

  addMessage(type, content) {
    const message = document.createElement('div');
    message.className = `chatbot-message ${type}`;
    message.textContent = content;
    this.messagesContainer.appendChild(message);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    this.messages.push({ type, content, timestamp: new Date().toISOString() });

    // Track interests from user messages
    if (type === 'user') {
      this.detectInterests(content);
    }
  }

  showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-message bot typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    this.messagesContainer.appendChild(typing);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  submitLeadForm() {
    const firstName = document.getElementById('lead-firstname').value.trim();
    const lastName = document.getElementById('lead-lastname').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const website = document.getElementById('lead-website').value.trim();

    if (!firstName || !lastName || !email) {
      alert('Please enter your first name, last name, and email to continue.');
      return;
    }

    if (!this.isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    this.leadData = { firstName, lastName, name: `${firstName} ${lastName}`, email, website };

    // Hide form, show input
    this.form.classList.add('hidden');
    this.inputContainer.classList.remove('hidden');

    // Greeting message
    this.addMessage('bot', `Nice to meet you, ${firstName}! 🎉 How can I help you today? Feel free to ask about our services:`);
    this.addMessage('bot', `• AI Web Architecture\n• SEO Content Engines\n• AI Video Production`);

    // Send lead data to webhook
    this.sendLeadToWebhook();
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  detectInterests(message) {
    const lowerMsg = message.toLowerCase();
    const interestKeywords = {
      'AI Web Architecture': ['web', 'website', 'architecture', 'design', 'ui', 'ux', 'frontend', 'backend'],
      'SEO Content Engines': ['seo', 'content', 'blog', 'search', 'ranking', 'traffic', 'marketing'],
      'AI Video Production': ['video', 'motion', 'animation', 'production', 'visual', 'footage']
    };

    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(keyword => lowerMsg.includes(keyword))) {
        this.interests.add(interest);
      }
    }
  }

  async sendLeadToWebhook() {
    try {
      const headers = await this.getAuthHeaders();
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          type: 'lead_capture',
          conversationId: this.conversationId,
          lead: {
            ...this.leadData,
            interests: Array.from(this.interests),
            conversationSummary: this.messages.map(m => `${m.type}: ${m.content}`).join('\n')
          },
          history: this.messages,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send lead data:', error);
    }
  }

  async updateLeadWithInterests() {
    if (!this.leadData || this.interests.size === 0) return;

    try {
      const headers = await this.getAuthHeaders();
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          type: 'lead_update',
          conversationId: this.conversationId,
          lead: {
            ...this.leadData,
            interests: Array.from(this.interests),
            conversationSummary: this.messages.map(m => `${m.type}: ${m.content}`).join('\n')
          },
          history: this.messages,
          timestamp: new Date().toISOString()
        })
      });
      console.log('Lead updated with interests:', Array.from(this.interests));
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    // Add user message
    this.addMessage('user', text);
    this.input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          type: 'chat_message',
          conversationId: this.conversationId,
          lead: this.leadData,
          interests: Array.from(this.interests),
          message: text,
          history: this.messages.slice(-10), // Last 10 messages for context
          timestamp: new Date().toISOString()
        })
      });

      this.hideTyping();

      if (response.ok) {
        const text = await response.text();
        try {
          // Check if response is empty
          if (!text) {
            console.warn('Received empty response from webhook');
            this.addMessage('bot', 'Thanks for your message! Our team will follow up soon.');
            return;
          }

          const data = JSON.parse(text);
          this.addMessage('bot', data.reply || 'Thanks for your message! Our team will follow up soon.');
        } catch (e) {
          console.error('Failed to parse JSON response:', text);
          // If the response is not JSON (e.g., simple text), we might want to display it or show a generic error
          this.addMessage('bot', 'Thanks for your message! Our team will follow up soon.');
        }
      } else {
        console.error('Webhook error:', response.status, response.statusText);
        this.addMessage('bot', 'Sorry, I encountered an issue. Please try again or contact us directly at hello@cloudmiami.org');
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.hideTyping();
      this.addMessage('bot', 'Connection issue. Please check your internet and try again.');
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if n8n webhook URL is configured
  const webhookUrl = window.CHATBOT_WEBHOOK_URL || 'https://nn.cloudmiami.org/webhook/chatbot';

  window.cloudMiamiChat = new CloudMiamiChatbot({
    webhookUrl: webhookUrl
  });
});
