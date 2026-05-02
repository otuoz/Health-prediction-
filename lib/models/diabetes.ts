/**
 * Type 2 Diabetes Prediction Model
 * Based on Pima Indians Diabetes Dataset
 * Model: Logistic Regression with C=0.027
 * Source: UBC-MDS diabetes_predictor_py validated study
 */

import type { DiabetesInput, FeatureContribution, Recommendation, PredictionResult } from '@/types/health';
import { sigmoid, standardize, calculatePercentile, generatePredictionId, getRiskCategory, getFeatureStatus } from '../calculations';

// Logistic regression coefficients from validated study
const COEFFICIENTS = {
  glucose: 0.724,
  bmi: 0.389,
  pregnancies: 0.229,
  age: 0.194,
  diabetesPedigree: 0.161,
  bloodPressure: 0.048,
  skinThickness: -0.007,
  insulin: 0.002,
  intercept: -0.85
};

// Training set statistics for standardization
const FEATURE_STATS = {
  glucose: { mean: 120.89, std: 31.97 },
  bmi: { mean: 31.99, std: 7.88 },
  pregnancies: { mean: 3.85, std: 3.37 },
  age: { mean: 33.24, std: 11.76 },
  diabetesPedigree: { mean: 0.47, std: 0.33 },
  bloodPressure: { mean: 69.11, std: 19.36 },
  skinThickness: { mean: 20.54, std: 15.95 },
  insulin: { mean: 79.80, std: 115.24 }
};

// Feature display names and units
const FEATURE_INFO: Record<string, { displayName: string; unit: string; higherWorse: boolean }> = {
  glucose: { displayName: 'Blood Glucose', unit: 'mg/dL', higherWorse: true },
  bmi: { displayName: 'BMI', unit: 'kg/m²', higherWorse: true },
  pregnancies: { displayName: 'Pregnancies', unit: '', higherWorse: true },
  age: { displayName: 'Age', unit: 'years', higherWorse: true },
  diabetesPedigree: { displayName: 'Family History Score', unit: '', higherWorse: true },
  bloodPressure: { displayName: 'Blood Pressure', unit: 'mmHg', higherWorse: true },
  skinThickness: { displayName: 'Skin Thickness', unit: 'mm', higherWorse: false },
  insulin: { displayName: 'Insulin Level', unit: 'μU/ml', higherWorse: true }
};

/**
 * Run diabetes prediction inference
 */
