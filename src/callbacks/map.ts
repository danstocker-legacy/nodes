/**
 * Frequently used Mapper callbacks.
 */
import {TMapperCallback} from "../nodes/lang/Mapper";
import {ValueOf} from "../utils";

export namespace map {
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
   * Maps object to one of its properties.
   * @param property
   */
  export function pluck$<T>(property: string): TMapperCallback<T, ValueOf<T>> {
    return (value: T) => value[property];
  }
}
