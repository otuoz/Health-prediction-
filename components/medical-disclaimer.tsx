'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mx-auto max-w-2xl"
    >
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 shrink-0 text-warning" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Medical Disclaimer</p>
            <p className="text-sm text-muted-foreground">
              This tool is for educational purposes only and does not constitute medical advice. 
              Results are based on statistical models and should not replace professional medical 
              consultation. Always consult with a healthcare provider for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
