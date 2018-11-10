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

export async function saveDomainForEmail({ email, domain }) {
  const users = await knex('customers')
    .where({ email });
  await knex('domains')
    .insert({ owner_id: users[0].id, domain_name: domain });
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
    postIndex: user && user.post_index ? user.post_index : undefined,
    additionalInfo: user && user.additional_info ? user.additional_info : undefined,
  };
  return omit(formatted, ['post_index', 'additional_info']);
}