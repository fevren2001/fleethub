// import { Router } from "express";
// import { getTrucks, addTruck } from "../controllers/truckController";
// import { authenticate } from "../middlewares/authMiddleware";

// const router = Router();

// // This should work after fixing the authenticate middleware
// router.use(authenticate);

// router.get("/", getTrucks);
// router.post("/", addTruck);

// export default router;

import { Router } from "express";
import { getTrucks, addTruck } from "../controllers/truckController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to individual routes instead of using router.use()
router.get("/", authenticate, getTrucks);
router.post("/", authenticate, addTruck);

export default router;