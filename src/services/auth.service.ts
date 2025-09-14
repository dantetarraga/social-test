import Boom from '@hapi/boom'
import { User } from '@/models'
import { Repository } from 'typeorm'
import { AppDataSource } from '@/config/database'
import {
  generateToken,
  verifyToken,
  comparePassword,
  hashPassword,
  sendRecoveryEmail,
} from '@/helpers'
import {
  RegisterUserSchema,
  LoginUserSchema,
  ResetPasswordSchema,
  AuthResponseSchema
} from '@/schemas/auth.schemas'
import { TokenPayload } from '@/types/auth.types'

class AuthService {
  private userRepo: Repository<User>

  constructor() {
    this.userRepo = AppDataSource.getRepository(User)
  }

  async register(userData: RegisterUserSchema): Promise<AuthResponseSchema> {
    const existingUser = await this.userRepo.findOne({
      where: { email: userData.email },
    })

    if (existingUser) throw Boom.conflict('Email already registered')
    
    const hashedPassword = await hashPassword(userData.password)

    const user = this.userRepo.create({
      ...userData,
      password: hashedPassword,
    })
    
    const savedUser = await this.userRepo.save(user)

    const tokenPayload: TokenPayload = {
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: savedUser.role,
    }

    const accessToken = generateToken(tokenPayload)

    return {
      email: savedUser.email,
      fullName: savedUser.fullName,
      accessToken,
    }
  }

  async login(credentials: LoginUserSchema): Promise<AuthResponseSchema> {
    const user = await this.userRepo.findOne({
      where: { email: credentials.email },
    })

    if (!user) throw Boom.unauthorized('Invalid email and/or password')
    
    const isValidPassword = await comparePassword(
      credentials.password,
      user.password
    )

    if (!isValidPassword) throw Boom.unauthorized('Invalid email and/or password')
    
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    }

    const accessToken = generateToken(tokenPayload)

    return {
      email: user.email,
      fullName: user.fullName,
      accessToken,
    }
  }

  async notifyResetPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { email },
    })

    if (!user) throw Boom.notFound('User not found')
    
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
    }

    const token = generateToken(tokenPayload, '15m')
    const result = await sendRecoveryEmail(user.email, token)
    
    if (!result.success) {
      throw Boom.internal('Error sending recovery email')
    }
  }

  async resetPassword(resetData: ResetPasswordSchema): Promise<void> {
    const decoded = verifyToken(resetData.token) as TokenPayload | null

    if (!decoded) {
      throw Boom.unauthorized('Invalid or expired token')
    }

    const user = await this.userRepo.findOne({
      where: { id: decoded.id, email: decoded.email },
    })

    if (!user) {
      throw Boom.notFound('User not found')
    }

    const hashedPassword = await hashPassword(resetData.password)
    user.password = hashedPassword
    
    await this.userRepo.save(user)
  }
}

export default AuthService
