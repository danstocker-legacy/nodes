import {TOutPorts} from "../port";
import {IEventEmitter} from "./IEventEmitter";

/**
 * Defines a source node.
 */
export interface ISource extends IEventEmitter {
  /** User defined output ports */
  out: TOutPorts<any>;
}
