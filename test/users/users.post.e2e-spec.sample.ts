import { faker } from '@faker-js/faker/.';

export const completeUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123!',
};

export const missingFirstNameUser = {
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123!',
};
export const missingEmailUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'Password123!',
};
export const missingPasswordUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
};
