import {TOutPorts} from "../port";

/**
 * Defines a source node.
 */
export interface ISource<T> {
  /** User defined output ports */
  readonly out: TOutPorts<T>;
}
