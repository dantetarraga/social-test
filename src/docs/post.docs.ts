/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gestión de publicaciones
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crear nueva publicación
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - platforms
 *             properties:
 *               content:
 *                 type: string
 *                 example: Mi nueva publicación
 *                 description: Contenido de la publicación (máx. 500 caracteres)
 *               platforms:
 *                 type: string
 *                 example: '[{"profileId":1,"connectionId":5},{"profileId":2,"connectionId":7}]'
 *                 description: Array JSON de objetos con profileId y connectionId
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-25T10:00:00.000Z
 *                 description: Fecha programada para publicar
 *               publishNow:
 *                 type: boolean
 *                 example: false
 *                 description: Publicar inmediatamente
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos multimedia (imágenes/videos)
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Obtener publicación por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Actualizar publicación
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Contenido actualizado
 *               platforms:
 *                 type: string
 *                 example: '[{"profileId":1,"connectionId":5}]'
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               publishNow:
 *                 type: boolean
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 */


/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Eliminar publicación
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 */      


/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener todas las publicaciones del usuario
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Publicaciones por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, PUBLISHED, FAILED, DRAFT]
 *         description: Filtrar por estado
 *       - in: query
 *         name: profileId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar por perfil
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Posts retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         hasNext:
 *                           type: boolean
 *                           example: true
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

