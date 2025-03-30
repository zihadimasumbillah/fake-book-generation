import React from 'react';
import { Book } from '@/types/book';
import Image from 'next/image';

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  const validateRating = (rating: number): number => {
    return isNaN(rating) ? 5 : Math.max(1, Math.min(5, Math.round(rating)));
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const width = 300;
  const height = 450;

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const titleHash = book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = titleHash % 360;
    target.src = `https://picsum.photos/seed/${book.id}-${titleHash}-${hue}/${width}/${height}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="relative w-[300px] h-[450px] flex-shrink-0">
        {/* Book cover container with fixed dimensions */}
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
          {book.coverImage ? (
            <>
              {/* The book cover image */}
              <Image 
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                onError={onImageError}
              />
              
              {/* Semi-transparent gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Book title and author positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold line-clamp-2">{book.title}</h3>
                <p className="text-sm opacity-90 line-clamp-1">
                  {book.authors.join(', ')}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center p-4 text-white">
              <h3 className="text-xl font-bold text-center mb-6">{book.title}</h3>
              <p className="text-sm opacity-80 text-center">{book.authors.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
        <p className="text-lg mb-4">by {book.authors.join(', ')}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="text-sm font-medium">ISBN:</div>
          <div className="text-sm">{book.isbn}</div>
          <div className="text-sm font-medium">Publisher:</div>
          <div className="text-sm">{book.publisher}</div>
          <div className="text-sm font-medium">Publication Date:</div>
          <div className="text-sm">{formatDate(book.publicationDate)}</div>
          {book.pageCount && (
            <>
              <div className="text-sm font-medium">Pages:</div>
              <div className="text-sm">{book.pageCount}</div>
            </>
          )}
          <div className="text-sm font-medium">Likes:</div>
          <div className="text-sm">❤️ {book.likes}</div>
        </div>
        
        {book.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm whitespace-pre-line">{book.description}</p>
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-3">Reviews</h3>
        {book.reviews.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {book.reviews.map((review, reviewIndex) => {
              const rating = validateRating(review.rating);
              return (
                <div key={reviewIndex} className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{review.author}</span>
                    <span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="text-sm mb-1">{review.text}</p>
                  <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}