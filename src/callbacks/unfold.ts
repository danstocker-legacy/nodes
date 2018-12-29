/**
 * @module unfold
 * Frequently used Unfolder callbacks.
 */

/**
 * @param value
 */
export function* pop(value: Array<any>): any {
  value = value.slice();
  while (value.length > 0) {
    yield value.pop();
  }
}

/**
 * @param value
 */
export function* shift(value: Array<any>): any {
  value = value.concat();
  while (value.length > 0) {
    yield value.shift();
  }
}

/**
 * Returns function which splits string along the specified delimiter,
 * preserving fragments at ends / beginnings of inputs.
 * @example
 * const lineSplitter = new Unfolder(unfold.split$("\n"));
 */
export function split$(delimiter: string): (value: string) => IterableIterator<string> {
  let fragment = "";
  return function* (value: string) {
    const items = (fragment + value).split(delimiter);
    fragment = items.pop();
    for (const item of items) {
      yield item;
    }
  };
}
