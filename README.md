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

The application uses a sophisticated generation algorithm that creates contextually appropriate book data. Each component of the generated books (title, author names, descriptions, etc.) is carefully crafted to match the selected language and detected genre, ensuring a cohesive and realistic result.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.