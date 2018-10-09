/**
 * Determines equality by reference.
 */
import {EqualsCallback} from "./EqualsCallback";

export function reference<T>(a: T, b: T): boolean {
  return a === b;
}

export function property<T extends { [key: string]: any }>(name: string): EqualsCallback<T> {
  return (a: T, b: T): boolean => {
    return a && b && a[name] === b[name];
  };
}

// TODO: Add shallow(), deep()
