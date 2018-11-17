/**
 * Describes an error emitted by nodes through their `err` service port.
 * Errors signal a fatal interruption to the program's normal operation.
 * @example
 * const event: IError<"foo"> = {type: "foo", payload: null};
 */
export interface IError<R extends string> {
  /**
   * Identifies type of error.
   */
  type: R;

  /**
   * Carries additional information about the error.
   */
  payload: any;
}
