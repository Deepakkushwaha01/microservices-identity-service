import { createJwtToken, encryptRefreshToken } from './createJwtToken'

interface IUser {
  _id: string
  email: string
}

export const generateTokens = async (user: IUser) => {
  const [accessToken, refreshToken] = await Promise.all([
    createJwtToken(user),
    encryptRefreshToken(user)
  ])

  return {
    accessToken,
    refreshToken
  }
}
