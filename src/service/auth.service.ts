import Boom from '@hapi/boom'

import { SocialType, User } from '@/models'
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
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  SocialConnectionDTO,
  TikTokAuthResponse,
} from '@/types'

class AuthService {
  private userRepo: Repository<User>

  constructor() {
    this.userRepo = AppDataSource.getRepository(User)
  }

  async register(userData: RegisterDTO): Promise<AuthResponse> {
    const hashedPassword = await hashPassword(userData.password)

    const user = this.userRepo.create({
      ...userData,
      password: hashedPassword,
    })
    const savedUser = await this.userRepo.save(user)

    const accessToken = generateToken({
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
    })

    return {
      email: savedUser.email,
      fullName: savedUser.fullName,
      accessToken,
    }
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: credentials.email },
    })

    if (!user) throw Boom.notFound('El usuario no fue encontrado')

    const isValidPassword = await comparePassword(
      credentials.password,
      user.password
    )

    if (!isValidPassword)
      throw Boom.unauthorized('Correo y/o contraseña inválida')

    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    })

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

    if (!user) throw Boom.notFound('El usuario no fue encontrado')
    const token = generateToken({ id: user.id, email: user.email }, '15m')

    const result = await sendRecoveryEmail(user.email, token)
    console.log(result)
    if (!result.success)
      throw Boom.internal('Error al enviar el correo de recuperación')
  }

  async resetPassword(resetData: ResetPasswordDTO): Promise<void> {
    const decoded = verifyToken(resetData.token)

    if (!decoded) throw Boom.unauthorized('Token inválido o expirado')

    const user = await this.userRepo.findOne({
      where: { id: Number(decoded.id), email: decoded.email },
    })

    if (!user) throw Boom.notFound('El usuario no fue encontrado')

    user.password = await hashPassword(resetData.password)
    await this.userRepo.save(user)
  }

  getTikTokAuthUrl(state: string): string {
    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY!
    const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI!

    const URL_AUTH_TIKTOK = 'https://www.tiktok.com/v2/auth/authorize/'
    const SCOPE = 'user.info.basic'

    let redirectUrl = `${URL_AUTH_TIKTOK}`
    redirectUrl += `?client_key=${CLIENT_KEY}`
    redirectUrl += `&scope=${SCOPE}`
    redirectUrl += `&response_type=code`
    redirectUrl += `&redirect_uri=${REDIRECT_URI}`
    redirectUrl += `&state=${state}`

    return redirectUrl
  }

  async tiktokCallback(code: string): Promise<SocialConnectionDTO> {
    const response = await fetch(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
        }),
      }
    )

    if (!response.ok) throw Boom.internal('Error obtaining TikTok token')
    const data = (await response.json()) as TikTokAuthResponse

    return {
      socialType: SocialType.TIKTOK,
      socialAccountId: data.open_id,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
      refreshExpires: new Date(Date.now() + data.refresh_expires_in * 1000),
      scope: data.scope,
    }
  }
}

export default AuthService
