import {reference} from "../callbacks";
import {EqualsCallback} from "../callbacks/EqualsCallback";
import {FilterCallback} from "./FilterCallback";

/**
 * Returns filter callback which returns true when next value equals
 * current, false otherwise.
 * Higher-order function.
 */
export function change<T>(callback: EqualsCallback<T> = reference): FilterCallback<T> {
  let current: T;
  return (next: T): boolean => {
    const previous = current;
    current = next;
    return !callback(next, previous);
  };
}
