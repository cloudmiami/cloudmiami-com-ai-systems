import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isHome) {
      window.location.href = `/${id}`;
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  // StoryBrand-aligned navigation items
  const navItems = [
    { label: 'The Problem', target: '#story' },
    { label: 'How It Works', target: '#services' },
    { label: 'Results', target: '#benefits' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-void/80 backdrop-blur-md py-3 shadow-lg border-b border-white/5' : 'py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="relative z-50">
            <Logo size={scrolled ? "default" : "large"} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => scrollToSection(item.target)}
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('#contact')}
              className="px-5 py-2 rounded-full bg-primary text-void border-none hover:bg-white transition-all font-semibold text-sm cursor-pointer"
            >
              Start Conversation
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-void/95 backdrop-blur-xl z-40 flex items-center justify-center">
            <nav className="flex flex-col gap-8 text-center">
              {navItems.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => scrollToSection(item.target)}
                  className="text-2xl font-display font-bold text-white hover:text-primary bg-transparent border-none"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('#contact')}
                className="mt-4 px-8 py-3 rounded-full bg-primary text-void font-bold border-none"
              >
                Schedule a Call
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-void/50 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="small" />
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Cloud Miami AI Agency. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-500 hover:text-primary text-sm">Privacy</Link>
              <Link to="/" className="text-gray-500 hover:text-primary text-sm">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
