import { NextRequest, NextResponse } from 'next/server';
import { generateBooks } from '@/services/bookGenerator';
import { GenerationParams } from '@/types/book';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const seed = searchParams.get('seed') || 'default';
  const count = parseInt(searchParams.get('count') || '20', 10);
  const language = searchParams.get('language') || 'en';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const offset = page === 1 ? 0 : 20 + (page - 2) * 10;
  
  // Add averageLikes and averageReviews from query params
  const averageLikes = parseFloat(searchParams.get('averageLikes') || '5');
  const averageReviews = parseFloat(searchParams.get('averageReviews') || '2');
  
  // Create generation params with all parameters
  const params: GenerationParams = {
    seed,
    language,
    offset,
    averageLikes: isNaN(averageLikes) ? 5 : averageLikes,
    averageReviews: isNaN(averageReviews) ? 2 : averageReviews
  };
  
  // Generate books using the parameters
  const books = generateBooks(params, count);
  
  return NextResponse.json({ books });
}