# Fake Book Store Generator

A modern, fully-featured application for generating realistic mock book data with language support for English, German, and French.

## Overview

The Fake Book Store Generator is a sophisticated Next.js application designed to create realistic, deterministic book data for testing, UI development, and demonstration purposes. The application produces consistently high-quality mock data including titles, authors, publishers, ISBNs, book descriptions, reviews, and book covers across multiple languages.

## Features

- **Multi-language Support**: Generate books in English, German, and French with appropriate language-specific content
- **Deterministic Generation**: Use seed values to consistently recreate the same data sets
- **Realistic Book Metadata**: Generate realistic titles, authors, publishers, ISBNs, and publication dates
- **Dynamic Book Descriptions**: Create contextually appropriate book descriptions that match the book's language and genre
- **Authentic Reviews**: Generate plausible book reviews with ratings, author names, and properly formatted text
- **Visual Book Covers**: Produce genre-appropriate book covers with proper text overlays
- **Flexible Data Control**:
  - Adjust the average number of likes per book
  - Control the average number of reviews per book
  - Generate consistent results with custom seed values

## Interface Options

- **Table View**: Display books in a sortable, detailed tabular format
- **Gallery View**: Browse books in a visually appealing grid layout with cover images
- **Export to CSV**: Download the generated data for use in other applications

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **UI**: Tailwind CSS for responsive design
- **Data Handling**: React Query for efficient data fetching
- **Mock Data**: Faker.js for generating realistic content
- **Image Processing**: Next.js Image component for optimized image loading
- **State Management**: React hooks for state management
- **Data Generation**: Custom deterministic generators with seedrandom

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd fake-book-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

## Usage

1. **Select Language**: Choose between English (US), German, or French from the dropdown
2. **Set Seed Value**: Enter a custom seed or generate a random one for consistent results
3. **Adjust Parameters**: Set the average number of likes and reviews per book
4. **Switch Views**: Toggle between Table and Gallery views based on your preference
5. **Export Data**: Download the generated book data as a CSV file

## Implementation Details

The application uses a sophisticated multi-stage generation algorithm that creates contextually appropriate book data:

### Book Generation Algorithm

1. **Seed-based Determinism**:
   - Uses seedrandom.js to create deterministic pseudo-random number generators
   - Combines the base seed with unique identifiers for each book component
   - Ensures identical output for the same input parameters across sessions

2. **Language-Specific Generation**:
   - Implements locale-specific generators for each supported language
   - Uses different Faker.js locales (en-US, de-DE, fr-FR) for appropriate content
   - Adjusts grammar patterns and formatting based on language rules

3. **Title Generation**:
   - Uses language-specific pattern templates (14 different patterns)
   - Combines adjectives, nouns, and other word types contextually
   - Applies language-appropriate capitalization rules

4. **Author Name Generation**:
   - Creates culturally appropriate names based on locale
   - Adds region-specific name formats (middle initials for English, academic titles for German, compound names for French)
   - Ensures unique authors within books

5. **Cover Image Generation**:
   - Analyzes book title to detect genre via linguistic markers
   - Applies genre-specific visual treatments (grayscale for history, blur effects for sci-fi)
   - Creates unique but deterministic image URLs based on book metadata

6. **Review Generation**:
   - Implements fractional probability system for review count
   - Uses template-based generation with sentiment analysis
   - Creates appropriate distribution of positive and negative reviews
   - Generates chronologically plausible review dates after publication

7. **ISBN Generation**:
   - Implements standard ISBN-13 format with proper group identifiers
   - Creates unique but deterministic ISBNs for each book
   - Maintains correct checksum calculation

8. **Statistical Controls**:
   - Uses the `applyTimes` algorithm for non-integer averages
   - Implements probabilistic distribution for likes and reviews
   - Applies fractional parts as probability thresholds

### Performance Optimizations

- **Lazy Loading**: Images use Next.js optimized loading with proper prioritization
- **Deterministic Memoization**: Prevents redundant recalculations for identical inputs
- **Data Pagination**: Implements infinite scroll with appropriate page sizing
- **Visual Feedback**: Provides loading states and skeleton UI during data generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.