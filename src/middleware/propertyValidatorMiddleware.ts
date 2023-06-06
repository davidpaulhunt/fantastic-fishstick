import type { RequestHandler } from 'express';

const isUndefined = (value: any) => typeof value === 'undefined';
const isNumber = (value: any) => typeof value === 'number';
const isString = (value: any) => typeof value === 'string';

export const propertyValidatorMiddleware = ({
  requiredFields = [],
}: {
  requiredFields?: string[];
} = {}): RequestHandler => {
  return (req, res, next) => {
    const errors: string[] = [];

    // validate number fields
    for (const field of ['price', 'bedrooms', 'bathrooms']) {
      const value = req.body[field];
      if (isUndefined(value)) {
        if (requiredFields.includes(field)) {
          errors.push(`${field} is required`);
        }
      } else if (!isNumber(value)) {
        errors.push(`${field} must be a number`);
      } else if (value < 0) {
        errors.push(`${field} must be a positive number`);
      }
    }

    // validate address
    if (isUndefined(req.body.address)) {
      if (requiredFields.includes('address')) {
        errors.push('address is required');
      }
    } else if (!isString(req.body.address)) {
      errors.push('address must be a string');
    }

    // validate type
    if (!isUndefined(req.body.type) && !isString(req.body.type)) {
      errors.push('type must be a string');
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors.join(', ') });
    }

    next();
  };
};
