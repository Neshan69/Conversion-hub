# Conversion Hub

A premium, all-in-one conversion platform built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Real-time Unit Conversion**: Instant conversion across 8 categories
- **Premium UI/UX**: iOS-inspired design with smooth animations
- **Dark Mode**: System-aware theme switching
- **Search**: Instant fuzzy search across all units
- **Recent Conversions**: LocalStorage-powered history
- **SEO Optimized**: Dynamic metadata, structured data, sitemap
- **Responsive**: Mobile-first design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd conversion-hub
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── layout.tsx          # Root layout with theme provider
├── page.tsx           # Homepage
├── loading.tsx        # Global loading state
├── not-found.tsx      # 404 page
├── search/            # Search page
├── convert/           # Converter routes
│   ├── page.tsx      # All converters grid
│   ├── [category]/   # Category pages
│   │   ├── page.tsx
│   │   └── [pair]/   # Specific unit pair
│   │       └── page.tsx
├── robots.txt
└── sitemap.ts

components/
├── ui/               # Reusable UI components
├── layout/           # Header, Footer
├── home/             # Homepage sections
├── converter/        # Converter components
├── seo/              # Structured data
└── providers/        # Theme provider

lib/
├── converter-engine.ts  # Conversion logic
└── utils.ts            # Utility functions

data/
└── conversions.ts      # Conversion data & factors

types/
└── converter.ts        # TypeScript interfaces
```

## Converter Categories

1. **Length** - meters, feet, miles, km, etc.
2. **Weight** - kg, pounds, grams, ounces, etc.
3. **Temperature** - Celsius, Fahrenheit, Kelvin
4. **Speed** - km/h, mph, m/s, knots, etc.
5. **Area** - m², km², acres, hectares, etc.
6. **Volume** - liters, gallons, cups, etc.
7. **Time** - seconds, minutes, hours, days, etc.
8. **Storage** - bytes, KB, MB, GB, TB, etc.

## Features in Detail

### Real-time Conversion
As you type, results update instantly with high precision.

### Swap Units
Click the swap button to reverse from/to units with smooth animation.

### Copy Results
One-click copy to clipboard with visual feedback.

### Recent Conversions
Your last 10 conversions are saved locally for quick access.

### Search
Instant fuzzy search across all unit names and symbols. Keyboard navigation support.

### Dark Mode
Automatic system preference detection with manual toggle. Smooth transition.

### SEO
- Dynamic meta titles & descriptions
- Open Graph & Twitter Cards
- JSON-LD structured data
- Automatic sitemap generation
- Canonical URLs
- Semantic HTML5

### Performance
- 60fps GPU-accelerated animations
- Optimized Core Web Vitals
- Minimal layout shift
- Efficient re-renders with memoization
- Code splitting & lazy loading

## Route Structure

- `/` - Homepage
- `/convert` - All converter categories grid
- `/convert/:category` - Category page (e.g., `/convert/length`)
- `/convert/:category/:pair` - Specific conversion (e.g., `/convert/length/kilometer-to-mile`)
- `/search` - Search interface

## Future Enhancements

- Currency conversion with live rates
- File format converters
- Image converters
- AI-powered tools
- User accounts & cloud sync
- Multi-language support

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/conversion-hub)

Or manually:
```bash
vercel
```

## Performance Scores Target

- **Lighthouse**: 95+
- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile-optimized with touch-friendly controls.

## License

MIT License - feel free to use for personal or commercial projects.