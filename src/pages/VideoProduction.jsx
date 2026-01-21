import React from 'react';
import { motion } from 'framer-motion';
import { Play, Mic, Users, Video, Layers, Wand2, MonitorPlay } from 'lucide-react';
import Contact from '../components/Contact';

export default function VideoProduction() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-void">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 text-pink-500 font-bold tracking-wider uppercase text-sm mb-6">
              <Video size={16} />
              <span>AI Video Production</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
              Broadcast Quality. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Software Speed.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Create hyper-realistic AI avatars, personalized sales outreach, and motion graphics that scale infinitely—without cameras or crews. We turn video production into an API call.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users}
              title="Digital Twins"
              desc="We create a pixel-perfect digital clone of your CEO or sales reps. Once trained, this avatar can speak 40+ languages fluently."
            />
            <FeatureCard 
              icon={Mic}
              title="Voice Cloning"
              desc="Indistinguishable text-to-speech engines (ElevenLabs Enterprise) allow you to correct scripts or generate new content in seconds."
            />
            <FeatureCard 
              icon={MonitorPlay}
              title="Programmatic Video"
              desc="Connect your CRM to our rendering engine. Send 10,000 unique video emails where the avatar speaks the prospect's name and company."
            />
          </div>
        </div>
      </section>

      {/* Technical Process - Training */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <h2 className="text-3xl font-display font-bold mb-6">How It Works: <span className="text-pink-500">The Cloning Process</span></h2>
               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="mt-1 w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm">01</div>
                   <div>
                     <h3 className="font-bold text-lg">Capture</h3>
                     <p className="text-gray-400">We require just 2 minutes of high-quality footage of your subject speaking to train the visual model.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="mt-1 w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm">02</div>
                   <div>
                     <h3 className="font-bold text-lg">Fine-Tuning</h3>
                     <p className="text-gray-400">Our engineers adjust lip-sync latency, facial micro-expressions, and voice timbre to ensure realism.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="mt-1 w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm">03</div>
                   <div>
                     <h3 className="font-bold text-lg">Generation</h3>
                     <p className="text-gray-400">Type script, render video. Outputs in 1080p/4K ready for social media, email, or VSLs.</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-500 font-mono text-sm">Rendering Frame 1402/2048...</p>
                    <div className="w-64 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                      <div className="h-full w-2/3 bg-pink-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay UI elements to look like a software interface */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-2 py-1 bg-black/50 backdrop-blur rounded text-xs font-mono text-green-400">LipSync: 99.8%</div>
                  <div className="px-2 py-1 bg-black/50 backdrop-blur rounded text-xs font-mono text-blue-400">Res: 4K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass-card p-8 rounded-2xl text-center hover:border-pink-500/30 transition-colors">
      <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
