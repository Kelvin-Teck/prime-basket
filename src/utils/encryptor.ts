import { User } from '@prisma/client';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashedPassword = async (plainTextPassword: string) => {
    return await bcrypt.hash(plainTextPassword, 10);
}


export const comparePassword = async (plainTextPassword: string, passwordFromDb: string) => {
    return await bcrypt.compare(plainTextPassword, passwordFromDb);
}

export const generateAccessToken = async (user: Partial<User>) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );