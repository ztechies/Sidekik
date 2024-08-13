import Joi, { Schema, ValidationError } from 'joi';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';

const validate = (schema: Record<string, Schema>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema) as Array<'params' | 'query' | 'body'>);

    const { value, error }: { value: any; error?: ValidationError } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, value);
    return next();
  };
};

export default validate;