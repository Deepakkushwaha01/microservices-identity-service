import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { globalConstants } from '../constants/global.constant'
dotenv.config()

const slat = process.env.BCRYPT_SALT
export const hashPassword = async (password: string) => {
  if (!slat) {
    throw new Error(globalConstants.BCRYPT_SALT_ERROR)
  }
  return await bcrypt.hash(password, parseInt(slat))
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}
