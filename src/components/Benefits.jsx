import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const transformations = [
  {
    before: "Invisible in AI search results",
    after: "Cited as the authority in your niche by ChatGPT, Perplexity, and Google AI",
    metric: "92%",
    metricLabel: "GEO Visibility"
  },
  {
    before: "Team drowning in repetitive tasks",
    after: "40+ hours/week freed up for strategic work",
    metric: "80%",
    metricLabel: "Task Reduction"
  },
  {
    before: "Losing leads after business hours",
    after: "AI agents qualifying prospects 24/7/365",
    metric: "24/7",
    metricLabel: "Lead Capture"
  },
  {
    before: "Content bottleneck limiting growth",
    after: "Autonomous pipelines publishing daily",
    metric: "10x",
    metricLabel: "Content Velocity"
  },
  {
    before: "Generic website for all visitors",
    after: "Real-time personalization for every segment",
    metric: "3x",
    metricLabel: "Conversion Rate"
  },
  {
    before: "Playing catch-up with competitors",
    after: "Leading your market with AI-native infrastructure",
    metric: "#1",
    metricLabel: "Market Position"
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-32 bg-void relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Imagine Your Business <span className="text-primary">Transformed</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            This is what success looks like when you stop fighting against the future and start harnessing it.
          </p>
        </div>

        {/* Transformation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {transformations.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:border-primary/30 transition-all group"
            >
              {/* Before State */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-white/10">
                <span className="text-red-400 font-bold text-xs mt-1">BEFORE</span>
                <p className="text-gray-500 text-sm line-through">{t.before}</p>
              </div>
              
              {/* After State */}
              <div className="flex items-start gap-3 mb-6">
                <span className="text-primary font-bold text-xs mt-1">AFTER</span>
                <p className="text-white text-sm font-medium">{t.after}</p>
              </div>

              {/* Metric */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary font-display">{t.metric}</span>
                <span className="text-gray-400 text-sm">{t.metricLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-2xl border-primary/20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">
            In 6 Months, You Could Be the Company Others Are Trying to Catch
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            The question isn't whether AI will transform your industry—it's whether you'll be the one leading that transformation or scrambling to keep up.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-void font-bold rounded-full hover:bg-white transition-all group"
          >
            Claim Your Advantage Now
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
