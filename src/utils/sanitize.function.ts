import * as _ from 'lodash';

export function sanitize<T>(data: T, fieldsToSanitize: Array<keyof T>): T {
  const sanitized = _.omit(data, fieldsToSanitize);
  return sanitized;
}
