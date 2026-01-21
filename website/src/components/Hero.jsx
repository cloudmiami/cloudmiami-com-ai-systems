import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Tagline - Positions customer desire */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-wider mb-8 uppercase backdrop-blur-sm">
            <Sparkles size={12} />
            <span>For B2B Leaders Who Refuse to Fall Behind</span>
          </div>
          
          {/* Main Headline - Customer as Hero */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8">
            Build Smarter With AI-Powered Growth
          </h1>
          
          {/* Subheadline - Clear value proposition */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-6 font-light leading-relaxed">
            Deploy AI systems that generate leads, create content, and close deals—<strong className="text-white">while you sleep.</strong>
          </p>
          
          {/* Social Proof */}
          <p className="text-sm text-gray-500 mb-10">
            Trusted by growth-focused B2B companies ready to dominate their market.
          </p>
          
          {/* CTAs - Direct and Transitional */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="#contact" 
              className="group px-8 py-4 bg-primary text-void font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              Get Your Free AI Audit
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#story" 
              className="px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all font-medium backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Play size={16} className="fill-current" />
              See How It Works
            </a>
          </div>

          {/* One-liner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block glass-card px-6 py-3 rounded-full"
          >
            <p className="text-sm text-gray-300">
              <span className="text-primary font-semibold">Cloud Miami</span> helps ambitious B2B companies install AI-native growth systems so they can scale faster without burning out their team.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
