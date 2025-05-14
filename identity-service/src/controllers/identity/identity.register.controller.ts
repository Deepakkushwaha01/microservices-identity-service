import { Request, Response } from 'express'
import logger from '../../logs/logger'
import { IIdentity, IdentitySchema } from './identity.validation'
import { Result } from '../../utils/helpers/Result'
import { globalConstants, userConstants } from '../../utils/constants/global.constant'
import User from '../../models/user.schema'
import { hashPassword } from '../../utils/helpers/hashPassword'
import { generateTokens } from '../../utils/helpers/generateTokens'
import mongoose from 'mongoose'
import RefreshToken from '../../models/RefreshToken.schema'

const registerIdentity = async (req: Request, res: Response) => {
  const result = new Result(res)

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const isValid = IdentitySchema.safeParse(req.body as IIdentity)
    if(!isValid.success) {
      const error = isValid.error
      logger.warn(globalConstants.VALIDATION_ERROR, error.issues[0].message)
      await session.abortTransaction()
      session.endSession()
      result.badRequest({ message: error.issues[0].message })
      return
    }

    const { email, password, userName } = req.body

    const existingUser = await User.findOne({
      email
    }).session(session)

    if (existingUser) {
      await session.abortTransaction()
      session.endSession()
      result.conflict({ message: userConstants.USER_ALREADY_EXISTS })
      return
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new User({
      email,
      password: hashedPassword,
      userName
    })
    await newUser.save({ session })

    try {
      const tokens = await generateTokens({
        _id: newUser._id.toString(),
        email: newUser.email
      })

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // (node:70305) [MONGOOSE] Warning: WARNING: to pass a `session` to `Model.create()` in Mongoose, you **must** pass an array as the first argument. See: https://mongoosejs.com/docs/api/model.html#Model.create()
      // Rule: When we use transactions in Mongoose, we need to pass an array to the `Model.create()` method, even if we are creating a single document. This is because Mongoose expects an array of documents to be passed in when using transactions. If we pass a single document, Mongoose will not know how to handle the session correctly.
      // This is a Mongoose requirement when using transactions.
      // The session is used to ensure that the operation is atomic and can be rolled back if there is an error.

      await RefreshToken.create(
        [
          {
            token: tokens.refreshToken,
            user: newUser._id,
            expiresAt
          }
        ],
        { session }
      ).catch(err => {
        throw new Error(globalConstants.CREATE_REFRESH_TOKEN_ERROR)
      })

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
    } catch (error) {
      logger.error(globalConstants.TOKEN_GENERATION_ERROR, error)

      await session.abortTransaction()
      session.endSession()

      result.internalServerError({ message: globalConstants.TOKEN_GENERATION_ERROR })
      return
    }

    await session.commitTransaction()
    session.endSession()

    // Assuming successful registration logic here
    result.success({ message: userConstants.USER_CREATED })
    return
  } catch (error) {
    logger.error(userConstants.FAILED_TO_CREATE_USER, error)
    result.badRequest({ message: userConstants.FAILED_TO_CREATE_USER })
    return
  }
}

export default registerIdentity
