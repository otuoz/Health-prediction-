'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormStep } from '@/types/health';

interface AssessmentFormProps {
  title: string;
  description: string;
  steps: FormStep[];
  apiEndpoint: string;
  disease: 'diabetes' | 'cardiovascular';
}

export function AssessmentForm({ title, description, steps, apiEndpoint, disease }: AssessmentFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, number | string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const updateField = (name: string, value: number | string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    
    for (const field of step.fields) {
      const value = formData[field.name];
      
      if (value === undefined || value === '') {
        stepErrors[field.name] = `${field.label} is required`;
        continue;
      }

      if (field.type === 'number') {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        if (isNaN(numValue)) {
          stepErrors[field.name] = `${field.label} must be a number`;
        } else if (field.min !== undefined && numValue < field.min) {
          stepErrors[field.name] = `${field.label} must be at least ${field.min}`;
        } else if (field.max !== undefined && numValue > field.max) {
          stepErrors[field.name] = `${field.label} must be at most ${field.max}`;
        }
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Convert string numbers to actual numbers
      const processedData: Record<string, number | string | boolean> = {};
      for (const s of steps) {
        for (const field of s.fields) {
          const value = formData[field.name];
          if (field.type === 'number' && typeof value === 'string') {
            processedData[field.name] = parseFloat(value);
          } else {
            processedData[field.name] = value;
          }
        }
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      
      // Store result in sessionStorage and navigate
      sessionStorage.setItem(`prediction_${result.id}`, JSON.stringify(result));
      router.push(`/results/${result.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to process your assessment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              <div className="space-y-6">
                {step.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="flex items-center gap-2">
                      {field.label}
                      {field.unit && (
                        <span className="text-xs text-muted-foreground">({field.unit})</span>
                      )}
                    </Label>
                    
                    {field.type === 'number' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[Number(formData[field.name]) || field.min || 0]}
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            onValueChange={([value]) => updateField(field.name, value)}
                            className="flex-1"
                          />
                          <Input
                            id={field.name}
                            type="number"
                            value={formData[field.name] ?? ''}
                            onChange={(e) => updateField(field.name, e.target.value)}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            className="w-24 text-center font-mono"
                            placeholder={field.placeholder}
                          />
                        </div>
                        {field.helpText && (
                          <p className="text-xs text-muted-foreground">{field.helpText}</p>
                        )}
                        {field.min !== undefined && field.max !== undefined && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{field.min}</span>
                            <span>{field.max}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {field.type === 'select' && field.options && (
                      <Select
                        value={formData[field.name] as string}
                        onValueChange={(value) => updateField(field.name, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={field.placeholder || 'Select an option'} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === 'boolean' && (
                      <div className="flex items-center gap-3">
                        <Switch
                          id={field.name}
                          checked={formData[field.name] as boolean ?? false}
                          onCheckedChange={(checked) => updateField(field.name, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {formData[field.name] ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}

                    {errors[field.name] && (
                      <p className="text-sm text-destructive">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              {errors.submit && (
                <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {errors.submit}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing...
                </>
              ) : isLastStep ? (
                'Get Results'
              ) : (
                <>
                  Next
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
