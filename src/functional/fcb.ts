import {ecb} from "../callbacks";
import {EqualsCallback} from "../callbacks/EqualsCallback";
import {FilterCallback} from "./FilterCallback";

export const fcb = {
  /**
   * Returns filter callback which returns true when next value equals
   * current, false otherwise.
   * Higher-order function.
   */
  change: <T>(callback: EqualsCallback<T> = ecb.reference): FilterCallback<T> => {
    let current: T;
    return (next: T): boolean => {
      const previous = current;
      current = next;
      return !callback(next, previous);
    };
  }
};
