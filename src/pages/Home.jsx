import React from 'react';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import Services from '../components/Services';
import Benefits from '../components/Benefits';
import About from '../components/About';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      {/* 1. Hero - Position customer as hero with clear desire */}
      <Hero />
      
      {/* 2. Problem + Guide + Plan - The StoryBrand narrative */}
      <section id="story">
        <StorySection />
      </section>
      
      {/* 3. Services - The "Plan" in detail */}
      <Services />
      
      {/* 4. Benefits - Success vs Failure transformation */}
      <Benefits />
      
      {/* 5. About - Establish authority as guide */}
      <About />
      
      {/* 6. FAQ - Overcome objections */}
      <FAQ />
      
      {/* 7. Contact - Clear call to action */}
      <Contact />
    </>
  );
}
