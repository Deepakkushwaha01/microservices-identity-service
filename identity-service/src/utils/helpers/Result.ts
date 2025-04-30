import { Response } from 'express'

interface IResult {
  success?: boolean
  message: string
}

export class Result {
  constructor(private res: Response) {} // make's it private

  badRequest({ success = false, message = 'Bad Request' }: IResult): Response {
    return this.res.status(400).json({
      success,
      message
    })
  }

  success({ success = true, message = 'Success' }: IResult): Response {
    return this.res.status(200).json({
      success,
      message
    })
  }
  notFound({ success = false, message = 'Not Found' }: IResult): Response {
    return this.res.status(404).json({
      success,
      message
    })
  }
  internalServerError({ success = false, message = 'Internal Server Error' }: IResult): Response {
    return this.res.status(500).json({
      success,
      message
    })
  }
  unauthorized({ success = false, message = 'Unauthorized' }: IResult): Response {
    return this.res.status(401).json({
      success,
      message
    })
  }
  forbidden({ success = false, message = 'Forbidden' }: IResult): Response {
    return this.res.status(403).json({
      success,
      message
    })
  }

  conflict({ success = false, message = 'Conflict' }: IResult): Response {
    return this.res.status(409).json({
      success,
      message
    })
  }
}
