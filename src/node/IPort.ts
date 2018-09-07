/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  send(value: T, tag?: string): void;
}
