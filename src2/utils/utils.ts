import {IHash} from "./IHash";

/**
 * Merges hash "b" to hash "a". On conflicting properties, host hash (a) wins.
 * @param a
 * @param b
 * @returns Object passed as "a".
 */
export function merge(a: IHash, b: IHash): IHash {
  for (const key in b) {
    if (a[key] === undefined) {
      a[key] = b[key];
    }
  }
  return a;
}

export function copy(a: any): any {
  if (a instanceof Array) {
    return a.slice();
  } else if (a instanceof Object) {
    const result = {};
    // tslint:disable:forin
    for (const key in a) {
      result[key] = a[key];
    }
    // tslint:enable:forin
    return result;
  } else {
    return a;
  }
}
