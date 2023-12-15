import * as _ from 'lodash';

export function sanitize<T>(data: T, fieldsToSanitize: Array<keyof T>) {
  const sanitized = _.omit(data, fieldsToSanitize);
  return sanitized;
}
