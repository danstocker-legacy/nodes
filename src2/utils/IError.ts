/**
 * Describes an error emitted by nodes through the `err` service port.
 * @example
 * const event: IError<"foo"> = {type: "foo", reason: null};
 */
export interface IError<R extends string> {
  type: R;
  payload: any;
}
