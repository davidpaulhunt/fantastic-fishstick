import express from 'express';
import bodyParser from 'body-parser';
import { Property } from '../entities';
import {
  idValidatorMiddleware,
  propertyValidatorMiddleware,
} from '../middleware';
import { PropertyService } from '../services';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());

propertyRoutes.get('/', async (req, res) => {
  const page = Number(req.query.page || 1);
  // Limit the number of results to a maximum of 100 results per page
  const limit = Math.min(Number(req.query.limit || 100), 100);

  /**
   * This is an example off the top of my head of how you could filter
   * properties by particular fields. This is not a complete solution,
   * but it should give you an idea of how you could implement it.
   */
  const filters: Partial<Omit<Property, 'id'>> = {};
  if (typeof req.query.type === 'string') {
    filters.type = req.query.type;
  }

  const properties = await PropertyService.getProperties(page, limit, filters);
  return res.send(properties);
});

propertyRoutes.get('/:id', idValidatorMiddleware, async (req, res) => {
  const property = await PropertyService.getProperty(Number(req.params.id));

  if (property) {
    return res.send(property);
  }

  return res.status(404).send({ message: 'Property not found' });
});

propertyRoutes.post(
  '/',
  propertyValidatorMiddleware({
    requiredFields: ['address', 'price', 'bedrooms', 'bathrooms'],
  }),
  async (req, res) => {
    const property = await PropertyService.createProperty(req.body);
    return res.send(property);
  },
);

propertyRoutes.put(
  '/:id',
  idValidatorMiddleware,
  propertyValidatorMiddleware(),
  async (req, res) => {
    const updatedProperty = await PropertyService.updateProperty(
      Number(req.params.id),
      req.body,
    );
    if (!updatedProperty) {
      return res.status(404).send({ message: 'Property not found' });
    }
    return res.send(updatedProperty);
  },
);

propertyRoutes.delete('/:id', idValidatorMiddleware, async (req, res) => {
  const result = await PropertyService.deleteProperty(Number(req.params.id));
  if (!result) {
    return res.status(404).send({ message: 'Property not found' });
  }
  return res.status(200).send();
});
