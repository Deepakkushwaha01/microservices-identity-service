import express, { Express } from 'express'
import router from './routes/route'
import dotenv from 'dotenv'
import connectToDb from './DB/connectToDb'
import logger from './logs/logger'
import chalk from 'chalk'
import helmet from 'helmet'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import rateLimit from 'express-rate-limit'
import connectToRedis from './middlewares/redis/redisHandler'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocumentation } from './docs/swagger/swagger'

const app: Express = express()
dotenv.config()
const PORT = process.env.PORT

if (!PORT) {
  logger.error(chalk.bold.redBright(`Unable to identify identity service port ${PORT}`))
  process.exit(1)
}

connectToRedis()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({ success: false, message: 'Too many requests' })
  }
  // store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter) // Apply the rate limiting middleware to all requests

connectToDb()

// Middleware to parse incoming JSON data from client (like from frontend)
app.use(express.json())

// Middleware to parse URL-encoded data (like from HTML form submissions)
// extended: true allows parsing of nested objects
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', router)

// Middleware to set security-related HTTP headers
// This helps protect the app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
// For example, it can help prevent XSS attacks, clickjacking, etc.
// It is a good practice to use helmet in production environments
app.use(helmet())
app.use(cors())

app.use(errorHandler) // handler for errors which are not caught by the above middleware


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.listen(PORT, () => {
  logger.info(chalk.magenta(`Identity service is running on port ${PORT}`))
})
