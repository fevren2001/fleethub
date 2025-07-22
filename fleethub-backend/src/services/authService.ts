import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config';

export async function register(email: string, password: string) {
  console.log("Registering user with email:", email);
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

     // More detailed debugging
  console.log("About to sign token with JWT_SECRET:", JWT_SECRET);
  console.log("JWT_SECRET type:", typeof JWT_SECRET);
  console.log("JWT_SECRET length:", JWT_SECRET ? JWT_SECRET.length : 0);
  console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);
  
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is undefined or empty!");
      throw new Error("Server configuration error: JWT_SECRET is not set");
    }
  // Use the imported JWT_SECRET
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "8h",
  });
 
  return { token, user };
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function getAllUsers() {
  return prisma.user.findMany();
}