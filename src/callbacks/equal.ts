import {EqualCallback} from "./EqualCallback";

/**
 * Collection of equality callbacks.
 * TODO: Add shallow(), deep()
 */
export namespace equal {
  /**
   * Determines equality by reference.
   */
  export function reference<T>(a: T, b: T): boolean {
    return a === b;
  }

  /**
   * Determines equality by the specified property of both arguments.
   */
  export function property<T extends { [key: string]: any }>(name: string): EqualCallback<T> {
    return (a: T, b: T): boolean => {
      return a && b && a[name] === b[name];
    };
  }
}
