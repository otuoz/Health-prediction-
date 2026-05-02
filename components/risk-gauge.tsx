'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  percentage: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'very-high';
  animate?: boolean;
}

const riskColors = {
  'low': { color: 'var(--color-chart-1)', label: 'Low Risk', bg: 'bg-chart-1/10' },
  'moderate': { color: 'var(--color-chart-2)', label: 'Moderate Risk', bg: 'bg-chart-2/10' },
  'high': { color: 'var(--color-chart-3)', label: 'High Risk', bg: 'bg-chart-3/10' },
  'very-high': { color: 'var(--color-destructive)', label: 'Very High Risk', bg: 'bg-destructive/10' },
};

export function RiskGauge({ percentage, riskCategory, animate = true }: RiskGaugeProps) {
  const [displayPercentage, setDisplayPercentage] = useState(animate ? 0 : percentage);
  const { color, label, bg } = riskColors[riskCategory];
  
  // Semicircle gauge calculations
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  useEffect(() => {
    if (!animate) return;
    
    const duration = 1500;
    const startTime = Date.now();
    
    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(Math.round(eased * percentage));
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [percentage, animate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="drop-shadow-sm"
        >
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          />
          
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * Math.PI;
            const x1 = 100 - Math.cos(angle) * 70;
            const y1 = 100 - Math.sin(angle) * 70;
            const x2 = 100 - Math.cos(angle) * 60;
            const y2 = 100 - Math.sin(angle) * 60;
            
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/30"
              />
            );
          })}
        </svg>
        
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center pt-6">
          <div className="text-center">
            <motion.span
              className="text-4xl font-bold font-mono"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {displayPercentage}%
            </motion.span>
          </div>
        </div>
      </div>
      
      {/* Risk label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`mt-2 rounded-full px-4 py-1.5 ${bg}`}
      >
        <span className="text-sm font-medium" style={{ color }}>
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}
