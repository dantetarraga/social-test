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
  AuthResponse,
  CallbackConfig,
  FacebookAuthResponse,
  InstagramAuthResponse,
  LoginDTO,
  PageFacebookResponse,
  ProviderConfig,
  RegisterDTO,
  ResetPasswordDTO,
  SocialConnectionDTO,
  SocialType,
  TikTokAuthResponse,
  YouTubeAuthResponse,
} from '@/types'
import { callbackProviders, providers } from '@/config'
import axios from 'axios'

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

  generateAuthUrl(platform: SocialType, state: string): string {
    const config = providers[platform] as ProviderConfig
    if (!config) throw Boom.badRequest(`Plataforma ${platform} no soportada`)

    const params = new URLSearchParams({
      [config.clientIdParam]: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: config.responseType!,
      scope: config.scope,
      state,
    })

    if (platform === SocialType.YOUTUBE) {
      params.append('access_type', config.accessType!)
      params.append('prompt', config.prompt!)
    }

    return `${config.authUrl}?${params.toString()}`
  }

  async tiktokCallback(code: string): Promise<SocialConnectionDTO> {
    const config = callbackProviders[SocialType.TIKTOK] as CallbackConfig

    const params = new URLSearchParams({
      client_key: config.clientId!,
      client_secret: config.clientSecret!,
      code,
      grant_type: config.grantType!,
      redirect_uri: config.redirectUri!,
    })

    const { data } = await axios.post<TikTokAuthResponse>(
      config.tokenUrl,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      }
    )

    if (!data) throw Boom.internal('Error obtaining TikTok token')

    return {
      socialType: SocialType.TIKTOK,
      socialAccountId: data.open_id,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
      refreshExpires: new Date(Date.now() + data.refresh_expires_in * 1000),
      scope: data.scope,
      tokenType: data.token_type,
    }
  }

  async facebookCallback(code: string): Promise<SocialConnectionDTO> {
    const config = callbackProviders[SocialType.FACEBOOK] as CallbackConfig

    const { data } = await axios.get<FacebookAuthResponse>(config.tokenUrl, {
      params: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        code,
      },
    })

    if (!data.access_token) {
      throw Boom.internal('Error obtaining Facebook access token')
    }

    const { data: accountsData } = await axios.get(
      'https://graph.facebook.com/v23.0/me/accounts',
      {
        params: {
          access_token: data.access_token,
        },
      }
    )

    const pages = accountsData.data.map((page: PageFacebookResponse) => ({
      pageId: page.id,
      pageName: page.name,
      pageToken: page.access_token,
    }))

    return {
      socialType: SocialType.FACEBOOK,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      pages, 
    }
  }

  async instagramCallback(code: string): Promise<SocialConnectionDTO> {
    const config = callbackProviders[SocialType.INSTAGRAM] as CallbackConfig

    const { data } = await axios.get<InstagramAuthResponse>(config.tokenUrl, {
      params: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      },
    })

    console.log('Instagram data:', data)

    if (!data) throw Boom.internal('Error obtaining Instagram token')

    return {
      socialType: SocialType.INSTAGRAM,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
    }
  }

  async youtubeCallback(code: string): Promise<SocialConnectionDTO> {
    const config = callbackProviders[SocialType.YOUTUBE] as CallbackConfig

    const { data } = await axios.post<YouTubeAuthResponse>(
      config.tokenUrl,
      null,
      {
        params: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: config.redirectUri,
          grant_type: config.grantType,
        },
      }
    )

    if (!data) throw Boom.internal('Error obtaining YouTube token')
    console.log(data)

    return {
      socialType: SocialType.YOUTUBE,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
      scope: data.scope,
      tokenType: data.token_type,
    }
  }
}
export default AuthService
