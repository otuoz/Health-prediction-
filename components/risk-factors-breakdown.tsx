'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FeatureContribution } from '@/types/health';

interface RiskFactorsBreakdownProps {
  contributions: FeatureContribution[];
}

const statusConfig = {
  good: {
    icon: CheckCircle2,
    color: 'text-chart-1',
    bg: 'bg-chart-1/10',
    label: 'Good',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-chart-2',
    bg: 'bg-chart-2/10',
    label: 'Warning',
  },
  concern: {
    icon: XCircle,
    color: 'text-chart-3',
    bg: 'bg-chart-3/10',
    label: 'Concern',
  },
};

export function RiskFactorsBreakdown({ contributions }: RiskFactorsBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Health Metrics</CardTitle>
          <CardDescription>
            Detailed breakdown of each factor and how it compares to population norms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {contributions.map((fc, index) => {
              const config = statusConfig[fc.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={fc.feature}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="rounded-lg border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{fc.displayName}</p>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        {typeof fc.value === 'number' 
                          ? fc.value % 1 === 0 
                            ? fc.value 
                            : fc.value.toFixed(1)
                          : fc.value}
                        {fc.unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{fc.unit}</span>}
                      </p>
                    </div>
                    <div className={`rounded-full p-1.5 ${config.bg}`}>
                      <StatusIcon className={`size-4 ${config.color}`} />
                    </div>
                  </div>
                  
                  {fc.percentile !== undefined && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Percentile</span>
                        <span className={config.color}>{fc.percentile}th</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <motion.div
                          className={`h-full rounded-full ${
                            fc.status === 'good' 
                              ? 'bg-chart-1' 
                              : fc.status === 'warning' 
                                ? 'bg-chart-2' 
                                : 'bg-chart-3'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${fc.percentile}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.05, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
