import React, { useState } from 'react';
import { Book } from '@/types/book';
import BookDetails from './BookDetails';

interface BookTableProps {
  books: Book[];
  loading: boolean;
}

export default function BookTable({ books, loading }: BookTableProps) {
  const [expandedBook, setExpandedBook] = useState<number | null>(null);
  
  const toggleBookExpansion = (bookId: number) => {
    if (expandedBook === bookId) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookId);
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'short'
    });
  };
  
  const formatPublisherWithDate = (publisher: string, date: Date): React.ReactElement => {
    return (
      <div className="flex flex-col">
        <span>{publisher}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12 md:w-16">
              ID
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 md:w-28">
              ISBN
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
              Title
              </th>
              <th className="px-2 md:px-4 py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
              Author(s)
              </th>
              <th className="px-2 md:px-4 py-3 pl-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              Publisher & Date
              </th>
              <th className="px-2 md:px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36 text-center">
              Like & Reviews
              </th>
            </tr>
            </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {books.map((book, index) => (
              <React.Fragment key={`book-row-${book.id}-${index}`}>
                <tr 
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleBookExpansion(book.id)}
                >
                  <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm">
                    {book.id}
                  </td>
                  <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm truncate">
                    {book.isbn}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm font-medium truncate">
                    {book.title}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm truncate">
                    {book.authors.join(', ')}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm hidden md:table-cell">
                    {formatPublisherWithDate(book.publisher, book.publicationDate)}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-center gap-4">
                      <span className="flex items-center gap-1">
                        <span>👍</span> {book.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> {book.reviews.length}
                      </span>
                    </div>
                  </td>
                </tr>
                {expandedBook === book.id && (
                  <tr key={`book-details-${book.id}-${index}`}>
                    <td colSpan={6} className="px-4 py-4 bg-gray-50 dark:bg-gray-900">
                      <BookDetails book={book} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {books.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No books found. Try changing your parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}