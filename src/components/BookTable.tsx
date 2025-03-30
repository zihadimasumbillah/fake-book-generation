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
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Index
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Author(s)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Publisher
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Stats
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {books.map((book, index) => (
            <React.Fragment key={`book-row-${book.id}-${index}`}>
              <tr 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => toggleBookExpansion(book.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {book.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {book.isbn}
                </td>
                <td className="px-6 py-4 text-sm">
                  {book.title}
                </td>
                <td className="px-6 py-4 text-sm">
                  {book.authors.join(', ')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {book.publisher}
                </td>
                <td className="px-6 py-4 text-sm">
                  ❤️ {book.likes} | 💬 {book.reviews.length}
                </td>
              </tr>
              {expandedBook === book.id && (
                <tr key={`book-details-${book.id}-${index}`}>
                  <td colSpan={6} className="px-6 py-4">
                    <BookDetails book={book} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {loading && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center">
                Loading more books...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}