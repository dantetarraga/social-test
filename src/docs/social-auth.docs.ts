/**
 * @swagger
 * tags:
 *   name: Social Authentication
 *   description: Autenticación con plataformas sociales
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Generar URL de autenticación social
 *     tags: [Social Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *               - platform
 *             properties:
 *               profileId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del perfil al que se asociará la conexión
 *               platform:
 *                 type: string
 *                 enum: [tiktok, facebook, instagram, youtube]
 *                 example: tiktok
 *                 description: Plataforma social a conectar
 *     responses:
 *       200:
 *         description: URL de autenticación generada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     authUrl:
 *                       type: string
 *                       example: https://www.tiktok.com/v2/auth/authorize/?client_key=...
 *                     platform:
 *                       type: string
 *                       example: tiktok
 *                 message:
 *                   type: string
 *                   example: tiktok auth URL generated successfully
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/{platform}/callback:
 *   get:
 *     summary: Manejar callback de autenticación social
 *     tags: [Social Authentication]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: platform
 *         required: true
 *         schema:
 *           type: string
 *           enum: [tiktok, facebook, instagram, youtube]
 *         description: Plataforma social
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de autorización proporcionado por la plataforma
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: Estado de la petición que contiene el profileId
 *     responses:
 *       200:
 *         description: Autenticación exitosa y conexión guardada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SocialConnection'
 *                 message:
 *                   type: string
 *                   example: tiktok connected successfully
 *       400:
 *         description: Error en el proceso de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
