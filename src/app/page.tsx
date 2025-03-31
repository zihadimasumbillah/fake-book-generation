"use client";

import { useState, useEffect, useCallback } from 'react';
import BookTable from '@/components/BookTable';
import BookGallery from '@/components/BookGallery';
import ControlPanel from '@/components/ControlPanel';
import { Book } from '@/types/book';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import Papa from 'papaparse';

export default function Home() {
  const [language, setLanguage] = useState<string>('en-US');
  const [seed, setSeed] = useState<string>('42');
  const [averageLikes, setAverageLikes] = useState<number>(5.0);
  const [averageReviews, setAverageReviews] = useState<number>(2.0);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table');
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const fetchBooks = useCallback(async (page: number, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
    
      const params = {
        language,
        seed,
        averageLikes: isNaN(averageLikes) ? '5' : averageLikes.toString(),
        averageReviews: isNaN(averageReviews) ? '2' : averageReviews.toString(),
        page: page.toString(),
        count: (page === 1 ? 20 : 10).toString()
      };
      
      const response = await axios.get('/api/books', { params });
      
      if (reset) {
        setBooks(response.data.books);
      } else {
        setBooks(prev => [...prev, ...response.data.books]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [language, seed, averageLikes, averageReviews]);

  const handleAverageLikesChange = useCallback((value: number) => {
    const likes = !isNaN(value) ? Math.max(0, Math.min(10, value)) : 0;
    setAverageLikes(likes);
  }, []);

  const handleAverageReviewsChange = useCallback((value: number) => {
    const reviews = !isNaN(value) ? Math.max(0, Math.min(10, value)) : 0;
    setAverageReviews(reviews);
  }, []);
  useEffect(() => {
    fetchBooks(1, true);
    setCurrentPage(1);
  }, [language, seed, averageLikes, averageReviews, fetchBooks]);
  useEffect(() => {
    if (inView && !loading && currentPage > 0) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchBooks(nextPage);
    }
  }, [inView, loading, currentPage, fetchBooks]);
  
  const generateRandomSeed = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 1000000).toString();
    setSeed(randomSeed);
  }, []);

  const exportToCSV = useCallback(() => {
    if (books.length === 0) return;
    const csvData = books.map(book => ({
      Index: book.id,
      ISBN: book.isbn,
      Title: book.title,
      Authors: book.authors.join(', '),
      Publisher: book.publisher,
      Likes: book.likes,
      Reviews: book.reviews.length,
      PublishedDate: new Date(book.publicationDate).toLocaleDateString(),
      Pages: book.pageCount
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `books-${language}-${seed}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [books, language, seed]);
  
  return (
    <div className="max-w-full px-2 md:px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Fake Book Generator</h1>
      
      <ControlPanel
        language={language}
        seed={seed}
        averageLikes={averageLikes}
        averageReviews={averageReviews}
        viewMode={viewMode}
        onLanguageChange={setLanguage}
        onSeedChange={setSeed}
        onRandomSeed={generateRandomSeed}
        onAverageLikesChange={handleAverageLikesChange}
        onAverageReviewsChange={handleAverageReviewsChange}
        onViewModeChange={setViewMode}
        onExportCSV={exportToCSV}
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {viewMode === 'table' ? (
        <BookTable books={books} loading={loading} />
      ) : (
        <BookGallery books={books} loading={loading} />
      )}
      
      {/* Loading indicator */}
      <div ref={ref} className="py-4 text-center">
        {loading && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
