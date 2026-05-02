/**
 * Cardiovascular Disease 10-Year Risk Prediction
 * Based on Framingham Heart Study (AHA/ACC endorsed)
 * Source: https://pharmaverse.github.io/admiral/reference/compute_framingham.html
 */

import type { CVDInput, FeatureContribution, Recommendation, PredictionResult } from '@/types/health';
import { generatePredictionId, getRiskCategory, calculatePercentile, getFeatureStatus } from '../calculations';

// Framingham coefficients for women
const FEMALE_COEFFICIENTS = {
  logAge: 2.32888,
  logTotalChol: 1.20904,
  logHDLChol: -0.70833,
  logSysBPUntreated: 2.76157,
  logSysBPTreated: 2.82263,
  smoker: 0.52873,
  diabetic: 0.69154,
  averageRisk: 26.1931,
  riskPeriod: 0.95012
};

// Framingham coefficients for men
const MALE_COEFFICIENTS = {
  logAge: 3.06117,
  logTotalChol: 1.12370,
  logHDLChol: -0.93263,
  logSysBPUntreated: 1.93303,
  logSysBPTreated: 2.99881,
  smoker: 0.65451,
  diabetic: 0.57367,
  averageRisk: 23.9802,
  riskPeriod: 0.88936
};

// Population statistics for percentile calculations
const POPULATION_STATS = {
  age: { mean: 49, std: 12 },
  systolicBP: { mean: 120, std: 18 },
  totalCholesterol: { mean: 200, std: 40 },
  hdlCholesterol: { mean: 55, std: 15 }
};

// Feature display info
const FEATURE_INFO: Record<string, { displayName: string; unit: string; higherWorse: boolean }> = {
  age: { displayName: 'Age', unit: 'years', higherWorse: true },
  systolicBP: { displayName: 'Systolic Blood Pressure', unit: 'mmHg', higherWorse: true },
  totalCholesterol: { displayName: 'Total Cholesterol', unit: 'mg/dL', higherWorse: true },
  hdlCholesterol: { displayName: 'HDL Cholesterol', unit: 'mg/dL', higherWorse: false },
  isSmoker: { displayName: 'Smoking Status', unit: '', higherWorse: true },
  isDiabetic: { displayName: 'Diabetes Status', unit: '', higherWorse: true }
};

/**
 * Run Framingham CVD risk prediction
 */
export function predictCVD(input: CVDInput): PredictionResult {
  const coefficients = input.sex === 'female' ? FEMALE_COEFFICIENTS : MALE_COEFFICIENTS;

  // Calculate log-transformed values
  const logAge = Math.log(input.age);
  const logTotalChol = Math.log(input.totalCholesterol);
  const logHDLChol = Math.log(input.hdlCholesterol);
  const logSysBP = Math.log(input.systolicBP);

  // Select appropriate BP coefficient based on treatment status
  const sysBPCoeff = input.onHypertensionMeds 
    ? coefficients.logSysBPTreated 
    : coefficients.logSysBPUntreated;

  // Calculate risk factors sum
  const riskFactors = 
    coefficients.logAge * logAge +
    coefficients.logTotalChol * logTotalChol +
    coefficients.logHDLChol * logHDLChol +
    sysBPCoeff * logSysBP +
    (input.isSmoker ? coefficients.smoker : 0) +
    (input.isDiabetic ? coefficients.diabetic : 0) -
    coefficients.averageRisk;

  // Calculate 10-year risk
  const risk10Year = 1 - Math.pow(coefficients.riskPeriod, Math.exp(riskFactors));
  const probability = Math.max(0, Math.min(1, risk10Year));
  
  // CVD uses different thresholds per AHA guidelines
  const riskCategory = getCVDRiskCategory(probability);

  // Calculate individual feature contributions
  const baselineRisk = 1 - Math.pow(coefficients.riskPeriod, Math.exp(-coefficients.averageRisk));
  
  const featureContributions: FeatureContribution[] = [
    {
      feature: 'age',
      displayName: 'Age',
      value: input.age,
      unit: 'years',
      contribution: coefficients.logAge * logAge,
      percentile: calculatePercentile(input.age, POPULATION_STATS.age.mean, POPULATION_STATS.age.std),
      status: getFeatureStatus(calculatePercentile(input.age, POPULATION_STATS.age.mean, POPULATION_STATS.age.std), true)
    },
    {
      feature: 'systolicBP',
      displayName: 'Systolic Blood Pressure',
      value: input.systolicBP,
      unit: 'mmHg',
      contribution: sysBPCoeff * logSysBP,
      percentile: calculatePercentile(input.systolicBP, POPULATION_STATS.systolicBP.mean, POPULATION_STATS.systolicBP.std),
      status: getFeatureStatus(calculatePercentile(input.systolicBP, POPULATION_STATS.systolicBP.mean, POPULATION_STATS.systolicBP.std), true)
    },
    {
      feature: 'totalCholesterol',
      displayName: 'Total Cholesterol',
      value: input.totalCholesterol,
      unit: 'mg/dL',
      contribution: coefficients.logTotalChol * logTotalChol,
      percentile: calculatePercentile(input.totalCholesterol, POPULATION_STATS.totalCholesterol.mean, POPULATION_STATS.totalCholesterol.std),
      status: getFeatureStatus(calculatePercentile(input.totalCholesterol, POPULATION_STATS.totalCholesterol.mean, POPULATION_STATS.totalCholesterol.std), true)
    },
    {
      feature: 'hdlCholesterol',
      displayName: 'HDL (Good) Cholesterol',
      value: input.hdlCholesterol,
      unit: 'mg/dL',
      contribution: coefficients.logHDLChol * logHDLChol,
      percentile: calculatePercentile(input.hdlCholesterol, POPULATION_STATS.hdlCholesterol.mean, POPULATION_STATS.hdlCholesterol.std),
      status: getFeatureStatus(calculatePercentile(input.hdlCholesterol, POPULATION_STATS.hdlCholesterol.mean, POPULATION_STATS.hdlCholesterol.std), false)
    },
    {
      feature: 'isSmoker',
      displayName: 'Smoking',
      value: input.isSmoker ? 1 : 0,
      unit: '',
      contribution: input.isSmoker ? coefficients.smoker : 0,
      percentile: input.isSmoker ? 85 : 15,
      status: input.isSmoker ? 'concern' : 'good'
    },
    {
      feature: 'isDiabetic',
      displayName: 'Diabetes',
      value: input.isDiabetic ? 1 : 0,
      unit: '',
      contribution: input.isDiabetic ? coefficients.diabetic : 0,
      percentile: input.isDiabetic ? 90 : 10,
      status: input.isDiabetic ? 'concern' : 'good'
    }
  ].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  // Generate recommendations
  const recommendations = generateCVDRecommendations(input, featureContributions, riskCategory);

  // Generate summary
  const summary = generateCVDSummary(probability, riskCategory, input, featureContributions);

  return {
    id: generatePredictionId(),
    timestamp: new Date().toISOString(),
    disease: 'cardiovascular',
    riskProbability: probability,
    riskPercentage: Math.round(probability * 100),
    riskCategory,
    featureContributions,
    recommendations,
    summary
  };
}

