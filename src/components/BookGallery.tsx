import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookDetails from './BookDetails';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface BookGalleryProps {
  books: Book[];
  loading: boolean;
}

export default function BookGallery({ books, loading }: BookGalleryProps) {
  const [expandedBook, setExpandedBook] = useState<number | null>(null);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  useEffect(() => {
    if (expandedBook !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedBook]);

  const handleBookClick = (bookId: number) => {
    if (expandedBook === bookId) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookId);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
        {books.map((book, index) => (
          <div
            key={`gallery-book-${book.id}-${index}`}
            className="group"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="flex flex-col"
            >
              <div
                className="relative h-[320px] rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => handleBookClick(book.id)}
              >
                <div className={`relative w-full h-full transition-transform duration-500 ease-out ${hoveredBook === book.id ? 'transform-gpu scale-105' : ''}`}>
                  <Image
                    src={book.coverImage || `/placeholder-book.jpg`}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                    loading={index < 8 ? "eager" : "lazy"}
                    priority={index < 4}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      const titleHash = book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      const hue = titleHash % 360;
                      target.src = `https://picsum.photos/seed/${book.id}-${titleHash}/300/450`;
                      target.style.backgroundColor = `hsl(${hue}, 70%, 80%)`;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white transform transition-transform duration-300">
                    <h3 className="text-base font-bold mb-1 line-clamp-2 group-hover:text-indigo-200 transition-colors">{book.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-1 mb-3">{book.authors.join(', ')}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                          👍
                        </span>
                        <span>{book.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                          💬
                        </span>
                        <span>{book.reviews.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="bg-black/50 text-white text-sm py-1.5 px-3 rounded-full backdrop-blur-sm transform transition-all duration-300 hover:bg-indigo-600/80">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expandedBook !== null && books.find(book => book.id === expandedBook) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setExpandedBook(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 md:p-6 sticky top-0 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 z-10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Details</h2>
                </div>
                <button
                  onClick={() => setExpandedBook(null)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors p-2 rounded-full"
                  aria-label="Close details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-5 md:p-6 hide-scrollbar">
                <BookDetails book={books.find(book => book.id === expandedBook)!} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={`skeleton-${i}`} className="animate-pulse">
              <div className="h-[320px] bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
          border: transparent;
        }
      `}</style>
    </div>
  );
}