'use client';

import { motion } from 'framer-motion';
import { Activity, Brain, Heart, Shield } from 'lucide-react';

const floatingIcons = [
  { Icon: Heart, delay: 0, x: -80, y: -40 },
  { Icon: Activity, delay: 0.2, x: 80, y: -60 },
  { Icon: Brain, delay: 0.4, x: -100, y: 40 },
  { Icon: Shield, delay: 0.6, x: 100, y: 20 },
];

export function HealthHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      {/* Floating medical icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 text-primary/20"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0.3, 0],
              x: [0, x, x * 1.2, x * 1.5],
              y: [0, y, y * 1.2, y * 1.5],
            }}
            transition={{ 
              duration: 8, 
              delay, 
              repeat: Infinity,
              ease: 'easeOut'
            }}
          >
            <Icon className="size-8 md:size-12" />
          </motion.div>
        ))}
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Powered by Validated ML Models
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-balance">
              Predict Your Health Risk{' '}
              <span className="text-primary">Before It&apos;s Too Late</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-balance">
              Assess your risk for Type 2 Diabetes and Cardiovascular Disease using 
              peer-reviewed machine learning models. Get personalized insights and 
              actionable recommendations.
            </span>
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span>Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              <span>Validated Models</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <span>Instant Results</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
