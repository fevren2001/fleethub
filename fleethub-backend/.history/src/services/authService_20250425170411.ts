import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";


console.log("authService.ts loaded!");
console.log("JWT_SECRET (early):", process.env.JWT_SECRET);

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

console.log("authService.ts loaded!");
console.log("JWT_SECRET (late):", process.env.JWT_SECRET);


export async function register(email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash: hash },
  });
  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");
  console.log("JWT_SECRET from env: printed from authService.ts", process.env.JWT_SECRET);

  // const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
  //   expiresIn: "8h",
  // });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "8h",
  });
  
  return { token, user };
}
