import Joi from 'joi'
import { userRole } from '../../utils/enums/user-role.enum'
export interface IIdentity {
  userName: string
  email: string
  password: string
  role?: string
}

export const validateIdentityRegistration = (data: IIdentity) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(...Object.values(userRole))
      .default(userRole.USER)
  })

  return schema.validate(data)
}
