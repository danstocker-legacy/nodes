/**
 * Extracts keys from object.
 */
export function keys(next: { [key: string]: any }): Array<string> {
  return Object.keys(next);
}

/**
 * Extracts values from object.
 */
export function values(next: { [key: string]: any }): Array<any> {
  const result = [];
  // tslint:disable:no-shadowed-variable
  const keys = Object.keys(next);
  const keyCount = keys.length;
  for (let i = 0; i < keyCount; i++) {
    result.push(next[keys[i]]);
  }
  return result;
}

/**
 * Returns a mapper callback function that assigns field names to array
 * elements.
 */
export function addKeys(fields: Array<string>): (next: Array<any>) => { [key: string]: any } {
  return function (next: Array<any>) {
    const result: { [key: string]: any } = {};
    const fieldCount = fields.length;
    for (let i = 0; i < fieldCount; i++) {
      result[fields[i]] = next[i];
    }
    return result;
  };
}

/**
 * Returns string representation of input.
 */
export function stringify(next: any): string {
  return String(next);
}

/**
 * Encodes the input as JSON string.
 */
export function jsonStringify(next: any): string {
  return JSON.stringify(next);
}
