/**
 * Pairs a value and the name of the port it's coming / going through.
 * TODO: Move to utils
 */
export interface IMuxed<T> {
  name: keyof T;
  val: T[keyof T];
}
