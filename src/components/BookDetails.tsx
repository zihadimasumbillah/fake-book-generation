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

  const formatPublicationInfo = (publisher: string, date: Date): string => {
    const year = new Date(date).getFullYear();
    return `${publisher}, ${year}`;
  };

  const width = 300;
  const height = 450;

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const titleHash = book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = titleHash % 360;
    target.src = `https://picsum.photos/seed/${book.id}-${titleHash}-${hue}/${width}/${height}`;
  };

  const coverStyleVariant = book.id % 5; 
  
  const coverOverlayStyle = 
    coverStyleVariant === 0 ? "bg-gradient-to-r from-black/70 to-transparent" : 
    coverStyleVariant === 1 ? "bg-gradient-to-b from-black/60 via-transparent to-black/70" : 
    coverStyleVariant === 2 ? "bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0.7)_100%)]" : 
    coverStyleVariant === 3 ? "bg-gradient-to-tr from-black/80 via-black/40 to-transparent" : 
    "bg-gradient-to-tl from-black/50 to-black/70"; 

  const coverTextPosition =
    coverStyleVariant === 0 ? "left-0 top-1/2 -translate-y-1/2 max-w-[70%] p-5" : 
    coverStyleVariant === 1 ? "inset-x-0 bottom-0 p-5 text-center" : 
    coverStyleVariant === 2 ? "inset-0 flex flex-col justify-center items-center text-center p-4" : 
    coverStyleVariant === 3 ? "left-5 top-5 max-w-[80%]" : 
    "inset-0 flex flex-col justify-between p-5"; 

  const getTitleStyle = () => {
    if (coverStyleVariant === 2) return "text-2xl font-bold text-center mb-2";
    if (coverStyleVariant === 1) return "text-xl font-bold";
    if (coverStyleVariant === 0) return "text-xl font-bold line-clamp-3";
    if (coverStyleVariant === 4) return "text-xl font-bold text-center"; 
    return "text-lg font-bold line-clamp-2";
  };

  const getAuthorStyle = () => {
    if (coverStyleVariant === 2) return "text-sm opacity-90 text-center";
    if (coverStyleVariant === 1) return "text-sm opacity-90 mt-2";
    if (coverStyleVariant === 4) return "text-sm opacity-90 text-center"; 
    return "text-sm opacity-90 mt-1";
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex flex-col w-[330px] flex-shrink-0 mx-auto md:mx-0 gap-6">
        <div className="relative h-[470px] w-full mx-auto">
          <div className="absolute -right-2 top-3 bottom-2 w-5 bg-gradient-to-l from-transparent to-black/15 rounded-r-lg"></div>
          <div className="absolute left-0 right-0 -bottom-1 h-3 bg-gradient-to-t from-black/15 to-transparent rounded-b-lg"></div>
          
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none"></div>
            
            {book.coverImage ? (
              <>
                <Image 
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  onError={onImageError}
                  priority
                />
                <div className={`absolute inset-0 ${coverOverlayStyle}`} />
                
                {coverStyleVariant === 4 ? (
                  <div className={`absolute inset-0 flex flex-col justify-between p-5`}>
                    <div className="backdrop-blur-sm p-2 self-center">
                      <h3 className={getTitleStyle()}>
                        {book.title}
                      </h3>
                    </div>
                    <div className="backdrop-blur-sm p-2 self-center mt-auto">
                      <p className={getAuthorStyle()}>
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`absolute ${coverTextPosition} text-white z-10`}>
                    <h3 className={getTitleStyle()}>
                      {book.title}
                    </h3>
                    <p className={getAuthorStyle()}>
                      {book.authors.join(', ')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center p-6 text-white">
                <h3 className="text-xl font-bold text-center mb-5">{book.title}</h3>
                <p className="text-sm opacity-80 text-center">{book.authors.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300">
              <span className="text-2xl">📖</span>
              <div className="text-center">
                <span className="text-base font-medium">{book.pageCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">pages</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300">
              <span className="text-2xl">👍</span>
              <div className="text-center">
                <span className="text-base font-medium">{book.likes}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">likes</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300">
              <span className="text-2xl">💬</span>
              <div className="text-center">
                <span className="text-base font-medium">{book.reviews.length}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{book.title}</h2>
          <p className="text-xl mb-1 text-gray-700 dark:text-gray-300">by {book.authors.join(', ')}</p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>{formatPublicationInfo(book.publisher, book.publicationDate)}</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>ISBN: {book.isbn}</span>
          </div>
        </div>
        
        {book.description && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">About This Book</h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {book.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 pb-2">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span>Reader Reviews</span>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                {book.reviews.length}
              </span>
            </h3>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4">
            {book.reviews.length > 0 ? (
              book.reviews.map((review, reviewIndex) => {
                const rating = validateRating(review.rating);
                return (
                  <div 
                    key={reviewIndex} 
                    className="py-4 first:pt-0 bg-gradient-to-r from-transparent via-gray-50/50 dark:via-gray-800/50 to-transparent rounded-lg px-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{review.author}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < rating ? "text-amber-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2 italic">{review.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{formatDate(review.date)}</p>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                <span className="text-3xl mb-2">📝</span>
                <p>No reviews yet for this book.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
