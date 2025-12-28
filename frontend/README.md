# HireCandi Frontend

MVP frontend for HireCandi - A resume shortlisting tool for HRs.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## Backend Configuration

The frontend expects the backend API to be running at `http://localhost:8000`. The Vite proxy is configured to forward `/api` requests to the backend.

If your backend runs on a different port, update the proxy configuration in `vite.config.js`.

## API Endpoints Used

- `POST /api/jobs` - Create a new job
- `POST /api/jobs/:jobId/resumes` - Upload resumes
- `GET /api/jobs/:jobId/status` - Get processing status
- `GET /api/jobs/:jobId/results` - Get candidate results

## Project Structure

```
src/
├── api/
│   └── api.js              # API integration layer
├── components/
│   └── CandidateDetailsModal.jsx  # Modal for candidate details
├── pages/
│   ├── CreateJobPage.jsx   # Job creation and resume upload
│   ├── ProcessingPage.jsx  # Status polling page
│   └── ResultsPage.jsx     # Results table page
├── App.jsx                 # Main app with routing
├── main.jsx               # React entry point
└── index.css              # Global styles with Tailwind
```

## Features

- Create jobs with job descriptions
- Upload multiple PDF resumes
- Real-time status polling (every 3 seconds)
- Ranked candidate results table
- Detailed candidate information modal
- Clean, professional UI
- Error handling and loading states

## Notes

- No authentication required
- No global state management (uses local component state)
- Desktop-first design
- Focuses on functionality over fancy animations

