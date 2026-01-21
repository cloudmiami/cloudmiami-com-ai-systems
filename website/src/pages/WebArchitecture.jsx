import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Database, Layout, Smartphone, Zap, Server, Shield, Code, Cpu } from 'lucide-react';
import Contact from '../components/Contact';

export default function WebArchitecture() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-void">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm mb-6">
              <Layout size={16} />
              <span>AI Web Architecture</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
              Websites That <br />
              <span className="text-gradient">Think & Adapt</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              We move beyond static HTML to create intelligent digital experiences. Our architectures leverage edge computing and real-time AI inference to personalize every visitor interaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table (Great for LLM comparison queries) */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-12 text-center">Evolution of Web Standards</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-gray-400 font-medium">Feature</th>
                    <th className="p-4 text-gray-400 font-medium">Legacy Web (Web 2.0)</th>
                    <th className="p-4 text-primary font-bold bg-primary/5 rounded-t-lg">Cloud Miami AI-Native</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 font-semibold">Personalization</td>
                    <td className="p-4 text-gray-400">Manual A/B Testing</td>
                    <td className="p-4 bg-primary/5">Real-time AI Inference</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Search Optimization</td>
                    <td className="p-4 text-gray-400">Keyword Stuffing</td>
                    <td className="p-4 bg-primary/5">Entity Knowledge Graphs (GEO)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Interaction</td>
                    <td className="p-4 text-gray-400">Static Forms</td>
                    <td className="p-4 bg-primary/5">LLM-Powered Conversational Agents</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Infrastructure</td>
                    <td className="p-4 text-gray-400">Monolithic Servers</td>
                    <td className="p-4 bg-primary/5">Serverless Edge Networks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Deep Dive */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold">The Modern AI Stack</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                We don't just use WordPress. We engineer high-performance applications using the same technology stack as top Silicon Valley tech companies. This ensures your digital presence is future-proof, secure, and infinitely scalable.
              </p>
              
              <div className="grid gap-6">
                <TechSpec 
                  icon={Zap} 
                  title="Next.js & React" 
                  desc="Server-side rendering for instant SEO indexing and zero-layout-shift performance." 
                />
                <TechSpec 
                  icon={Server} 
                  title="Vercel Edge Functions" 
                  desc="Logic that runs closer to the user, reducing latency to <50ms globally." 
                />
                <TechSpec 
                  icon={Database} 
                  title="Vector Databases" 
                  desc="We implement Pinecone or Milvus to give your site 'memory', allowing it to recall user preferences." 
                />
                 <TechSpec 
                  icon={Shield} 
                  title="Enterprise Security" 
                  desc="Automated dependency updates and SOC2 compliant infrastructure providers." 
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-[100px]"></div>
              <div className="relative glass-card p-8 rounded-2xl border border-white/10">
                 <pre className="text-xs sm:text-sm text-gray-300 font-mono overflow-x-auto">
{`// AI-Native Edge Middleware
import { next } from '@vercel/edge';

export default async function middleware(req) {
  const userContext = await analyzeUser(req);
  
  // Real-time personalization
  if (userContext.segment === 'enterprise') {
    return rewrite('/enterprise-landing');
  }
  
  return next();
}`}
                 </pre>
                 <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                     <span>System Operational</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Cpu size={14} />
                     <span>Edge Inference Active</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Process */}
      <section className="py-20 bg-void/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold mb-16 text-center">Development Lifecycle</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessStep number="01" title="Data Audit" desc="We analyze your user data to train the personalization models." />
            <ProcessStep number="02" title="Atomic Design" desc="Building a modular component library for consistent UI/UX." />
            <ProcessStep number="03" title="AI Integration" desc="Connecting LLM APIs and setting up vector retrieval pipelines." />
            <ProcessStep number="04" title="Edge Deployment" desc="Global rollout on CDN with automated CI/CD testing." />
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}

function TechSpec({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-primary/30 transition-colors">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-void text-primary flex items-center justify-center border border-white/10">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ProcessStep({ number, title, desc }) {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform">
      <span className="text-6xl font-bold text-white/5 absolute -top-2 -right-2">{number}</span>
      <h3 className="text-xl font-bold mb-3 relative z-10">{title}</h3>
      <p className="text-gray-400 text-sm relative z-10">{desc}</p>
    </div>
  );
}
