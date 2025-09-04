import z from 'zod'

export const mediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(['image', 'video']),
  filename: z.string().min(1).max(100),
})

export const createPostSchema = z
  .object({
    content: z.string().min(1, 'El contenido es requerido').max(500),
    profileId: z.number().min(1, 'El ID del perfil es requerido'),
    socialIds: z.array(z.number()).min(1, 'Debe seleccionar al menos una conexión social'),
    media: z.array(mediaSchema).min(1, 'Debe incluir al menos un elemento multimedia'),
    scheduledAt: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduledAt && data.scheduledAt <= new Date()) {
      ctx.addIssue({
        code: 'custom',
        message: 'La fecha/hora debe ser en el futuro',
        path: ['scheduledAt'],
      })
    }
  })

export type CreatePostDTO = z.infer<typeof createPostSchema>
export type MediaItem = z.infer<typeof mediaSchema>
