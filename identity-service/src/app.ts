import express, { Express } from 'express'
import router from './routes/route'
import dotenv from 'dotenv'
import connectToDb from './DB/connectToDb'
import logger from './logs/logger'
import chalk from 'chalk'
import helmet from 'helmet'
import cors from 'cors'

const app: Express = express()
dotenv.config()
const PORT = process.env.PORT || 3001

connectToDb()
// Middleware to parse incoming JSON data from client (like from frontend)
app.use(express.json())

// Middleware to parse URL-encoded data (like from HTML form submissions)
// extended: true allows parsing of nested objects
app.use(express.urlencoded({ extended: true }))
app.use(router)

// Middleware to set security-related HTTP headers
// This helps protect the app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
// For example, it can help prevent XSS attacks, clickjacking, etc.
// It is a good practice to use helmet in production environments
app.use(helmet())
app.use(cors())

app.listen(PORT, () => {
  logger.info(chalk.magenta(`Identity service is running on port ${PORT}`))
})
