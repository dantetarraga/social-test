import { z } from 'zod'

export const authSchema = z.object({
  email: z.string('El campo email es obligatorio').email('Correo inválido'),
  password: z.string('La contraseña es obligatoria'),
})

export const registerSchema = authSchema.extend({
  fullName: z
    .string('El nombre completo es obligatorio')
    .min(3, 'El nombre completo debe tener mínimo 3 caracteres'),
  password: z
    .string('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener mínimo 6 caracteres'),
})

export const loginSchema = authSchema.pick({
  email: true,
  password: true,
})

export const recoveryEmailSchema = authSchema.pick({
  email: true,
})

export const resetPasswordSchema = z.object({
  token: z.string('El token es obligatorio'),
  password: z
    .string('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener mínimo 6 caracteres'),
})

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>

export type RecoveryEmailDTO = z.infer<typeof recoveryEmailSchema>
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>
