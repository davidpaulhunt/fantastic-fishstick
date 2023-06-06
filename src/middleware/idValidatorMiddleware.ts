import type { RequestHandler } from "express";
/**
 * Middleware to validate that the ID parameter is a number.
 */
export const idValidatorMiddleware: RequestHandler = (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  next();
};
