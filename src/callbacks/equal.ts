import {TEqualityCallback} from "../nodes/utils/Comparer";
import {IAny} from "../utils";

/**
 * Frequently used Comparer callbacks.
 * TODO: Add shallow(), deep()
 */
export namespace equal {
  /**
   * Determines equality by reference.
   */
  export function reference<V>(a: V, b: V): boolean {
    return a === b;
  }

  /**
   * Determines equality by the specified property of both arguments.
   * @param name Name of property to be compared.
   * @param cb Optional equality callback for determining property equality.
   * (Defaults to `equal.reference`.)
   */
  export function property$<I extends IAny>(
    name: string,
    cb: TEqualityCallback<I[keyof I]> = equal.reference
  ): TEqualityCallback<I> {
    return (a: I, b: I): boolean => {
      return a && b && cb(a[name], b[name]);
    };
  }
}
