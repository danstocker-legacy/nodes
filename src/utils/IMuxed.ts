/**
 * Pairs a value and the name of the port it's coming / going through.
 */
export interface IMuxed<T> {
  /**
   * Name of port associated with transmitted value.
   */
  port: keyof T;

  /**
   * Multiplexed value.
   */
  val: T[keyof T];
}
