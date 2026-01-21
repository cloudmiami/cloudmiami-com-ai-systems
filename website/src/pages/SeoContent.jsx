import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart, FileText, Globe, PenTool, Search, Network, Brain, Hash } from 'lucide-react';
import Contact from '../components/Contact';

export default function SeoContent() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-void">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-accent font-bold tracking-wider uppercase text-sm mb-6">
              <PenTool size={16} />
              <span>Generative Engine Optimization (GEO)</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
              Rank in Search <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">& AI Models</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              The search landscape is shifting from "10 blue links" to direct AI answers. We build "Knowledge Graph" optimized content that signals authority to both Google's algorithms and Large Language Models (LLMs) like ChatGPT and Claude.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-void/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <h2 className="text-3xl font-display font-bold">The Knowledge Graph Strategy</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Feature 
                  icon={Network} 
                  title="Entity Salience" 
                  desc="We structure content around entities (people, places, concepts) rather than just keywords, making it easier for AI to parse your expertise." 
                />
                <Feature 
                  icon={Brain} 
                  title="Topical Authority" 
                  desc="We deploy 'Topic Clusters'—a pillar page supported by dozens of detailed sub-articles—to dominate an entire niche." 
                />
                <Feature 
                  icon={Hash} 
                  title="Schema Markup" 
                  desc="Advanced JSON-LD implementation (FAQ, How-To, Article) that explicitly tells search engines what your data means." 
                />
                <Feature 
                  icon={BarChart} 
                  title="Data-Driven Updates" 
                  desc="Our agents monitor SERP volatility and automatically refresh content to maintain relevance." 
                />
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border-accent/20 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-6 text-center">GEO Impact</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Traditional SEO Visibility</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-gray-500"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-primary font-bold">Cloud Miami GEO Visibility</span>
                      <span className="text-primary font-bold">92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-primary to-accent"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">*Includes visibility in AI Chat Search (Perplexity, Bing Chat, Gemini)</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Pipeline */}
      <section className="py-20">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl font-display font-bold mb-12 text-center">Autonomous Content Pipeline</h2>
           <div className="relative">
             {/* Connection Line */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2"></div>
             
             <div className="grid md:grid-cols-4 gap-6 relative z-10">
               <PipelineStep step="1" title="Ingestion" desc="AI scans your internal docs, transcripts, and brand guidelines to learn your voice." />
               <PipelineStep step="2" title="Ideation" desc="Agents analyze competitors and generate high-value topic clusters." />
               <PipelineStep step="3" title="Drafting" desc="LLMs write comprehensive drafts with proper formatting and citations." />
               <PipelineStep step="4" title="Validation" desc="Human editors review for nuance, fact-check, and final polish." />
             </div>
           </div>
         </div>
      </section>

      <Contact />
    </>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all group">
      <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PipelineStep({ step, title, desc }) {
  return (
    <div className="glass-card p-6 rounded-xl text-center bg-void border border-accent/20">
      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-4 font-bold shadow-lg shadow-accent/20">
        {step}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
