import {ComparerCallback} from "../callbacks/ComparerCallback";
import {intrinsic} from "../callbacks/comparerCallbacks";

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
 * Returns a mapper callback function that assigns values to a list of keys.
 */
export function addValues(values: Array<any>): (next: Array<string>) => { [key: string]: any } {
  return function (next: Array<string>) {
    const result: { [key: string]: any } = {};
    const valueCount = values.length;
    for (let i = 0; i < valueCount; i++) {
      result[next[i]] = values[i];
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

// TODO: Add jsonParse

/**
 * Returns a function that sorts input according to the specified
 * comparer callback.
 */
export function sort<T>(callback: ComparerCallback<T> = intrinsic): (next: Array<T>) => Array<T> {
  return (next: Array<T>) => {
    return next.sort(callback);
  };
}
