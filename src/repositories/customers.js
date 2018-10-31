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
  const formatted = formatApiToDb(user);

  await knex('customers')
    .insert(formatted)
    .catch((err) => {
      if (err.code === '23505' && err.constraint === 'customers_email_unique') {
        throw new UserExistsError();
      }
      throw err;
    })
}

export async function getCustomerByEmail(email) {
  const user = await knex('customers')
    .where({ email });

  return formatDbToApi(user[0]);
}

export async function getCustomerById(id) {
  const user = await knex('customers')
    .where({ id });

  return formatDbToApi(user[0]);
}

function formatApiToDb(user) {
  const formatted = {
    id: uuidv4(),
    ...user,
    post_index: user.postIndex,
    additional_info: user.additionalInfo
  };
  return omit(formatted, ['postIndex', 'additionalInfo']);
}

function formatDbToApi(user) {
  const formatted = {
    id: uuidv4(),
    ...user,
    postIndex: user.post_index,
    additionalInfo: user.additional_info
  };
  return omit(formatted, ['post_index', 'additional_info']);
}