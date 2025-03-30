import React, { useState } from 'react';
import { Book } from '@/types/book';
import BookDetails from './BookDetails';
import Image from 'next/image';

interface BookGalleryProps {
  books: Book[];
  loading: boolean;
}

export default function BookGallery({ books, loading }: BookGalleryProps) {
  const [expandedBook, setExpandedBook] = useState<number | null>(null);
  
  const handleBookClick = (bookId: number) => {
    if (expandedBook === bookId) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookId);
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book, index) => (
          <div key={`gallery-book-${book.id}-${index}`} className="flex flex-col">
            <div
              className="relative h-[300px] rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleBookClick(book.id)}
            >
              {/* Book cover image */}
              <Image
                src={book.coverImage || `/placeholder-book.jpg`}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
                loading={index < 10 ? "eager" : "lazy"}
                priority={index < 4}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  const titleHash = book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const hue = titleHash % 360;
                  target.src = `https://picsum.photos/seed/${book.id}-${titleHash}/300/450`;
                  target.style.backgroundColor = `hsl(${hue}, 70%, 80%)`;
                }}
              />
              
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              
              {/* Book title and author at bottom of cover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                <h3 className="text-sm font-bold mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-xs line-clamp-1">{book.authors.join(', ')}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span>❤️ {book.likes}</span>
                  <span>💬 {book.reviews.length}</span>
                </div>
              </div>
            </div>
            
            {expandedBook === book.id && (
              <div key={`gallery-details-${book.id}-${index}`} className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <BookDetails book={book} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-pulse text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading more books...</p>
          </div>
        </div>
      )}
    </div>
  );
}