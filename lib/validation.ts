import { z } from 'zod';

/**
 * Diabetes input validation schema
 * Based on Pima Indians dataset ranges
 */
export const diabetesInputSchema = z.object({
  glucose: z.number()
    .min(44, 'Glucose must be at least 44 mg/dL')
    .max(199, 'Glucose must be at most 199 mg/dL'),
  bmi: z.number()
    .min(18.2, 'BMI must be at least 18.2')
    .max(67.1, 'BMI must be at most 67.1'),
  pregnancies: z.number()
    .int('Pregnancies must be a whole number')
    .min(0, 'Pregnancies cannot be negative')
    .max(17, 'Pregnancies must be at most 17'),
  age: z.number()
    .int('Age must be a whole number')
    .min(21, 'Age must be at least 21')
    .max(81, 'Age must be at most 81'),
  diabetesPedigree: z.number()
    .min(0.078, 'Diabetes pedigree must be at least 0.078')
    .max(2.42, 'Diabetes pedigree must be at most 2.42'),
  bloodPressure: z.number()
    .min(24, 'Blood pressure must be at least 24 mmHg')
    .max(122, 'Blood pressure must be at most 122 mmHg'),
  skinThickness: z.number()
    .min(7, 'Skin thickness must be at least 7 mm')
    .max(99, 'Skin thickness must be at most 99 mm'),
  insulin: z.number()
    .min(14, 'Insulin must be at least 14 μU/ml')
    .max(846, 'Insulin must be at most 846 μU/ml')
});

/**
 * CVD input validation schema
 * Based on Framingham Heart Study ranges
 */
export const cvdInputSchema = z.object({
  age: z.number()
    .int('Age must be a whole number')
    .min(30, 'Age must be at least 30 for CVD risk assessment')
    .max(74, 'Age must be at most 74 for accurate CVD risk assessment'),
  systolicBP: z.number()
    .min(90, 'Systolic BP must be at least 90 mmHg')
    .max(200, 'Systolic BP must be at most 200 mmHg'),
  totalCholesterol: z.number()
    .min(130, 'Total cholesterol must be at least 130 mg/dL')
    .max(320, 'Total cholesterol must be at most 320 mg/dL'),
  hdlCholesterol: z.number()
    .min(20, 'HDL cholesterol must be at least 20 mg/dL')
    .max(100, 'HDL cholesterol must be at most 100 mg/dL'),
  sex: z.enum(['male', 'female']),
  isSmoker: z.boolean(),
  isDiabetic: z.boolean(),
  onHypertensionMeds: z.boolean()
});

export type DiabetesInputSchema = z.infer<typeof diabetesInputSchema>;
export type CVDInputSchema = z.infer<typeof cvdInputSchema>;
