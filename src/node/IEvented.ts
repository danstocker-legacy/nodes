import {TOutBundle} from "../port";

export interface IEvented {
  /**
   * Event port bundle.
   * Connect to these ports to receive events from the node.
   */
  e: TOutBundle<any>;
}
