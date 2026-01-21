import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

  const faqs = [
    {
      question: "We're not sure we're ready for AI. Is this too advanced for us?",
      answer: "That's exactly why we exist. Most B2B companies feel overwhelmed by AI because they overcomplicate it. We've simplified the process into a proven 3-step framework: Discovery, Buildout, and Launch. You don't need to understand the technology—you just need to understand your goals. We handle the technical complexity so you can focus on strategy."
    },
    {
      question: "How is this different from hiring a traditional marketing agency?",
      answer: "Traditional agencies charge monthly retainers for human labor—content writers, designers, SEO specialists. We install AI systems that generate content, qualify leads, and create personalized experiences autonomously. You're not paying for hours; you're investing in an asset that compounds over time. Companies that embrace AI don't have fewer employees—they have more productive, engaged ones."
    },
    {
      question: "What if AI replaces our team?",
      answer: "AI doesn't replace your team—it elevates them. Think of it as adding a team of experts that work 24/7 without burnout. While competitors are stuck with manual processes, your team will be doing strategic work that AI can't. The question is: will you be leveraging AI or competing against it?"
    },
    {
      question: "How long until we see results?",
      answer: "Most clients see initial results within 30 days of deployment. Content engines start ranking within 60-90 days. We structure engagements around clear milestones and deliverables. You'll see progress updates and ROI tracking from day one."
    }
  ];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section id="faq" className="py-32 bg-void relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Questions You Might Be Asking</h2>
          <p className="text-gray-400">Honest answers to help you decide if we're the right guide for your journey.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-lg text-white pr-4">{faq.question}</span>
                {openIndex === i ? <Minus className="text-primary shrink-0" /> : <Plus className="text-gray-400 shrink-0" />}
              </button>
              
              {openIndex === i && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-6 pb-6 text-gray-400 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
