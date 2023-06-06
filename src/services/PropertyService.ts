import type { FindManyOptions } from 'typeorm';
import AppDataSource from '../dataSource';
import { Property } from '../entities';

/**
 * A class housing all the methods for CRUD operations on the Property entity.
 *
 * It is a static class, so it does not need to be instantiated.
 */
export abstract class PropertyService {
  static async getProperties(
    page: number = 1,
    limit: number = 100,
    filters: Partial<Omit<Property, 'id'>> = {},
  ) {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
    };
    if (Object.keys(filters).length > 0) {
      options.where = filters;
    }
    return AppDataSource.getRepository('Property').find(options);
  }

  static async getProperty(id: number) {
    return AppDataSource.getRepository('Property').findOneBy({ id });
  }

  static async createProperty(property: Omit<Property, 'id'>) {
    return AppDataSource.getRepository('Property').save(property);
  }

  static async updateProperty(id: number, property: Partial<Property>) {
    const propertyToUpdate = await AppDataSource.getRepository(
      'Property',
    ).findOneBy({ id });
    if (!propertyToUpdate) {
      return null;
    }
    AppDataSource.getRepository('Property').merge(propertyToUpdate, property);
    return AppDataSource.getRepository('Property').save(propertyToUpdate);
  }

  static async deleteProperty(id: number) {
    const results = await AppDataSource.getRepository('Property').delete(id);
    return results.affected! > 0;
  }
}
