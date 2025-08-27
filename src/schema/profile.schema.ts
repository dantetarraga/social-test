import z from 'zod'

export const createProfileSchema = z.object({
  name: z.string('El campo nombre es obligatorio').min(2).max(100),
  description: z.string('El campo descripción es obligatorio').min(2).max(100),
  color: z.string().length(7).optional()
})

export type CreateProfileDTO = z.infer<typeof createProfileSchema>
