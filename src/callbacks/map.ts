import {TMapperCallback} from "../nodes/o2o/sep/Mapper";
import {ValueOf} from "../utils";

/**
 * @module map
 * Frequently used Mapper callbacks.
 */

/**
 * Maps input to itself.
 * @param value
 */
export const identity = (value) => value;

/**
 * Maps input to a constant.
 * @param value
 */
export function constant$(value: any): TMapperCallback<any, any> {
  return () => value;
}

/**
 * Splits input into multiple strings, along the specified delimiter.
 * @param delimiter
 */
export function split$(delimiter: string): TMapperCallback<string, Array<string>> {
  return (next: string) => next.split(delimiter);
}

/**
 * Maps object to one of its properties.
 * @param property
 */
export function pluck$<T>(property: string): TMapperCallback<T, ValueOf<T>> {
  return (value: T) => value[property];
}
