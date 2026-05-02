'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Droplet, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiseaseCardProps {
  disease: 'diabetes' | 'cardiovascular';
  index: number;
}

const diseaseData = {
  diabetes: {
    title: 'Type 2 Diabetes',
    description: 'Assess your risk using the validated Pima Indians dataset model. Factors include glucose levels, BMI, age, and family history.',
    icon: Droplet,
    href: '/predict/diabetes',
    features: ['8 health metrics', 'Logistic regression model', 'Pima Indians dataset'],
    gradient: 'from-chart-2/20 to-chart-2/5',
    iconBg: 'bg-chart-2/20',
    iconColor: 'text-chart-2',
  },
  cardiovascular: {
    title: 'Cardiovascular Disease',
    description: '10-year CVD risk assessment using the Framingham Heart Study formula, endorsed by AHA/ACC guidelines.',
    icon: Heart,
    href: '/predict/cardiovascular',
    features: ['AHA/ACC endorsed', 'Framingham formula', '10-year risk projection'],
    gradient: 'from-destructive/20 to-destructive/5',
    iconBg: 'bg-destructive/20',
    iconColor: 'text-destructive',
  },
};

export function DiseaseCard({ disease, index }: DiseaseCardProps) {
  const data = diseaseData[disease];
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={data.href} className="block h-full">
        <Card className={`relative h-full overflow-hidden bg-gradient-to-br ${data.gradient} transition-shadow duration-300 hover:shadow-lg`}>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className={`absolute -inset-px rounded-xl bg-gradient-to-br ${data.gradient} blur-xl`} />
          </div>
          
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <motion.div 
                className={`rounded-xl ${data.iconBg} p-3`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Icon className={`size-6 ${data.iconColor}`} />
              </motion.div>
              <motion.div
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                initial={false}
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <ArrowRight className="size-5" />
              </motion.div>
            </div>
            <CardTitle className="mt-4 text-xl">{data.title}</CardTitle>
            <CardDescription className="text-base">{data.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>
            
            <Button 
              className="mt-6 w-full group-hover:bg-primary group-hover:text-primary-foreground"
              variant="outline"
            >
              Start Assessment
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
