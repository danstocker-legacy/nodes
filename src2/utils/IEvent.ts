/**
 * Describes an event value emitted by nodes though the `evt` service port.
 * @example
 * const event: IEvent<"foo"> = {type: "foo", payload: null};
 */
export interface IEvent<E extends string> {
  /** Identifies event type, eg. EVENT_CONNECT */
  readonly type: E;

  /** Payload */
  readonly payload: any;
}
