import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

// <-- annotate here:
app.get(
  '/',
  (req: Request, res: Response): void => {
    res.send('FleetHub backend up — hit /auth');
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
