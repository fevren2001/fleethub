

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import truckRoutes from "./routes/truck";


const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use("/trucks", truckRoutes);

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