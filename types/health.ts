// Disease types
export type DiseaseType = 'diabetes' | 'cardiovascular';

export type RiskCategory = 'low' | 'moderate' | 'high' | 'very-high';

// Diabetes input features (Pima Indians dataset)
export interface DiabetesInput {
  glucose: number;          // 44-199 mg/dL
  bmi: number;              // 18.2-67.1 kg/m²
  pregnancies: number;      // 0-17 count
  age: number;              // 21-81 years
  diabetesPedigree: number; // 0.078-2.42 score
  bloodPressure: number;    // 24-122 mmHg
  skinThickness: number;    // 7-99 mm
  insulin: number;          // 14-846 μU/ml
}

// CVD input features (Framingham Heart Study)
export interface CVDInput {
  age: number;              // 30-74 years
  systolicBP: number;       // 90-200 mmHg
  totalCholesterol: number; // 130-320 mg/dL
  hdlCholesterol: number;   // 20-100 mg/dL
  sex: 'male' | 'female';
  isSmoker: boolean;
  isDiabetic: boolean;
  onHypertensionMeds: boolean;
}

// Feature contribution for explainability
export interface FeatureContribution {
  feature: string;
  displayName: string;
  value: number;
  unit: string;
  contribution: number;     // Positive = increases risk
  percentile?: number;      // Where user falls in population (0-100)
  status: 'good' | 'warning' | 'concern';
}

// Recommendation
export interface Recommendation {
  priority: 'critical' | 'important' | 'suggested';
  category: 'lifestyle' | 'medical' | 'monitoring';
  title: string;
  description: string;
  icon: string;
}

// Full prediction result
export interface PredictionResult {
  id: string;
  timestamp: string;
  disease: DiseaseType;
  
  // Core prediction
  riskProbability: number;      // 0-1
  riskPercentage: number;       // 0-100
  riskCategory: RiskCategory;
  
  // Feature contributions (for explainability)
  featureContributions: FeatureContribution[];
  
  // Recommendations
  recommendations: Recommendation[];
  
  // Summary text
  summary: string;
}

// Form step definition
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'boolean';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
}
