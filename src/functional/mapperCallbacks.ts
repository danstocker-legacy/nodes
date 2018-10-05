/**
 * Returns a mapper callback function that assigns field names to array
 * elements.
 * @param fields
 * TODO: Tentative. Contender: "HashMapper"
 */
export function hash(fields: Array<string>): (next: Array<any>) => { [key: string]: any } {
  return function (next: Array<any>) {
    const result: { [key: string]: any } = {};
    const fieldCount = fields.length;
    for (let i = 0; i < fieldCount; i++) {
      result[fields[i]] = next[i];
    }
    return result;
  };
}
