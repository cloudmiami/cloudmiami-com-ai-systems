import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Calendar, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-primary/5 to-void pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
          {/* Main Content Box */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border-primary/30 text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Talk With Our AI Assistant
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Our AI assistant is here to answer your questions about our services, learn about your project needs, and help you discover how we can support your business growth.
            </p>
            
            <div className="flex justify-center">
              <motion.button
                onClick={() => {
                  const chatbotButton = document.querySelector('button[aria-label="Toggle Chat"]');
                  if (chatbotButton) chatbotButton.click();
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-void font-bold rounded-full hover:bg-white transition-all text-lg group mb-6"
              >
                <MessageCircle size={24} />
                Start Conversation
              </motion.button>
            </div>
          </div>
          
          {/* Alternative Contact Options */}
          <div className="grid md:grid-cols-2 gap-6">
              <motion.a
                href="mailto:hello@cloudmiami.com"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Email Us Directly</h3>
                  <p className="text-gray-400 text-sm">hello@cloudmiami.com</p>
                </div>
              </motion.a>
            
            <motion.button
              onClick={() => {
                const chatbotButton = document.querySelector('button[aria-label="Toggle Chat"]');
                if (chatbotButton) chatbotButton.click();
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Chat With Our Team</h3>
                <p className="text-gray-400 text-sm mb-2">Get instant answers 24/7</p>
                <p className="text-primary text-sm font-medium">We'll follow up within 24 hours</p>
              </div>
            </motion.button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm mb-6">Why Chat With Cloud Miami:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Industry expertise and insights</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Immediate, professional responses</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Builds rapport, understands your needs</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Follows up with 24-hour response time</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
