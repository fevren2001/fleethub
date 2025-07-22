import * as dotenv from 'dotenv';
// dotenv.config();// Load environment variables first
dotenv.config();


import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import truckRoutes from "./routes/truck";
import garageRoutes from "./routes/garage";
import driverRoutes from "./routes/driver";
import deliveryRoutes from "./routes/delivery";
import { generateRandomDeliveriesForUser } from './services/deliveryService';
import { getAllUsers } from './services/authService';
import { completeDueDeliveries } from './services/deliveryService';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use("/trucks", truckRoutes);
app.use("/garages", garageRoutes);
app.use("/drivers", driverRoutes);
app.use("/deliveries", deliveryRoutes);

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

// Background job: generate random deliveries for each user every minute
setInterval(async () => {
  try {
    const users = await getAllUsers();
    for (const user of users) {
      await generateRandomDeliveriesForUser(user.id, 10);
    }
    await completeDueDeliveries();
  } catch (err) {
    console.error('Error generating random deliveries or completing deliveries:', err);
  }
}, 60 * 1000); // every 1 minute