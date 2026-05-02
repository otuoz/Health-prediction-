/**
 * Shared math utilities for ML inference
 */

/**
 * Sigmoid function for logistic regression
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Standardize a value using z-score normalization
 */
export function standardize(value: number, mean: number, std: number): number {
  return (value - mean) / std;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate percentile ranking (simplified)
 * Returns 0-100 indicating where the value falls
 */
export function calculatePercentile(
  value: number,
  mean: number,
  std: number
): number {
  // Using normal distribution approximation
  const z = (value - mean) / std;
  // Simplified percentile using error function approximation
  const p = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Math.round(p * 100);
}

/**
 * Error function approximation (for percentile calculation)
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Generate a unique ID for predictions
 */
export function generatePredictionId(): string {
  return `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Determine risk category from probability
 */
export function getRiskCategory(probability: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (probability < 0.2) return 'low';
  if (probability < 0.4) return 'moderate';
  if (probability < 0.6) return 'high';
  return 'very-high';
}

/**
 * Get status for a feature based on its percentile
 */
export function getFeatureStatus(
  percentile: number,
  isHigherWorse: boolean = true
): 'good' | 'warning' | 'concern' {
  if (isHigherWorse) {
    if (percentile < 50) return 'good';
    if (percentile < 75) return 'warning';
    return 'concern';
  } else {
    if (percentile > 50) return 'good';
    if (percentile > 25) return 'warning';
    return 'concern';
  }
}
