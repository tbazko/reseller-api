import uuidv4 from 'uuid/v4';
import { omit } from 'lodash';
import knex from '../services/knex';


export function insert(user) {
  const formatted = formatUserData(user);

  return knex('customers')
    .insert(formatted);
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