import {EqualsCallback} from "./EqualsCallback";

// TODO: Add shallow(), deep()
export const ecb = {
  /**
   * Determines equality by reference.
   */
  reference: <T>(a: T, b: T): boolean => {
    return a === b;
  },

  /**
   * Determines equality by the specified property of both arguments.
   */
  property: <T extends { [key: string]: any }>(name: string): EqualsCallback<T> => {
    return (a: T, b: T): boolean => {
      return a && b && a[name] === b[name];
    };
  }
};
