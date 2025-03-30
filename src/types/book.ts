export interface Book {
  id: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  coverImage?: string;
  likes: number;
  reviews: Review[];
  description?: string; 
  publicationDate: Date; 
  pageCount: number; 
}

export interface Review {
  id: number;
  author: string;
  text: string;
  rating: number;
  date: Date; 
}

export interface GenerationParams {
  seed: string;
  language: string;
  averageLikes?: number;
  averageReviews?: number;
  offset?: number;
}