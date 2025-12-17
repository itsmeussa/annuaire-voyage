# TravelAgencies.World

A comprehensive global directory for finding and comparing travel agencies worldwide. Built with Next.js 14, TypeScript, and Tailwind CSS.

![TravelAgencies.World](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop)

## Features

- 🌍 **1600+ Travel Agencies** - Browse verified agencies from around the world
- ⭐ **Real Reviews & Ratings** - All data sourced from Google Places
- 🔍 **Advanced Search & Filtering** - Find agencies by location, rating, and category
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🚀 **SEO Optimized** - Built for search engines with proper metadata, sitemap, and structured data
- ⚡ **Fast Performance** - Static generation for blazing-fast page loads
- 📝 **Travel Blog** - Expert tips and destination guides

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel / Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/annuaire-voyage.git
cd annuaire-voyage
```

2. Install dependencies:
```bash
npm install
```

3. Process agency data (if updating):
```bash
python process_data.py
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The static site will be generated in the `out` directory.

## Project Structure

```
annuaire-voyage/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── agencies/      # Agency listing and detail pages
│   │   ├── blog/          # Blog section
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   └── destinations/  # Destinations page
│   ├── components/        # Reusable components
│   │   ├── layout/        # Header, Footer
│   │   └── ui/            # UI components
│   ├── data/              # Processed agency data
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── data/                   # Raw agency data (JSON files)
├── process_data.py         # Data processing script
└── package.json
```

## Data Sources

Agency data is sourced from Google Places and includes:
- Agency name and description
- Ratings and review counts
- Contact information (phone, website)
- Location details (address, city, country)
- Category/specialization

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/annuaire-voyage)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/annuaire-voyage)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Credits

Developed with ❤️ by [Orious Strategy](https://oriousstrategy.com)

---

© 2024 TravelAgencies.World. All rights reserved.
