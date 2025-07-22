// // // import { Request, Response, NextFunction } from "express";
// // // import jwt from "jsonwebtoken";
// // // import { JWT_SECRET } from '../config';

// // // // const JWT_SECRET = process.env.JWT_SECRET!;

// // // export interface AuthRequest extends Request {
// // //   user?: { userId: number; role: string };
// // // }

// // // export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
// // //   const authHeader = req.headers.authorization;
// // //   if (!authHeader?.startsWith("Bearer ")) {
// // //     return; // res.status(401).json({ error: "Missing token" })
// // //   }
// // //   const token = authHeader.split(" ")[1];
// // //   try {
// // //     const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
// // //     req.user = payload;
// // //     next();
// // //   } catch {
// // //     return; // res.status(401).json({ error: "Invalid token" }
// // //   }
// // // }


// // import { Request, Response, NextFunction } from "express";
// // import jwt from "jsonwebtoken";
// // import { JWT_SECRET } from '../config';

// // export interface AuthRequest extends Request {
// //   user?: { userId: number; role: string };
// // }

// // export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader?.startsWith("Bearer ")) {
// //     return res.status(401).json({ error: "Missing token" });
// //   }
  
// //   const token = authHeader.split(" ")[1];
// //   try {
// //     const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
// //     req.user = payload;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ error: "Invalid token" });
// //   }
// // }

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from '../config';

// export interface AuthRequest extends Request {
//   user?: { userId: number; role: string };
// }

// export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Missing token" });
//   }
  
//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
//     req.user = payload;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

// Make sure there's no undefined return type
export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
}