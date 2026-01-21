import React from 'react';

export default function Logo({ className = "", size = "default", showText = true }) {
  const sizes = {
    small: { icon: 36, text: "text-lg", tagline: "text-[8px]" },
    default: { icon: 44, text: "text-xl", tagline: "text-[9px]" },
    large: { icon: 56, text: "text-2xl", tagline: "text-[10px]" },
  };
  
  const { icon, text, tagline } = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon - Cloud shape with Miami sunset gradient + AI neural dots */}
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Miami Sunset Gradient - Cyan to Pink to Orange */}
          <linearGradient id="miamiGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f3ff" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Inner gradient for AI core */}
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#00f3ff" />
          </radialGradient>
        </defs>
        
        {/* Cloud Shape - Stylized with Miami curves */}
        <path 
          d="M52 36c0-2.2-1.8-4-4-4h-1c0-7.7-6.3-14-14-14-6.3 0-11.6 4.2-13.3 10-0.6-0.1-1.1-0.1-1.7 0-4.4 0-8 3.6-8 8s3.6 8 8 8h30c2.2 0 4-1.8 4-4z"
          fill="url(#miamiGradient)"
          opacity="0.9"
          filter="url(#glow)"
        />
        
        {/* AI Neural Network inside cloud */}
        {/* Central brain/processing node */}
        <circle cx="33" cy="32" r="4" fill="url(#coreGradient)" />
        
        {/* Surrounding neural nodes */}
        <circle cx="22" cy="28" r="2" fill="white" opacity="0.9" />
        <circle cx="44" cy="28" r="2" fill="white" opacity="0.9" />
        <circle cx="28" cy="38" r="2" fill="white" opacity="0.9" />
        <circle cx="40" cy="38" r="2" fill="white" opacity="0.9" />
        <circle cx="33" cy="22" r="1.5" fill="white" opacity="0.7" />
        
        {/* Neural connections */}
        <line x1="22" y1="28" x2="29" y2="30" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="44" y1="28" x2="37" y2="30" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="28" y1="38" x2="30" y2="35" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="38" x2="36" y2="35" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="33" y1="22" x2="33" y2="28" stroke="white" strokeWidth="1" opacity="0.6" />
        
        {/* Data flow particles */}
        <circle cx="26" cy="29" r="1" fill="white" opacity="0.5" />
        <circle cx="40" cy="29" r="1" fill="white" opacity="0.5" />
        <circle cx="33" cy="25" r="1" fill="white" opacity="0.5" />
      </svg>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold ${text} bg-gradient-to-r from-cyan-400 via-pink-400 to-orange-400 bg-clip-text text-transparent`}>
            Cloud Miami
          </span>
          <span className={`${tagline} tracking-[0.3em] uppercase text-white/60 font-medium mt-1`}>
            AI Systems
          </span>
        </div>
      )}
    </div>
  );
}
