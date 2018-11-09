/**
 * Pairs a value and the name of the port it's coming / going through.
 */
export type TMuxed<T> = {
  name: keyof T,
  val: T[keyof T]
};
