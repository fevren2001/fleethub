
## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Backend Setup

```bash
cd fleethub-backend
npm install
# Set up your .env file with DATABASE_URL and JWT_SECRET
npx prisma migrate deploy
npm run dev
```

### Frontend Setup

```bash
cd fleethub-frontend
npm install
npm run dev
```

### Environment Variables

- **Backend:**  
  - `DATABASE_URL` (PostgreSQL connection string)
  - `JWT_SECRET` (JWT signing key)
- **Frontend:**  
  - `VITE_API_BASE_URL` (API endpoint, e.g., your Render backend URL)

## Deployment

- Frontend: Deploy to Vercel
- Backend: Deploy to Render

## License

MIT
