'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  CigaretteOff, 
  Droplet, 
  Heart, 
  HeartPulse, 
  Scale, 
  Stethoscope,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Recommendation } from '@/types/health';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'activity': Activity,
  'calendar': Calendar,
  'cigarette-off': CigaretteOff,
  'droplet': Droplet,
  'heart': Heart,
  'heart-pulse': HeartPulse,
  'scale': Scale,
  'stethoscope': Stethoscope,
};

const priorityStyles = {
  critical: {
    badge: 'bg-destructive/10 text-destructive',
    border: 'border-l-destructive',
    icon: 'text-destructive',
  },
  important: {
    badge: 'bg-warning/10 text-warning',
    border: 'border-l-warning',
    icon: 'text-warning',
  },
  suggested: {
    badge: 'bg-primary/10 text-primary',
    border: 'border-l-primary',
    icon: 'text-primary',
  },
};

const categoryLabels = {
  lifestyle: 'Lifestyle',
  medical: 'Medical',
  monitoring: 'Monitoring',
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
          <CardDescription>
            Actions you can take to improve your health outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => {
            const IconComponent = iconMap[rec.icon] || AlertCircle;
            const styles = priorityStyles[rec.priority];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className={`rounded-lg border border-l-4 ${styles.border} bg-card p-4`}
              >
                <div className="flex gap-4">
                  <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
                    <IconComponent className="size-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                        {rec.priority === 'critical' ? 'Critical' : rec.priority === 'important' ? 'Important' : 'Suggested'}
                      </span>
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {categoryLabels[rec.category]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
