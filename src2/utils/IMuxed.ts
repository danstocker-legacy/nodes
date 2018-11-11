/**
 * Pairs a value and the name of the port it's coming / going through.
 */
export interface IMuxed<T> {
  name: keyof T;
  val: T[keyof T];
}
