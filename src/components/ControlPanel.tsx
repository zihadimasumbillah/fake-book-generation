import { supportedLanguages } from '@/config/languages';
import { ChangeEvent, useCallback } from 'react';

interface ControlPanelProps {
  language: string;
  seed: string;
  averageLikes: number;
  averageReviews: number;
  viewMode: 'table' | 'gallery';
  onLanguageChange: (language: string) => void;
  onSeedChange: (seed: string) => void;
  onRandomSeed: () => void;
  onAverageLikesChange: (likes: number) => void;
  onAverageReviewsChange: (reviews: number) => void;
  onViewModeChange: (mode: 'table' | 'gallery') => void;
  onExportCSV: () => void;
}

export default function ControlPanel({
  language,
  seed,
  averageLikes,
  averageReviews,
  viewMode,
  onLanguageChange,
  onSeedChange,
  onRandomSeed,
  onAverageLikesChange,
  onAverageReviewsChange,
  onViewModeChange,
  onExportCSV,
}: ControlPanelProps) {
  const safeNumber = useCallback((value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) ? num.toString() : '0';
  }, []);

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value);
  };
  
  const handleSeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSeedChange(e.target.value);
  };
  
  const handleLikesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onAverageLikesChange(value);
    }
  };
  
  const handleReviewsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onAverageReviewsChange(value);
    }
  };
  
  const displayLikes = isNaN(averageLikes) ? 0 : averageLikes;
  const displayReviews = isNaN(averageReviews) ? 0 : averageReviews;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Language & Region</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Seed Value</label>
          <div className="flex">
            <input
              type="text"
              value={seed}
              onChange={handleSeedChange}
              className="flex-grow p-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={onRandomSeed}
              className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              aria-label="Generate random seed"
            >
              🔀
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Average Likes: {displayLikes.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={safeNumber(displayLikes)}
            onChange={handleLikesChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Average Reviews</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={safeNumber(displayReviews)}
            onChange={handleReviewsChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <div>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-4 py-2 mr-2 rounded-md ${
              viewMode === 'table' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => onViewModeChange('gallery')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'gallery' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Gallery View
          </button>
        </div>
        
        <button
          onClick={onExportCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}