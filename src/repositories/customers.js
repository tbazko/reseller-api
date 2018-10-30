import uuidv4 from 'uuid/v4';
import { omit } from 'lodash';
import knex from '../services/knex';

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserExistsError";
  }
};

export async function insert(user) {
  const formatted = formatUserData(user);

  await knex('customers')
    .insert(formatted)
    .catch((err) => {
      if (err.code === '23505' && err.constraint === 'customers_email_unique') {
        throw new UserExistsError();
      }
      throw err;
    })
}

function formatUserData(user) {
  const formatted = {
    id: uuidv4(),
    ...user,
    post_index: user.postIndex,
    additional_info: user.additionalInfo
  };
  return omit(formatted, ['postIndex', 'additionalInfo']);
}