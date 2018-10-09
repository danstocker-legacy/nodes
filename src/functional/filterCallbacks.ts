import {reference} from "../flow";
import {EqualsCallback} from "../flow/EqualsCallback";
import {FilterCallback} from "./FilterCallback";

export function change<T>(callback: EqualsCallback<T> = reference): FilterCallback<T> {
  let current: T;
  return (next: T): boolean => {
    const previous = current;
    current = next;
    return !callback(next, previous);
  };
}
