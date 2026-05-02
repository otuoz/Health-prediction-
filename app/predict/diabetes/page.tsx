'use client';

import Link from 'next/link';
import { ArrowLeft, Droplet } from 'lucide-react';
import { AssessmentForm } from '@/components/assessment-form';
import { Button } from '@/components/ui/button';
import type { FormStep } from '@/types/health';

const diabetesSteps: FormStep[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Let\'s start with some basic health metrics.',
    fields: [
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        unit: 'years',
        min: 21,
        max: 81,
        placeholder: '35',
        helpText: 'Model validated for ages 21-81'
      },
      {
        name: 'pregnancies',
        label: 'Number of Pregnancies',
        type: 'number',
        min: 0,
        max: 17,
        step: 1,
        placeholder: '0',
        helpText: 'Total number of pregnancies (enter 0 if not applicable)'
      }
    ]
  },
  {
    id: 'glucose',
    title: 'Blood Glucose',
    description: 'Enter your fasting blood glucose level.',
    fields: [
      {
        name: 'glucose',
        label: 'Fasting Glucose Level',
        type: 'number',
        unit: 'mg/dL',
        min: 44,
        max: 199,
        placeholder: '100',
        helpText: 'Normal fasting glucose is typically 70-100 mg/dL'
      },
      {
        name: 'insulin',
        label: '2-Hour Serum Insulin',
        type: 'number',
        unit: 'μU/ml',
        min: 14,
        max: 846,
        placeholder: '80',
        helpText: 'Insulin level 2 hours after glucose tolerance test'
      }
    ]
  },
  {
    id: 'physical',
    title: 'Physical Measurements',
    description: 'Enter your body measurements.',
    fields: [
      {
        name: 'bmi',
        label: 'Body Mass Index (BMI)',
        type: 'number',
        unit: 'kg/m²',
        min: 18.2,
        max: 67.1,
        step: 0.1,
        placeholder: '25.0',
        helpText: 'Normal BMI range is 18.5-24.9'
      },
      {
        name: 'skinThickness',
        label: 'Triceps Skin Fold Thickness',
        type: 'number',
        unit: 'mm',
        min: 7,
        max: 99,
        placeholder: '20',
        helpText: 'Measured at the back of the upper arm'
      }
    ]
  },
  {
    id: 'vitals',
    title: 'Vital Signs & Family History',
    description: 'Final measurements and family history score.',
    fields: [
      {
        name: 'bloodPressure',
        label: 'Diastolic Blood Pressure',
        type: 'number',
        unit: 'mmHg',
        min: 24,
        max: 122,
        placeholder: '70',
        helpText: 'Normal diastolic pressure is typically 60-80 mmHg'
      },
      {
        name: 'diabetesPedigree',
        label: 'Diabetes Pedigree Function',
        type: 'number',
        min: 0.078,
        max: 2.42,
        step: 0.001,
        placeholder: '0.5',
        helpText: 'Family history score (0.078-2.42). Higher values indicate stronger family history of diabetes.'
      }
    ]
  }
];

export default function DiabetesAssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-chart-2/5 via-background to-background py-8">
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
            <div className="rounded-xl bg-chart-2/20 p-3">
              <Droplet className="size-6 text-chart-2" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Type 2 Diabetes Risk Assessment</h1>
              <p className="text-muted-foreground">Based on the Pima Indians Diabetes Dataset</p>
            </div>
          </div>
        </div>

        <AssessmentForm
          title="Health Assessment"
          description="Please provide accurate information for the most reliable results."
          steps={diabetesSteps}
          apiEndpoint="/api/predict/diabetes"
          disease="diabetes"
        />

        {/* Info Panel */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="mb-2 font-semibold text-foreground">About This Model</h3>
            <p className="text-sm text-muted-foreground">
              This assessment uses a Logistic Regression model trained on the Pima Indians Diabetes 
              Dataset. The model analyzes 8 health metrics to estimate your Type 2 Diabetes risk. 
              Feature coefficients were validated by the UBC-MDS research study.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
