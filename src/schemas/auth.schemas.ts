import { z } from 'zod'

// Esquemas base reutilizables
export const emailSchema = z.string('El campo email es obligatorio').email('Correo inválido')
export const passwordSchema = z.string('La contraseña es obligatoria').min(6, 'La contraseña debe tener mínimo 6 caracteres')
export const fullNameSchema = z.string('El nombre completo es obligatorio').min(3, 'El nombre completo debe tener mínimo 3 caracteres')
export const tokenSchema = z.string('El token es obligatorio')

// Esquemas de validación
export const registerUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
})

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string('La contraseña es obligatoria'),
})

export const recoveryEmailSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: tokenSchema,
  password: passwordSchema,
})

export const authResponseSchema = z.object({
  email: z.string(),
  fullName: z.string(),
  accessToken: z.string(),
})

// Tipos inferidos con nomenclatura consistente
export type RegisterUserSchema = z.infer<typeof registerUserSchema>
export type LoginUserSchema = z.infer<typeof loginUserSchema>
export type RecoveryEmailSchema = z.infer<typeof recoveryEmailSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type AuthResponseSchema = z.infer<typeof authResponseSchema>