import jwt, { SignOptions } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET 
const EXPIRATION = process.env.JWT_EXPIRES_IN

export const generateToken = (payload: object, expiresIn: string = EXPIRATION!): string => {
  return jwt.sign(payload, SECRET!, { expiresIn } as SignOptions);
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET!) as { id: number; email: string; fullName?: string };
}