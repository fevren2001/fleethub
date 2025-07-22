// import { Router } from "express";
// import { getTrucks, addTruck } from "../controllers/truckController";
// import { authenticate } from "../middlewares/authMiddleware";

// const router = Router();

// // All truck routes require authentication
// router.use(authenticate);

// router.get("/", getTrucks);
// router.post("/", addTruck);

// export default router;


import { Router } from "express";
import { getTrucks, addTruck } from "../controllers/truckController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to each route individually
router.get("/", authenticate, getTrucks);
router.post("/", authenticate, addTruck);

export default router;