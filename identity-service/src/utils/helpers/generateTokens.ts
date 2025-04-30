import RefreshToken from '../../models/RefreshToken.schema'
import { globalConstants } from '../constants/global.constant'
import { createJwtToken, encryptRefreshToken } from './createJwtToken'

interface IUser {
  _id: string
  email: string
}

export const generateTokens = async (user: IUser) => {
  const accessToken = createJwtToken(user)
  const refreshToken = encryptRefreshToken(user)

  return {
    accessToken,
    refreshToken
  }
}
