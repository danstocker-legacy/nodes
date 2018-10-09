import {reference} from "../callbacks";
import {EqualsCallback} from "./EqualsCallback";
import {FilterCallback} from "./FilterCallback";

export function change<T>(callback: EqualsCallback<T> = reference): FilterCallback<T> {
  let current: T;
  return (next: T): boolean => {
    const previous = current;
    current = next;
    return !callback(next, previous);
  };
}
