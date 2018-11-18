/**
 * Frequently used Mapper callbacks.
 */
import {TMapperCallback} from "../nodes/lang/Mapper";

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
}
