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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 border border-gray-100 dark:border-gray-700 overflow-hidden">    
      <div className="p-6">
        <div className="flex flex-wrap items-start gap-6 lg:gap-8">
          {/* Language selector */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <div className="relative">
              <label 
                htmlFor="language-selector" 
                className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
              >
                Language & Region
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                id="language-selector"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seed input */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <label 
              htmlFor="seed-input" 
              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
            >
              Seed Value
            </label>
            <div className="flex">
              <input
                type="text"
                value={seed}
                onChange={handleSeedChange}
                id="seed-input"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-l-lg dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
              />
              <button
                onClick={onRandomSeed}
                className="px-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition-all shadow-sm flex items-center justify-center"
                aria-label="Generate random seed"
                title="Generate random seed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Likes with thumbs up */}
          <div className="w-full sm:w-44 flex-shrink-0">
            <label 
              htmlFor="likes-range" 
              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
            >
              Average Likes
            </label>
            <div className="flex items-center gap-3">
              <input
                id="likes-range"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={safeNumber(displayLikes)}
                onChange={handleLikesChange}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500 dark:bg-gray-700"
                title="Average Likes"
              />
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2.5 py-1.5 text-gray-600 dark:text-gray-300">
                <span className="text-sm">👍</span>
                <span className="font-medium text-sm">{displayLikes.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Reviews input */}
          <div className="w-full sm:w-44 flex-shrink-0">
            <label 
              htmlFor="reviews-input" 
              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
            >
              Average Reviews
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12z"/>
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6z"/>
                  </svg>
                </div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={safeNumber(displayReviews)}
                  onChange={handleReviewsChange}
                  id="reviews-input"
                  className="w-full p-2.5 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="sm:ml-auto flex-shrink-0 pt-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              View Mode
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg shadow-inner">
                <button
                  onClick={() => onViewModeChange('table')}
                  className={`p-2 rounded-md flex items-center justify-center transition-all ${
                    viewMode === 'table' 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Table View"
                  title="Table View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v1h14V2zM1 5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H1z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onViewModeChange('gallery')}
                  className={`p-2 rounded-md flex items-center justify-center transition-all ${
                    viewMode === 'gallery' 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Gallery View"
                  title="Gallery View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 5H2v8l3.546-3.783a.5.5 0 0 1 .708.057l2.285 2.785a.5.5 0 0 0 .808-.057L13 5.5a.5.5 0 0 1 .818.162L14 8V5z"/>
                  </svg>
                </button>
              </div>

              {/* Export button */}
              <button
                onClick={onExportCSV}
                className="px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 shadow-sm flex items-center gap-2 transition-all h-[38px]"
                aria-label="Export to CSV"
                title="Export to CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}