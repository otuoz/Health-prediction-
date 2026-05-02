import { NextRequest, NextResponse } from 'next/server';
import { cvdInputSchema } from '@/lib/validation';
import { predictCVD } from '@/lib/models/framingham';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parseResult = cvdInputSchema.safeParse(body);
    
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
    const result = predictCVD(parseResult.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('CVD prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
