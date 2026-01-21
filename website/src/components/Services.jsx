import React from 'react';
import { Layers, PenTool, Video, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Layers,
    title: "AI Web Architecture",
    desc: "We build self-optimizing platforms that adapt to every visitor in real-time. Using Next.js, Vercel Edge Functions, and vector databases, your site becomes a living asset that learns, personalizes, and converts autonomously.",
    color: "text-blue-400",
    link: "/web-architecture",
    features: ["Real-time AI Inference", "Edge Performance <50ms", "Vector Database Memory", "Enterprise Security"]
  },
  {
    icon: PenTool,
    title: "Generative Engine Optimization",
    desc: "Dominate both traditional search and AI chat results. We deploy autonomous content pipelines that build topical authority through entity salience, knowledge graphs, and schema markup, ensuring your brand is the definitive source for LLMs.",
    color: "text-purple-400",
    link: "/seo-content",
    features: ["Entity Knowledge Graphs", "Topical Authority Clusters", "Automated Content Refresh", "Multi-Language Expansion"]
  },
  {
    icon: Video,
    title: "AI Video Production",
    desc: "Create hyper-realistic digital twins and personalized video outreach at scale. Our pipeline turns video production into an API call, generating broadcast-quality content with digital avatars that speak 40+ languages.",
    color: "text-pink-400",
    link: "/video-production",
    features: ["Digital Twin Avatars", "Voice Cloning", "Programmatic Personalization", "4K Rendering"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">The AI-Native Operating System</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Three interconnected engines designed to modernize your entire B2B infrastructure, from first touch to final conversion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <Link to={s.link} key={i} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-8 rounded-2xl group hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <s.icon className={"w-7 h-7 " + s.color} />
                  </div>
                  <ArrowUpRight className="text-gray-600 group-hover:text-primary transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 font-display">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{s.desc}</p>
                
                <div className="space-y-2 mb-6">
                  {s.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Explore Engine <ArrowUpRight size={14} />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
