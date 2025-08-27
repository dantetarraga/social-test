import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || '123456789'
const EXPIRATION = process.env.JWT_EXPIRES_IN || '1d'

export const generateToken = (payload: object, expiresIn: string = EXPIRATION): string => {
  return jwt.sign(payload, SECRET, { expiresIn } as SignOptions);
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { id: string; email: string; fullName?: string };
}