import jwt from 'jsonwebtoken'
import crypto from 'crypto'

interface IUser {
  _id: string
  email: string
}

export const encryptRefreshToken = (payload: { _id: string; email: string }): string => {
  const algorithm = 'aes-256-cbc'
  const secret = process.env.REFRESH_TOKEN_SECRET!
  const ivLength = 16

  if (!secret || secret.length !== 64) {
    throw new Error('REFRESH_TOKEN_SECRET must be 64 hex characters (32 bytes)')
  }

  const key = Buffer.from(secret, 'hex') // 👈 convert 64 hex chars to 32 bytes
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  const data = JSON.stringify(payload)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return iv.toString('hex') + ':' + encrypted
}

export const createJwtToken = (user: IUser) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '10m' }
  )
}