export function predictDiabetes(input: DiabetesInput): PredictionResult {
  // Standardize all inputs
  const standardized = {
    glucose: standardize(input.glucose, FEATURE_STATS.glucose.mean, FEATURE_STATS.glucose.std),
    bmi: standardize(input.bmi, FEATURE_STATS.bmi.mean, FEATURE_STATS.bmi.std),
    pregnancies: standardize(input.pregnancies, FEATURE_STATS.pregnancies.mean, FEATURE_STATS.pregnancies.std),
    age: standardize(input.age, FEATURE_STATS.age.mean, FEATURE_STATS.age.std),
    diabetesPedigree: standardize(input.diabetesPedigree, FEATURE_STATS.diabetesPedigree.mean, FEATURE_STATS.diabetesPedigree.std),
    bloodPressure: standardize(input.bloodPressure, FEATURE_STATS.bloodPressure.mean, FEATURE_STATS.bloodPressure.std),
    skinThickness: standardize(input.skinThickness, FEATURE_STATS.skinThickness.mean, FEATURE_STATS.skinThickness.std),
    insulin: standardize(input.insulin, FEATURE_STATS.insulin.mean, FEATURE_STATS.insulin.std)
  };

  // Calculate logit
  const logit = COEFFICIENTS.intercept +
    COEFFICIENTS.glucose * standardized.glucose +
    COEFFICIENTS.bmi * standardized.bmi +
    COEFFICIENTS.pregnancies * standardized.pregnancies +
    COEFFICIENTS.age * standardized.age +
    COEFFICIENTS.diabetesPedigree * standardized.diabetesPedigree +
    COEFFICIENTS.bloodPressure * standardized.bloodPressure +
    COEFFICIENTS.skinThickness * standardized.skinThickness +
    COEFFICIENTS.insulin * standardized.insulin;

  // Calculate probability
  const probability = sigmoid(logit);
  const riskCategory = getRiskCategory(probability);

  // Calculate feature contributions
  const featureContributions: FeatureContribution[] = [
    { feature: 'glucose', value: input.glucose, contribution: COEFFICIENTS.glucose * standardized.glucose },
    { feature: 'bmi', value: input.bmi, contribution: COEFFICIENTS.bmi * standardized.bmi },
    { feature: 'pregnancies', value: input.pregnancies, contribution: COEFFICIENTS.pregnancies * standardized.pregnancies },
    { feature: 'age', value: input.age, contribution: COEFFICIENTS.age * standardized.age },
    { feature: 'diabetesPedigree', value: input.diabetesPedigree, contribution: COEFFICIENTS.diabetesPedigree * standardized.diabetesPedigree },
    { feature: 'bloodPressure', value: input.bloodPressure, contribution: COEFFICIENTS.bloodPressure * standardized.bloodPressure },
    { feature: 'skinThickness', value: input.skinThickness, contribution: COEFFICIENTS.skinThickness * standardized.skinThickness },
    { feature: 'insulin', value: input.insulin, contribution: COEFFICIENTS.insulin * standardized.insulin }
  ].map(fc => {
    const info = FEATURE_INFO[fc.feature];
    const stats = FEATURE_STATS[fc.feature as keyof typeof FEATURE_STATS];
    const percentile = calculatePercentile(fc.value, stats.mean, stats.std);
    return {
      ...fc,
      displayName: info.displayName,
      unit: info.unit,
      percentile,
      status: getFeatureStatus(percentile, info.higherWorse)
    };
  }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  // Generate recommendations
  const recommendations = generateDiabetesRecommendations(input, featureContributions, riskCategory);

  // Generate summary
  const summary = generateDiabetesSummary(probability, riskCategory, featureContributions);

  return {
    id: generatePredictionId(),
    timestamp: new Date().toISOString(),
    disease: 'diabetes',
    riskProbability: probability,
    riskPercentage: Math.round(probability * 100),
    riskCategory,
    featureContributions,
    recommendations,
    summary
  };
}

function generateDiabetesRecommendations(
  input: DiabetesInput,
  contributions: FeatureContribution[],
  risk: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Always add monitoring recommendation for elevated glucose
  if (input.glucose > 100) {
    recommendations.push({
      priority: input.glucose > 125 ? 'critical' : 'important',
      category: 'monitoring',
      title: 'Monitor Blood Glucose Regularly',
      description: `Your fasting glucose of ${input.glucose} mg/dL is ${input.glucose > 125 ? 'in the diabetic range' : 'elevated'}. Regular monitoring and consultation with a healthcare provider is recommended.`,
      icon: 'activity'
    });
  }

  // BMI recommendations
  if (input.bmi > 25) {
    recommendations.push({
      priority: input.bmi > 30 ? 'important' : 'suggested',
      category: 'lifestyle',
      title: 'Consider Weight Management',
      description: `A BMI of ${input.bmi.toFixed(1)} indicates ${input.bmi > 30 ? 'obesity' : 'overweight'}. Even modest weight loss (5-10%) can significantly reduce diabetes risk.`,
      icon: 'scale'
    });
  }

  // Age-related screening
  if (input.age >= 45 && risk !== 'low') {
    recommendations.push({
      priority: 'important',
      category: 'medical',
      title: 'Regular Diabetes Screening',
      description: 'Adults 45 and older with risk factors should get screened for diabetes every 1-3 years.',
      icon: 'calendar'
    });
  }

  // Lifestyle recommendations
  recommendations.push({
    priority: 'suggested',
    category: 'lifestyle',
    title: 'Increase Physical Activity',
    description: 'Aim for at least 150 minutes of moderate-intensity aerobic activity per week. Regular exercise improves insulin sensitivity.',
    icon: 'heart'
  });

  if (risk === 'high' || risk === 'very-high') {
    recommendations.push({
      priority: 'critical',
      category: 'medical',
      title: 'Consult Healthcare Provider',
      description: 'Your risk profile suggests you should discuss diabetes prevention strategies with a healthcare professional soon.',
      icon: 'stethoscope'
    });
  }

  return recommendations.slice(0, 5);
}

function generateDiabetesSummary(
  probability: number,
  risk: string,
  contributions: FeatureContribution[]
): string {
  const topFactors = contributions.slice(0, 2).map(c => c.displayName.toLowerCase());
  const riskText = {
    'low': 'low',
    'moderate': 'moderate',
    'high': 'elevated',
    'very-high': 'significantly elevated'
  }[risk];

  return `Based on your health metrics, your estimated Type 2 Diabetes risk is ${riskText} at ${Math.round(probability * 100)}%. The primary contributing factors are your ${topFactors.join(' and ')}. This assessment uses a validated logistic regression model trained on the Pima Indians Diabetes Dataset.`;
}
