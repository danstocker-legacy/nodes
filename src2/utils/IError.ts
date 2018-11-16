/**
 * Describes an error emitted by nodes through the `err` service port.
 * Errors signal the unexpected interruption of the program's normal operation.
 * @example
 * const event: IError<"foo"> = {type: "foo", reason: null};
 */
export interface IError<R extends string> {
  type: R;
  payload: any;
}
