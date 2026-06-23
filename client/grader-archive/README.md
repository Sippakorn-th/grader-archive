# Grader Archive Frontend

This is the Next.js frontend for Grader Archive.

## Setup

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_STORAGE_BASE_URL=<public-storage-base-url>
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Main Screens

- `/` - problem archive with search and filters
- `/problems/[slug]` - problem detail page with submissions, code viewer, testcase details, and analysis

See the repository root README for full project setup.
