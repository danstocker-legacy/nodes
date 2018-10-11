import {EqualsCallback} from "./EqualsCallback";

/**
 * Collection of equality callbacks.
 * TODO: Add shallow(), deep()
 */
export namespace ecb {
  /**
   * Determines equality by reference.
   */
  export function reference<T>(a: T, b: T): boolean {
    return a === b;
  }

  /**
   * Determines equality by the specified property of both arguments.
   */
  export function property<T extends { [key: string]: any }>(name: string): EqualsCallback<T> {
    return (a: T, b: T): boolean => {
      return a && b && a[name] === b[name];
    };
  }
}
