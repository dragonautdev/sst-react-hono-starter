import { HTTPException } from "hono/http-exception"
import { Context, ErrorHandler } from "hono"
import { ForbiddenError, CoreError, NotFoundError, UnauthorizedError, GeneralError } from "@dragonstart/core/errors"
import { ZodError } from "zod"
import { fromError } from "zod-validation-error" 

type ZodValidatorResponse = {
  success: true,
  data: any
} | {
  success: false,
  data: any,
  error: ZodError
}

export const zodValidatorErrorHandler = (param: ZodValidatorResponse, c: Context) => {
  if (!param.success) {
    throw new GeneralError(fromError(param.error).toString())
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  } else if (err instanceof CoreError) {
    if (err instanceof NotFoundError) {
      return c.json({
        code: err.code,
        message: err.message
      }, 404)
    } else if (err instanceof UnauthorizedError) {
      return c.json({
        code: err.code,
        message: err.message
      }, 401)
    } else if (err instanceof ForbiddenError) {
      return c.json({
        code: err.code,
        message: err.message
      }, 403)
    } else if (err instanceof GeneralError) {
      return c.json({
        code: err.code,
        message: err.message
      }, 400)
    } else {
      return c.json({
        code: err.code,
        message: err.message
      }, 500)
    }
  } else {
    return c.json({
      message: err.message
    }, 500)
  }
}