// import dotenv from 'dotenv';
// // dotenv.config();

// export const JWT_SECRET = process.env.JWT_SECRET!;


import dotenv from 'dotenv';
dotenv.config();

// Make sure the JWT_SECRET exists and throw a clear error if it doesn't
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export const JWT_SECRET = process.env.JWT_SECRET;