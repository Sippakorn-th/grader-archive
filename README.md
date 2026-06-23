# Grader Archive

Grader Archive is a web app for browsing programming problems, submission history, testcase results, and code analysis in one place. It has a dark, compact interface designed for quickly reviewing solved and unsolved problems.

## Features

- Problem list with search, course filtering, solved filtering, difficulty, score, and submission count
- Individual problem pages with fast loading states
- Submission history with sorting and filtering
- Code viewer with syntax highlighting and copy-to-clipboard
- Testcase result details per submission
- AI analysis display for algorithms, complexity, readability, and reasoning when available
- Dark loading and error screens for a consistent UI

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Go, Chi router
- Database: PostgreSQL
- Code display: react-syntax-highlighter

## Project Structure

```text
grader-archive/
├── client/grader-archive/   # Next.js frontend
└── server/                  # Go API server
```

## Requirements

- Node.js
- npm
- Go 1.24 or newer
- PostgreSQL database

## Environment Variables

### Frontend

Create `client/grader-archive/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_STORAGE_BASE_URL=<public-storage-base-url>
```

`NEXT_PUBLIC_STORAGE_BASE_URL` is used to load source code files referenced by submission records.

### Backend

Set `DB_URL` before starting the server:

```bash
export DB_URL="postgres://user:password@host:5432/database"
```

## Running Locally

Start the backend:

```bash
cd server
go run .
```

The API server runs on `http://localhost:8080`.

Start the frontend:

```bash
cd client/grader-archive
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## API Endpoints

```text
GET /problems
GET /problems/{slug}
GET /problems/{slug}/submissions
GET /submissions/{id}/testcases
```

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Backend:

```bash
go run .
go test ./...
```

## Notes

- The frontend expects the API to return JSON arrays for list endpoints.
- Missing submission data is handled gracefully in the UI where possible.
- If code files are unavailable, the code viewer shows a friendly fallback message instead of crashing.
