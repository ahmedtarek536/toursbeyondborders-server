# Travel Company API

## Setup

1. Install Node.js 18+
2. Copy .env.example to .env and fill values
3. Install dependencies and run

```bash
npm install
npm run dev
```

Required env vars:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- PORT (optional)

## Endpoints
- GET /health
- GET /destinations
- GET /destinations/:id
- GET /packages
- GET /packages/:id
- GET /reservations
- POST /reservations 