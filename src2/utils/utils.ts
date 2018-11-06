import {THash} from "./THash";

/**
 * Merges hash "b" to hash "a". On conflicting properties, host hash (a) wins.
 * @param a
 * @param b
 * @returns Object passed as "a".
 */
export function merge(a: THash, b: THash): THash {
  for (const key in b) {
    if (a[key] === undefined) {
      a[key] = b[key];
    }
  }
  return a;
}
