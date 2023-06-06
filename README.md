## TL;DR

This is a takehome project for Side, Inc. that can be found [here](https://github.com/reside-eng/take-home-assignment-nodejs-simplyrets). It is a simple API that allows you to perform CRUD actions on property data from a SQLite database. It is written in TypeScript and uses TypeORM.

## Getting Started
```
$ yarn install && yarn start
```

Navigate to `http://localhost:3000/properties` to see a list of properties.

## Validation

I initially included a third-party validation library, but I decided to remove it because it was overkill for this project. I decided to write my own validation middleware instead. One, it was a bit simpler. Two, it made testing error messages simpler. For a production system, I'd consider writing custom error classes or bringing in a json validator or third-party validation library.

Validators could be broken out into their own files and imported into the middleware. I decided to keep them in the middleware for simplicity. But for production, we'd likely want them separated for testing purposes and to keep the middleware file from getting too large.

Lastly, we could argue there should be validation in the service class. However, we definitely need to validate the API layer because we can't control user input, but we can control our interfacing with the service layer on the backend. So, we get more out of validating using middleware.

## Services

I decided to use an abstract service class so that it cannot be instantiated directly. This could make testing the service simpler, although we might consider instantiating classes for the sake of injection.

## Filtering

You will find an example of how we might add proper filtering when fetching a list of properties. We could add more filters, but I decided to keep it simple for this project. We could also add ranges for price, bedrooms, and bathrooms. Lastly, we could add sorting (`sortBy` & `sortDir`, for example).

## Testing

Run tests using
  
```
$ yarn test
```

I chose to write integration tests located in `./src/routes/__tests__/propertyRoutes.spec.ts` because e2e tests give us the most bang for our buck.

Our next step would be to identify isolated units of code that we can write unit tests for. I would consider starting with the custom middleware and the `PropertyService` class.

Additionally, we should consider breaking our helper functions in our middleware into their own files and writing unit tests for them.

## API

#### Property Schema
```
{
  "id": 6,
  "address": "89810 East Running Doe Knoll #709S",
  "price": 20764446,
  "bedrooms": 5,
  "bathrooms": 1,
  "type": "Townhouse" // nullable
}
```

### GET /properties

Returns a list of properties.

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| limit | number | The number of properties to return. |
| page | number | The current page of paginated properties |
| type | string | The type of property to return. |

### GET /properties/:id

Returns a single property.

### POST /properties

Creates a new property.

#### Body Parameters

| Parameter | Type | Description | Required |
| --- | --- | --- | --- |
| address | string | The address of the property | yes |
| price | number | The price of the property | yes |
| bedrooms | number | The number of beds in the property | yes |
| bathrooms | number | The number of baths in the property | yes |
| type | string | The type of property | no |

### PUT /properties/:id

Updates a property.

#### Body Parameters

| Parameter | Type | Description | Required |
| --- | --- | --- | --- |
| address | string | The address of the property | no |
| price | number | The price of the property | no |
| bedrooms | number | The number of beds in the property | no |
| bathrooms | number | The number of baths in the property | no |
| type | string | The type of property | no |

### DELETE /properties/:id

Deletes a property.
