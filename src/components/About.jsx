import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Globe, Code, LineChart, Shield, Brain, Target } from 'lucide-react';
import Logo from './Logo';

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-void/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left: Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-full"></div>
              <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden aspect-square bg-void flex items-center justify-center">
                {/* Abstract visualization of a neural network */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="url(#aboutGrad)" strokeWidth="0.3" fill="none" />
                  <circle cx="50" cy="50" r="35" stroke="url(#aboutGrad)" strokeWidth="0.3" fill="none" />
                  <circle cx="50" cy="50" r="25" stroke="url(#aboutGrad)" strokeWidth="0.3" fill="none" />
                  <circle cx="50" cy="50" r="15" stroke="url(#aboutGrad)" strokeWidth="0.3" fill="none" />
                  <path d="M50 5 L50 95 M5 50 L95 50 M15 15 L85 85 M85 15 L15 85" stroke="url(#aboutGrad)" strokeWidth="0.3" />
                  <defs>
                    <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#00f3ff', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#7c3aed', stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="relative z-10 text-center p-8">
                  <Logo size="large" showText={false} className="mx-auto mb-6 scale-150" />
                  <div className="text-3xl font-bold text-white mb-2 font-display">Cloud Miami</div>
                  <div className="text-primary tracking-[0.3em] text-xs uppercase font-semibold">Collective</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              We Are <span className="text-gradient">The Interface</span> Between Human Creativity & Machine Speed.
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Cloud Miami isn't just an agency. We are a collective of systems architects, prompt engineers, and motion designers who believe the future belongs to those who move fastest.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              By building custom AI infrastructures, we don't just "do marketing" — we install an engine that generates growth, content, and leads autonomously.
            </p>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Stat icon={Cpu} label="Neural Architectures" />
              <Stat icon={Zap} label="Real-time Generation" />
              <Stat icon={Globe} label="Global Scalability" />
              <Stat icon={LineChart} label="Predictive Analytics" />
            </div>

            {/* Philosophy Section */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-primary" />
                Our Philosophy
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                We believe the next decade of business will be won not by those with the biggest budgets, but by those with the most intelligent systems. Our role is to make cutting-edge AI accessible and actionable for B2B enterprises.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Edge Computing</span>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">Generative AI</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">Knowledge Graphs</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team/Expertise Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-bold mb-4">Core Expertise Areas</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our collective brings together decades of experience in systems engineering, AI research, and creative direction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ExpertiseCard 
              icon={Code}
              title="Systems Architecture"
              desc="Building scalable, secure, and performant web applications using modern frameworks and edge computing."
            />
            <ExpertiseCard 
              icon={Brain}
              title="AI Research & Implementation"
              desc="Fine-tuning LLMs, implementing vector databases, and building custom AI agents for specific business needs."
            />
            <ExpertiseCard 
              icon={Shield}
              title="Enterprise Security & Compliance"
              desc="Ensuring all deployments meet SOC2, GDPR, and industry-specific compliance requirements with automated monitoring."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
        <Icon size={20} />
      </div>
      <span className="font-semibold text-white text-sm">{label}</span>
    </div>
  );
}

function ExpertiseCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass-card p-8 rounded-2xl text-center hover:border-primary/30 transition-colors">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
        <Icon size={32} />
      </div>
      <h4 className="text-xl font-bold mb-4">{title}</h4>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
