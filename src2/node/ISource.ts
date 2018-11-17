import {TOutPorts} from "../port";

/**
 * Defines a source node.
 */
export interface ISource {
  /** User defined output ports */
  out: TOutPorts<any>;
}