// CVD uses AHA-specific risk thresholds
function getCVDRiskCategory(probability: number): 'low' | 'moderate' | 'high' | 'very-high' {
  const percent = probability * 100;
  if (percent < 5) return 'low';
  if (percent < 7.5) return 'moderate';
  if (percent < 20) return 'high';
  return 'very-high';
}

function generateCVDRecommendations(
  input: CVDInput,
  contributions: FeatureContribution[],
  risk: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Smoking cessation - highest priority if applicable
  if (input.isSmoker) {
    recommendations.push({
      priority: 'critical',
      category: 'lifestyle',
      title: 'Quit Smoking',
      description: 'Smoking cessation is the single most effective lifestyle change to reduce cardiovascular risk. Your risk can decrease significantly within 1-2 years of quitting.',
      icon: 'cigarette-off'
    });
  }

  // Blood pressure management
  if (input.systolicBP >= 130) {
    recommendations.push({
      priority: input.systolicBP >= 140 ? 'critical' : 'important',
      category: input.systolicBP >= 140 ? 'medical' : 'lifestyle',
      title: 'Manage Blood Pressure',
      description: `Your systolic BP of ${input.systolicBP} mmHg is ${input.systolicBP >= 140 ? 'high' : 'elevated'}. ${input.systolicBP >= 140 ? 'Discuss medication options with your doctor.' : 'Lifestyle changes like reducing sodium and increasing exercise can help.'}`,
      icon: 'heart-pulse'
    });
  }

  // Cholesterol management
  if (input.totalCholesterol >= 200 || input.hdlCholesterol < 40) {
    recommendations.push({
      priority: input.totalCholesterol >= 240 ? 'important' : 'suggested',
      category: 'lifestyle',
      title: 'Improve Cholesterol Levels',
      description: input.hdlCholesterol < 40 
        ? 'Your HDL (good) cholesterol is low. Exercise and healthy fats can help raise it.'
        : 'Consider dietary changes to reduce total cholesterol: more fiber, less saturated fat.',
      icon: 'droplet'
    });
  }

  // Diabetes management
  if (input.isDiabetic) {
    recommendations.push({
      priority: 'important',
      category: 'medical',
      title: 'Optimize Diabetes Control',
      description: 'Good blood sugar control is essential for cardiovascular health. Work with your healthcare team to maintain optimal HbA1c levels.',
      icon: 'activity'
    });
  }

  // General exercise recommendation
  recommendations.push({
    priority: 'suggested',
    category: 'lifestyle',
    title: 'Regular Cardiovascular Exercise',
    description: 'Aim for 150+ minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly. This strengthens your heart and improves circulation.',
    icon: 'heart'
  });

  // High risk consultation
  if (risk === 'high' || risk === 'very-high') {
    recommendations.push({
      priority: 'critical',
      category: 'medical',
      title: 'Cardiology Consultation',
      description: 'Your 10-year cardiovascular risk warrants discussion with a healthcare provider about preventive medications like statins or aspirin therapy.',
      icon: 'stethoscope'
    });
  }

  return recommendations.slice(0, 5);
}

function generateCVDSummary(
  probability: number,
  risk: string,
  input: CVDInput,
  contributions: FeatureContribution[]
): string {
  const riskPercent = Math.round(probability * 100);
  const topFactors = contributions
    .filter(c => Math.abs(c.contribution) > 0.5)
    .slice(0, 2)
    .map(c => c.displayName.toLowerCase());

  const riskText = {
    'low': 'low',
    'moderate': 'borderline',
    'high': 'intermediate',
    'very-high': 'high'
  }[risk];

  let factorText = '';
  if (topFactors.length > 0) {
    factorText = ` Key contributing factors include your ${topFactors.join(' and ')}.`;
  }

  return `Your estimated 10-year cardiovascular disease risk is ${riskPercent}%, which is considered ${riskText} risk per AHA/ACC guidelines.${factorText} This assessment uses the Framingham Heart Study risk equations, validated across diverse populations.`;
}
