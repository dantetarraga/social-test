import cors from 'cors'
import express from 'express'
import cookieParser from "cookie-parser";
import path from "path";

import routerApi from './routes'
import { errorHandler, logErrors } from './middleware'

import { specs, swaggerUiOptions } from './config/swagger.config';
import swaggerUi from 'swagger-ui-express'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Router
routerApi(app)

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

// Error handling middleware
app.use(errorHandler)
app.use(logErrors)

export default app