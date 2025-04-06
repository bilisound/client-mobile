# Bilisound Netlify Server

This Netlify serverless function provides a proxy service for GitHub release files from the bilisound/client-mobile repository.

## Features

- Proxy GitHub release files to avoid rate limiting and CORS issues
- Cache responses to improve performance
- Simple API endpoints for accessing releases and assets

## API Endpoints

- `/api/github-release-proxy/latest` - Get the latest release information
- `/api/github-release-proxy/releases` - List all releases
- `/api/github-release-proxy/download/:tag/:filename` - Download a specific release asset

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

## Deployment

```bash
# Deploy to Netlify
npm run deploy
```
