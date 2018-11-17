/**
 * Describes an event value emitted by nodes though the `evt` service port.
 * Events signal changes to the outside world.
 * @example
 * const event: IEvent<"foo"> = {type: "foo", payload: null};
 */
export interface IEvent<E extends string> {
  /**
   * Identifies type of event.
   */
  readonly type: E;

  /**
   * Carries additional information about the event.
   */
  readonly payload: any;
}
