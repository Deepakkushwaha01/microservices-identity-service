import { Request, Response, NextFunction } from 'express'
import { Result } from '../utils/helpers/Result'
import logger from '../logs/logger'
import jwt from 'jsonwebtoken'


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = new Result(res)
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without valid token!");
     result.unauthorized({message: "Unauthorized access. Please provide a valid token."})
     return
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error("JWT_SECRET is not defined in environment variables!");
    result.internalServerError({ message: "Internal server error." });
    return;
  }

  jwt.verify(token, jwtSecret, (err) => {
    if (err) {
      logger.warn("Invalid token!");
      result.unauthorized({message: "Invalid token!"})
      return
    }

    next();
  });

  next()
}

export default authMiddleware
