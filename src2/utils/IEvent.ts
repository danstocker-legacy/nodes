/**
 * Describes an event value emitted by nodes though the `evt` service port.
 * Events signal changes to the outside world.
 * @example
 * const event: IEvent<"foo"> = {type: "foo", payload: null};
 */
export interface IEvent<E extends string> {
  /** Identifies event type, eg. EVENT_CONNECT */
  readonly type: E;

  /** Payload */
  readonly payload: any;
}
