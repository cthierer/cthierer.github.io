/**
 * @flow
 */

// eslint-disable-next-line import/prefer-default-export
export function important(...values: string[]): [string[], string] {
  return [values, '!important']
}
