'use client';

import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { AssessmentForm } from '@/components/assessment-form';
import { Button } from '@/components/ui/button';
import type { FormStep } from '@/types/health';

const cvdSteps: FormStep[] = [
  {
    id: 'demographics',
    title: 'Demographics',
    description: 'Basic demographic information.',
    fields: [
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 30,
        max: 74,
        placeholder: '45',
        helpText: 'Framingham model validated for ages 30-74'
      },
      {
        name: 'sex',
        label: 'Biological Sex',
        type: 'select',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ],
        helpText: 'Risk calculations differ by biological sex'
      }
    ]
  },
  {
    id: 'bloodPressure',
    title: 'Blood Pressure',
    description: 'Your blood pressure information.',
    fields: [
      {
        name: 'systolicBP',
        label: 'Systolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 90,
        max: 200,
        placeholder: '120',
        helpText: 'The top number in a blood pressure reading. Normal is below 120.'
      },
      {
        name: 'onHypertensionMeds',
        label: 'Currently taking blood pressure medication?',
        type: 'boolean',
        helpText: 'Treatment status affects risk calculation'
      }
    ]
  },
  {
    id: 'cholesterol',
    title: 'Cholesterol Levels',
    description: 'Enter your cholesterol measurements.',
    fields: [
      {
        name: 'totalCholesterol',
        label: 'Total Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 130,
        max: 320,
        placeholder: '200',
        helpText: 'Desirable total cholesterol is below 200 mg/dL'
      },
      {
        name: 'hdlCholesterol',
        label: 'HDL (Good) Cholesterol',
        type: 'number',
        unit: 'mg/dL',
        min: 20,
        max: 100,
        placeholder: '50',
        helpText: 'Higher is better. Optimal HDL is 60+ mg/dL'
      }
    ]
  },
  {
    id: 'riskFactors',
    title: 'Additional Risk Factors',
    description: 'Other important risk factors.',
    fields: [
      {
        name: 'isSmoker',
        label: 'Current smoker?',
        type: 'boolean',
        helpText: 'Smoking significantly increases cardiovascular risk'
      },
      {
        name: 'isDiabetic',
        label: 'Have you been diagnosed with diabetes?',
        type: 'boolean',
        helpText: 'Diabetes is a major cardiovascular risk factor'
      }
    ]
  }
];

export default function CardiovascularAssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-destructive/5 via-background to-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-destructive/20 p-3">
              <Heart className="size-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cardiovascular Disease Risk Assessment</h1>
              <p className="text-muted-foreground">10-Year Risk using Framingham Heart Study formula</p>
            </div>
          </div>
        </div>

        <AssessmentForm
          title="Cardiovascular Assessment"
          description="Provide your health information for a 10-year CVD risk estimate."
          steps={cvdSteps}
          apiEndpoint="/api/predict/cvd"
          disease="cardiovascular"
        />

        {/* Info Panel */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="mb-2 font-semibold text-foreground">About This Model</h3>
            <p className="text-sm text-muted-foreground">
              This assessment uses the Framingham Heart Study risk equations, endorsed by the 
              American Heart Association (AHA) and American College of Cardiology (ACC). It 
              estimates your 10-year risk of developing cardiovascular disease including heart 
              attack and stroke.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
