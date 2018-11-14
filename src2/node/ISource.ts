import {TOutPorts} from "../port";
import {IEvented} from "./IEvented";

/**
 * Defines a source node.
 */
export interface ISource extends IEvented {
  /** User defined output ports */
  out: TOutPorts<any>;
}
