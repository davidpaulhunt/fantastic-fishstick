import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('GET /properties', () => {
    it('should return the first 100 properties', async () => {
      const response = await request(app).get('/properties').expect(200);
      expect(response.body.length).toBe(100);

      const firstProperty = response.body[0];
      expect(firstProperty).toHaveProperty('id', 1);
      expect(firstProperty).toHaveProperty('address');
      expect(firstProperty).toHaveProperty('price');
      expect(firstProperty).toHaveProperty('bedrooms');
      expect(firstProperty).toHaveProperty('bathrooms');
      expect(firstProperty).toHaveProperty('type');

      const lastProperty = response.body[99];
      expect(lastProperty).toHaveProperty('id', 100);
      expect(lastProperty).toHaveProperty('address');
      expect(lastProperty).toHaveProperty('price');
      expect(lastProperty).toHaveProperty('bedrooms');
      expect(lastProperty).toHaveProperty('bathrooms');
      expect(lastProperty).toHaveProperty('type');
    });

    it('should return the last 26 properties', async () => {
      const response = await request(app).get('/properties?page=2').expect(200);
      expect(response.body.length).toBe(26);

      const firstProperty = response.body[0];
      expect(firstProperty).toHaveProperty('id', 101);
      expect(firstProperty).toHaveProperty('address');
      expect(firstProperty).toHaveProperty('price');
      expect(firstProperty).toHaveProperty('bedrooms');
      expect(firstProperty).toHaveProperty('bathrooms');
      expect(firstProperty).toHaveProperty('type');

      const lastProperty = response.body[25];
      expect(lastProperty).toHaveProperty('id', 126);
      expect(lastProperty).toHaveProperty('address');
      expect(lastProperty).toHaveProperty('price');
      expect(lastProperty).toHaveProperty('bedrooms');
      expect(lastProperty).toHaveProperty('bathrooms');
      expect(lastProperty).toHaveProperty('type');
    });

    it('should respect the limit', async () => {
      const response = await request(app)
        .get('/properties?limit=10')
        .expect(200);
      expect(response.body.length).toBe(10);
    });

    it('should respect the limit and page', async () => {
      const response = await request(app)
        .get('/properties?limit=10&page=3')
        .expect(200);
      expect(response.body.length).toBe(10);

      const firstProperty = response.body[0];
      expect(firstProperty).toHaveProperty('id', 21);

      const lastProperty = response.body[9];
      expect(lastProperty).toHaveProperty('id', 30);
    });

    it('should respect the type filter', async () => {
      const response = await request(app)
        .get('/properties?type=Fake')
        .expect(200);
      expect(response.body.length).toBe(0);
    });

    it('should respect the type filter', async () => {
      const response = await request(app)
        .get('/properties?type=Townhouse&limit=5')
        .expect(200);
      expect(response.body.length).toBe(5);
      expect(response.body[0]).toHaveProperty('type', 'Townhouse');
      expect(response.body[1]).toHaveProperty('type', 'Townhouse');
      expect(response.body[2]).toHaveProperty('type', 'Townhouse');
      expect(response.body[3]).toHaveProperty('type', 'Townhouse');
      expect(response.body[4]).toHaveProperty('type', 'Townhouse');
    });
  });

  describe('GET /properties/:id', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await request(app).get('/properties/abc').expect(400);
      expect(response.body).toHaveProperty('message', 'Invalid ID');
    });

    it('should return 404 when property does not exist', async () => {
      const response = await request(app).get('/properties/999').expect(404);
      expect(response.body).toHaveProperty('message', 'Property not found');
    });

    it('should return the property with id 10', async () => {
      const response = await request(app).get('/properties/10').expect(200);
      const property = response.body;
      expect(property).toHaveProperty('id', 10);
      expect(property).toHaveProperty('address');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('bedrooms');
      expect(property).toHaveProperty('bathrooms');
      expect(property).toHaveProperty('type');
    });
  });

  describe('POST /properties', () => {
    const mockProperty = {
      address: '123 Main St',
      price: 100000,
      bedrooms: 3,
      bathrooms: 2,
      type: 'house',
    };

    it('should return 400 when address is missing', async () => {
      const { address, ...params } = mockProperty;
      const response = await request(app)
        .post('/properties')
        .send(params)
        .expect(400);
      expect(response.body).toHaveProperty('message', 'address is required');
    });

    it('should return 400 when price is missing', async () => {
      const { price, ...params } = mockProperty;
      const response = await request(app)
        .post('/properties')
        .send(params)
        .expect(400);
      expect(response.body).toHaveProperty('message', 'price is required');
    });

    it('should return 400 when bedrooms is missing', async () => {
      const { bedrooms, ...params } = mockProperty;
      const response = await request(app)
        .post('/properties')
        .send(params)
        .expect(400);
      expect(response.body).toHaveProperty('message', 'bedrooms is required');
    });

    it('should return 400 when bathrooms is missing', async () => {
      const { bathrooms, ...params } = mockProperty;
      const response = await request(app)
        .post('/properties')
        .send(params)
        .expect(400);
      expect(response.body).toHaveProperty('message', 'bathrooms is required');
    });

    it('should return 400 when bedrooms & bathrooms are missing', async () => {
      const { bathrooms, bedrooms, ...params } = mockProperty;
      const response = await request(app)
        .post('/properties')
        .send(params)
        .expect(400);
      expect(response.body).toHaveProperty(
        'message',
        'bedrooms is required, bathrooms is required',
      );
    });

    it('should return 200 with created property', async () => {
      const response = await request(app)
        .post('/properties')
        .send(mockProperty)
        .expect(200);
      const property = response.body;
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('address', mockProperty.address);
      expect(property).toHaveProperty('price', mockProperty.price);
      expect(property).toHaveProperty('bedrooms', mockProperty.bedrooms);
      expect(property).toHaveProperty('bathrooms', mockProperty.bathrooms);
      expect(property).toHaveProperty('type', mockProperty.type);
    });
  });

  describe('PUT /properties/:id', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await request(app).put('/properties/abc').expect(400);
      expect(response.body).toHaveProperty('message', 'Invalid ID');
    });

    it('should return 404 when property does not exist', async () => {
      const response = await request(app).put('/properties/999').expect(404);
      expect(response.body).toHaveProperty('message', 'Property not found');
    });

    it('should update the property with id 4', async () => {
      const property4 = await AppDataSource.getRepository('Property').findOneBy(
        {
          id: 4,
        },
      );
      const newAddress = '6543 Fake Rd';
      const response = await request(app)
        .put('/properties/4')
        .send({
          address: newAddress,
        })
        .expect(200);
      const property = response.body;
      expect(property).toHaveProperty('id', 4);
      expect(property).toHaveProperty('address', newAddress);
      expect(property).toHaveProperty('price', property4!.price);
      expect(property).toHaveProperty('bedrooms', property4!.bedrooms);
      expect(property).toHaveProperty('bathrooms', property4!.bathrooms);
      expect(property).toHaveProperty('type', property4!.type);
    });
  });

  describe('DEL /properties/:id', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await request(app).del('/properties/abc').expect(400);
      expect(response.body).toHaveProperty('message', 'Invalid ID');
    });

    it('should return 404 when property does not exist', async () => {
      const response = await request(app).del('/properties/999').expect(404);
      expect(response.body).toHaveProperty('message', 'Property not found');
    });

    it('should delete the property with id 21', async () => {
      await request(app).del('/properties/21').expect(200);
    });
  });
});
