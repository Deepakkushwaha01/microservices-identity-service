import {Request, Response} from 'express';
import { IdentityLoginSchema, IIdentityLogin } from './identity.validation';
import { Result } from '../../utils/helpers/Result';
import User from '../../models/user.schema';
import { comparePassword } from '../../utils/helpers/hashPassword';
import { generateTokens } from '../../utils/helpers/generateTokens';
import RefreshToken from '../../models/RefreshToken.schema';
import { globalConstants } from '../../utils/constants/global.constant';
import logger from '../../logs/logger';
import mongoose from 'mongoose';
const loginIdentity = async (req: Request, res: Response) => {
    const result = new Result(res);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    const isValid = IdentityLoginSchema.safeParse(req.body as IIdentityLogin);

    if(!isValid.success) {
      const error = isValid.error;
        logger.warn(globalConstants.VALIDATION_ERROR, error.issues[0].message);
        result.badRequest({message: error.issues[0].message})
        return
    }
    const { email, password } = req.body;
    const user = await User.findOne({   email });
    if (!user) {   
        result.notFound({message: 'User not found'})
        return 
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        result.unauthorized({message: 'Invalid password'})
        return 
    }

    try {
    const tokens = await generateTokens({
        _id: user._id.toString(),
        email: user.email
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshToken.create(
        [
          {
            token: tokens.refreshToken,
            user: user._id,
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
  
      result.success({ message: 'user login successfully' })
      return
    } catch (error) {
      logger.error('user failed to login', error)
      result.badRequest({ message: 'user failed to login' })
      return
    }
}

export default loginIdentity;