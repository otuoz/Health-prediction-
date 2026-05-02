import { NextRequest, NextResponse } from 'next/server';
import { diabetesInputSchema } from '@/lib/validation';
import { predictDiabetes } from '@/lib/models/diabetes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parseResult = diabetesInputSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: parseResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Run prediction
    const result = predictDiabetes(parseResult.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Diabetes prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
