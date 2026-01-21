import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Clock, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-red-950/10 to-void pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-semibold mb-8">
            <AlertTriangle size={16} />
            The Problem
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Your Competitors Are Using AI Against You
          </h2>
          
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            While you are doing manual sales and marketing, your competitors have automated AI chatbots working 24/7, engaging prospects instantly and qualifying leads automatically. Every minute you wait, your competitors are capturing leads.
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <PainPoint 
            icon={TrendingDown}
            title="Invisible Online"
            desc="Your competitors rank above you in Google AND in AI chat results. When prospects ask ChatGPT or Perplexity for recommendations, your brand does not exist."
          />
          <PainPoint 
            icon={Clock}
            title="Burning Resources"
            desc="Your team spends 40+ hours a week on repetitive tasks—writing content, qualifying leads, updating website—instead of strategic work that moves the needle."
          />
          <PainPoint 
            icon={Users}
            title="Losing Deals"
            desc="Prospects visit your site, but there is no one to engage them at 2 AM. By morning, they have already booked a call with a competitor whose AI chatbot captured their info."
          />
        </div>

        {/* The Stakes / Failure */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-2xl border-red-500/20 mb-24"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-display font-bold mb-4 text-red-400">What Happens If You Do Nothing?</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>Your market share erodes as AI-native competitors outpace you in content velocity and personalization.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>Top talent leaves for companies with modern tech stacks, tired of manual processes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>In 2 years, you are playing catch-up while others are already on AI v3.0.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>CAC continues to rise while LTV stagnates—the math stops working.</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 text-center">
              <div className="text-8xl font-bold text-red-500/20 font-display">67%</div>
              <p className="text-gray-400 mt-2">of B2B buyers say they prefer to research independently before talking to sales. If your content isn't there, you don't exist.</p>
            </div>
          </div>
        </motion.div>

        {/* The Guide (Cloud Miami) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8">
            <CheckCircle size={16} />
            The Solution
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            You Do not Have to Figure This Out Alone. <br />
            <span className="text-primary">We Have Built the Playbook.</span>
          </h2>
          
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Cloud Miami has helped B2B companies deploy AI systems that generate leads, create content, and close deals—all on autopilot. We understand the overwhelm because we have been there. Now we guide others through the same transformation.
          </p>
        </motion.div>

        {/* The Plan */}
        <div className="grid md:grid-cols-3 gap-8">
          <PlanStep 
            number="01"
            title="Discovery Call"
            desc="We audit your current systems, identify bottlenecks, and map out where AI can create the biggest impact in 30 days or less."
          />
          <PlanStep 
            number="02"
            title="Custom Buildout"
            desc="Our team deploys your AI infrastructure—web architecture, content engines, and video systems—tailored to your specific industry."
          />
          <PlanStep 
            number="03"
            title="Launch & Scale"
            desc="Go live with 24/7 autonomous systems. We train your team and provide ongoing optimization to ensure continuous growth."
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-void font-bold rounded-full hover:bg-white transition-all text-lg group"
          >
            Talk With Our AI
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-gray-500 text-sm mt-4">No commitment. Just clarity.</p>
        </motion.div>
      </div>
    </section>
  );
}

function PainPoint({ icon: Icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-2xl border-red-500/10 hover:border-red-500/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PlanStep({ number, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-2xl border-primary/20 hover:border-primary/50 transition-colors relative overflow-hidden"
    >
      <span className="absolute -top-4 -right-4 text-8xl font-bold text-primary/5 font-display">{number}</span>
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-full bg-primary text-void flex items-center justify-center font-bold mb-6">
          {number}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}