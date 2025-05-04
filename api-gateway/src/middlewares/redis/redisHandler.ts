import { createClient } from 'redis'
import logger from '../../logs/logger'
import chalk from 'chalk'

export const client = createClient({
  url: process.env.REDIS_URL
})

client.on('error', err => logger.error('Redis Client Error', err))

const connectToRedis = async () => {
  try {
    await client.connect()
    logger.info(chalk.redBright('Redis client connected successfully'))
  } catch (error) {
    logger.error('Error connecting to Redis:', error)
  }
}

export default connectToRedis
